<template>
  <div :class="{ 'row justify-content-center': !inComponent }">
    <div :class="colClass">
      <b-card-group :class="{ 'mb-3': !inComponent }">
        <b-card class="p-4" :class="{ 'shadow-none': inComponent, 'rounded': !registerViaPasswordEnabled }">
          <login-via-password
            v-if="mode === 'loginViaPassword'"
            @setAccount="setAccount"
          />

          <login-via-otp
            v-else-if="mode === 'loginViaOtp'"
            @setAccount="setAccount"
          />

          <login-mode-changer v-if="mode" v-model="mode"/>
        </b-card>

        <b-card
          v-if="registerViaPasswordEnabled"
          bg-variant="primary"
          class="p-4"
          :class="{ 'shadow-none': inComponent }"
          body-class="d-flex flex-column text-center align-items-center justify-content-center"
        >
          <h2 class="mb-3">{{ $t('account.signUp') }}</h2>

          <p class="mb-3">{{ $t('account.signUpMessage') }}</p>

          <b-btn to="/register" variant="primary" class="active">{{ $t('account.registerNow') }}</b-btn>
        </b-card>
      </b-card-group>
    </div>
  </div>
</template>

<script>
import vm from '@/lib/vm'
import Settings from '@/mixins/settings/index'
import LoginViaPassword from './loginViaPassword'
import LoginViaOtp from './loginViaOtp'
import LoginModeChanger from './LoginModeChanger'

export default {
  name: 'Login',
  components: {
    LoginViaPassword,
    LoginViaOtp,
    LoginModeChanger
  },
  mixins: [Settings],
  props: {
    inComponent: { type: Boolean, default: false },
    noRedirect: { type: Boolean, default: false },
    eventAppend: String
  },
  data () {
    return {
      mode: null
    }
  },
  computed: {
    colClass () {
      if (this.inComponent) return null
      else {
        if (this.registerViaPasswordEnabled)
          return 'col-md-12 col-lg-10 col-xl-8'
        else
          return 'col-md-7 col-lg-5 col-xl-4'
      }
    }
  },
  created () {
    this.mode = this.getDefualtMode()
  },
  methods: {
    getDefualtMode () {
      if (this.loginViaPasswordEnabled)
        return 'loginViaPassword'
      else if (this.loginViaOtpEnabled)
        return 'loginViaOtp'
    },
    setAccount(account) {
      vm.$emit('login', account, this.noRedirect, this.eventAppend)
    }
  }
}
</script>
