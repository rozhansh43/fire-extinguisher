<template>
  <div class="animated fadeIn h-100">
    <confirm-phone-number class="align-items-center h-100"/>
  </div>
</template>

<script>
import progressEnd from '@/mixins/progress-end'
import ConfirmPhoneNumber from '@/components/account/confirmInfo/confirmPhoneNumber'

export default {
  name: 'ChangePhoneNumberPage',
  meta: {
    auth: {
      allowUnconfirmedEmail: true,
      allowUnconfirmedPhoneNumber: true
    }
  },
  head () {
    return {
      title: this.$t('account.changePhoneNumber')
    }
  },
  components: {
    ConfirmPhoneNumber
  },
  mixins: [progressEnd]
}
</script>
