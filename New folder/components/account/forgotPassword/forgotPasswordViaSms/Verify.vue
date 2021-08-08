<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="mb-0">
        {{ $t('account.verifyPhoneNumber') }}
      </h4>

      <font-awesome-icon
        v-if="progressing"
        icon="cog"
        spin
        class="text-moremuted h4 mb-0"
      />
    </div>

    <p class="text-muted">{{ $t('account.enterVerificationCode', { number }) }}</p>

    <b-alert :show="errors.any()" variant="danger" class="px-4 my-2">
      <ul class="m-0 px-1">
        <li v-for="err in errors.all()" :key="err">
          {{ err }}
        </li>
      </ul>
    </b-alert>

    <b-form @submit.prevent="emitVerifyOtp">
      <b-form-group>
        <b-input-group>
          <input
            ref="input"
            v-model="verificationCode"
            v-validate="'required|digits:6'"
            class="form-control text-center"
            :class="{ 'is-invalid': errors.has($t('account.verificationCode')) }"
            dir="ltr"
            :name="$t('account.verificationCode')"
            placeholder="- - - - - -"
          >
        </b-input-group>
      </b-form-group>

      <b-btn
        :disabled="progressing"
        variant="primary"
        class="mb-3"
        block
        @click="emitVerifyOtp"
      >
        {{ $t('account.verifyPhoneNumber') }}
      </b-btn>
    </b-form>

    <b-row class="justify-content-between">
      <b-col md="auto" class="mb-2 mb-md-0">
        <span v-if="countdown > 0" class="text-primary">
          <span class="text-muted">{{ $t('account.resendCode') }}</span>
          ({{ countdown }})
        </span>

        <b-btn v-else variant="link" class="p-0" @click="emitResendOtp">
          {{ $t('account.resendCode') }}
        </b-btn>
      </b-col>

      <b-col md="auto">
        <b-btn variant="link" class="p-0" @click="emitChangeNumber">
          {{ $t('account.editPhoneNumber') }}
        </b-btn>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'LoginOtpVerify',
  props: {
    number: { type: String },
    prefix: { type : String },
    progressing: { type: Boolean, default: false }
  },
  data () {
    return {
      verificationCode: null,
      countdown: 60
    }
  },
  watch: {
    verificationCode (val) {
      this.normalize(val)
    }
  },
  mounted () {
    this.$refs.input.focus()
    this.interval()
  },
  methods: {
    normalize (val) {
      const strNum = String(val)
      .replace(/,/g, '')
      .replace(/۰/g, '0') // Persian digits
      .replace(/۱/g, '1')
      .replace(/۲/g, '2')
      .replace(/۳/g, '3')
      .replace(/۴/g, '4')
      .replace(/۵/g, '5')
      .replace(/۶/g, '6')
      .replace(/۷/g, '7')
      .replace(/۸/g, '8')
      .replace(/۹/g, '9')
      .replace(/٠/g, '0') // Arabic digits
      .replace(/١/g, '1')
      .replace(/٢/g, '2')
      .replace(/٣/g, '3')
      .replace(/٤/g, '4')
      .replace(/٥/g, '5')
      .replace(/٦/g, '6')
      .replace(/٧/g, '7')
      .replace(/٨/g, '8')
      .replace(/٩/g, '9')

      this.verificationCode = strNum
    },
    interval () {
      const intv = setInterval(() => {
        this.countdown--
        if (this.countdown === 0) {
          clearInterval(intv)
        }
      }, 1000)
    },
    emitResendOtp () {
      this.$emit('resendOtp', this.number)
      this.countdown = 60
      this.interval()
    },
    emitChangeNumber () {
      this.$emit('changeNumber')
    },
    emitVerifyOtp () {
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          this.$emit('verifyOtp', this.number, this.verificationCode)
        }
      })
    }
  }
}
</script>
