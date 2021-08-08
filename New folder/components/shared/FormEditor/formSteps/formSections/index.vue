<template>
  <div>
    <item
      v-for="(item, index) in items"
      :key="item.id"
      :ref="`formSection${index}`"
      :value="value"
      :item="item"
    />
  </div>
</template>

<script>
import Item from './Item'

export default {
  name: 'FormSections',
  components: {
    Item
  },
  props: {
    value: { type: Array, default: () => [] },
    items: { type: Array, required: true }
  },
  methods: {
    validateAll () {
      const validates = []
      
      this.items.map((formSection, index) => {
        validates.push(this.$refs[`formSection${index}`][0].validateAll())
      })
      
      return Promise.all(validates)
      .then(all => {
        return all.every(v => v)
      })
    },
    resetValidator () {
      this.items.forEach((formSection, index) => {
        this.$refs[`formSection${index}`][0].resetValidator()
      })
    }
  }
}
</script>
