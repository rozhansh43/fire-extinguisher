<template>
  <div>
    <send
      v-if="sending || changingNumber"
      :prefix="prefix"
      :number="number"
      :progressing="progressing"
      @sendOtp="sendOtp"
    />
    <verify
      v-else
      :prefix="prefix"
      :number="number"
      :progressing="progressing"
      @resendOtp="sendOtp"
      @changeNumber="changeNumber"
      @verifyOtp="verifyOtp"
    />
  </div>
</template>

<script>
import Send from './Send'
import Verify from './Verify'

export default {
  name: 'LoginViaOtp',
  components: {
    Send,
    Verify
  },
  data () {
    return {
      progressing: false,
      number: null,
      prefix: this.$config.country.phoneCode,
      changingNumber: false,
      sending: true
    }
  },
  methods: {
    sendOtp (number) {
      this.progressing = true
      this.number = number
      this.$api.account.sendOtp(number, true)
      .then(() => {
        this.$showSuccess(this.$t('account.verificationCodeSent', { number }))
        this.progressing = false
        this.changingNumber = false
        this.sending = false
      })
      .catch(err => {
        this.progressing = false
        this.$showError(this.$getLocaleErrorMessage(err, 'account'))
      })
    },
    changeNumber () {
      this.changingNumber = true
    },
    verifyOtp (number, verificationCode) {
      this.progressing = true
      this.$api.account.otpLogin({
        phoneNumber: String(parseInt(number)),
        code: verificationCode,
        userType: this.$config.auth.userType
      }, true)
      .then(account => {
        this.$emit('setAccount', account)
        this.progressing = false
      })
      .catch(err => {
        this.$showError(this.$getLocaleErrorMessage(err, 'account'))
        this.progressing = false
      })
    }
  }
}
</script>
