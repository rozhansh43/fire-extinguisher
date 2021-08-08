<template>
  <div class="animated fadeIn">
    <items :value="items" :sections="sections"/>
  </div>
</template>

<script>
import * as types from '@/store/types'
import Items from '@/components/dash/customerOrders/items'
import progressEnd from '@/mixins/progress-end'

function getItems ({ $api, route, query, $store }) {
  if (process.client) $store.commit(types.SET_DOWNLOAD_PROGRESS, 0)

  return Promise.all([
    $api.customerOrders.getAll({ status: query.status }),
    $api.customerOrders.getCountReport()
  ])
  .then(all => {
    if (process.client) $store.commit(types.SET_DOWNLOAD_PROGRESS, 25)

    const orders = all[0]
    const sections = [
      {
        key: 'pending',
        count: all[1].pending,
        icon: 'hourglass-half',
        text: 'customerOrders.statuses.pending',
        path: '/dash/orders?status=pending'
      },
      {
        key: 'processing',
        count: all[1].processing,
        icon: 'cogs',
        text: 'customerOrders.statuses.processing',
        path: '/dash/orders?status=processing'
      },
      {
        key: 'processed',
        count: all[1].processed,
        icon: 'truck',
        text: 'customerOrders.statuses.delivered',
        path: '/dash/orders?status=processed'
      },
      {
        key: 'canceled',
        count: all[1].canceled,
        icon: 'times-circle',
        text: 'customerOrders.statuses.canceledOrExpired',
        path: '/dash/orders?status=canceled'
      }
    ]

    const productTypeIds = orders && orders.length ? $api.products.getOrdersProductsTypeIds(orders) : null

    if (process.client) $store.commit(types.SET_DOWNLOAD_PROGRESS, 50)

    let promises = []
    if (productTypeIds && productTypeIds.length) {
      promises = [$api.productTypes.getByIds(productTypeIds), $api.settings.get('currency')]
    } else {
      promises.push(Promise.resolve())
    }

    if (process.client) $store.commit(types.SET_DOWNLOAD_PROGRESS, 75)

    return Promise.all(promises)
    .then(() => {
      if (process.client) {
        $store.commit(types.SET_DOWNLOAD_PROGRESS, 100)

        setTimeout(() => {
          $store.commit(types.SET_DOWNLOAD_PROGRESS, 0)
        }, 200)
      }

      return { orders, sections }
    })
  })
}

export default {
  name: 'Orders',
  meta: {
    modules: [
      'products_sale'
    ]
  },
  head () {
    return {
      title: this.$t('customerOrders.ordersWithStatus', { status: this.getStatusTextFromRoute() })
    }
  },
  components: {
    Items
  },
  mixins: [progressEnd],
  data () {
    return {
      items: null,
      sections: null
    }
  },
  watch: {
    '$route.query.status' () {
      this.getItems()
    }
  },
  validate ({ query }) {
    const statuses = ['pending', 'processing', 'processed', 'canceled']
    return query.status && statuses.find(o => o === query.status)
  },
  asyncData ({ store, query, app, error, route }) {
    return getItems({
      $api: app.$api,
      route,
      query,
      $store: store
    })
    .then(res => {
      return {
        items: res.orders,
        sections: res.sections
      }
    })
    .catch(error)
  },
  methods: {
    getItems () {
      return getItems({
        $api: this.$api,
        route: this.$route,
        query: this.$route.query,
        $store: this.$store
      })
      .then(res => {
        this.items = res.orders
        this.sections = res.sections
        return this.items
      })
    },
    getStatusTextFromRoute () {
      const routeStatus = this.$route.query.status
      if (routeStatus === 'processed') return this.$t('customerOrders.statuses.delivered')
      else return this.$t(`customerOrders.statuses.${routeStatus}`)
    }
  }
}
</script>
