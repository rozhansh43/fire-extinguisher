<template>
  <filter-item :text="$t('search.featuredProductsOnly')" @remove="remove"/>
</template>

<script>
import FilterItem from '../filters/Item'

export default {
  name: 'FeaturedOnlyFilter',
  components: {
    FilterItem
  },
  props: {
    value: Boolean
  },
  methods: {
    remove () {
      const key = 'feo'
      const query = Object.assign({}, this.$route.query)
      delete query[key]
      this.$router.push({ query })
    }
  }
}
</script>
