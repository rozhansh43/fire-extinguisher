<template>
  <b-card v-if="hasAnyTransaction" no-body>
    <b-card-header class="p-0" :class="{ 'rounded-bottom bg-white': !collapsed }">
      <b-btn
        block
        class="p-3 inherited-link d-flex align-items-center justify-content-between"
        variant="link"
        @click="toggleCollapsed"
      >
        <h5 class="mb-0">
          <font-awesome-icon
            icon="file-alt"
            class="align-middle text-info"
            :class="{ 'mr-2': $dir.ltr, 'ml-2': $dir.rtl }"
          />
          
          {{ $t('customerOrders.paymentsHistory') }}
        </h5>

        <font-awesome-icon
          :icon="collapsed ? 'angle-up' : 'angle-down'"
          class="align-middle"
        />
      </b-btn>
    </b-card-header>

    <b-card-body v-if="collapsed" class="p-0">
      <div class="border-top">
        <b-table-simple
          bordered
          responsive
          class="table-bright mb-0 table-flush rounded-bottom text-center"
        >
          <b-thead>
            <b-tr>
              <b-th class="font-weight-normal">
                {{ $t('shared.title') }}
              </b-th>

              <b-th class="font-weight-normal">
                {{ $t('payments.amount') }}
              </b-th>

              <b-th class="font-weight-normal">
                {{ $t('shared.created') }}
              </b-th>

              <b-th class="font-weight-normal">
                {{ $t('shared.status') }}
              </b-th>

              <b-th></b-th>
            </b-tr>
          </b-thead>

          <b-tbody>
            <template v-if="creditTransactions && creditTransactions.length">
              <b-tr v-for="transaction in creditTransactions" :key="transaction.id">
                <b-td>
                  <span
                    class="fa-layers align-middle"
                    style="font-size:215%"
                    :class="{'mr-2': $dir.ltr, 'ml-2': $dir.rtl}"
                  >
                    <font-awesome-icon icon="circle" fixed-width :class="'text-danger'"/>
                    <font-awesome-icon icon="wallet" fixed-width class="fa-inverse" transform="shrink-9"/>
                  </span>

                  {{ $t('payments.payThrough') }} {{ $t('payments.credit') }}
                </b-td>

                <b-td>
                  <currency-display
                    :value="transaction.amount"
                    amount-class="h5 mb-0 text-success"
                  />
                </b-td>

                <b-td>
                  <date-display :value="transaction.created" time/>
                </b-td>

                <b-td>
                  <font-awesome-icon
                    :icon="statuses[2].icon"
                    class="align-middle"
                    :class="[`text-${statuses[2].variant}`, { 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }]"
                  />

                  {{ statuses[2].text }}
                </b-td>

                <b-td>
                </b-td>
              </b-tr>
            </template>

            <template v-for="payment in payments">
              <template v-if="getTransactions(payment) && getTransactions(payment).length">
                <b-tr v-for="transaction in getTransactions(payment)" :key="payment.id + transaction.id">
                  <template v-if="transaction.amount > 0">
                    <b-td>
                      <pay-adapter-display :value="payment" :prefix="$t('payments.payThrough')"/>
                    </b-td>

                    <b-td>
                      <currency-display
                        :value="payment.amount"
                        amount-class="h5 mb-0 text-success"
                      />
                    </b-td>

                    <b-td>
                      <date-display :value="payment.created" time/>
                    </b-td>

                    <b-td>
                      <template v-if="getStatus(payment.status)">
                        <font-awesome-icon
                          :icon="getStatus(payment.status).icon"
                          class="align-middle"
                          :class="[`text-${getStatus(payment.status).variant}`, { 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }]"
                        />

                        {{ getStatus(payment.status).text }}
                      </template>
                    </b-td>

                    <b-td>
                      <div class="text-center">
                        <b-btn
                          v-if="payment.payType === 200 || payment.payType === 300"
                          variant="link"
                          size="lg"
                          class="p-0"
                          :title="$t('shared.details')"
                          v-b-tooltip
                          @click="showDetails(payment)"
                        >
                          <font-awesome-icon icon="info-circle" size="lg" fixed-width class="align-middle"/>
                        </b-btn>

                        <b-btn
                          v-if="payment.status === 0 && payment.payType !== 300"
                          variant="link"
                          size="lg"
                          class="p-0"
                          :title="$t('shared.remove')"
                          v-b-tooltip
                          @click="deleteTransaction(payment.id)"
                        >
                          <span class="fa-stack align-middle" style="font-size:70%">
                            <font-awesome-icon
                              icon="circle"
                              fixed-width
                              class="fas fa-stack-2x text-danger"
                            />

                            <font-awesome-icon
                              :icon="progressing ? 'cog' : 'trash-alt'"
                              :spin="progressing"
                              fixed-width
                              size="sm"
                              class="fas fa-stack-1x fa-inverse"
                            />
                          </span>
                        </b-btn>
                      </div>
                    </b-td>
                  </template>

                  <template v-else>
                    <b-td>
                      <span
                        class="fa-layers align-middle"
                        style="font-size:215%"
                        :class="{'mr-2': $dir.ltr, 'ml-2': $dir.rtl}"
                      >
                        <font-awesome-icon icon="circle" fixed-width :class="'text-danger'"/>
                        <font-awesome-icon icon="wallet" fixed-width class="fa-inverse" transform="shrink-9"/>
                      </span>

                      {{ $t('payments.transferToCredit') }}
                    </b-td>

                    <b-td>
                      <currency-display
                        :value="Math.abs(transaction.amount)"
                        amount-class="h5 mb-0 text-success"
                      />
                    </b-td>

                    <b-td>
                      <date-display :value="transaction.created" time/>
                    </b-td>

                    <b-td>
                      <font-awesome-icon
                        :icon="statuses[2].icon"
                        class="align-middle"
                        :class="[`text-${statuses[2].variant}`, { 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }]"
                      />

                      {{ statuses[2].text }}
                    </b-td>

                    <b-td>
                    </b-td>
                  </template>
                </b-tr>
              </template>

              <b-tr v-else :key="payment.id">
                <b-td>
                  <pay-adapter-display :value="payment" :prefix="$t('payments.payThrough')"/>
                </b-td>

                <b-td>
                  <currency-display
                    :value="payment.amount"
                    amount-class="h5 mb-0 text-success"
                  />
                </b-td>

                <b-td>
                  <date-display :value="payment.created" time/>
                </b-td>

                <b-td>
                  <template v-if="getStatus(payment.status)">
                    <font-awesome-icon
                      :icon="getStatus(payment.status).icon"
                      class="align-middle"
                      :class="[`text-${getStatus(payment.status).variant}`, { 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }]"
                    />

                    {{ getStatus(payment.status).text }}
                  </template>
                </b-td>

                <b-td>
                  <div class="text-center">
                    <b-btn
                      v-if="payment.payType === 200 || payment.payType === 300"
                      variant="link"
                      size="lg"
                      class="p-0"
                      :title="$t('shared.details')"
                      v-b-tooltip
                      @click="showDetails(payment)"
                    >
                      <font-awesome-icon icon="info-circle" size="lg" fixed-width class="align-middle"/>
                    </b-btn>

                    <b-btn
                      v-if="payment.status === 0 && payment.payType !== 300"
                      variant="link"
                      size="lg"
                      class="p-0"
                      :title="$t('shared.remove')"
                      v-b-tooltip
                      @click="deleteTransaction(payment.id)"
                    >
                      <span class="fa-stack align-middle" style="font-size:70%">
                        <font-awesome-icon
                          icon="circle"
                          fixed-width
                          class="fas fa-stack-2x text-danger"
                        />

                        <font-awesome-icon
                          :icon="progressing ? 'cog' : 'trash-alt'"
                          :spin="progressing"
                          fixed-width
                          size="sm"
                          class="fas fa-stack-1x fa-inverse"
                        />
                      </span>
                    </b-btn>
                  </div>
                </b-td>
              </b-tr>
            </template>
          </b-tbody>
        </b-table-simple>
      </div>
      
      <payment-details ref="paymentDetails"/>
    </b-card-body>
  </b-card>
</template>

<script>
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'
import DateDisplay from '@/components/shared/DateDisplay'
import PayAdapterDisplay from '@/components/shared/PayAdapterDisplay'
import PaymentDetails from './PaymentDetails'

export default {
  name: 'Payments',
  components: {
    CurrencyDisplay,
    DateDisplay,
    PayAdapterDisplay,
    PaymentDetails
  },
  props: {
    value: { type: Object, required: true }
  },
  data () {
    return {
      collapsed: false,
      progressing: false,
      payments: null,
      paymentTransactions: null,
      statuses: [
        { value: 0, text: this.$t('shared.waitingForApprovement'), icon: 'hourglass-half', variant: 'dark' },
        { value: 1, text: this.$t('shared.disapproved'), icon: 'hand-paper', variant: 'danger' },
        { value: 2, text: this.$t('shared.approved'), icon: 'check', variant: 'success' }
      ]
    }
  },
  computed: {
    hasAnyTransaction () {
      return (this.creditTransactions && this.creditTransactions.length) ||
        (this.payments && this.payments.length)
    },
    creditTransactions () {
      return this.paymentTransactions && this.paymentTransactions.length
        ? this.paymentTransactions.filter(o => o.amount > 0 && !o.paymentId)
        : null
    }
  },
  mounted () {
    this.payments = this.value.payments
    this.paymentTransactions = this.value.paymentTransactions
  },
  methods: {
    toggleCollapsed () {
      this.collapsed = !this.collapsed
    },
    getTransactions (payment) {
      return this.paymentTransactions && this.paymentTransactions.length ? this.paymentTransactions.filter(o => o.paymentId === payment.id) : null
    },
    getStatus (item) {
      return this.statuses.find(i => i.value === item)
    },
    showDetails (item) {
      this.$refs.paymentDetails.show(item)
    },
    deleteTransaction (itemId) {
      if (confirm(this.$t('shared.areYouSureToRemoveThisItem'))) {
        this.progressing = true

        this.$api.customerOrders.deleteBankReceipt(this.value.id, itemId, true)
        .then(() => {
          this.payments = this.payments.filter(o => o.id !== itemId)
          this.paymentTransactions = this.paymentTransactions.filter(o => o.id !== itemId)
          this.progressing = false
          this.$showSuccess(this.$t('invoices.transactionRemoved'))
        })
        .catch(err => {
          this.progressing = false
          this.$showError(this.$getLocaleErrorMessage(err, 'invoices'))
        })
      }
    }
  }
}
</script>
