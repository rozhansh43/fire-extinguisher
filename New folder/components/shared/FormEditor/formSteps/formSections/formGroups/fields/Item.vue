<template>
  <div>
    <component
      v-if="item.type !== null"
      :is="`${getFieldTypeText(item.type)}Field`"
      :key="item.id"
      ref="field"
      :class="item.viewData"
      :field="item"
      v-model="model"
    />
  </div>
</template>

<script>
export default {
  name: 'FieldItem',
  components: {
    AddressField: () => import('./types/AddressField'),
    CheckboxField: () => import('./types/CheckboxField'),
    CoordinatesField: () => import('./types/CoordinatesField'),
    DateField: () => import('./types/DateField'),
    DateTimeField: () => import('./types/DateTimeField'),
    DescriptionField: () => import('./types/DescriptionField'),
    EmailField: () => import('./types/EmailField'),
    FileField: () => import('./types/FileField'),
    LocationField: () => import('./types/LocationField'),
    MobileField: () => import('./types/MobileField'),
    NationalCodeField: () => import('./types/NationalCodeField'),
    PasswordField: () => import('./types/PasswordField'),
    PhoneField: () => import('./types/PhoneField'),
    RadioField: () => import('./types/RadioField'),
    RegexField: () => import('./types/RegexField'),
    SelectField: () => import('./types/SelectField'),
    TextAreaField: () => import('./types/TextAreaField'),
    TextField: () => import('./types/TextField'),
    UrlField: () => import('./types/UrlField'),
    ZipCodeField: () => import('./types/ZipCodeField')
  },
  props: {
    value: { type: Array, required: true },
    item: { type: Object, required: true },
    fieldTypes: { type: Array, required: true }
  },
  computed: {
    model: {
      get () {
        return this.value.find(o => o.id === this.item.id)
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  created () {
    if (this.item.type !== 6) { // Description Field
      this.value.push({
        id: this.item.id,
        value: this.item.type === 16 ? { province: null, city: null, district: null } : null
      })
    }
  },
  methods: {
    getFieldTypeText (value) {
      const fieldType = this.fieldTypes.find(o => o.value === value)
      return fieldType && fieldType.text
    },
    validateAll() {
      if (this.item.type === 6) // Description Field
        return true
      else
        return this.$refs.field.validateAll()
    },
    resetValidator () {
      if (this.item.type !== 6) // Description Field
        this.$refs.field.resetValidator()
    }
  }
}
</script>
