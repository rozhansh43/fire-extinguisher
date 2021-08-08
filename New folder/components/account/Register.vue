<template>
  <b-row class="justify-content-center">
    <b-col xl="4" lg="5" md="7">
      <b-card class="p-3">
        <b-alert :show="errors.any()" variant="danger" class="px-4">
          <ul class="m-0 px-1">
            <li v-for="err in errors.all()" :key="err">{{err}}</li>
          </ul>
        </b-alert>

        <b-form @submit.prevent="submit">
          <template v-if="$config.auth.includeProfileFieldsInRegisterForm">
            <b-form-group>
              <b-input-group :prepend="$t('account.firstName')">
                <b-form-input
                  dir="auto"
                  v-model="model.firstName"
                />
              </b-input-group>
            </b-form-group>

            <b-form-group>
              <b-input-group :prepend="$t('account.lastName')">
                <b-form-input
                  dir="auto"
                  v-model="model.lastName"
                />
              </b-input-group>
            </b-form-group>
          </template>

          <b-form-group v-if="registerViaEmailEnabled">
            <b-input-group>
              <b-input-group-prepend is-text>
                {{ $t('shared.email') }}
                <required-symbol/>
              </b-input-group-prepend>

              <b-form-input
                v-model="model.userName"
                dir="ltr"
                :name="$t('shared.email')"
                v-validate="'required|email'"
              />
            </b-input-group>
          </b-form-group>

          <b-form-group v-else-if="registerViaPhoneNumberEnabled">
            <b-input-group>
              <b-input-group-prepend v-if="$dir.ltr" is-text>
                {{ $t('account.phoneNumber') }}
                <required-symbol/>
              </b-input-group-prepend>

              <b-input-group-prepend is-text>
                <template v-if="$dir.ltr">
                  {{ this.$config.country.phoneCode }}
                </template>

                <template v-else>
                  {{ $t('account.phoneNumber') }}
                  <required-symbol/>
                </template>
              </b-input-group-prepend>

              <b-form-input
                v-model="model.userName"
                dir="ltr"
                :name="$t('account.phoneNumber')"
                placeholder="912xxxxxxx"
                v-validate="'required|digits:10'"
              />

              <b-input-group-append v-if="$dir.rtl" is-text dir="ltr">
                {{ this.$config.country.phoneCode }}
              </b-input-group-append>
            </b-input-group>
          </b-form-group>

          <b-form-group v-else-if="registerViaUserNameEnabled">
            <b-input-group>
              <b-input-group-prepend is-text>
                {{ $t('account.userName') }}
                <required-symbol/>
              </b-input-group-prepend>

              <b-form-input
                v-model="model.userName"
                dir="ltr"
                :name="$t('account.userName')"
                v-validate="'required'"
              />
            </b-input-group>
          </b-form-group>

          <b-form-group>
            <password-editor
              :prepend="$t('account.password')"
              ref="password"
              required
              :name="$t('account.password')"
              v-validate="'required|min:6'"
              v-model="model.password"
            />
          </b-form-group>

          <b-form-group>
            <password-editor
              :prepend="$t('account.passwordConfirm')"
              required
              :name="$t('account.passwordConfirm')"
              v-validate="'required|confirmed:password'"
              v-model="passwordConfirm"
            />
          </b-form-group>

          <b-btn variant="primary" block :disabled="progressing" type="submit">
            {{ $t('account.register') }}
          </b-btn>
        </b-form>
      </b-card>

      <b-btn to="/login" size="sm" variant="link" block class="mb-3">
        {{ $t('shared.return') }}
      </b-btn>
    </b-col>
  </b-row>
</template>

<script>
import Settings from '@/mixins/settings/index'
import vm from '@/lib/vm'
import PasswordEditor from '@/components/shared/PasswordEditor'

export default {
  name: 'Register',
  components: {
    PasswordEditor
  },
  mixins: [Settings],
  data () {
    return {
      progressing: false,
      passwordConfirm: null,
      model: {
        userName: null,
        password: null,
        mode: null,
        firstName: null,
        lastName: null,
        userType: this.$config.auth.userType
      }
    }
  },
  methods: {
    submit () {
      this.$validator.validateAll()
      .then(isValid => {
        if (isValid) {
          this.progressing = true

          if (this.registerViaEmailEnabled)
            this.model.mode = 'viaEmail'
          else if (this.registerViaPhoneNumberEnabled)
            this.model.mode = 'viaPhoneNumber'
          else if (this.registerViaUserNameEnabled)
            this.model.mode = 'viaUserName'

          this.$api.account.register(this.model, true)
          .then(() => {
            this.$showSuccess(this.$t('account.registerSuccessful'))
            this.login()
          })
          .catch(err => {
            this.progressing = false
            this.$showError(this.$getLocaleErrorMessage(err, 'account'))
          })
        }
      })
    },
    login () {
      this.$api.account.login(this.model, false)
      .then(account => {
        vm.$emit('login', account)
        this.progressing = false
      })
    }
  }
}
</script>
