<template>
  <b-form-group>
    <b-alert :show="errors.any()" variant="danger" class="px-4">
      <ul class="m-0 px-1">
        <li v-for="err in errors.all()" :key="err">
          {{ err }}
        </li>
      </ul>
    </b-alert>

    <label v-if="field.title" :for="model.id" class="mb-2 text-muted">
      {{ field.title }} :
      <required-symbol v-if="field.required"/>
    </label>
    
    <geopoint-editor
      :id="model.id"
      auto-detect
      class="shadow-none"
      :name="field.title"
      v-validate="fieldValidation"
      v-model="model.value"
    />
  </b-form-group>
</template>

<script>
import GeopointEditor from '@/components/shared/GeopointEditor'

export default {
  name: 'CityField',
  components: {
    GeopointEditor
  },
  props: {
    value: { type: Object, required: true },
    field: { type: Object, required: true }
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
    fieldValidation () {
      if (!this.field) return null
      
      const validations = []

      if (this.field.required)
        validations.push('required')

      return validations.length ? validations.join('|') : null
    }
  },
  methods: {
    citySearch (keyword) {
      return this.$api.cities.getInfos({
        name: keyword,
        active: true,
        // provinceId: this.model.provinceId,
        sort: 'sortOrder-asc'
      })
      .then(items => items.map(item => {
        return Object.assign(item, {
          text: item.name,
          value: item.id
        })
      }))
    },
    citySelect (value) {
      return this.$api.cities.getInfos({
        id: value
      })
      .then(items => {
        return {
          text: items[0].name,
          value: items[0].id
        }
      })
    },
    validateAll() {
      return this.$validator.validateAll()
    },
    resetValidator () {
      this.$validator.reset()
    }
  }
}
</script>
