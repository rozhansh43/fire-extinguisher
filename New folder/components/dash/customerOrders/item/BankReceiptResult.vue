<template>
  <b-card v-if="query && query.receipt" body-class="rounded overflow-hidden p-4">
    <b-row>
      <b-col lg="auto" class="d-flex align-items-center justify-content-center mb-4 mb-lg-0">
        <font-awesome-icon
          icon="check-circle"
          class="align-middle display-1 text-success mx-4"
        />
      </b-col>
      
      <b-col>
        <h4 class="text-success mb-4">
          {{ $t('customerOrders.orderSubmitted') }}.
        </h4>
        
        <b-alert show variant="warning" class="mb-4">
          <p class="mb-2">
            {{ $t('customerOrders.bankReceiptResult1') }}
          </p>

          <p class="mb-0">
            {{ $t('customerOrders.bankReceiptResult2') }}
          </p>
        </b-alert>

        <b-row class="align-items-center">
          <b-col lg="auto" class="mb-2 mb-lg-0">
            <b-btn size="lg" block variant="info" :to="`/dash/orders/${query.pid}`" class="px-4">
              {{ $t('customerOrders.followUpOrder') }}
            </b-btn>
          </b-col>

          <b-col lg="auto">
            <b-btn size="lg" block variant="link" to="/">
              {{ $t('shared.backToMainPage') }}
            </b-btn>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
export default {
  name: 'BankReceiptResult',
  computed: {
    query () {
      return this.$route.query
    }
  }
}
</script>
