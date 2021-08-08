<template>
  <div>
    <b-card class="p-4" body-class="text-center">
      <font-awesome-icon icon="check-circle" class="display-3 mb-3 text-success" />

      <p>{{ $t('account.confirmationEmailSentTo', { email }) }}</p>

      <h5 class="mb-3">
        {{ $t('account.pleaseCheckYourInbox') }}
      </h5>

      <small class="mb-3 text-muted">{{$t('account.andMaybeYourSpamFolder')}}</small>
    </b-card>

    <div v-if="countdown > 0" class="text-primary text-center mb-3">
      <span class="text-muted">{{ $t('account.resendEmail') }}</span>
      ({{ countdown }})
    </div>

    <b-btn v-else :disabled="progressing" variant="link" class="p-0 mb-3" block @click="emitResendEmail">
      {{ $t('account.resendEmail') }}
    </b-btn>
  </div>
</template>

<script>
export default {
  name: 'ConfirmEmailVerify',
  props: {
    email: { type: String },
    progressing: { type: Boolean }
  },
  data () {
    return {
      countdown: 60
    }
  },
  mounted () {
    this.interval()
  },
  methods: {
    interval () {
      const intv = setInterval(() => {
        this.countdown--
        if (this.countdown === 0) {
          clearInterval(intv)
        }
      }, 1000)
    },
    emitResendEmail () {
      this.$emit('resendEmail')
      this.countdown = 60
      this.interval()
    }
  }
}
</script>
