<template>
  <div class="animated fadeIn">
    <title-display :title="$t('account.profile')" icon="id-card"/>

    <b-row>
      <b-col v-if="showUserNameField && model.userName" :lg="userNameColSize" class="mb-3">
        <b-card
          class="h-100 mb-0"
          :header="$t('account.userName')"
          body-class="d-flex align-items-center justify-content-center"
        >
          <h4 class="mb-0 font-weight-normal text-truncate">{{ model.userName }}</h4>
        </b-card>
      </b-col>

      <b-col v-if="model.email" :lg="emailColSize" class="mb-3">
        <b-card
          class="mb-0 h-100"
          :header="$t('account.email')"
          body-class="d-flex align-items-center justify-content-center"
          footer-class="d-flex flex-wrap p-0 align-items-center justify-content-between p-1 bg-white border-top"
        >
          <h4 class="mb-0 font-weight-normal text-truncate">{{ model.email }}</h4>

          <template v-slot:footer>
            <div class="m-2">
              <small
                class="rounded-pill px-2 py-1 shadow-sm"
                :class="model.emailConfirmed ? 'bg-success text-white' : 'bg-warning text-dark'"
              >
                <font-awesome-icon
                  :icon="model.emailConfirmed ? 'check-circle' : 'times-circle'"
                  class="align-middle"
                  :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
                />

                <template v-if="model.emailConfirmed">
                  {{ $t('account.approved') }}
                </template>

                <template v-else>
                  {{ $t('account.disapproved') }}
                </template>
              </small>
            </div>

            <b-link :to="model.emailConfirmed ? './change-email' : './confirm-email'" class="m-2 small">
              <template v-if="model.emailConfirmed">
                {{ $t('account.changeEmail') }}
              </template>

              <template v-else>
                {{ $t('account.confirmEmail') }}
              </template>
            </b-link>
          </template>
        </b-card>
      </b-col>

      <b-col v-if="model.phoneNumber" :lg="phoneNumberColSize" class="mb-3">
        <b-card
          class="mb-0 h-100"
          :header="$t('account.phoneNumber')"
          body-class="d-flex align-items-center justify-content-center"
          footer-class="d-flex flex-wrap p-0 align-items-center justify-content-between p-1 bg-white border-top"
        >
          <h4 dir="ltr" class="mb-0 font-weight-normal text-truncate">{{ $config.country.phoneCode }}{{ model.phoneNumber }}</h4>

          <template v-slot:footer>
            <div class="m-2">
              <small
                class="rounded-pill px-2 py-1 shadow-sm"
                :class="model.phoneNumberConfirmed ? 'bg-success text-white' : 'bg-warning text-dark'"
              >
                <font-awesome-icon
                  :icon="model.phoneNumberConfirmed ? 'check-circle' : 'times-circle'"
                  class="align-middle"
                  :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
                />

                <template v-if="model.phoneNumberConfirmed">
                  {{ $t('account.approved') }}
                </template>

                <template v-else>
                  {{ $t('account.disapproved') }}
                </template>
              </small>
            </div>

            <b-link :to="model.phoneNumberConfirmed ? './change-phone-number' : './confirm-phone-number'" class="m-2 small">
              <template v-if="model.phoneNumberConfirmed">
                {{ $t('account.changePhoneNumber') }}
              </template>

              <template v-else>
                {{ $t('account.confirmPhoneNumber') }}
              </template>
            </b-link>
          </template>
        </b-card>
      </b-col>
    </b-row>

    <b-card body-class="pb-0">
      <b-alert :show="errors.any()" variant="danger" class="px-4">
        <ul class="m-0 px-1">
          <li v-for="err in errors.all()" :key="err">{{ err }}</li>
        </ul>
      </b-alert>

      <b-form-group>
        <uploader
          :label="model.legality === 0 ? $t('shared.image') : $t('shared.logo')"
          editor
          :editor-aspect-ratio="1*1"
          v-model="model.image"
        />
      </b-form-group>

      <b-form-group>
        <label for="legality" class="text-muted">
          {{ $t('account.person') }}:
          <required-symbol/>
        </label>

        <b-form-select
          id="legality"
          :options="legalityTypes"
          v-model="model.legality"
        />
      </b-form-group>

      <b-form-group v-if="model.legality === 0">
        <label for="firstName" class="text-muted">
          {{ $t('account.firstName') }}:
          <required-symbol/>
        </label>

        <b-input-group>
          <b-form-input
            id="firstName"
            dir="auto"
            :name="$t('account.firstName')"
            v-validate="'required'"
            v-model="model.firstName"
          />
        </b-input-group>
      </b-form-group>

      <b-form-group v-if="model.legality === 0">
        <label for="lastName" class="text-muted">
          {{ $t('account.lastName') }}:
          <required-symbol/>
        </label>

        <b-input-group>
          <b-form-input
            id="lastName"
            dir="auto"
            :name="$t('account.lastName')"
            v-validate="'required'"
            v-model="model.lastName"
          />
        </b-input-group>
      </b-form-group>

      <b-form-group v-if="model.legality === 1">
        <label for="companyName" class="text-muted">
          {{ $t('account.companyName') }}:
        </label>

        <b-input-group>
          <b-form-input
            id="companyName"
            dir="auto"
            v-model="model.companyName"
          />
        </b-input-group>
      </b-form-group>

      <template v-if="hasProfileField">
        <component
          v-for="field in filteredProfileFields"
          :key="field.id"
          :is="`${getFieldTypeName(field.type)}Field`"
          :ref="`${field.id}Field`"
          :value="field"
          :type="getFieldType(field.id)"
        />
      </template>

      <template v-slot:footer>
        <b-row class="justify-content-center">
          <b-col md="3">
            <b-btn block variant="success" :disabled="progressing" @click="submit">
              <font-awesome-icon
                :icon="progressing ? 'cog' : 'check'"
                :spin="progressing"
                class="align-middle"
                :class="{'mr-1': $dir.ltr, 'ml-1': $dir.rtl}"
              />
              {{ $t('shared.save') }}
            </b-btn>
          </b-col>
        </b-row>
      </template>
    </b-card>
  </div>
</template>

<script>
import progressEnd from '@/mixins/progress-end'
import Settings from '@/mixins/settings/index'
import TitleDisplay from '@/components/dash/shared/TitleDisplay'
import Uploader from '@/components/shared/Uploader'
import * as types from '@/store/types'

export default {
  name: 'ProfilePage',
  head () {
    return {
      title: this.$t('account.profile')
    }
  },
  components: {
    BirthdateField: () => import('@/components/account/profile/fields/BirthdateField'),
    FatherNameField: () => import('@/components/account/profile/fields/FatherNameField'),
    NationalCodeField: () => import('@/components/account/profile/fields/NationalCodeField'),
    NationalIdField: () => import('@/components/account/profile/fields/NationalIdField'),
    UserGroupField: () => import('@/components/account/profile/fields/UserGroupField'),
    TitleDisplay,
    Uploader
  },
  mixins: [progressEnd, Settings],
  meta: {
    auth: {
      allowUnconfirmedEmail: true,
      allowUnconfirmedPhoneNumber: true
    }
  },
  data () {
    return {
      progressing: false,
      passwordConfirm: null,
      model: {
        companyName: null,
        email: null,
        emailConfirmed: null,
        firstName: null,
        image: null,
        lastName: null,
        legality: 0,
        phoneNumber: null,
        phoneNumberConfirmed: null,
        profileFields: [],
        userName: null
      },
      legalityTypes: [
        { value: 0, text: this.$t('account.individual') },
        { value: 1, text: this.$t('account.legal') }
      ],
      profileFieldTypes: [
        { value: 0, name: 'NationalCode' },
        { value: 1, name: 'FatherName' },
        { value: 2, name: 'Birthdate' },
        { value: 3, name: 'UserGroup' },
        { value: 4, name: 'NationalId' }
      ]
    }
  },
  computed: {
    userStatus () {
      return this.$store.state.$userStatus
    },
    userNameColSize () {
      let size = 12
      if (this.model.email && this.model.phoneNumber)
        size = 4
      else if (this.model.email || this.model.phoneNumber)
        size = 6
      return size
    },
    emailColSize () {
      let size = 12
      const hasUserName = this.showUserNameField && this.model.userName
      if (hasUserName && this.model.phoneNumber)
        size = 4
      else if (hasUserName || this.model.phoneNumber)
        size = 6
      return size
    },
    phoneNumberColSize () {
      let size = 12
      const hasUserName = this.showUserNameField && this.model.userName
      if (hasUserName && this.model.email)
        size = 4
      else if (hasUserName || this.model.email)
        size = 6
      return size
    },
    hasProfileField () {
      return this.$hasModule('profile_fields') && this.filteredProfileFields && this.filteredProfileFields.length
    },
    filteredProfileFields () {
      if (!this.$hasModule('profile_fields') || !this.model.profileFields || !this.model.profileFields.length) return null

      return this.model.profileFields.filter(field => {
        const fieldType = this.getFieldType(field.id)
        return fieldType && (fieldType.legality === null || fieldType.legality === this.model.legality)
      })
    }
  },
  asyncData({ app, error }) {
    return Promise.all([
      app.$api.account.getProfile(),
      app.$api.settings.get([`${app.$config.auth.userType}Account`, `${app.$config.auth.userType}Profile`])
    ])
    .then(all => {
      return {
        model: all[0]
      }
    })
    .catch(error)
  },
  mounted () {
    if (this.$hasModule('profile_fields')) this.populateProfileFields()
  },
  methods: {
    preSubmit () {
      const promises = [this.$validator.validateAll()]

      if (this.hasProfileField) {
        this.filteredProfileFields.forEach(field => {
          promises.push(this.$refs[`${field.id}Field`][0].validateAll())
        })
      }

      return Promise.all(promises)
      .then(all => {
        const isValid = all.every(v => v)
        this.progressing = isValid
        return isValid
      })
    },
    submit () {
      this.preSubmit()
      .then(proceed => {
        if (proceed) {
          this.progressing = true

          if (this.model.legality === 0) {
            this.model.companyName = null
          } else if (this.model.legality === 1) {
            this.model.firstName = null
            this.model.lastName = null
          }

          if (this.hasProfileField) this.model.profileFields = this.filteredProfileFields

          this.$api.account.updateProfile(this.model, true)
          .then(res => {
            this.model.image = res.image
            
            this.$store.commit(types.SET_ACCOUNT_IMAGE, {
              value: res.image,
              cookies: this.$cookies
            })
            
            this.progressing = false
            this.$showSuccess(this.$t('account.profileUpdated'))
          })
          .catch(err => {
            this.progressing = false
            this.$showError(this.$getLocaleErrorMessage(err, 'profile'))
          })
        }
      })
    },
    getFieldType (fieldId) {
      const fields = this.$store.state.$settings[`${this.$config.auth.userType}Profile`]
      return fields.find(o => o.id === fieldId)
    },
    getFieldTypeName (fieldType) {
      const type = this.profileFieldTypes.find(o => o.value === fieldType)
      return type ? type.name : null
    },
    populateProfileFields () {
      const oldFields = [].concat(this.model.profileFields)
      let fields = this.$store.state.$settings[`${this.$config.auth.userType}Profile`]
      this.model.profileFields = []
      
      if (fields && fields.length) {
        fields = fields.filter(o => o.active)
        
        fields.forEach(field => {
          this.model.profileFields.push({
            id: field.id,
            type: field.type,
            value: null
          })
        })

        if (this.model.profileFields && this.model.profileFields.length && oldFields && oldFields.length) {
          this.model.profileFields.forEach(field => {
            const oldField = oldFields.find(o => o.id === field.id)
            if (oldField) field.value = oldField.value
          })
        }
      }
    }
  }
}
</script>
