<template>
  <div>
    <b-card class="p-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="h5 mb-0">
          {{ $t('account.confirmEmail') }}
        </h1>

        <font-awesome-icon
          v-if="progressing"
          icon="cog"
          spin
          class="text-moremuted h5 mb-0"
        />
      </div>

      <b-form @submit.prevent="emitSendEmail">
        <b-form-group>
          <b-input-group :prepend="$t('account.email')">
            <b-form-input dir="ltr" :value="email" readonly/>
          </b-input-group>
        </b-form-group>

        <b-btn
          type="submit"
          :disabled="progressing"
          variant="primary"
          block
        >
          {{ $t('account.sendEmail') }}
        </b-btn>
      </b-form>
    </b-card>

    <b-btn to="./change-email" size="sm" variant="link" block class="mb-3">
      {{ $t('account.changeEmail') }}
    </b-btn>
  </div>
</template>

<script>
export default {
  name: 'ConfirmEmailSend',
  props: {
    email: { type: String },
    progressing: { type: Boolean }
  },
  methods: {
    emitSendEmail () {
      this.$emit('sendEmail')
    }
  }
}
</script>
