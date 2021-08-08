<template>
  <b-card class="search-checks" body-class="p-0">
    <b-check name="featured-only-check-button" class="check-item" v-model="model">
      {{ $t('search.featuredProductsOnly') }}
    </b-check>
  </b-card>
</template>

<script>
export default {
  name: 'FeaturedOnly',
  computed: {
    model: {
      get () {
        const args = this.getListRouteArgs()
        return args ? args.featuredOnly : false
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
        query.feo = val
      else
        delete query.feo
      
      this.$router.push({ query })
    }
  }
}
</script>
