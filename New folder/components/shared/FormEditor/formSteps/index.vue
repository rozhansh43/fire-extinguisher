<template>
  <div>
    <template v-for="(item, index) in items">
      <item
        v-show="activeStepIndex === index"
        :key="item.id"
        :ref="`formStep${index}`"
        :value="value"
        :item="item"
      />
    </template>
  </div>
</template>

<script>
import Item from './Item'

export default {
  name: 'FormSteps',
  components: {
    Item
  },
  props: {
    value: { type: Array, default: () => [] },
    items: { type: Array, required: true },
    activeStepIndex: { type: Number, required: true }
  },
  methods: {
    validateAll () {
      return this.$refs[`formStep${this.activeStepIndex}`][0].validateAll()
    },
    resetValidator () {
      this.items.forEach((formStep, index) => {
        this.$refs[`formStep${index}`][0].resetValidator()
      })
    }
  }
}
</script>
