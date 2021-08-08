<template>
  <b-form @submit.prevent="submit">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1 class="h2 mb-0">
        {{ $t('account.login') }}
      </h1>

      <font-awesome-icon
        v-if="progressing"
        icon="cog"
        spin
        class="text-moremuted h4 mb-0"
      />
    </div>

    <p class="text-muted">{{ $t('account.signInToYourAccount') }}</p>

    <b-alert :show="errors.any()" variant="danger" class="px-4">
      <ul class="m-0 px-1">
        <li v-for="err in errors.all()" :key="err">{{err}}</li>
      </ul>
    </b-alert>

    <b-form-group>
      <b-input-group>
        <b-input-group-prepend is-text>
          <font-awesome-icon icon="user" v-if="loginViaEmailEnabled && loginViaPhoneNumberEnabled"/>
          <font-awesome-icon icon="at" v-else-if="loginViaEmailEnabled"/>
          <font-awesome-icon icon="mobile" v-else-if="loginViaPhoneNumberEnabled"/>
          <font-awesome-icon icon="user" v-else/>
        </b-input-group-prepend>
        
        <b-form-input
          v-model="model.userName"
          dir="auto"
          v-validate="'required'"
          :name="userNameLabel"
          :placeholder="userNameLabel"
          autocomplete="userName"
        />
      </b-input-group>
    </b-form-group>

    <b-form-group>
      <password-editor
        :placeholder="$t('account.password')"
        autocomplete="current-password"
        :name="$t('account.password')"
        v-validate="'required'"
        v-model="model.password"
      >
        <template v-slot:prepend>
          <b-input-group-prepend is-text>
            <font-awesome-icon icon="key"/>
          </b-input-group-prepend>
        </template>
      </password-editor>
    </b-form-group>

    <b-btn variant="primary" block :disabled="progressing" type="submit">
      {{ $t('account.login') }}
    </b-btn>

    <b-btn
      v-if="resetPasswordEnabled"
      to="/forgot-password"
      variant="link"
      block
      class="mt-3"
    >
      {{ $t('account.haveYouForgotPassword') }}
    </b-btn>
  </b-form>
</template>

<script>
import Settings from '@/mixins/settings/index'
import PasswordEditor from '@/components/shared/PasswordEditor'

export default {
  name: 'LoginViaPassword',
  components: {
    PasswordEditor
  },
  mixins: [Settings],
  inject: ['$validator'],
  data () {
    return {
      progressing: false,
      model: {
        userName: null,
        password: null,
        userType: this.$config.auth.userType
      }
    }
  },
  computed: {
    userNameLabel () {
      let label = this.$t('account.userName')
      if (this.loginViaEmailEnabled && this.loginViaPhoneNumberEnabled) {
        label = this.$t('account.emailOrPhoneNumber')
      } else if (this.loginViaEmailEnabled) {
        label = this.$t('account.email')
      } else if (this.loginViaPhoneNumberEnabled) {
        label = this.$t('account.phoneNumber')
      }
      return label
    }
  },
  methods: {
    submit () {
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          this.progressing = true
          this.$api.account.login(this.model, true)
          .then(account => {
            this.$emit('setAccount', account)
            this.progressing = false
          })
          .catch(err => {
            this.$showError(this.$getLocaleErrorMessage(err, 'account'))
            this.progressing = false
          })
        }
      })
    }
  }
}
</script>
