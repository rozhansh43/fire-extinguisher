<template>
  <div class="animated fadeIn">
    <meta name="product_id" :content="product.id"/>

    <header-display v-if="product.header" :value="product.header" class="mt-pull-3"/>

    <b-container>
      <breadcrumb v-if="breadcrumbItems && breadcrumbItems.length" :items="breadcrumbItems"/>
      <b-card body-class="pb-0">
        <b-row>
          <b-col v-if="product.image || product.otherImages" lg="5" xl="4">
            <deal
              v-if="$hasModule('products_sale') && $hasModule('products_discounts', 'deals') && selectedSalePlan"
              :selected-sale-plan="selectedSalePlan"
              class="p-2 mt-1"
            />
            
            <images-display :value="product"/>
          </b-col>

          <b-col>
            <deal
              v-if="
                !product.image &&
                !product.otherImages &&
                $hasModule('products_sale') &&
                $hasModule('products_discounts', 'deals') &&
                selectedSalePlan
              "
              :selected-sale-plan="selectedSalePlan"
              class="p-2 mb-2"
            />

            <info-display
              :value="product"
              :type="type"
              :selected-model="selectedModel"
              :selected-article="selectedArticle"
            />
          </b-col>
        </b-row>
      </b-card>

      <models
        v-if="$hasModule('sellers') && product.saleable"
        :value="product.models"
        :type="type"
        :selected-model="selectedModel"
        :selected-article="selectedArticle"
        :product="product"
      />

      <b-card v-if="hasTabs" no-body class="tabs-card">
        <b-tabs card>
          <b-tab v-if="hasBody" :title="$t('products.introduction')">
            <html-display :value="product.body" class="article-body"/>
          </b-tab>

          <b-tab v-if="$hasModule('products_types') && hasField" :title="$t('products.specifications')">
            <fields-display :value="product.fieldGroups" :type="type"/>
          </b-tab>

          <b-tab v-if="hasAttachments" :title="$t('products.downloadableFilesAfterPurchase')">
            <attachments-display :value="product.attachments" no-space-on-bottom/>
          </b-tab>

          <template v-if="$hasModule('products_tabs') && hasTab">
            <b-tab v-for="(item, index) in tabs" :key="index">
              <div slot="title" class="d-flex align-items-center">
                {{ item.title }}
              </div>

              <html-display :value="item.body" class="article-body"/>
            </b-tab>
          </template>

          <b-tab
            v-if="($hasModule('products_comments') && product.commentEnabled) || ($hasModule('products_rates') && product.rateEnabled)"
            :title="$hasModule('products_comments') && product.commentEnabled ? $t('productComments.comments') : $t('productComments.rates')"
            no-body
          >
            <comments
              :item="product"
              :rate-items="rateItems"
              :comment-enabled="$hasModule('products_comments') && product.commentEnabled"
              :rate-enabled="$hasModule('products_rates') && product.rateEnabled"
              :total="total"
              :comments="comments"
              :rates="rates"
              class="px-4 pt-4 pb-2"
            />
          </b-tab>
        </b-tabs>
      </b-card>
    </b-container>

    <relations v-if="$hasModule('products_relations') && relations && relations.length" :value="relations"/>

    <sale-plans ref="salePlans"/>
    <compare-list-button endpoint="products"/>
  </div>
</template>

<script>
import AttachmentsDisplay from '@/components/products/product/attachmentsDisplay'
import Breadcrumb from '@/components/shared/Breadcrumb'
import Comments from '@/components/products/product/comments'
import CompareListButton from '@/components/compare/CompareListButton'
import Deal from '@/components/products/product/Deal'
import FieldsDisplay from '@/components/products/product/fields'
import HeaderDisplay from '@/components/products/product/Header'
import HtmlDisplay from '@/components/shared/HtmlDisplay'
import ImagesDisplay from '@/components/products/product/Images'
import InfoDisplay from '@/components/products/product/Info'
import Models from '@/components/products/product/models'
import progressEnd from '@/mixins/progress-end'
import Relations from '@/components/products/product/Relations'
import SalePlans from '@/components/products/product/salePlans'
import vm from '@/lib/vm'
import * as types from '@/store/types'

function filter ({ $config, productId, isCount }) {
  const filter = {}
  const page = 1

  if (!isCount) {
    filter.skip = ((page - 1) * $config.defaultPageSize)
    filter.limit = $config.defaultPageSize
  }

  filter.status = 1
  filter.sort = 'created'
  filter.include = 'User'
  filter.productId = productId

  return filter
}

function getRateItems (type) {
  const items = []

  if (type) {
    for (let index = 0; index < 6; index++) {
      const item = {
        id: `r${index + 1}`,
        rate: { value: 5, text: null },
        title: type[`r${index + 1}`]
      }

      if (item.title) items.push(item)
    }
  }

  return items
}

export default {
  name: 'Product',
  meta: {
    modules: [
      'products'
    ]
  },
  head () {
    const meta = [
      {
        hid: 'og:title',
        name: 'og:title',
        content: this.product.metaTitle || this.product.title
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: this.product.metaTitle || this.product.title
      }
    ]

    if (this.product.metaDescription) {
      meta.push({
        hid: 'description',
        name: 'description',
        content: this.product.metaDescription
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: this.product.metaDescription
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: this.product.metaDescription
      })
    }

    return {
      title: this.product.metaTitle || this.product.title,
      meta
    }
  },
  components: {
    AttachmentsDisplay,
    Breadcrumb,
    Comments,
    CompareListButton,
    Deal,
    FieldsDisplay,
    HeaderDisplay,
    HtmlDisplay,
    ImagesDisplay,
    InfoDisplay,
    Models,
    Relations,
    SalePlans
  },
  mixins: [progressEnd],
  data () {
    return {
      comments: null,
      rateItems: null,
      rates: null,
      selectedArticle: null,
      selectedModel: null,
      selectedSalePlan: null,
      total: null
    }
  },
  computed: {
    breadcrumbItems () {
      const items = []
      let path = ''

      path += '/products'
      items.push({ path, text: this.$t('products.products') })

      if (this.$hasModule('products_groups') && this.productGroup) {
        path += `/${this.productGroup.slug}`
        items.push({ path, text: this.productGroup.name })
      }

      if (this.productCategories && this.productCategories.length) {
        this.productCategories.forEach(productCategory => {
          items.push({ path: `${path}/${productCategory.slug}`, text: productCategory.name })
        })
      }

      path = `/product/${this.product.id}/${this.product.slug}`
      items.push({ path, text: this.product.title })

      return items
    },
    tabs () {
      if (!this.type) return

      const tabs = []

      for (let index = 0; index < 6; index++) {
        const title = this.type[`tab${index + 1}`]
        const body = this.product[`tab${index + 1}Body`]
        if (title && body) tabs.push({ title, body })
      }

      return tabs
    },
    hasBody () {
      return this.product.body && this.product.body.length
    },
    hasField () {
      if (!this.type) return false
      
      const val = this.product.fieldGroups
      return val && val.length && val.find(o => o.fields && o.fields.length && o.fields.find(x => x.value))
    },
    hasTab () {
      return this.tabs && this.tabs.length
    },
    hasAttachments () {
      return this.$hasModule('products_sale_attachments') && this.product.logical && this.product.attachments && this.product.attachments.length
    },
    hasTabs () {
      return this.hasBody ||
        this.hasField ||
        this.hasTab ||
        (this.$hasModule('products_comments') && this.product.commentEnabled) ||
        (this.$hasModule('products_rates') && this.product.rateEnabled) ||
        this.hasAttachments
    },
    relations () {
      if (!this.$hasModule('products_relations'))
        return false

      return this.product.relations &&
      this.product.relations.length &&
      this.product.relations.filter(o => o.products && o.products.length)
    },
    defaultModel () {
      const models = this.product && this.product.models && this.product.models.length ? this.product.models : null
      return models && (models.find(o => o.default) || models[0])
    },
    defaultArticle () {
      const articles = this.selectedModel && this.selectedModel.articles && this.selectedModel.articles.length ? this.selectedModel.articles : null
      return articles && (articles.find(o => o.default) || articles[0])
    }
  },
  validate ({ params }) {
    return !!params.id
  },
  asyncData ({ params, app, error, store }) {
    return Promise.all([
      app.$api.products.getById(params.id, { include: ['Brand', 'Categories', 'Color', 'Size', 'Guarantee', 'Relations'] }),
      app.$api.productGroups.getAll({ sort: 'sortOrder-asc', include: 'Categories' }),
      app.$api.settings.get(['currency', 'products', `${app.$config.auth.userType}Account`])
    ])
    .then(all => {
      if (process.client) store.commit(types.SET_DOWNLOAD_PROGRESS, 50)

      const product = all[0]
      let productGroup = null
      const productCategories = []
      const promises = []

      if (
        product.categories &&
        product.categories.length &&
        product.categories[0].group &&
        product.categories[0].parentIds &&
        product.categories[0].parentIds.length
      ) {
        const categoryIds = [].concat(product.categories[0].parentIds).reverse()
        const group = all[1].find(productGroup => productGroup.id === product.categories[0].group.id)

        if (group) productGroup = group
        
        if (group && group.categories && group.categories.length) {
          categoryIds.forEach(categoryId => {
            const category = group.categories.find(category => category.id === categoryId)
            if (category) productCategories.push(category)
          })
        }
      }
      
      if (app.$hasModule('products_types')) {
        let productTypeIds = [product.typeId]
  
        const relations = product && product.relations && product.relations.length && product.relations.filter(o => o.products && o.products.length)
        if (relations && relations.length) {
          productTypeIds.push(...app.$api.products.getProductRelationsTypeIds(relations))
          productTypeIds = [...new Set(productTypeIds)]
        }
        promises.push(app.$api.productTypes.getByIds(productTypeIds))
      } else {
        promises.push(null)
      }

      promises.push(app.$hasModule('products_comments') && product.commentEnabled ? app.$api.productComments.count(filter({ $config: app.$config, productId: product.id, isCount: true }), true) : 0)
      promises.push(app.$hasModule('products_comments') && product.commentEnabled ? app.$api.productComments.getAll(filter({ $config: app.$config, productId: product.id, isCount: false }), true) : [])
      promises.push(app.$hasModule('products_rates') && product.rateEnabled ? app.$api.productRates.getAll(product.id, null, true) : null)

      return Promise.all(promises)
      .then(results => {
        if (process.client) store.commit(types.SET_DOWNLOAD_PROGRESS, 75)

        const baseRates = {
          r1: 5,
          r2: 5,
          r3: 5,
          r4: 5,
          r5: 5,
          r6: 5,
          total: 0
        }

        const type = results[0] && results[0].find(o => o.id === product.typeId)
        const total = results[1]
        const comments = results[2]
        const rates = product.rateEnabled ? (results[3] && results[3].total ? results[3] : baseRates) : null
        const rateItems = getRateItems(type)

        return {
          product,
          productGroup,
          productCategories,
          type,
          total,
          comments,
          rates,
          rateItems
        }
      })
    })
    .catch(err => {
      error(err)
    })
  },
  created () {
    this.selectedModel = this.defaultModel
    this.selectedArticle = this.defaultArticle
  },
  mounted () {
    vm.$on('showSalePlans', (selectedPackage, selectedSalePlanId) => {
      if (this.$refs.salePlans) this.$refs.salePlans.show(selectedPackage, selectedSalePlanId)
    })

    vm.$on('setComments', ({ total, comments, rates }) => {
      this.total = total
      this.comments = comments
      this.rates = rates
    })

    vm.$on('resetRateItems', () => {
      this.rateItems = getRateItems(this.type)
    })

    vm.$on('setSelectedModel', (value) => {
      this.selectedModel = value
      this.selectedArticle = this.defaultArticle
    })

    vm.$on('setSelectedSalePlan', (value) => {
      this.setSelectedSalePlan(value)
    })
  },
  beforeDestroy () {
    vm.$off('showSalePlans')
    vm.$off('setComments')
    vm.$off('resetRateItems')
    vm.$off('setSelectedModel')
    vm.$off('setSelectedSalePlan')
  },
  methods: {
    setSelectedSalePlan (value) {
      if (value && this.selectedArticle.packages && this.selectedArticle.packages.find(p => p.salePlans && p.salePlans.find(s => s.id === value.id)))
        this.selectedSalePlan = value
    }
  }
}
</script>
