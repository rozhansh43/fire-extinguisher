<template>
  <b-form-group>
    <b-alert :show="errors.any()" variant="danger" class="px-4">
      <ul class="m-0 px-1">
        <li v-for="err in errors.all()" :key="err">{{err}}</li>
      </ul>
    </b-alert>
    
    <label v-if="field.title" :for="model.id" class="mb-2 text-muted">
      {{ field.title }} :
      <required-symbol v-if="field.required"/>
    </label>

    <b-input
      :id="model.id"
      :placeholder="field.placeholder"
      :name="field.title"
      v-validate="fieldValidation"
      v-model="model.value"
    />
  </b-form-group>
</template>

<script>
export default {
  name: 'RegexField',
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

      if (this.field.minLength)
        validations.push(`min:${this.field.minLength}`)
      
      if (this.field.maxLength)
        validations.push(`max:${this.field.maxLength}`)

      if (this.field.regex)
        validations.push(`regex:${this.field.regex}`)

      return validations.length ? validations.join('|') : null
    }
  },
  methods: {
    validateAll() {
      return this.$validator.validateAll()
    },
    resetValidator () {
      this.$validator.reset()
    }
  }
}
</script>
