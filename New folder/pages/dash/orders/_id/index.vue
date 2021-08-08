<template>
  <div class="animated fadeIn">
    <template v-if="order">
      <order-details-print
        v-if="printView"
        :value="order"
        :adapter-types="adapterTypes"
        :status="status"
        :product-types="productTypes"
      />

      <order-details-view
        v-else
        :value="order"
        :adapter-types="adapterTypes"
        :status="status"
      />
    </template>
  </div>
</template>

<script>
import * as types from '@/store/types'
import OrderDetailsPrint from '@/components/dash/customerOrders/item/print'
import OrderDetailsView from '@/components/dash/customerOrders/item/view'
import progressEnd from '@/mixins/progress-end'

export default {
  name: 'Order',
  components: {
    OrderDetailsPrint,
    OrderDetailsView
  },
  mixins: [progressEnd],
  meta: {
    modules: [
      'products_sale'
    ]
  },
  head () {
    return {
      title: this.$t('customerOrders.orderDetailsNumber', { number: this.order.id })
    }
  },
  data () {
    return {
      adapterTypes: [
        { value: 110, text: this.$t('payments.credit'), icon: 'wallet', variant: 'danger' },
        { value: 210, text: this.$t('payments.bankReceipt'), icon: 'receipt', variant: 'dark' },
        { value: 310, text: this.$t('payments.zarinpalIpg'), icon: 'globe', variant: 'info' },
        { value: 311, text: this.$t('payments.zarinpalSandboxIpg'), icon: 'globe', variant: 'info' },
        { value: 320, text: this.$t('payments.pasargadIpg'), icon: 'globe', variant: 'info' },
        { value: 330, text: this.$t('payments.mellatIpg'), icon: 'globe', variant: 'info' },
        { value: 340, text: this.$t('payments.samanIpg'), icon: 'globe', variant: 'info' },
        { value: 410, text: this.$t('payments.payOnDelivery'), icon: 'truck-loading', variant: 'success' }
      ],
      statuses: [
        { value: 0, text: this.$t('customerOrders.statuses.pending'), icon: 'hourglass-half', variant: 'muted' },
        { value: 10, text: this.$t('customerOrders.statuses.processing'), icon: 'cogs', variant: 'info' },
        { value: 20, text: this.$t('customerOrders.statuses.delivered'), icon: 'truck', variant: 'success' },
        { value: 30, text: this.$t('customerOrders.statuses.canceled'), icon: 'times-circle', variant: 'danger' },
        { value: 40, text: this.$t('customerOrders.statuses.expired'), icon: 'hourglass', variant: 'dark' }
      ]
    }
  },
  computed: {
    status () {
      return this.order && this.order.status !== null ? this.statuses.find(i => i.value === this.order.status) : null
    },
    printView () {
      return !!this.$route.query.print
    },
    productTypes () {
      return this.$store.state.$productTypes
    }
  },
  validate ({ params }) {
    return !!params.id
  },
  asyncData({ app, route, params, store, error }) {
    if (process.client) store.commit(types.SET_DOWNLOAD_PROGRESS, 0)

    return app.$api.customerOrders.getById(params.id)
    .then(order => {
      if (process.client) store.commit(types.SET_DOWNLOAD_PROGRESS, 25)

      const productTypeIds = order && app.$api.products.getOrdersProductsTypeIds([order])

      if (process.client) store.commit(types.SET_DOWNLOAD_PROGRESS, 50)

      let promises = []

      if (productTypeIds && productTypeIds.length)
        promises = [app.$api.productTypes.getByIds(productTypeIds), app.$api.settings.get('currency')]
      else promises = [null, null]

      if (process.client) store.commit(types.SET_DOWNLOAD_PROGRESS, 75)

      return Promise.all(promises)
      .then(all => {
        return {
          order
        }
      })
    })
    .catch(error)
  }
}
</script>
