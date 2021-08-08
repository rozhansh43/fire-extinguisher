<template>
  <div class="animated fadeIn h-100">
    <change-email class="align-items-center h-100"/>
  </div>
</template>

<script>
import progressEnd from '@/mixins/progress-end'
import ChangeEmail from '@/components/account/changeInfo/ChangeEmail'

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
    ChangeEmail
  },
  mixins: [progressEnd]
}
</script>
