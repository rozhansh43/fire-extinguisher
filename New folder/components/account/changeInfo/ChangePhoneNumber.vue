<template>
  <b-row class="justify-content-center">
    <b-col xl="6" lg="8">
      <div v-if="initializing" class="text-center">
        <font-awesome-icon spin icon="circle-notch" class="text-moremuted display-2"/>
      </div>

      <b-card v-else class="p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h1 class="h5 mb-0">
            <template v-if="hasPhoneNumber">
              {{ $t('account.changePhoneNumber') }}
            </template>
            
            <template v-else>
              {{ $t('account.enterPhoneNumber') }}.
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
            <b-input-group>
              <b-input-group-prepend v-if="$dir.ltr" is-text>
                {{ $t('account.phoneNumber') }}
              </b-input-group-prepend>

              <b-input-group-prepend is-text>
                <template v-if="$dir.ltr">
                  {{ this.$config.country.phoneCode }}
                </template>

                <template v-else>
                  {{ $t('account.phoneNumber') }}
                </template>
              </b-input-group-prepend>

              <b-form-input
                v-model="newPhoneNumber"
                autocomplete="off"
                dir="ltr"
                placeholder="912xxxxxxx"
                :name="$t('account.phoneNumber')"
                v-validate="'required|digits:10'"
              />

              <b-input-group-append v-if="$dir.rtl" is-text dir="ltr">
                {{ this.$config.country.phoneCode }}
              </b-input-group-append>
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
  name: 'ChangePhoneNumber',
  data () {
    return {
      initializing: true,
      progressing: false,
      newPhoneNumber: null,
      hasPhoneNumber: true
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
        if (res.phoneNumber)
          this.newPhoneNumber = res.phoneNumber
        else
          this.hasPhoneNumber = false
        return this.newPhoneNumber
      })
    },
    submit () {
      this.$validator.validateAll()
      .then(isValid => {
        if (isValid) {
          this.progressing = true
          this.$api.account.changePhoneNumber(this.newPhoneNumber, true)
          .then(() => {
            this.progressing = false
            this.success('account.yourPhoneNumberHasChanged', '/dash/account/confirm-phone-number?sendConfirmation=true')
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
