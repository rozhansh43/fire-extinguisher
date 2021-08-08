<template>
  <div v-if="$hasModule('contactForms')">
    <b-alert :show="errors.any()" variant="danger" class="px-4">
      <ul class="m-0 px-1">
        <li v-for="err in errors.all()" :key="err">
          {{ err }}
        </li>
      </ul>
    </b-alert>

    <div v-if="progressing" class="py-4 text-center">
      <font-awesome-icon
        spin
        icon="circle-notch"
        class="text-moremuted display-2"
      />
    </div>

    <template v-else>
      <b-form-group>
        <label for="yourName">
          {{ $t('shared.yourName') }} :
          <required-symbol/>
        </label>

        <b-input-group>
          <b-form-input
            id="yourName"
            v-validate="'required|max: 50'"
            :name="$t('shared.yourName')"
            v-model="model.name"
          />
        </b-input-group>
      </b-form-group>

      <b-form-group>
        <label for="email">
          {{ $t('shared.email') }} :
          <required-symbol/>
        </label>

        <b-input-group>
          <b-form-input
            id="email"
            dir="ltr"
            :name="$t('shared.email')"
            v-validate="'required|email'"
            v-model="model.email"
          />
        </b-input-group>
      </b-form-group>

      <b-form-group>
        <label for="contactNumber">
          {{ $t('contactForms.contactNumber') }} :
          <required-symbol/>
        </label>

        <b-input-group>
          <b-form-input
            id="contactNumber"
            dir="ltr"
            :name="$t('contactForms.contactNumber')"
            v-validate="'required|numeric'"
            v-model="model.mobile"
          />
        </b-input-group>
      </b-form-group>

      <b-form-group v-if="!componentData || !componentData.length">
        <label for="subject">
          {{ $t('contactForms.subject') }} :
          <required-symbol/>
        </label>

        <b-form-select
          id="subject"
          :options="subjects"
          :name="$t('contactForms.subject')"
          v-validate="'required'"
          v-model="model.subject"
        />
      </b-form-group>

      <b-form-group class="mb-0">
        <label for="description">
          {{ $t('shared.description') }} :
          <required-symbol/>
        </label>

        <b-input-group>
          <b-textarea
            id="description"
            :rows="3"
            :name="$t('shared.description')"
            v-validate="'required'"
            v-model="model.description"
          />
        </b-input-group>
      </b-form-group>

      <div v-if="!hideSubmitButton" class="text-center mt-3">
        <b-btn variant="success" block @click="submit">
          {{ $t('contactForms.send') }}
        </b-btn>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ContactForm',
  props: {
    hideSubmitButton: { type: Boolean, default: false },
    componentData: String
  },
  data () {
    return {
      progressing: false,
      model: {
        name: null,
        email: null,
        mobile: null,
        subject: null,
        description: null
      },
      subjects: [
        { value: null, text: this.$t('shared.choose') },
        this.$t('contactForms.subjects.connectionWithManagers'),
        this.$t('contactForms.subjects.financialAndPaymentProcesses'),
        this.$t('contactForms.subjects.registrationAndIdentificationProcess'),
        this.$t('contactForms.subjects.suggestions'),
        this.$t('contactForms.subjects.other')
      ]
    }
  },
  methods: {
    resetValidation () {
      this.$validator.reset()
    },
    submit () {
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          this.progressing = true
          this.$emit('progressing', true)

          if (this.componentData && this.componentData.length)
            this.model.subject = this.componentData

          this.$api.contactForms.create(this.model, true)
          .then(() => {
            this.model.name = null
            this.model.email = null
            this.model.mobile = null
            this.model.subject = null
            this.model.description = null

            this.$validator.reset()

            this.progressing = false
            this.$emit('progressing', false)

            this.$showSuccess(this.$t('contactForms.messageSent'))
            this.$emit('success')
          })
          .catch(err => {
            this.$showError(this.$t(this.$getLocaleErrorMessage(err, 'contacts')))

            this.progressing = false
            this.$emit('progressing', false)
          })
        }
      })
    }
  }
}
</script>
