<template>
  <span>
    <filter-item
      v-for="(item, index) in value"
      :key="index"
      :text="item"
      @remove="remove(index)"
    />
  </span>
</template>

<script>
import FilterItem from '../filters/Item'

export default {
  name: 'TagsFilter',
  components: {
    FilterItem
  },
  props: {
    value: { type: Array, required: true }
  },
  methods: {
    remove (itemIndex) {
      const key = 'tags'
      const query = Object.assign({}, this.$route.query)

      query[key] = this.value.filter((o, index) => index !== itemIndex).join()

      if (!query[key]) delete query[key]
      this.$router.push({ query })
    }
  }
}
</script>
