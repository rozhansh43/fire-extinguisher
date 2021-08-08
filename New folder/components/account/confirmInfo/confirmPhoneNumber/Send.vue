<template>
  <div>
    <b-card class="p-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="h5 mb-0">
          {{ $t('account.confirmPhoneNumber') }}
        </h1>

        <font-awesome-icon
          v-if="progressing"
          icon="cog"
          spin
          class="text-moremuted h5 mb-0"
        />
      </div>

      <b-form @submit.prevent="emitSendOtp">
        <b-form-group>
          <b-input-group>
            <b-input-group-prepend v-if="$dir.ltr" is-text>
              {{ $t('account.phoneNumber') }}
            </b-input-group-prepend>

            <b-input-group-prepend is-text>
              <template v-if="$dir.ltr">
                {{ prefix }}
              </template>

              <template v-else>
                {{ $t('account.phoneNumber') }}
              </template>
            </b-input-group-prepend>

            <b-form-input dir="ltr" :value="number" readonly/>

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
    </b-card>

    <b-btn to="./change-phone-number" size="sm" variant="link" block class="mb-3">
      {{ $t('account.changePhoneNumber') }}
    </b-btn>
  </div>
</template>

<script>
export default {
  name: 'ConfirmPhoneNumberSend',
  props: {
    number: { type: String },
    prefix: { type : String },
    progressing: { type: Boolean }
  },
  methods: {
    emitSendOtp () {
      this.$emit('sendOtp')
    }
  }
}
</script>
