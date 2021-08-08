<template>
  <b-card
    :dir="$dir.ltr ? 'ltr' : 'rtl'"
    class="mb-0 h-100 shadow-none"
    :bg-variant="cardItemVariant"
    body-class="d-flex flex-column w-100 h-100 pb-0"
  >
  <h1>
      product default item
    </h1>
    <b-link
      :to="getProductPath()"
      :target="itemTarget"
      class="d-inline-block mb-3"
    >
      <thumbnail
        :link="false"
        :width="720"
        :height="720"
        :path="value.image"
        :alt="value.title"
        fluid-grow
        show-no-image
        class="rounded"
      />
    </b-link>

    <h6 :class="itemTitleClass" class="text-justify">
      <b-link :to="getProductPath()" class="inherited-link">
        {{ value.title }}
      </b-link>
    </h6>

    <div v-if="$hasModule('products_sale') && value.saleable" class="mt-auto">
      <div v-if="firstArticle && firstArticle.availabilityStatus === 1" class="text-left">
        <template v-if="firstPackage && firstSalePlan">
          <div v-if="$hasModule('products_discounts', 'deals') && (firstSalePlan.discount || firstSalePlan.discountPercent)" class="mb-2">
            <currency-display
              :value="firstSalePlan.priceBeforeDiscount"
              class="text-muted text-line-through"
              :show-currency="false"
            />

            <b-badge
              v-if="Math.round(firstSalePlan.discountPercent)"
              variant="danger"
              pill
              style="font-size: 120%"
              :class="{ 'ml-1': $dir.ltr, 'mr-1': $dir.rtl }"
            >
              {{ Math.round(firstSalePlan.discountPercent) }}%
            </b-badge>
          </div>

          <currency-display
            v-if="firstSalePlan.priceAfterDiscount"
            :value="firstSalePlan.priceAfterDiscount"
            currency-class="font-weight-normal"
            class="d-block h5 mb-3"
          />

          <span v-else class="d-block h5 mb-3 text-success">
            {{ $t('products.free') }}
          </span>

          <add-to-cart-button
            variant="outline-success"
            :article-id="firstArticle.id"
            :selected-package="firstPackage"
            :selected-sale-plan="firstSalePlan"
            :unit="type && type.unit ? type.unit : { name: this.$t('products.units') }"
            :need-login="addToCartNeedLogin"
            :value="firstSalePlan.minOq"
          />
        </template>
      </div>

      <h5 v-else-if="!firstArticle || (firstArticle && firstArticle.availabilityStatus === 0)" class="text-center text-muted font-weight-normal mb-3">
        {{ $t('products.unavailable') }}
      </h5>

      <h5 v-else-if="firstArticle && firstArticle.availabilityStatus === 2" class="text-center text-muted font-weight-normal mb-3">
        {{ $t('products.stopProduction') }}
      </h5>

      <h5 v-else-if="firstArticle && firstArticle.availabilityStatus === 3" class="text-center text-muted font-weight-normal mb-3">
        {{ $t('products.call') }}
      </h5>
      
      <template v-if="$hasModule('sellers') && firstArticle && firstArticle.seller">
        <hr class="my-3"/>

        <div class="mb-3">
          <span class="text-muted">
            <font-awesome-icon
              icon="store"
              class="align-middle text-info"
              :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
            />

            {{ $t('products.seller') }} :
          </span>

          {{ getUserDisplayName(firstArticle.seller) }}
        </div>
      </template>
    </div>
  </b-card>
</template>

<script>
import AddToCartButton from '@/components/products/product/addToCart/Button'
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'
import Thumbnail from '@/components/shared/Thumbnail'

export default {
  name: 'Item',
  components: {
    AddToCartButton,
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
  computed: {
    models () {
      const models = this.value && this.value.models
      return models && models.length ? models : null
    },
    firstModel () {
      return this.models && this.models[0]
    },
    articles () {
      const articles = this.firstModel && this.firstModel.articles
      return articles && articles.length ? articles : null
    },
    firstArticle () {
      return this.articles && this.articles[0]
    },
    packages () {
      const packages = this.firstArticle && this.firstArticle.packages
      return packages && packages.length ? packages : null
    },
    firstPackage () {
      return this.packages && this.packages[0]
    },
    salePlans () {
      const salePlans = this.firstPackage && this.firstPackage.salePlans
      return salePlans && salePlans.length ? salePlans : null
    },
    firstSalePlan () {
      return this.salePlans && this.salePlans[0]
    },
    unit () {
      return this.type && this.type.unit
    },
    addToCartNeedLogin () {
      const account = this.$store.state.$account
      const userGroups = this.value.userGroupIds
      return !!(this.$hasModule('userGroups') && userGroups && userGroups.length && !account)
    }
  },
  methods: {
    getProductPath () {
      return this.$api.products.getProductPath(this.value)
    },
    getUserDisplayName (user) {
      return this.$api.account.getUserDisplayName(user)
    }
  }
}
</script>
