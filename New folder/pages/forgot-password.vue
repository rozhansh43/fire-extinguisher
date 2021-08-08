<template>
  <div class="animated fadeIn d-flex align-items-center">
    <b-container>
      <forgot-password/>
    </b-container>
  </div>
</template>

<script>
import progressEnd from '@/mixins/progress-end'
import ForgotPassword from '@/components/account/forgotPassword'

export default {
  name: 'ForgotPasswordPage',
  meta: {
    modules: [
      'products_sale'
    ]
  },
  head () {
    return {
      title: this.$t('account.forgotPassword')
    }
  },
  components: {
    ForgotPassword
  },
  mixins: [progressEnd],
  validate({ app }) {
    return app.$config.auth.resetPasswordEnabled
  }
}
</script>
