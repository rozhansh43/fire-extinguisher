<template>
  <b-card class="search-checks" body-class="p-0">
    <b-check name="deals-only-check-button" class="check-item" v-model="model">
      {{ $t('search.dealsOnly') }}
    </b-check>
  </b-card>
</template>

<script>
export default {
  name: 'DealsOnly',
  computed: {
    model: {
      get () {
        const args = this.getListRouteArgs()
        return args ? args.dealsOnly : false
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
        query.dlo = val
      else
        delete query.dlo
      
      this.$router.push({ query })
    }
  }
}
</script>
