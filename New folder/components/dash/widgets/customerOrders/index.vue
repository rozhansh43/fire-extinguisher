<template>
  <div>
    <title-display :title="$t('customerOrders.orders')" icon="clipboard-list"/>

    <b-card no-body footer-class="text-center p-0">
      <div v-if="initializing" class="text-center p-4">
        <font-awesome-icon spin icon="circle-notch" class="text-moremuted display-3"/>
      </div>

      <template v-else>
        <b-table-simple
          v-if="items && items.length"
          bordered
          responsive
          class="table-bright mb-0 table-flush rounded text-center"
        >
          <b-thead>
            <b-tr>
              <b-th class="font-weight-normal" style="min-width: 120px">
                {{ $t('customerOrders.orderId') }}
              </b-th>

              <b-th class="font-weight-normal" style="min-width: 200px">
                {{ $t('shared.created') }}
              </b-th>

              <b-th class="font-weight-normal" style="min-width: 200px">
                {{ $t('shared.status') }}
              </b-th>

              <b-th class="font-weight-normal" style="min-width: 250px">
                {{ $t('products.payable') }}
              </b-th>

              <b-th class="font-weight-normal" style="min-width: 100px">
                {{ $t('shared.details') }}
              </b-th>
            </b-tr>
          </b-thead>

          <b-tbody>
            <b-tr v-for="item in items" :key="item.id">
              <b-td>
                {{ item.id }}
              </b-td>

              <b-td>
                <date-display :value="item.created" time/>
              </b-td>

              <b-td>
                <template v-if="getStatus(item.status)">
                  <font-awesome-icon
                    :icon="getStatus(item.status).icon"
                    class="align-middle mx-1"
                    :class="'text-' + getStatus(item.status).variant"
                  />

                  {{ getStatus(item.status).text }}
                </template>
              </b-td>

              <b-td>
                <currency-display
                  :value="item.payable"
                  amount-class="h5 mb-0 text-success"
                />
              </b-td>

              <b-td class="p-0">
                <b-btn block class="py-3 px-0 rounded-0 border-0" variant="outline-bright" :to="`/dash/orders/${item.id}`">                  
                  <font-awesome-icon
                    :icon="$dir.ltr ? 'angle-right' : 'angle-left'"
                    class="align-middle text-muted"
                    size="lg"
                  />
                </b-btn>
              </b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>

        <template v-else>
          <div class="text-center p-4">
            <font-awesome-icon
              icon="times-circle"
              class="text-moremuted display-3 mb-3"
            />

            <div class="text-muted">
              {{ $t('customerOrders.noOrderHasBeenSubmittedYet') }}
            </div>
          </div>
          <div></div>
        </template>
      </template>

      <template v-if="items && items.length && items.length < count" v-slot:footer>
        <b-link class="py-2 px-3 d-block inherited-link" to="/dash/orders?status=pending">
          <div class="py-1">
            {{ $t('shared.viewAll') }}

            <font-awesome-icon
              :icon="$dir.ltr ? 'angle-right' : 'angle-left'"
              class="align-middle"
              :class="{ 'ml-1': $dir.ltr, 'mr-1': $dir.rtl }"
            />
          </div>
        </b-link>
      </template>
    </b-card>
  </div>
</template>

<script>
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'
import DateDisplay from '@/components/shared/DateDisplay'
import Settings from '@/mixins/settings/index'
import TitleDisplay from '@/components/dash/shared/TitleDisplay'

export default {
  name: 'CustomerOrders',
  components: {
    CurrencyDisplay,
    DateDisplay,
    TitleDisplay
  },
  mixins: [Settings],
  data () {
    return {
      initializing: true,
      items: [],
      count: 0,
      fields: [
        {
          key: 'id',
          label: this.$t('customerOrders.orderId')
        },
        {
          key: 'created',
          label: this.$t('shared.created')
        },
        {
          key: 'status',
          label: this.$t('shared.status')
        },
        {
          key: 'payable',
          label: this.$t('products.payable')
        }
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
  mounted () {
    Promise.all([
      this.getSettings('currency'),
      this.getItems(),
      this.getCount()
    ])
    .then(() => {
      this.initializing = false
    })
    .catch(err => {
      this.$showError(this.$getLocaleErrorMessage(err, 'currencies'))
    })
  },
  methods: {
    getItems () {
      return this.$api.customerOrders.getAll({
        limit: 10,
        sort: 'created'
      }, true)
      .then(res => {
        this.items = res
        return this.items
      })
      .catch(err => {
        this.$showError(this.$getLocaleErrorMessage(err, 'customerOrders'))
        this.items = []
        return this.items
      })
    },
    getCount () {
      return this.$api.customerOrders.count()
      .then(res => {
        this.count = res
        return this.count
      })
      .catch(err => {
        this.$showError(this.$getLocaleErrorMessage(err, 'customerOrders'))
        this.count = 0
        return this.count
      })
    },
    getUserDisplayName (user) {
      return this.$api.account.getUserDisplayName(user)
    },
    getStatus (status) {
      return this.statuses.find(o => o.value === status)
    }
  }  
}
</script>
