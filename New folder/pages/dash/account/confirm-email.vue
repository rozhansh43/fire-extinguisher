<template>
  <div class="animated fadeIn h-100">
    <confirm-email class="align-items-center h-100"/>
  </div>
</template>

<script>
import progressEnd from '@/mixins/progress-end'
import ConfirmEmail from '@/components/account/confirmInfo/confirmEmail'

export default {
  name: 'ChangeEmailPage',
  meta: {
    auth: {
      allowUnconfirmedEmail: true,
      allowUnconfirmedPhoneNumber: true
    }
  },
  head () {
    return {
      title: this.$t('account.changeEmail')
    }
  },
  components: {
    ConfirmEmail
  },
  mixins: [progressEnd]
}
</script>
