<template>
  <b-row class="justify-content-center">
    <b-col xl="6" lg="8">
      <b-card class="p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h1 class="h5 mb-0">
            <template v-if="$userStatus.hasPassword">
              {{ $t('account.changePassword') }}
            </template>

            <template v-else>
              {{ $t('account.setPassword') }}
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
          <b-form-group v-if="$userStatus.hasPassword">
            <password-editor
              :prepend="$t('account.currentPassword')"
              autocomplete="current-password"
              required
              :name="$t('account.currentPassword')"
              v-validate="'required|min:6'"
              v-model="model.currentPassword"
            />
          </b-form-group>
          
          <b-form-group>
            <password-editor
              :prepend="$t('account.newPassword')"
              ref="newPassword"
              required
              :name="$t('account.newPassword')"
              v-validate="'required|min:6'"
              v-model="model.newPassword"
            />
          </b-form-group>

          <b-form-group>
            <password-editor
              :prepend="$t('account.passwordConfirm')"
              required
              :name="$t('account.passwordConfirm')"
              v-validate="'required|confirmed:newPassword'"
              v-model="pwdcfrm"
            />
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
import PasswordEditor from '@/components/shared/PasswordEditor'
import { mapState } from 'vuex'

export default {
  name: 'ChangePassword',
  components: {
    PasswordEditor
  },
  data () {
    return {
      progressing: false,
      pwdcfrm: null,
      model: {
        currentPassword: null,
        newPassword: null
      }
    }
  },
  computed: {
    ...mapState(['$userStatus'])
  },
  methods: {
    submit () {
      this.$validator.validateAll()
      .then(isValid => {
        if (isValid) {
          this.progressing = true
          this.$api.account.changePassword(this.model, true)
          .then(() => {
            this.model.currentPassword = null
            this.model.newPassword = null
            this.pwdcfrm = null
            this.$validator.reset()
            this.$showSuccess(this.$t(this.$userStatus.hasPassword ? 'account.yourPasswordHasChanged' : 'account.yourPasswordHasSetted'))
            this.progressing = false
            this.$router.push('/dash/account/profile')
          }).catch(err => {
            this.$showError(this.$getLocaleErrorMessage(err, 'account'))
            this.progressing = false
          })
        }
      })
    }
  }
}
</script>
