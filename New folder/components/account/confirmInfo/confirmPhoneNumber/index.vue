<template>
  <b-row class="justify-content-center">
    <b-col xl="6" lg="8">
      <div v-if="initializing" class="text-center">
        <font-awesome-icon spin icon="circle-notch" class="text-moremuted display-2"/>
      </div>

      <template v-else>
        <div v-if="confirmed" class="text-center">
          <font-awesome-icon icon="check-circle" class="display-3 mb-3 text-success" />
          <h5>{{ $t('account.phoneNumberConfirmedSuccessfully') }}</h5>
        </div>

        <template v-else>
          <send
            v-if="sending"
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
            @verifyOtp="verifyOtp"
          />
        </template>
      </template>
    </b-col>
  </b-row>
</template>

<script>
import * as types from '@/store/types'
import Send from './Send'
import Verify from './Verify'

export default {
  name: 'ConfirmPhoneNumber',
  components: {
    Send,
    Verify
  },
  data () {
    return {
      initializing: true,
      progressing: false,
      number: null,
      prefix: this.$config.country.phoneCode,
      sending: true,
      confirmed: false
    }
  },
  mounted () {
    this.getProfile()
    .then(res => {
      if (res.phoneNumber && res.phoneNumberConfirmed) {
        this.$router.push('./profile')
      } else {
        if (res.phoneNumber) {
          this.number = res.phoneNumber
          
          if (this.$route.query && this.$route.query.sendConfirmation) {
            this.sendOtp()
            .then(() => {
              this.initializing = false
            })
          } else {
            this.initializing = false
          }
        } else {
          this.$router.push('/dash/account/change-phone-number')
        }
      }
    })
    .catch(err => {
      this.$showError(this.$getLocaleErrorMessage(err, 'account'))
      this.$router.push('/dash')
    })
  },
  methods: {
    getProfile () {
      return this.$api.account.getProfile()
    },
    sendOtp () {
      this.progressing = true
      return this.$api.account.sendConfirmationSms(true)
      .then(() => {
        this.progressing = false
        this.sending = false
        return this.$showSuccess(this.$t('account.verificationCodeSent', { number: this.number }))
      })
      .catch(err => {
        this.progressing = false
        return this.$showError(this.$getLocaleErrorMessage(err, 'account'))
      })
    },
    verifyOtp (verificationCode) {
      this.progressing = true
      this.$api.account.confirmPhoneNumber(verificationCode, true)
      .then(() => {
        this.progressing = false
        this.confirmed = true
        setTimeout(() => {
          this.$store.commit(types.SET_ALLOW_NAVIGATION, true)
          this.$nextTick(() => this.$router.push(this.$config.homeUrl))
        }, 1000)
      })
      .catch(err => {
        this.$showError(this.$getLocaleErrorMessage(err, 'account'))
        this.progressing = false
      })
    }
  }
}
</script>
