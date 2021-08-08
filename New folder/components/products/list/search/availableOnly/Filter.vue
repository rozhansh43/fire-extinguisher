<template>
  <filter-item :text="$t('search.availableProductsOnly')" @remove="remove"/>
</template>

<script>
import FilterItem from '../filters/Item'

export default {
  name: 'AvailableOnlyFilter',
  components: {
    FilterItem
  },
  props: {
    value: Boolean
  },
  methods: {
    remove () {
      const key = 'avo'
      const query = Object.assign({}, this.$route.query)
      delete query[key]
      this.$router.push({ query })
    }
  }
}
</script>
