<template>
  <div class="animated fadeIn">
    <title-display :title="$t('credit.userCredit')" icon="wallet"/>

    <b-card class="mt-3 mb-4 overflow-hidden" body-class="p-0">
      <div class="m-3 p-4 d-flex justify-content-center align-items-center">
        <h5 class="text-muted mb-0" :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }">
          {{ $t('credit.credit') }} :
        </h5>

        <h3 class="mb-0 text-success">
          <currency-display
            :value="balance"
            currency-class="h5"
          />
        </h3>
      </div>

      <pay/>
    </b-card>

    <title-display :title="$t('credit.transactions')" icon="exchange-alt"/>

    <b-card v-if="transactions && transactions.length" no-body class="overflow-hidden">
      <b-table-simple
        bordered
        responsive
        class="table-bright table-flush mb-0"
      >
        <b-thead class="text-center">
          <b-tr>
            <b-th class="font-weight-normal">
              {{ $t('credit.id') }}
            </b-th>

            <b-th class="font-weight-normal">
              {{ $t('credit.amount') }}
            </b-th>

            <b-th class="font-weight-normal">
              {{ $t('shared.created') }}
            </b-th>

            <b-th class="font-weight-normal w-50">
              {{ $t('shared.description') }}
            </b-th>
          </b-tr>
        </b-thead>

        <b-tbody class="text-center">
          <b-tr v-for="item in transactions" :key="item.id">
            <b-td>
              {{ item.id }}
            </b-td>

            <td>
              <currency-display
                :value="Math.abs(item.amount)"
                amount-class="h5 mb-0"
              />

              <font-awesome-icon
                :icon="item.amount > 0 ? 'plus-circle' : 'minus-circle'"
                size="lg"
                class="align-middle"
                :class="[item.amount > 0 ? 'text-success' : 'text-danger', { 'ml-1': $dir.ltr, 'mr-1': $dir.rtl }]"
              />
            </td>

            <td>
              <date-display :value="item.created" time/>
            </td>

            <td>
              <template v-if="item.description">
                <template v-if="item.description.includes('ExtraPayment')">
                  {{ $t('customerOrders.extraPayment', { number: item.description.split('-')[1] }) }}
                </template>

                <p v-else class="mb-0 text-justify">
                  {{ item.description }}
                </p>
              </template>
            </td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </b-card>

    <b-card v-else class="text-muted">
      <div class="d-flex align-items-center justify-content-center">
        {{ $t('credit.thereIsNoTransactions') }}
      </div>
    </b-card>
  </div>
</template>

<script>
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'
import DateDisplay from '@/components/shared/DateDisplay'
import Pay from '@/components/dash/credit/Pay'
import progressEnd from '@/mixins/progress-end'
import TitleDisplay from '@/components/dash/shared/TitleDisplay'

export default {
  name: 'Credit',
  head () {
    return {
      title: this.$t('credit.userCredit')
    }
  },
  components: {
    CurrencyDisplay,
    DateDisplay,
    Pay,
    TitleDisplay
  },
  mixins: [progressEnd],
  meta: {
    modules: [
      'pay_credit'
    ]
  },
  asyncData ({ app, error }) {
    return Promise.all([
      app.$api.credit.getTransactions(),
      app.$api.credit.getBalance(),
      app.$api.settings.get('currency')
    ])
    .then(all => {
      return {
        transactions: all[0],
        balance: all[1]
      }
    })
    .catch(error)
  }
}
</script>
