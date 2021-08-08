<template>
  <div>
    <b-container>
      <breadcrumb v-if="breadcrumbItems && breadcrumbItems.length" :items="breadcrumbItems"/>

      <b-card body-class="pb-0">
        <b-row class="align-items-center">
          <b-col v-if="value.image" md="4" lg="3">
            <thumbnail
              :path="value.image"
              :alt="value.name"
              :link="false"
              :width="720"
              :height="720"
              fluid-grow
              class="rounded mb-3"
            />
          </b-col>

          <b-col>
            <div class="p-md-4">
              <h1 class="h3">
                {{ value.name }}
              </h1>

              <b-row v-if="value.price" class="align-items-center mb-3">
                <b-col cols="auto">
                  {{ $t('products.price') }} :
                </b-col>

                <b-col cols="auto">
                  <currency-display
                    :value="value.price"
                    amount-class="h3 mb-0 text-success"
                    currency-class="font-weight-normal"
                    class="h5 mb-0"
                  />
                </b-col>
              </b-row>
            </div>
          </b-col>

          <b-col v-if="bulkAddToCartData && bulkAddToCartData.length" lg="auto">
            <add-to-cart-button-bulk
              :value="bulkAddToCartData"
              :need-login="addToCartNeedLogin"
              size="lg"
            />
          </b-col>
        </b-row>

        <template v-if="filteredItems && filteredItems.length">
          <hr class="mt-0">

          <b-row v-for="item in filteredItems" :key="item.id" class="mb-3">
            <b-col md="4" lg="3" class="mb-1 mb-md-0">
              <div class="py-3 px-4 rounded h-100 bg-bright d-flex align-items-center">
                {{ getSetTypeItemName(item.productSetTypeItemId) }}
              </div>
            </b-col>

            <b-col md="8" lg="9">
              <div class="pt-3 px-3 rounded h-100 bg-bright">
                <product v-if="item.product" :value="item.product"/>
              </div>
            </b-col>
          </b-row>
        </template>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import * as types from '@/store/types'
import AddToCartButtonBulk from '@/components/products/product/addToCart/Bulk'
import Breadcrumb from '@/components/shared/Breadcrumb'
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'
import Product from '@/components/sets/set/Product'
import progressEnd from '@/mixins/progress-end'
import Thumbnail from '@/components/shared/Thumbnail'

export default {
  name: 'ProductSet',
  meta: {
    modules: [
      'products_sets'
    ]
  },
  head () {
    const headers = {
      title: this.value.metaTitle || this.value.name,
      titleTemplate: `%s | ${this.$t('productSets.productSets')} | ${this.$settings.branding.name}`,
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.value.metaTitle || this.value.name
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.value.metaTitle || this.value.name
        }
      ]
    }

    if (this.value.metaDescription) {
      headers.meta.push({
        hid: 'description',
        name: 'description',
        content: this.value.metaDescription
      })
      headers.meta.push({
        hid: 'og:description',
        name: 'og:description',
        content: this.value.metaDescription
      })
      headers.meta.push({
        hid: 'twitter:description',
        name: 'twitter:description',
        content: this.value.metaDescription
      })
    }

    return headers
  },
  components: {
    AddToCartButtonBulk,
    Breadcrumb,
    CurrencyDisplay,
    Product,
    Thumbnail
  },
  mixins: [progressEnd],
  data () {
    return {
      value: null,
      bulkAddToCartData: null,
      addToCartNeedLogin: false
    }
  },
  computed: {
    ...mapState(['$settings']),
    breadcrumbItems () {
      const items = []
      let path = ''

      path += '/sets'
      // items.push({ path, text: this.$t('productSets.productSets') })

      path += `/${this.value.type.slug}`
      items.push({ path, text: this.value.type.name })

      path += `/${this.value.slug}`
      items.push({ path, text: this.value.name })

      return items
    },
    filteredItems () {
      const setItems = this.value.items && this.value.items.length ? this.value.items : null
      const typeItems = this.value.type.items && this.value.type.items.length ? this.value.type.items : null
      return setItems && typeItems && setItems.filter(setItem => typeItems.find(typeItem => typeItem.id === setItem.productSetTypeItemId))
    }
  },
  asyncData ({ app, params, error, store }) {
    return app.$api.productSets.getBySlug(params.slug, { include: ['Items', 'Type'] })
    .then(value => {
      if (!params.typeSlug || (value.type && value.type.slug !== params.typeSlug)) error({ statusCode: 404 })

      if (process.client) store.commit(types.SET_DOWNLOAD_PROGRESS, 25)
      value.items = value.items.filter(o => o.product)

      const productTypeIds = value.items && value.items.length ? value.items.map(o => o.product && o.product.typeId) : null

      if (process.client) store.commit(types.SET_DOWNLOAD_PROGRESS, 50)

      let promises = []
      if (productTypeIds && productTypeIds.length) {
        promises = [app.$api.productTypes.getByIds(productTypeIds), app.$api.settings.get(['Currency', 'Products'])]
      } else {
        promises.push(Promise.resolve())
      }

      const bulkAddToCartData = []
      let addToCartNeedLogin = false
      
      if (value.items && value.items.length) {
        value.items.forEach(item => {
          const product = item.product
          const models = product && product.models && product.models.length ? product.models : null
          const firstModel = models && models[0]
          const articles = firstModel && firstModel.articles && firstModel.articles.length ? firstModel.articles : null
          const firstArticle = articles && articles[0]
          const packages = firstArticle && firstArticle.packages && firstArticle.packages.length ? firstArticle.packages : null
          const firstPackage = packages && packages[0]
  
          if (firstPackage) {
            bulkAddToCartData.push({
              packageId: firstPackage.id,
              quantity: firstPackage.minOq
            })
          }
        })

        addToCartNeedLogin = !!(value.items.find(item => item.product && item.product.userGroupIds && item.product.userGroupIds.length))
      }

      return Promise.all(promises)
      .then(() => {
        if (process.client) store.commit(types.SET_DOWNLOAD_PROGRESS, 75)

        return {
          value,
          bulkAddToCartData,
          addToCartNeedLogin
        }
      })
    })
    .catch(error)
  },
  methods: {
    getSetTypeItemName (id) {
      const item = this.value.type && this.value.type.items && this.value.type.items.find(o => o.id === id)
      return item && item.name
    }
  }
}
</script>
