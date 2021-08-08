<template>
  <filter-item :text="$t('search.dealsOnly')" @remove="remove"/>
</template>

<script>
import FilterItem from '../filters/Item'

export default {
  name: 'DealsOnlyFilter',
  components: {
    FilterItem
  },
  props: {
    value: Boolean
  },
  methods: {
    remove () {
      const key = 'dlo'
      const query = Object.assign({}, this.$route.query)
      delete query[key]
      this.$router.push({ query })
    }
  }
}
</script>
