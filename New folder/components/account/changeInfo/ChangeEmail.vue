<template>
  <b-row class="justify-content-center">
    <b-col xl="6" lg="8">
      <div v-if="initializing" class="text-center">
        <font-awesome-icon spin icon="circle-notch" class="text-moremuted display-2"/>
      </div>

      <b-card v-else class="p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h1 class="h5 mb-0">
            <template v-if="hasEmail">
              {{ $t('account.changeEmail') }}
            </template>
            
            <template v-else>
              {{ $t('account.enterEmail') }}.
            </template>
          </h1>

          <font-awesome-icon
            v-if="progressing"
            icon="cog"
            spin
            class="text-moremuted h5 mb-0"
          />
        </div>

        <b-alert :show="errors.any()" variant="danger" class="px-4">
          <ul class="m-0 px-1">
            <li v-for="err in errors.all()" :key="err">{{err}}</li>
          </ul>
        </b-alert>

        <b-form @submit.prevent="submit">
          <b-form-group>
            <b-input-group :prepend="$t('account.email')">
              <b-form-input
                dir="ltr"
                v-model="newEmail"
                :name="$t('account.email')"
                v-validate="'required|email'"
              />
            </b-input-group>
          </b-form-group>

          <b-btn block :disabled="progressing" variant="primary" type="submit">
            {{ $t('shared.save') }}
          </b-btn>
        </b-form>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'ChangeEmail',
  data () {
    return {
      initializing: true,
      progressing: false,
      newEmail: null,
      hasEmail: true
    }
  },
  mounted () {
    this.getModel()
    .then(() => {
      this.initializing = false
    })
    .catch(err => {
      this.fail(err)
      this.goto('/dash')
    })
  },
  methods: {
    getModel () {
      return this.$api.account.getProfile()
      .then(res => {
        if (res.email)
          this.newEmail = res.email
        else
          this.hasEmail = false
        return this.newEmail
      })
    },
    submit () {
      this.$validator.validateAll()
      .then(isValid => {
        if (isValid) {
          this.progressing = true
          this.$api.account.changeEmail(this.newEmail, true)
          .then(() => {
            this.progressing = false
            this.success('account.yourEmailHasChanged', '/dash/account/confirm-email?sendConfirmation=true')
          }).catch(err => {
            this.fail(err)
          })
        }
      })
    },
    fail (err) {
      this.$showError(this.$getLocaleErrorMessage(err, 'account'))
      this.progressing = false
      return false
    },
    success (successMessage, path) {
      this.$showSuccess(this.$t(successMessage))
      this.progressing = false
      this.goto(path)
    },
    goto (path) {
      if (path) this.$router.push({ path })
    }
  }
}
</script>
