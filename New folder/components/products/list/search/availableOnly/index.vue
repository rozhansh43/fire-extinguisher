<template>
  <b-card class="search-checks" body-class="p-0">
    <b-check name="available-only-check-button" class="check-item" v-model="model">
      {{ $t('search.availableProductsOnly') }}
    </b-check>
  </b-card>
</template>

<script>
export default {
  name: 'AvailableOnly',
  computed: {
    model: {
      get () {
        const args = this.getListRouteArgs()
        return args ? args.availableOnly : false
      },
      set (val) {
        this.submit(val)
      }
    }
  },
  methods: {
    getListRouteArgs () {
      const route = this.$route
      
      try {
        return this.$api.products.getListRouteArgs({ params: route.params, query: route.query })
      } catch (err) {
        return null
      }
    },
    submit (val) {
      const query = Object.assign({}, this.$route.query)

      if (val)
        query.avo = val
      else
        delete query.avo
      
      this.$router.push({ query })
    }
  }
}
</script>
