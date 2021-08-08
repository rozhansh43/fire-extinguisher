<template>
  <b-row class="justify-content-center">
    <b-col xl="4" lg="5" md="7">
      <reset-password v-if="queryParams" :query-params="queryParams"/>
      
      <b-card v-else class="mb-3" body-class="p-0">
        <h1 class="h2 mb-0 p-4 m-3">
          {{ $t('account.forgotPassword') }}
        </h1>

        <hr class="my-0"/>

        <forgot-password-via-email
          v-if="(loginViaUserNameEnabled || loginViaEmailEnabled) && (!mode || mode === 'email')"
          class="p-4 m-3"
          @active="setMode('email')"
        />

        <hr class="my-0" v-if="(loginViaUserNameEnabled || loginViaEmailEnabled) && loginViaPhoneNumberEnabled && !mode"/>

        <forgot-password-via-sms
          v-if="loginViaPhoneNumberEnabled && (!mode || mode === 'sms')"
          class="p-4 m-3"
          @active="setMode('sms')"
        />
      </b-card>

      <b-btn to="/login" size="sm" variant="link" block class="mb-3">
        {{ $t('shared.return') }}
      </b-btn>
    </b-col>
  </b-row>
</template>

<script>
import Settings from '@/mixins/settings/index'
import ForgotPasswordViaEmail from './forgotPasswordViaEmail'
import ForgotPasswordViaSms from './forgotPasswordViaSms'
import ResetPassword from './ResetPassword'

export default {
  name: 'ForgotPassword',
  components: {
    ForgotPasswordViaEmail,
    ForgotPasswordViaSms,
    ResetPassword
  },
  mixins: [Settings],
  data () {
    return {
      mode: null,
      queryParams: null
    }
  },
  watch: {
    '$route.query' () {
      this.getRouteParams()
    }
  },
  mounted () {
    this.getRouteParams()
  },
  methods: {
    getRouteParams () {
      if (this.$route.query.email && this.$route.query.token)
        this.queryParams = { email: this.$route.query.email, token: this.$route.query.token }
      else if (this.$route.query.phoneNumber && this.$route.query.code)
        this.queryParams = { phoneNumber: this.$route.query.phoneNumber, code: this.$route.query.code }
    },
    setMode (mode) {
      this.mode = mode
    }
  }
}
</script>
