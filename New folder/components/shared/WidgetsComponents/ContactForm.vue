<template>
  <div class="contact-form">
    <div v-if="progressing" class="py-4 text-center">
      <font-awesome-icon
        spin
        icon="circle-notch"
        class="text-moremuted display-2"
      />
    </div>

    <b-row v-else class="justify-content-center">
      <b-col lg="6">
        <b-alert :show="errors.any()" variant="danger" class="px-4">
          <ul class="m-0 px-1">
            <li v-for="err in errors.all()" :key="err">
              {{ err }}
            </li>
          </ul>
        </b-alert>

        <b-form-group>
          <b-input-group>
            <b-form-input
              v-model="model.name"
              v-validate="'required|max: 50'"
              :name="$t('shared.YourName')"
              :placeholder="$t('contacts.YourNameOrCompany')"
            />
          </b-input-group>
        </b-form-group>

        <b-form-group>
          <b-input-group>
            <b-form-input
              v-model="model.email"
              v-validate="'email'"
              dir="ltr"
              :name="$t('shared.Email')"
              :placeholder="$t('shared.Email')"
            />
          </b-input-group>
        </b-form-group>

        <b-form-group>
          <b-input-group>
            <b-form-input
              v-model="model.mobile"
              dir="ltr"
              :placeholder="$t('shared.ContactNumber')"
              :name="$t('shared.ContactNumber')"
              v-validate="'required|numeric'"
            />
          </b-input-group>
        </b-form-group>

        <b-form-group>
          <b-input-group>
            <b-form-input
              v-model="model.subject"
              :name="$t('contacts.Subject')"
              :placeholder="$t('contacts.Subject')"

              v-validate="'required'"
            />
          </b-input-group>
        </b-form-group>

        <b-form-group>
          <b-input-group>
            <b-textarea
              v-model="model.description"
              v-validate="'required'"
              :rows="3"
              :name="$t('shared.Description')"
              :placeholder="$t('shared.Description')"
            />
          </b-input-group>
        </b-form-group>

        <div class="text-center mb-3">
          <b-btn variant="success" class="px-5" @click="submit">
            {{ $t('contacts.Send') }}
          </b-btn>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'ContactForm',
  props: {
    progressing: Boolean
  },
  data () {
    return {
      model: {
        name: null,
        subject: null,
        email: null,
        mobile: null,
        description: null
      }
    }
  },
  methods: {
    submit () {
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          this.progressing = true
          this.$api.contactForms.create(this.model, true)
          .then(() => {
            this.model.name = null
            this.model.email = null
            this.model.mobile = null
            this.model.subject = null
            this.model.description = null
            this.$showSuccess(this.$t('contacts.MessageSent'))
            this.progressing = false
          })
          .catch(err => {
            this.$showError(this.$t(this.$getLocaleErrorMessage(err, 'contacts')))
            this.progressing = false
          })
        }
      })
    }
  }
}
</script>
