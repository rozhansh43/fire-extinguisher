<template>
  <b-col
    xl="3"
    lg="4"
    md="6"
    class="item absolute-compare"
    :class="{ 'border-bottom': !isInLastRow, 'border-right': $dir.ltr && !isLastInRow, 'border-left': $dir.rtl && !isLastInRow }"
  >
    <div
      v-if="
        $hasModule('products_sale') &&
        $hasModule('products_discounts', 'deals') &&
        value.saleable &&
        firstArticle &&
        firstArticle.availabilityStatus &&
        firstPackage &&
        firstSalePlan &&
        firstSalePlan.dealName &&
        firstSalePlan.dealEndDate
      "
      class="product-deal absolute-deal"
    >
      {{ firstSalePlan.dealName }}

      <countdown
        :value="firstSalePlan.dealEndDate"
        icon-class="text-danger"
      />
    </div>
    
    <div class="w-100 h-100 pt-3 px-3 text-dark d-flex flex-column">
      <div class="position-relative">
        <b-link :to="getProductPath()" class="d-inline-block mb-3">
          <thumbnail
            :path="value.image"
            :link="false"
            :width="720"
            :height="720"
            fluid-grow
            show-no-image
            class="rounded"
          />
        </b-link>

        <compare-button v-if="$hasModule('products_compare')" endpoint="products" :item="value" absolute/>
      </div>

      <h6 class="text-justify">
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
              :unit="unit"
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
    </div>
  </b-col>
</template>

<script>
import AddToCartButton from '@/components/products/product/addToCart/Button'
import CompareButton from '@/components/compare/CompareButton'
import Countdown from '@/components/shared/Countdown'
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'
import Thumbnail from '@/components/shared/Thumbnail'

export default {
  name: 'GridItem',
  components: {
    AddToCartButton,
    CompareButton,
    Countdown,
    CurrencyDisplay,
    Thumbnail
  },
  props: {
    value: Object,
    index: Number,
    count: Number,
    type: Object
  },
  data () {
    return {
      isLastInRow: true,
      isInLastRow: true
    }
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
      return this.type && this.type.unit ? this.type.unit : { name: this.$t('products.units') }
    },
    addToCartNeedLogin () {
      const account = this.$store.state.$account
      const userGroups = this.value.userGroupIds
      return !!(this.$hasModule('userGroups') && userGroups && userGroups.length && !account)
    }
  },
  mounted () {
    let rowItemsCount = 1

    if (window.innerWidth >= 768) // md
      rowItemsCount = 2
    if (window.innerWidth >= 992) // lg
      rowItemsCount = 3
    if (window.innerWidth >= 1200) // xl
      rowItemsCount = 4

    this.isLastInRow = !((this.index + 1) % rowItemsCount)

    const lastRowItemsCount = (this.count % rowItemsCount) || rowItemsCount
    this.isInLastRow = (this.index + 1) > this.count - lastRowItemsCount
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
