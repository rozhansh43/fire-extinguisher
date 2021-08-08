<template>
  <filter-item :text="$t('search.discountedProductsOnly')" @remove="remove"/>
</template>

<script>
import FilterItem from '../filters/Item'

export default {
  name: 'DiscountedOnlyFilter',
  components: {
    FilterItem
  },
  props: {
    value: Boolean
  },
  methods: {
    remove () {
      const key = 'dso'
      const query = Object.assign({}, this.$route.query)
      delete query[key]
      this.$router.push({ query })
    }
  }
}
</script>
