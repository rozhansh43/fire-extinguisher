<template>
  <b-card header-class="py-3" body-class="pb-0">
    <template v-slot:header>
      <h5 class="mb-0">
        <font-awesome-icon
          icon="user"
          class="align-middle text-info"
          :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
        />
        
        {{ $t('account.profile') }}
      </h5>
    </template>

    <div v-if="initializing" class="text-center mb-3">
      <font-awesome-icon spin icon="circle-notch" class="text-moremuted display-4"/>
    </div>

    <b-row v-else class="align-items-end">
      <b-col lg="4">
        <b-form-group>
          <label for="legality" class="text-muted">
            {{ $t('account.person') }}:
            <required-symbol/>
          </label>

          <b-form-select
            id="legality"
            :options="legalityTypes"
            v-model="profile.legality"
          />
        </b-form-group>
      </b-col>

      <template v-if="filteredProfileFields && filteredProfileFields.length">
        <b-col
          v-for="field in filteredProfileFields"
          :key="field.id"
          lg="4"
        >
          <component
            :is="`${getFieldTypeName(field.type)}Field`"
            :ref="`${field.id}Field`"
            :value="field"
            :type="getFieldType(field.id)"
          />
        </b-col>
      </template>
    </b-row>
  </b-card>
</template>

<script>
export default {
  name: 'ProfileFields',
  components: {
    BirthdateField: () => import('@/components/account/profile/fields/BirthdateField'),
    FatherNameField: () => import('@/components/account/profile/fields/FatherNameField'),
    NationalCodeField: () => import('@/components/account/profile/fields/NationalCodeField'),
    NationalIdField: () => import('@/components/account/profile/fields/NationalIdField'),
    UserGroupField: () => import('@/components/account/profile/fields/UserGroupField')
  },
  props: {
    profileFields: { type: Array, required: true }
  },
  data () {
    return {
      initializing: true,
      profile: null,
      model: [],
      profileFieldTypes: [
        { value: 0, name: 'NationalCode' },
        { value: 1, name: 'FatherName' },
        { value: 2, name: 'Birthdate' },
        { value: 3, name: 'UserGroup' },
        { value: 4, name: 'NationalId' }
      ],
      legalityTypes: [
        { value: 0, text: this.$t('account.individual') },
        { value: 1, text: this.$t('account.legal') }
      ]
    }
  },
  computed: {
    filteredProfileFields () {
      if (!this.model || !this.model.length || !this.profile) return null

      return this.model.filter(field => {
        const fieldType = this.getFieldType(field.id)
        return fieldType && (fieldType.legality === null || fieldType.legality === this.profile.legality)
      })
    }
  },
  mounted () {
    this.$api.account.getProfile()
    .then(res => {
      this.profile = res
      this.populateProfileFields()
    })
    .catch(err => {
      this.initializing = false
      this.$showError(this.$getLocaleErrorMessage(err, 'account'))
    })
  },
  methods: {
    getFieldType (fieldId) {
      const fields = this.$store.state.$settings[`${this.$config.auth.userType}Profile`]
      return fields.find(o => o.id === fieldId)
    },
    getFieldTypeName (fieldType) {
      const type = this.profileFieldTypes.find(o => o.value === fieldType)
      return type ? type.name : null
    },
    populateProfileFields () {
      this.profileFields.forEach(o => {
        this.model.push({
          id: o.id,
          type: o.type,
          value: null
        })
      })

      this.initializing = false
    },
    validateAll () {
      const promises = []

      this.filteredProfileFields.forEach(field => {
        promises.push(this.$refs[`${field.id}Field`][0].validateAll())
      })

      return Promise.all(promises)
      .then(all => {
        return all.every(v => v)
      })
    },
    submit () {
      if (!this.profile.profileFields) this.profile.profileFields = []

      this.model.forEach(o => {
        const fieldInProfile = this.profile.profileFields.find(j => j.id === o.id)
        if (fieldInProfile) fieldInProfile.value = o.value
        else this.profile.profileFields.push(o)
      })
      
      this.profile.profileFields = this.profile.profileFields.filter(field => {
        const fieldType = this.getFieldType(field.id)
        return fieldType && (fieldType.legality === null || fieldType.legality === this.profile.legality)
      })

      return this.$api.account.updateProfile(this.profile)
    }
  }
}
</script>
