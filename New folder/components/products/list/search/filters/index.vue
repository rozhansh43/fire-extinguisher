<template>
  <b-card v-if="hasFilter" :header-class="collapsed ? 'p-0' : 'rounded-bottom p-0 bg-white'" no-body>
    <collapse-button slot="header" :title="$t('search.appliedFilters')" :collapsed="collapsed" @toggle="toggleCollapse"/>
    
    <b-card-body v-show="collapsed" class="pb-2">
      <keyword v-if="keyword" :value="keyword"/>
      <brands v-if="brands && brands.length" :value="brands"/>
      <available-only v-if="availableOnly" :value="availableOnly"/>
      <discounted-only v-if="discountedOnly" :value="discountedOnly"/>
      <deals-only v-if="dealsOnly" :value="dealsOnly"/>
      <featured-only v-if="featuredOnly" :value="featuredOnly"/>
      <colors v-if="colors && colors.length" :value="colors"/>
      <sizes v-if="sizes && sizes.length" :value="sizes"/>
      <guarantees v-if="guarantees && guarantees.length" :value="guarantees"/>
      <tags v-if="tags && tags.length" :value="tags"/>
      <fields v-if="fields && fields.length" :value="fields" :type="type"/>
      <price v-if="price" :value="price"/>
    </b-card-body>
  </b-card>
</template>

<script>
import CollapseButton from '../shared/CollapseButton'

import AvailableOnly from '../availableOnly/Filter'
import Brands from '../brands/Filter'
import Colors from '../colors/Filter'
import DealsOnly from '../dealsOnly/Filter'
import DiscountedOnly from '../discountedOnly/Filter'
import FeaturedOnly from '../featuredOnly/Filter'
import Fields from '../fields/Filter'
import Guarantees from '../guarantees/Filter'
import Keyword from '../keyword/Filter'
import Price from '../price/Filter'
import Sizes from '../sizes/Filter'
import Tags from '../tags/Filter'

export default {
  name: 'Filters',
  components: {
    CollapseButton,
    AvailableOnly,
    Brands,
    Colors,
    DiscountedOnly,
    DealsOnly,
    FeaturedOnly,
    Fields,
    Guarantees,
    Keyword,
    Price,
    Sizes,
    Tags
  },
  props: {
    brands: Array,
    colors: Array,
    guarantees: Array,
    sizes: Array,
    type: Object
  },
  data () {
    return {
      collapsed: true,
      args: null
    }
  },
  computed: {
    keyword () {
      return this.args ? this.args.keyword : null
    },
    availableOnly () {
      return this.args ? this.args.availableOnly : null
    },
    discountedOnly () {
      return this.args ? this.args.discountedOnly : null
    },
    dealsOnly () {
      return this.args ? this.args.dealsOnly : null
    },
    featuredOnly () {
      return this.args ? this.args.featuredOnly : null
    },
    tags () {
      return this.args ? this.args.tags : null
    },
    fields () {
      return this.type ? this.getProductTypeFieldsFilter() : null
    },
    price () {
      return this.args ? this.args.price : null
    },
    hasFilter () {
      return this.keyword ||
        (this.brands && this.brands.length) ||
        this.availableOnly ||
        this.discountedOnly ||
        this.dealsOnly ||
        this.featuredOnly ||
        (this.colors && this.colors.length) ||
        (this.sizes && this.sizes.length) ||
        (this.guarantees && this.guarantees.length) ||
        (this.tags && this.tags.length) ||
        (this.fields && this.fields.length) ||
        this.price
    }
  },
  watch: {
    $route () {
      this.args = this.getListRouteArgs()
    }
  },
  created () {
    this.args = this.getListRouteArgs()

    if (this.hasFilter)
      this.collapsed = true
  },
  methods: {
    toggleCollapse () {
      this.collapsed = !this.collapsed
    },
    getListRouteArgs () {
      const route = this.$route
      
      try {
        return this.$api.products.getListRouteArgs({ params: route.params, query: route.query })
      } catch (err) {
        return null
      }
    },
    getProductTypeFieldsFilter () {
      const route = this.$route
      
      try {
        return this.$api.products.getProductTypeFieldsFilter({ query: route.query, productType: this.type })
      } catch (err) {
        return null
      }
    }
  }
}
</script>
