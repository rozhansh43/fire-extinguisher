<template>
  <filter-item v-if="label" :text="label" @remove="remove"/>
</template>

<script>
import FilterItem from '../filters/Item'

export default {
  name: 'PriceFilter',
  components: {
    FilterItem
  },
  props: {
    value: { type: Object, required: true }
  },
  computed: {
    settings () {
      return this.$api.settings.currencySettings.get()
    },
    currency () {
      return this.settings.displayName
    },
    label () {
      let result = ''

      if (this.value) {
        if (this.value.min !== null) {
          result += this.$t('search.from')
          result += ' '
          result += (this.value.min / this.settings.displayRate).toLocaleString()
          result += ' '
          result += this.currency
        }

        if (this.value.max !== null) {
          if (this.value.min) result += ' '
          result += this.$t('search.to')
          result += ' '
          result += (this.value.max / this.settings.displayRate).toLocaleString()
          result += ' '
          result += this.currency
        }
      }
      return result
    }
  },
  methods: {
    remove () {
      const key = 'price'
      const query = Object.assign({}, this.$route.query)
      delete query[key]
      this.$router.push({ query })
    }
  }
}
</script>
