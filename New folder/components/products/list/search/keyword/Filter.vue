<template>
  <filter-item :text="value" @remove="remove"/>
</template>

<script>
import FilterItem from '../filters/Item'

export default {
  name: 'KeywordFilter',
  components: {
    FilterItem
  },
  props: {
    value: { type: String, required: true }
  },
  methods: {
    remove () {
      const key = 'q'
      const query = Object.assign({}, this.$route.query)
      delete query[key]
      this.$router.push({ query })
    }
  }
}
</script>
