<template>
  <b-col>
    <p v-if="item.name" class="border-bottom pb-3 mb-3">
      {{ item.name }}
    </p>

    <fields
      v-if="item.fields && item.fields.length"
      ref="fields"
      :items="item.fields"
      :value="value"
    />
  </b-col>
</template>

<script>
import Fields from './fields/index'

export default {
  name: 'FormGroupItem',
  components: {
    Fields
  },
  props: {
    value: { type: Array, default: () => [] },
    item: { type: Object, required: true }
  },
  methods: {
    validateAll() {
      return this.$refs.fields.validateAll()
    },
    resetValidator () {
      this.$refs.fields.resetValidator()
    }
  }
}
</script>
