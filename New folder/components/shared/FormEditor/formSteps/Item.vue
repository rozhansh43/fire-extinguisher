<template>
  <div>
    <form-sections
      v-if="item.sections && item.sections.length"
      ref="formSections"
      :items="item.sections"
      :value="value"
    />
  </div>
</template>

<script>
import FormSections from './formSections/index'

export default {
  name: 'FormStepItem',
  components: {
    FormSections
  },
  props: {
    value: { type: Array, default: () => [] },
    item: { type: Object, required: true }
  },
  methods: {
    validateAll() {
      return this.$refs.formSections.validateAll()
    },
    resetValidator () {
      this.$refs.formSections.resetValidator()
    }
  }
}
</script>
