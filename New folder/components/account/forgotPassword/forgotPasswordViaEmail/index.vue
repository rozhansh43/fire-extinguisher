<template>
  <div>
    <div v-if="sent" class="text-center">
      <font-awesome-icon icon="check-circle" class="display-3 mb-3 text-success" />
      <p>{{ $t('account.resetPasswordEmailSentTo', { email }) }}</p>
      
      <h5 class="mb-3">
        {{ $t('account.pleaseCheckYourInbox') }}
      </h5>

      <small class="text-muted">{{$t('account.andMaybeYourSpamFolder')}}</small>
    </div>

    <template v-else>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">
          {{ $t('account.resetPasswordViaEmail') }}
        </h5>

        <font-awesome-icon
          v-if="progressing"
          icon="cog"
          spin
          class="text-moremuted h4 mb-0"
        />
      </div>

      <b-alert :show="errors.any()" variant="danger" class="px-4 my-2">
        <ul class="m-0 px-1">
          <li v-for="err in errors.all()" :key="err">{{err}}</li>
        </ul>
      </b-alert>

      <b-form @submit.prevent="submit">
        <b-form-group>
          <b-input-group>
            <b-input-group-prepend is-text>
              <font-awesome-icon icon="at"/>
            </b-input-group-prepend>

            <b-form-input
              dir="ltr"
              :placeholder="$t('account.email')"
              :name="$t('account.email')"
              v-validate="'required|email'"
              v-model="email"
            />
          </b-input-group>  
        </b-form-group>                

        <b-btn type="submit" :disabled="progressing" variant="primary" block>
          {{ $t('account.sendEmail') }}
        </b-btn>
      </b-form>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ForgotPasswordViaEmail',
  data () {
    return {
      progressing: false,
      sent: false,
      email: null
    }
  },
  methods: {
    submit () {
      this.$validator.validateAll()
      .then(isValid => {
        if (isValid) {
          this.progressing = true
          this.$api.account.sendResetPasswordEmail({ email: this.email, url: `${window.location.origin}/forgot-password` }, true)
          .then(() => {
            this.progressing = false
            this.sent = true
            this.$emit('active')
          })
          .catch(err => {
            this.progressing = false
            this.$showError(this.$getLocaleErrorMessage(err, 'account'))
          })
        }
      })
    }
  }
}
</script>
