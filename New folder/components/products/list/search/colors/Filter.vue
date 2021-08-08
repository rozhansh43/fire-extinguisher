<template>
  <span>
    <filter-item
      v-for="item in value"
      :key="item.id"
      :text="item.name"
      @remove="remove(item.id)"
    />
  </span>
</template>

<script>
import FilterItem from '../filters/Item'

export default {
  name: 'ColorsFilter',
  components: {
    FilterItem
  },
  props: {
    value: { type: Array, required: true }
  },
  methods: {
    remove (itemId) {
      const key = 'colors'
      const query = Object.assign({}, this.$route.query)

      const items = this.value.map(o => o.id)
      query[key] = items.filter(o => o !== itemId).join()

      if (!query[key]) delete query[key]
      this.$router.push({ query })
    }
  }
}
</script>
