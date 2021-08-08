<template>
  <b-card v-if="query && query.credit" body-class="rounded overflow-hidden p-4">
    <b-row>
      <b-col lg="auto" class="d-flex align-items-center justify-content-center mb-4 mb-lg-0">
        <font-awesome-icon
          :icon="query.err ? 'times-circle' : 'check-circle'"
          class="align-middle display-1 mx-4"
          :class="query.err ? 'text-danger' : 'text-success'"
        />
      </b-col>
      
      <b-col>
        <h4 class="mb-4 text-success">
          {{ $t('customerOrders.orderSubmitted') }}
        </h4>
        
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
  name: 'CreditResult',
  computed: {
    query () {
      return this.$route.query
    }
  }
}
</script>
