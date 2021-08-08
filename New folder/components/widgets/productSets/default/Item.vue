<template>
  <b-card
    :dir="$dir.ltr ? 'ltr' : 'rtl'"
    class="mb-0 h-100 shadow-none"
    :bg-variant="cardItemVariant"
    body-class="d-flex flex-column w-100 h-100 pb-0"
  >
  <h1>
      product set item
    </h1>
    <b-link
      :to="getItemPath()"
      :target="itemTarget"
      class="d-inline-block mb-3"
    >
      <thumbnail
        :link="false"
        :width="720"
        :height="720"
        :path="value.image"
        :alt="value.name"
        fluid-grow
        show-no-image
        class="rounded"
      />
    </b-link>

    <h6 :class="itemTitleClass" class="text-justify">
      <b-link :to="getItemPath()" class="inherited-link">
        {{ value.name }}
      </b-link>
    </h6>

    <div v-if="$hasModule('products_sale') && value.price" class="mt-auto text-left">
      <currency-display
        :value="value.price"
        currency-class="font-weight-normal"
        class="d-block h5 mb-3"
      />

      <add-to-cart-button-bulk
        v-if="bulkAddToCartData && bulkAddToCartData.length"
        :value="bulkAddToCartData"
        :need-login="addToCartNeedLogin"
        variant="outline-success"
      />
    </div>
  </b-card>
</template>

<script>
import AddToCartButtonBulk from '@/components/products/product/addToCart/Bulk'
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'
import Thumbnail from '@/components/shared/Thumbnail'

export default {
  name: 'Item',
  components: {
    AddToCartButtonBulk,
    CurrencyDisplay,
    Thumbnail
  },
  props: {
    value: { type: Object, required: true },
    type: Object,
    cardItemVariant: { type: String, default: 'bright' },
    itemTitleClass: String,
    itemTarget: { type: String, default: '_self' }
  },
  data () {
    return {
      addToCartNeedLogin: false,
      bulkAddToCartData: null
    }
  },
  mounted () {
    this.addToCartNeedLogin = this.getAddToCartNeedLogin()
    this.bulkAddToCartData = this.getBulkAddToCartData()
  },
  methods: {
    getItemPath () {
      return this.$api.productSets.getPath(this.value.type.slug, this.value.slug)
    },
    getAddToCartNeedLogin () {
      if (!this.value.items || !this.value.items.length) return null

      return !!(this.value.items.find(item => item.product && item.product.userGroupIds && item.product.userGroupIds.length))
    },
    getBulkAddToCartData () {
      if (!this.value.items || !this.value.items.length) return null

      const result = []

      this.value.items.forEach(item => {
        const product = item.product
        const models = product && product.models && product.models.length ? product.models : null
        const firstModel = models && models[0]
        const articles = firstModel && firstModel.articles && firstModel.articles.length ? firstModel.articles : null
        const firstArticle = articles && articles[0]
        const packages = firstArticle && firstArticle.packages && firstArticle.packages.length ? firstArticle.packages : null
        const firstPackage = packages && packages[0]

        if (firstPackage) {
          result.push({
            packageId: firstPackage.id,
            quantity: firstPackage.minOq
          })
        }
      })

      return result
    }
  }
}
</script>
