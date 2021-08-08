<template>
  <div class="animated fadeIn">
    <b-container>
      <breadcrumb v-if="breadcrumbItems && breadcrumbItems.length" :items="breadcrumbItems"/>

      <b-row>
        <b-col v-if="$hasModule('products_search')" xl="3" lg="4" md="5">
          <filters :brands="selectedBrands" :colors="selectedColors" :sizes="selectedSizes" :guarantees="selectedGuarantees" :type="selectedType"/>
          <groups v-if="groups && groups.length" :items="groups"/>
          <categories v-if="selectedGroup" :group="selectedGroup" :items="categories" :active-item="selectedCategory"/>
          <keyword/>
          <brands v-if="$hasModule('brands')" :items="brands"/>
          <available-only v-if="$hasModule('products_sale')"/>
          <discounted-only v-if="$hasModule('products_discounts')"/>
          <deals-only v-if="$hasModule('deals')"/>
          <featured-only v-if="$hasModule('products_featured')"/>
          <colors v-if="colors && colors.length" :items="colors"/>
          <sizes v-if="sizes && sizes.length" :items="sizes"/>
          <guarantees v-if="guarantees && guarantees.length" :items="guarantees"/>
          <fields v-if="$hasModule('products_types') && selectedType" :type="selectedType"/>
          <price v-if="minPrice && maxPrice" :min="minPrice" :max="maxPrice"/>
        </b-col>

        <b-col>
          <products :items="items" :progressing="progressing" :total="total" :types="types"/>
          <pagination v-if="items && items.length && total > items.length" :total="total"/>
        </b-col>
      </b-row>

      <selected-group v-if="selectedGroup && !selectedCategory" :value="selectedGroup"/>
      <selected-category v-if="selectedCategory" :value="selectedCategory"/>
    </b-container>
  </div>
</template>

<script>
import progressEnd from '@/mixins/progress-end'
import * as types from '@/store/types'

export default {
  name: 'ProductsList',
  head () {
    return {
      title: this.metaTitle,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.metaDescription
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.metaTitle
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.metaDescription
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.metaTitle
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.metaDescription
        }
      ]
    }
  },
  components: {
    AvailableOnly: () => import('@/components/products/list/search/availableOnly'),
    Brands: () => import('@/components/products/list/search/brands'),
    Breadcrumb: () => import('@/components/shared/Breadcrumb'),
    Categories: () => import('@/components/products/list/search/Categories'),
    Colors: () => import('@/components/products/list/search/colors'),
    DealsOnly: () => import('@/components/products/list/search/dealsOnly'),
    DiscountedOnly: () => import('@/components/products/list/search/discountedOnly'),
    FeaturedOnly: () => import('@/components/products/list/search/featuredOnly'),
    Fields: () => import('@/components/products/list/search/fields'),
    Filters: () => import('@/components/products/list/search/filters'),
    Groups: () => import('@/components/products/list/search/Groups'),
    Guarantees: () => import('@/components/products/list/search/guarantees'),
    Keyword: () => import('@/components/products/list/search/keyword'),
    Pagination: () => import('@/components/products/list/search/Pagination'),
    Price: () => import('@/components/products/list/search/price'),
    Products: () => import('@/components/products/list/items'),
    SelectedCategory: () => import('@/components/products/list/search/Category'),
    SelectedGroup: () => import('@/components/products/list/search/Group'),
    Sizes: () => import('@/components/products/list/search/sizes')
  },
  mixins: [progressEnd],
  data () {
    return {
      availableOnly: null,
      brands: null,
      categories: null,
      colors: null,
      dealsOnly: null,
      discountedOnly: null,
      featuredOnly: null,
      groups: null,
      guarantees: null,
      items: null,
      keyword: null,
      page: null,
      price: null,
      progressing: false,
      selectedBrands: null,
      selectedCategory: null,
      selectedColors: null,
      selectedGroup: null,
      selectedGuarantees: null,
      selectedSizes: null,
      selectedType: null,
      size: null,
      sizes: null,
      sort: null,
      tags: null,
      total: null,
      types: null
    }
  },
  computed: {
    metaTitle () {
      if (this.selectedCategory)
        return this.selectedCategory.metaTitle || this.selectedCategory.name
      else if (this.selectedGroup && this.$hasModule('products_groups'))
        return this.selectedGroup.metaTitle || this.selectedGroup.name
      else return this.$t('products.products')
    },
    metaDescription () {
      if (this.selectedCategory && this.selectedCategory.metaDescription)
        return this.selectedCategory.metaDescription
      else if (this.selectedGroup && this.selectedGroup.metaDescription)
        return this.selectedGroup.metaDescription
      else return this.$t('products.listMetaDescription', { brandingName: this.$store.state.$settings.branding.name })
    },
    breadcrumbItems () {
      const items = []
      let path = ''

      path += '/products'
      items.push({ path, text: this.$t('products.products') })

      if (this.$hasModule('products_groups') && this.selectedGroup) {
        path += `/${this.selectedGroup.slug}`
        items.push({ path, text: this.selectedGroup.name })
      }

      if (this.selectedCategory) {
        let parentIds = [].concat(this.selectedCategory.parentIds)
        parentIds = parentIds.reverse()

        parentIds.forEach(itemId => {
          const item = this.categories.find(o => o.id === itemId)
          if (item) {
            items.push({ path: `${path}/${item.slug}`, text: item.name })
          }
        })
      }

      return items
    }
  },
  watch: {
    $route () {
      this.getItems()
    }
  },
  asyncData({ app, params, query, error, store }) {
    function setProgress (value) {
      if (process.client) store.commit(types.SET_DOWNLOAD_PROGRESS, value)
    }

    let args = null

    try {
      args = app.$api.products.getListRouteArgs({
        params,
        query,
        groupsEnabled: app.$hasModule('products_groups')
      })
    } catch (err) {
      error(err)
      return
    }

    setProgress(10)

    return app.$api.products.getListModel({
      args,
      getFilters: true,
      groupsEnabled: app.$hasModule('products_groups'),
      brandsEnabled: app.$hasModule('brands'),
      typesEnabled: app.$hasModule('products_types'),
      setProgress
    })
    .then(model => {
      setProgress(70)

      const searchModel = { args, model }

      if (app.$hasModule('products_types'))
        searchModel.fields = app.$api.products.getProductTypeFieldsFilter({ query, productType: model.selectedType })

      setProgress(75)

      return app.$api.products.search(searchModel)
      .then(res => {
        setProgress(85)

        const promises = [
          app.$api.products.getPriceAgg({
            groupSlug: model.selectedGroup && model.selectedGroup.slug,
            categorySlug: model.selectedCategory && model.selectedCategory.slug
          }),
          app.$api.settings.get(['currency', 'products'])
        ]

        if (app.$hasModule('products_types')) {
          let ids = []

          res.hits.forEach(product => {
            ids.push(product.typeId)
          })

          ids = [...new Set(ids)]

          promises.push(app.$api.productTypes.getByIds(ids))
        }

        return Promise.all(promises)
        .then(all => {
          setProgress(95)

          const price = all && all[0]
          const types = (all && all[2]) || []

          return {
            availableOnly: args.availableOnly,
            brands: model.brands,
            categories: model.categories,
            colors: model.colors,
            dealsOnly: args.dealsOnly,
            discountedOnly: args.discountedOnly,
            featuredOnly: args.featuredOnly,
            groups: model.groups,
            guarantees: model.guarantees,
            items: res.hits,
            keyword: args.keyword,
            maxPrice: price.max,
            minPrice: price.min,
            page: args.page,
            price: args.price,
            selectedBrands: model.selectedBrands,
            selectedCategory: model.selectedCategory,
            selectedColors: model.selectedColors,
            selectedGroup: model.selectedGroup,
            selectedGuarantees: model.selectedGuarantees,
            selectedSizes: model.selectedSizes,
            selectedType: model.selectedType,
            size: args.size,
            sizes: model.sizes,
            sort: args.sort,
            tags: args.tags,
            total: Number(res.total),
            types
          }
        })
      })
    })
    .catch(error)
  },
  methods: {
    getItems () {
      this.progressing = true

      const route = this.$route
      let args = null

      try {
        args = this.$api.products.getListRouteArgs({
          params: route.params,
          query: route.query,
          groupsEnabled: this.$hasModule('products_groups')
        })
      } catch (err) {
        this.$nuxt.error(err)
      }

      return this.$api.products.getListModel({
        args,
        getFilters: false,
        groupsEnabled: this.$hasModule('products_groups'),
        brandsEnabled: this.$hasModule('brands'),
        typesEnabled: this.$hasModule('products_types')
      })
      .then(model => {
        const fields = this.$api.products.getProductTypeFieldsFilter({ query: route.query, productType: model.selectedType })
        return this.$api.products.search({ args, model, fields })
        .then(res => {
          const promises = [
            this.$api.settings.get('currency')
          ]

          if (this.$hasModule('products_types')) {
            let ids = []

            res.hits.forEach(product => {
              ids.push(product.typeId)
            })

            ids = [...new Set(ids)]

            promises.push(this.$api.productTypes.getByIds(ids))
          }

          return Promise.all(promises)
          .then(all => {
            this.availableOnly = args.availableOnly
            this.colors = model.colors
            this.dealsOnly = args.dealsOnly
            this.discountedOnly = args.discountedOnly
            this.featuredOnly = args.featuredOnly
            this.guarantees = model.guarantees
            this.items = res.hits
            this.keyword = args.keyword
            this.page = args.page
            this.price = args.price
            this.selectedBrands = model.selectedBrands
            this.selectedCategory = model.selectedCategory
            this.selectedColors = model.selectedColors
            this.selectedGroup = model.selectedGroup
            this.selectedGuarantees = model.selectedGuarantees
            this.selectedSizes = model.selectedSizes
            this.selectedType = model.selectedType
            this.size = args.size
            this.sizes = model.sizes
            this.sort = args.sort
            this.tags = args.tags
            this.total = Number(res.total)
            this.types = (all && all[1]) || []

            this.progressing = false
          })
        })
      })
      .catch(this.$nuxt.error)
    }
  }
}
</script>
