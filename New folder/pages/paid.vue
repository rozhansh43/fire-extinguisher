<template>
  <div class="animated fadeIn d-flex align-items-center">
    <b-container>
      <template v-if="query.pid">
        <pay-on-delivery-result v-if="query.payOnDelivery"/>
        <credit-result v-else-if="query.credit"/>
        <bank-receipt-result v-else-if="query.receipt"/>
        <ipg-result v-else-if="query.err || query.ref || query.rec"/>
      </template>

      <template v-else>
        <increase-credit-result v-if="query.credit"/>
      </template>
    </b-container>
  </div>
</template>

<script>
import BankReceiptResult from '@/components/dash/customerOrders/item/BankReceiptResult'
import CreditResult from '@/components/dash/customerOrders/item/CreditResult'
import IncreaseCreditResult from '@/components/dash/credit/IncreaseResult'
import IpgResult from '@/components/dash/customerOrders/item/IpgResult'
import PayOnDeliveryResult from '@/components/dash/customerOrders/item/PayOnDeliveryResult'
import progressEnd from '@/mixins/progress-end'

export default {
  name: 'OrderPaid',
  components: {
    BankReceiptResult,
    CreditResult,
    IncreaseCreditResult,
    IpgResult,
    PayOnDeliveryResult
  },
  mixins: [progressEnd],
  meta: {
    modules: [
      'products_sale',
      'credit'
    ]
  },
  computed: {
    query () {
      return this.$route.query
    }
  },
  head () {
    return {
      title: this.$t('payments.paymentDetails')
    }
  },
  validate ({ query }) {
    return query && ((query.pid && (query.receipt || (query.err || query.ref || query.rec))) || query.credit || query.payOnDelivery)
  }
}
</script>
