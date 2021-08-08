<template>
  <div class="animated fadeIn d-flex align-items-center">
    <b-container>
      <login/>
    </b-container>
  </div>
</template>

<script>
import progressEnd from '@/mixins/progress-end'
import Login from '@/components/account/login'

export default {
  name: 'LoginPage',
  meta: {
    modules: [
      'products_sale'
    ]
  },
  head () {
    return {
      title: this.$t('account.login')
    }
  },
  components: {
    Login
  },
  mixins: [progressEnd],
  validate({ app, store }) {
    const key = `${app.$config.auth.userType}Account`
    return app.$api.settings.get(key)
    .then(res => {
      const loginViaPasswordEnabled = res[key].loginViaUserNameEnabled || res[key].loginViaEmailEnabled || res[key].loginViaPhoneNumberEnabled
      return loginViaPasswordEnabled || res[key].loginViaOtpEnabled
    })
    .catch(() => {
      return false
    })
  }
}
</script>
