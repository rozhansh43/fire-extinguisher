<template>
  <b-row class="justify-content-center">
    <b-col xl="6" lg="8">
      <div v-if="initializing" class="text-center">
        <font-awesome-icon spin icon="circle-notch" class="text-moremuted display-2"/>
      </div>

      <template v-else>
        <div v-if="confirmed" class="text-center">
          <font-awesome-icon icon="check-circle" class="display-3 mb-3 text-success" />
          <h5>{{ $t('account.emailConfirmedSuccessfully') }}</h5>
        </div>

        <template v-else>
          <send
            v-if="sending"
            :email="email"
            :progressing="progressing"
            @sendEmail="sendEmail"
          />
          <verify
            v-else
            :email="email"
            :progressing="progressing"
            @resendEmail="sendEmail"
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
  name: 'ConfirmEmail',
  components: {
    Send,
    Verify
  },
  data () {
    return {
      initializing: true,
      progressing: false,
      email: null,
      sending: true,
      confirmed: false
    }
  },
  mounted () {
    if (this.$route.query.token)
      this.verifyEmail(this.$route.query.token)
    else {
      this.getProfile()
      .then(res => {
        if (res.email && res.emailConfirmed) {
          this.$router.push('./profile')
        } else {
          if (res.email) {
            this.email = res.email
            
            if (this.$route.query && this.$route.query.sendConfirmation) {
              this.sendEmail()
              .then(() => {
                this.initializing = false
              })
            } else {
              this.initializing = false
            }
          } else {
            this.$router.push('/dash/account/change-email')
          }
        }
      })
      .catch(err => {
        this.$showError(this.$getLocaleErrorMessage(err, 'account'))
        this.$router.push('/dash')
      })
    }
  },
  methods: {
    getProfile () {
      return this.$api.account.getProfile()
    },
    sendEmail () {
      this.progressing = true
      return this.$api.account.sendConfirmationEmail({ url: `${window.location.origin}/dash/account/confirm-email` }, true)
      .then(() => {
        this.progressing = false
        this.sending = false
        return this.$showSuccess(this.$t('account.confirmationEmailSentTo', { email: this.email }))
      })
      .catch(err => {
        this.progressing = false
        return this.$showError(this.$getLocaleErrorMessage(err, 'account'))
      })
    },
    verifyEmail (token) {
      this.initializing = true
      this.$api.account.confirmEmail(token, true)
      .then(() => {
        this.confirmed = true
        setTimeout(() => {
          this.$store.commit(types.SET_ALLOW_NAVIGATION, true)
          this.$nextTick(() => this.$router.push(this.$config.homeUrl))
        }, 1000)
      })
      .then(() => {
        this.initializing = false
      })
      .catch(err => {
        this.$router.push('/dash/account/profile')
        this.$showError(this.$getLocaleErrorMessage(err, 'account'))
        this.initializing = false
      })
    }
  }
}
</script>
