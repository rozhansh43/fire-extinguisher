<template>
  <div class="animated fadeIn d-flex align-items-center">
    <b-container>
      <register/>
    </b-container>
  </div>
</template>

<script>
import progressEnd from '@/mixins/progress-end'
import Register from '@/components/account/Register'

export default {
  name: 'RegisterPage',
  meta: {
    modules: [
      'products_sale'
    ]
  },
  head () {
    return {
      title: this.$t('account.register')
    }
  },
  components: {
    Register
  },
  mixins: [progressEnd],
  validate({ app, store }) {
    const key = `${app.$config.auth.userType}Account`
    return app.$api.settings.get(key)
    .then(res => {
      return res[key].registerViaUserNameEnabled || res[key].registerViaEmailEnabled || res[key].registerViaPhoneNumberEnabled
    })
    .catch(() => {
      return false
    })
  }
}
</script>
