<template>
  <div>
    <b-alert :show="errors.any()" variant="danger" class="px-4">
      <ul class="m-0 px-1">
        <li v-for="err in errors.all()" :key="err">
          {{ err }}
        </li>
      </ul>
    </b-alert>

    <b-form-group>
      <label :for="`userGroup${type.id}`" class="text-muted">
        {{ $t('account.userGroup') }}:
        <required-symbol v-if="type.required"/>
      </label>
      
      <div v-if="initializing" class="form-control text-center">
        <font-awesome-icon spin icon="circle-notch" class="text-moremuted"/>
      </div>

      <b-form-select
        v-else
        :id="`userGroup${type.id}`"
        :options="userGroupOptions"
        :name="$t('account.userGroup')"
        v-validate="type.required ? 'required' : null"
        v-model="model.value"
      />
    </b-form-group>
  </div>
</template>

<script>
export default {
  name: 'UserGroupField',
  props: {
    value: { type: Object, required: true },
    type: { type: Object, required: true }
  },
  data () {
    return {
      initializing: true,
      userGroups: []
    }
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    userGroupOptions () {
      return this.userGroups && this.userGroups.length ? [{ value: null, text: this.$t('shared.choose') }]
      .concat(this.userGroups.map(o => {
        return {
          value: o.id,
          text: o.name
        }
      })) : null
    }
  },
  mounted () {
    this.getUserGroups()
    .then(() => {
      this.initializing = false
    })
    .catch(err => {
      this.$showError(this.$getLocaleErrorMessage(err, 'account'))
      this.initializing = false
    })
  },
  methods: {
    getUserGroups () {
      return this.$api.userGroups.getInfos({ sort: 'sortOrder-asc' })
      .then(res => {
        this.userGroups = res
        return this.userGroups
      })
    },
    validateAll() {
      return this.$validator.validateAll()
    }
  }
}
</script>
