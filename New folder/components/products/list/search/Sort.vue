<template>
  <div class="search-sort">
    <font-awesome-icon
      icon="sort-amount-down"
      size="lg"
      class="align-middle text-moremuted"
      :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
    />

    {{ $t('search.sortBy') }}:

    <b-radio
      v-for="item in options.filter(o => o.allowed)"
      :key="item.value"
      :value="item.value"
      name="sort-radio-group"
      button
      inline
      size="sm"
      button-variant="link"
      v-model="model"
    >
      {{ item.text }}
    </b-radio>
  </div>
</template>

<script>
export default {
  name: 'Sort',
  data () {
    return {
      options: [
        {
          value: 0,
          text: this.$t('search.sortOptions.newest'),
          allowed: true
        },
        {
          value: 1,
          text: this.$t('search.sortOptions.mostHits'),
          allowed: true
        },
        {
          value: 2,
          text: this.$t('search.sortOptions.mostSales'),
          allowed: this.$hasModule('products_sale')
        },
        {
          value: 3,
          text: this.$t('search.sortOptions.mostRate'),
          allowed: this.$hasModule('products_rates')
        },
        {
          value: 4,
          text: this.$t('search.sortOptions.cheapest'),
          allowed: this.$hasModule('products_sale')
        },
        {
          value: 5,
          text: this.$t('search.sortOptions.mostExpensive'),
          allowed: this.$hasModule('products_sale')
        },
        {
          value: 6,
          text: this.$t('search.sortOptions.mostDiscount'),
          allowed: this.$hasModule('products_sale')
        }
      ]
    }
  },
  computed: {
    model: {
      get () {
        const args = this.getListRouteArgs()
        return args ? args.sort : null
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
        query.sort = val
      else
        delete query.sort
      
      this.$router.push({ query })
    }
  }
}
</script>
