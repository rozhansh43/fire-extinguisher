<template>
  <div class="animated fadeIn h-100">
    <change-password class="align-items-center h-100"/>
  </div>
</template>

<script>
import progressEnd from '@/mixins/progress-end'
import ChangePassword from '@/components/account/changeInfo/ChangePassword'

export default {
  name: 'ChangePasswordPage',
  meta: {
    auth: {
      allowUnconfirmedEmail: true,
      allowUnconfirmedPhoneNumber: true
    }
  },
  head () {
    return {
      title: this.$t('account.changePassword')
    }
  },
  components: {
    ChangePassword
  },
  mixins: [progressEnd]
}
</script>
