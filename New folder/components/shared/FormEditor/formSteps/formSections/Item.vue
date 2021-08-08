<template>
  <div>
    <h5 v-if="item.name" class="border-bottom pb-4 mb-4">
      {{ item.name }}
    </h5>

    <form-groups
      v-if="item.groups && item.groups.length"
      ref="formGroups"
      :items="item.groups"
      :value="value"
    />
  </div>
</template>

<script>
import FormGroups from './formGroups/index'

export default {
  name: 'FormSectionItem',
  components: {
    FormGroups
  },
  props: {
    value: { type: Array, default: () => [] },
    item: { type: Object, required: true }
  },
  methods: {
    validateAll() {
      return this.$refs.formGroups.validateAll()
    },
    resetValidator () {
      this.$refs.formGroups.resetValidator()
    }
  }
}
</script>
