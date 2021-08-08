<template>
  <b-row>
    <item
      v-for="(item, index) in items"
      :key="item.id"
      :ref="`formGroup${index}`"
      :value="value"
      :item="item"
    />
  </b-row>
</template>

<script>
import Item from './Item'

export default {
  name: 'FormGroups',
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
      
      this.items.map((formGroup, index) => {
        validates.push(this.$refs[`formGroup${index}`][0].validateAll())
      })
      
      return Promise.all(validates)
      .then(all => {
        return all.every(v => v)
      })
    },
    resetValidator () {
      this.items.forEach((formGroup, index) => {
        this.$refs[`formGroup${index}`][0].resetValidator()
      })
    }
  }
}
</script>
