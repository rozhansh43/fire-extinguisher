<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="mb-0">
        {{ $t('account.resetPasswordViaSms') }}
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
        <li v-for="err in errors.all()" :key="err">
          {{ err }}
        </li>
      </ul>
    </b-alert>
    
    <b-form @submit.prevent="emitSendOtp">
      <b-form-group>
        <b-input-group>
          <b-input-group-prepend v-if="$dir.ltr" is-text>
            {{ prefix }}
          </b-input-group-prepend>

          <input
            ref="input"
            v-model.lazy="inputNumber"
            v-validate="{ required: true, regex: /^0?\d{10}$/ }"
            class="form-control"
            dir="ltr"
            :name="$t('account.phoneNumber')"
            placeholder="912xxxxxxx"
          />
          <b-input-group-append v-if="$dir.rtl" is-text dir="ltr">
            {{ prefix }}
          </b-input-group-append>
        </b-input-group>
      </b-form-group>

      <b-btn
        type="submit"
        :disabled="progressing"
        variant="primary"
        block
      >
        {{ $t('account.sendSms') }}
      </b-btn>
    </b-form>
  </div>
</template>

<script>
export default {
  name: 'ForgotPasswordViaSmsSend',
  props: {
    number: { type: String },
    prefix: { type : String },
    progressing: { type: Boolean }
  },
  data () {
    return {
      inputNumber: this.number
    }
  },
  watch: {
    inputNumber (val) {
      this.normalize(val)
    }
  },
  mounted () {
    this.$refs.input.focus()
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

      this.inputNumber = strNum
    },
    emitSendOtp () {
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          this.$emit('sendOtp', this.inputNumber)
        }
      })
    }
  }
}
</script>
