<template>
  <div class="animated fadeIn h-100">
    <change-phone-number class="align-items-center h-100"/>
  </div>
</template>

<script>
import progressEnd from '@/mixins/progress-end'
import ChangePhoneNumber from '@/components/account/changeInfo/ChangePhoneNumber'

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
    ChangePhoneNumber
  },
  mixins: [progressEnd]
}
</script>
