<template>
  <div>
    <b-alert :show="errors.any()" variant="danger" class="px-4">
      <ul class="m-0 px-1">
        <li v-for="err in errors.all()" :key="err">
          {{ err }}
        </li>
      </ul>
    </b-alert>

    <item-selector
      :label="field.title"
      :required="field.required"
      label-class="mb-2 text-muted"
      :select="provinceSelect"
      :search="provinceSearch"
      :name="field.title"
      v-validate="provinceValidation"
      v-model="model.value.province"
    />

    <item-selector
      v-if="field.cityTitle"
      :disabled="!model.value.province"
      :label="field.cityTitle"
      :required="field.cityRequired"
      label-class="mb-2 text-muted"
      :select="citySelect"
      :search="citySearch"
      :name="field.cityTitle"
      v-validate="cityValidation"
      v-model="model.value.city"
    />

    <item-selector
      v-if="field.districtTitle"
      :disabled="!model.value.city"
      :label="field.districtTitle"
      :required="field.districtRequired"
      label-class="mb-2 text-muted"
      :select="districtSelect"
      :search="districtSearch"
      :name="field.districtTitle"
      v-validate="districtValidation"
      v-model="model.value.district"
    />
  </div>
</template>

<script>
import ItemSelector from '@/components/shared/item-selector'

export default {
  name: 'LocationField',
  components: {
    ItemSelector
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
    provinceValidation () {
      if (!this.field) return null
      
      const validations = []

      if (this.field.required)
        validations.push('required')

      return validations.length ? validations.join('|') : null
    },
    cityValidation () {
      if (!this.field) return null
      
      const validations = []

      if (this.field.cityRequired)
        validations.push('required')

      return validations.length ? validations.join('|') : null
    },
    districtValidation () {
      if (!this.field) return null
      
      const validations = []

      if (this.field.districtRequired)
        validations.push('required')

      return validations.length ? validations.join('|') : null
    }
  },
  watch: {
    'model.value.province' (val, oldVal) {
      if (val !== oldVal) this.model.value.city = null
    },
    'model.value.city' (val, oldVal) {
      if (val !== oldVal) this.model.value.district = null
    }
  },
  methods: {
    provinceSearch (keyword) {
      return this.$api.provinces.getInfos({
        name: keyword,
        active: true,
        sort: 'sortOrder-asc'
      })
      .then(items => items.map(item => {
        return Object.assign(item, {
          text: item.name,
          value: item.id
        })
      }))
    },
    provinceSelect (value) {
      return this.$api.provinces.getInfos({
        id: value
      })
      .then(items => {
        return {
          text: items[0].name,
          value: items[0].id
        }
      })
    },
    citySearch (keyword) {
      return this.$api.cities.getInfos({
        name: keyword,
        active: true,
        provinceId: this.model.value.province,
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
    districtSearch (keyword) {
      return this.$api.districts.getInfos({
        name: keyword,
        active: true,
        cityId: this.model.value.city,
        sort: 'sortOrder-asc'
      })
      .then(items => items.map(item => {
        return Object.assign(item, {
          text: item.name,
          value: item.id
        })
      }))
    },
    districtSelect (value) {
      return this.$api.districts.getInfos({
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
