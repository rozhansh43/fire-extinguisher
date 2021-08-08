<template>
  <b-card class="mb-3 p-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1 class="h4 mb-0">
        {{ $t('account.resetPassword') }}
      </h1>

      <font-awesome-icon
        v-if="progressing"
        icon="cog"
        spin
        class="text-moremuted h4 mb-0"
      />
    </div>

    <p class="text-muted">{{ $t('account.enterNewPassword') }}</p>

    <b-alert :show="errors.any()" variant="danger" class="px-4 my-2">
      <ul class="m-0 px-1">
        <li v-for="err in errors.all()" :key="err">{{err}}</li>
      </ul>
    </b-alert>

    <b-form @submit.prevent="submit">
      <b-form-group>
        <password-editor
          :prepend="$t('account.newPassword')"
          ref="newPassword"
          required
          :name="$t('account.newPassword')"
          v-validate="'required|min:6'"
          v-model="newPassword"
        />
      </b-form-group>

      <b-form-group>
        <password-editor
          :prepend="$t('account.passwordConfirm')"
          required
          :name="$t('account.passwordConfirm')"
          v-validate="'required|confirmed:newPassword'"
          v-model="pwdcfrm"
        />
      </b-form-group>

      <b-btn :disabled="progressing" type="submit" variant="primary" block>
        {{ $t('account.resetPassword') }}
      </b-btn>
    </b-form>
  </b-card>
</template>

<script>
import PasswordEditor from '@/components/shared/PasswordEditor'

export default {
  name: 'ForgotPassword',
  components: {
    PasswordEditor
  },
  props: {
    queryParams: { type: Object, required: true }
  },
  data () {
    return {
      progressing: false,
      newPassword: null,
      pwdcfrm: null
    }
  },
  methods: {
    submit () {
      this.$validator.validateAll()
      .then(isValid => {
        if (isValid) {
          if (this.queryParams.email && this.queryParams.token) {
            const model = {
              email: this.queryParams.email,
              token: this.queryParams.token,
              newPassword: this.newPassword
            }
            this.$api.account.resetPasswordViaToken(model, true)
            .then(() => {
              this.success()
            })
            .catch(err => {
              this.fail(err)
            })
          } else if (this.queryParams.phoneNumber && this.queryParams.code) {
            const model = {
              phoneNumber: this.queryParams.phoneNumber,
              code: this.queryParams.code,
              newPassword: this.newPassword
            }
            this.$api.account.resetPasswordViaCode(model, true)
            .then(() => {
              this.success()
            })
            .catch(err => {
              this.fail(err)
            })
          }
        }
      })
    },
    success () {
      this.$showSuccess(this.$t('account.yourPasswordHasChanged'))
      this.$router.push({ path: '/login' })
    },
    fail (err) {
      this.$showError(this.$getLocaleErrorMessage(err, 'account'))
    }
  }
}
</script>
