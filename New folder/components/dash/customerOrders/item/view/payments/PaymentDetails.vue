<template>
  <b-modal
    ref="modal"
    centered
    hide-footer
    :title="$t('payments.paymentDetails')"
    body-class="p-0"
    @hide="resetModal"
  >
    <b-list-group v-if="item" flush class="rounded-bottom overflow-hidden">
      <b-list-group-item v-if="item.created">
        <b-row class="align-items-center">
          <b-col md="4" class="text-muted">
            {{ $t('shared.created') }} :
          </b-col>

          <b-col>
            <date-display :value="item.created" time/>
          </b-col>
        </b-row>
      </b-list-group-item>

      <b-list-group-item v-if="getStatus(item.status)">
        <b-row class="align-items-center">
          <b-col md="4" class="text-muted">
            {{ $t('shared.status') }} :
          </b-col>

          <b-col>
            <font-awesome-icon
              :icon="getStatus(item.status).icon"
              class="align-middle"
              :class="[`text-${getStatus(item.status).variant}`, { 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }]"
            />

            {{ getStatus(item.status).text }}
          </b-col>
        </b-row>
      </b-list-group-item>

      <b-list-group-item v-if="item.amount">
        <b-row class="align-items-center">
          <b-col md="4" class="text-muted">
            {{ $t('payments.amount') }} :
          </b-col>

          <b-col>
            <currency-display
              :value="item.amount"
              amount-class="h5 mb-0 text-success"
            />
          </b-col>
        </b-row>
      </b-list-group-item>

      <b-list-group-item v-if="item.payAdapterType">
        <b-row class="align-items-center">
          <b-col md="4" class="text-muted">
            {{ $t('payments.paymentMethod') }} :
          </b-col>

          <b-col>
            <pay-adapter-display :value="item"/>
          </b-col>
        </b-row>
      </b-list-group-item>

      <b-list-group-item v-if="item.payError">
        <b-row class="align-items-center">
          <b-col md="4" class="text-muted">
            {{ $t('payments.payError') }} :
          </b-col>

          <b-col>
            {{ getPayErrorName(item.payError) }}
          </b-col>
        </b-row>
      </b-list-group-item>

      <b-list-group-item v-if="item.bankAccount">
        <b-row class="align-items-center">
          <b-col md="4" class="text-muted">
            {{ $t('payments.destinationBankAccount') }} :
          </b-col>

          <b-col>
            {{ item.bankAccount.name}}

            <template v-if="item.bankAccount.bank">
              ({{ item.bankAccount.bank.name }})
            </template>
          </b-col>
        </b-row>
      </b-list-group-item>

      <b-list-group-item v-if="item.receiptNo">
        <b-row class="align-items-center">
          <b-col md="4" class="text-muted">
            {{ $t('payments.receiptNo') }} :
          </b-col>

          <b-col>
            {{ item.receiptNo}}
          </b-col>
        </b-row>
      </b-list-group-item>

      <b-list-group-item v-if="item.receiptImage">
        <b-row class="align-items-center">
          <b-col md="4" class="text-muted">
            {{ $t('payments.receiptImage') }} :
          </b-col>

          <b-col class="d-flex">
            <thumbnail
              :path="item.receiptImage"
              :width="50"
              :height="50"
              class="border border-light rounded d-block"
            />
          </b-col>
        </b-row>
      </b-list-group-item>
    </b-list-group>
  </b-modal>
</template>

<script>
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'
import DateDisplay from '@/components/shared/DateDisplay'
import PayAdapterDisplay from '@/components/shared/PayAdapterDisplay'
import Thumbnail from '@/components/shared/Thumbnail'

export default {
  name: 'PaymentDetails',
  components: {
    CurrencyDisplay,
    DateDisplay,
    PayAdapterDisplay,
    Thumbnail
  },
  data () {
    return {
      item: null,
      statuses: [
        { value: 0, text: this.$t('shared.pending'), icon: 'hourglass-half', variant: 'dark' },
        { value: 1, text: this.$t('shared.disapproved'), icon: 'hand-paper', variant: 'danger' },
        { value: 2, text: this.$t('shared.approved'), icon: 'check', variant: 'success' }
      ],
      payErrors: [
        { value: 0, text: this.$t('payments.isPaidBefore') },
        { value: 1, text: this.$t('payments.notProcessable') },
        { value: 2, text: this.$t('payments.reserveFailed') },
        { value: 3, text: this.$t('payments.unreserveFailed') },
        { value: 4, text: this.$t('payments.applyReserveFailed') },
        { value: 5, text: this.$t('payments.notVerified') },
        { value: 6, text: this.$t('payments.notSettled') },
        { value: 7, text: this.$t('payments.redirectToIpgFailed') },
        { value: 8, text: this.$t('payments.processAndUnreserveFailed') },
        { value: 9, text: this.$t('payments.notSettledAndUnreserveFailed') },
        { value: 10, text: this.$t('payments.notVerifiedAndUnreserveFailed') }
      ]
    }
  },
  methods: {
    show (item) {
      this.item = item
      this.$refs.modal.show()
    },
    resetModal () {
      this.item = null
    },
    getStatus (item) {
      return this.statuses.find(i => i.value === item)
    },
    getPayErrorName (item) {
      const error = this.payErrors.find(i => i.value === item)
      return error ? error.text : null
    }
  }
}
</script>
