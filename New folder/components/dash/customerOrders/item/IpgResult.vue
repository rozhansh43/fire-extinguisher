<template>
  <b-card v-if="query && (query.err || query.ref || query.rec)" body-class="rounded overflow-hidden p-4">
    <b-row>
      <b-col lg="auto" class="d-flex align-items-center justify-content-center mb-4 mb-lg-0">
        <font-awesome-icon
          :icon="query.err ? 'times-circle' : 'check-circle'"
          class="align-middle display-1 mx-4"
          :class="query.err ? 'text-danger' : 'text-success'"
        />
      </b-col>
      
      <b-col>
        <h4 class="mb-4" :class="query.err ? 'text-danger' : 'text-success'">
          <template v-if="query.err">
            {{ $t('payments.ipgError') }}
          </template>

          <template v-else>
            {{ $t('customerOrders.orderSubmitted') }}.
          </template>
        </h4>
        
        <div class="mb-4">
          <p v-if="query.err" class="mb-2">
            <span class="text-muted">
              {{ $t('payments.error') }} :
            </span>
            
            {{ $t(`payments.${query.err}`) }} - 
            
            <template v-if="query.errMsg">
              {{ query.errMsg }}
            </template>
          </p>

          <p v-if="query.errCode" class="mb-2">
            <span class="text-muted">
              {{ $t('payments.code') }} :
            </span>
            
            {{ query.errCode }}
          </p>

          <p v-if="query.ref" class="mb-2">
            <span class="text-muted">
              {{ $t('payments.referenceNo') }} :
            </span>
            
            {{ query.ref }}
          </p>

          <p v-if="query.rec" class="mb-2">
            <span class="text-muted">
              {{ $t('payments.receiptNo') }} :
            </span>
            
            {{ query.rec }}
          </p>

          <p v-if="query.rev" class="mb-2">
            <span class="text-muted">
              {{ $t('payments.reverted') }}
            </span>
          </p>
        </div>

        <b-btn
          v-if="isMobileClient"
          size="lg"
          block
          variant="info"
          class="px-4"
          :href="`${query.protocol}://${$config.websiteUrl.split('//')[1]}/dash/orders/${query.pid}`"
        >
          {{ $t('shared.returnToApplication') }}
        </b-btn>
        
        <b-row v-else class="align-items-center">
          <b-col lg="auto" class="mb-2 mb-lg-0">
            <b-btn
              size="lg"
              block
              variant="info"
              class="px-4"
              :to="`/dash/orders/${query.pid}`"
            >
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
  name: 'IpgResult',
  computed: {
    query () {
      return this.$route.query
    },
    isMobileClient () {
      return this.query && this.query.protocol
    }
  }
}
</script>
