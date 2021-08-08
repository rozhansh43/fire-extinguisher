<template>
  <b-list-group-item class="item absolute-compare pt-3 px-3 pb-0 text-dark position-relative">
    <b-row class="align-items-center">
      <b-col md="3" lg="2">
        <b-link :to="getProductPath()" class="d-inline-block mb-3">
          <thumbnail
            :path="value.image"
            :alt="value.title"
            :link="false"
            :width="720"
            :height="720"
            fluid-grow
            show-no-image
            class="rounded"
          />
        </b-link>
      </b-col>

      <b-col>
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
          class="product-deal pb-2 mb-3"
        >
          {{ firstSalePlan.dealName }}

          <countdown
            :value="firstSalePlan.dealEndDate"
            icon-class="text-danger"
          />
        </div>
        
        <b-row>
          <b-col>
            <h6 class="text-justify">
              <b-link :to="getProductPath()" class="inherited-link">
                {{ value.title }}
              </b-link>
            </h6>

            <template v-if="$hasModule('products_sale') && value.saleable">
              <template v-if="firstArticle && firstArticle.availabilityStatus === 1">
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

                  <div class="d-flex">
                    <add-to-cart-button
                      variant="outline-success"
                      :article-id="firstArticle.id"
                      :selected-package="firstPackage"
                      :selected-sale-plan="firstSalePlan"
                      :unit="unit"
                      :need-login="addToCartNeedLogin"
                      :value="firstSalePlan.minOq"
                    />
                  </div>
                </template>
              </template>

              <h5 v-else-if="!firstArticle || (firstArticle && firstArticle.availabilityStatus === 0)" class="text-muted font-weight-normal mb-3">
                {{ $t('products.unavailable') }}
              </h5>

              <h5 v-else-if="firstArticle && firstArticle.availabilityStatus === 2" class="text-muted font-weight-normal mb-3">
                {{ $t('products.stopProduction') }}
              </h5>

              <h5 v-else-if="firstArticle && firstArticle.availabilityStatus === 3" class="text-muted font-weight-normal mb-3">
                {{ $t('products.call') }}
              </h5>
            </template>
          </b-col>

          <b-col v-if="$hasModule('products_types') && hasFeaturedFields" md="3">
            <fields-display :value="featuredFields" :type="type" stacked hide-group-name/>
          </b-col>
        </b-row>

        <template v-if="$hasModule('products_sale') && value.saleable && $hasModule('sellers') && firstArticle && firstArticle.seller">
          <hr class="mt-0 mb-3"/>

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
        
        <compare-button v-if="$hasModule('products_compare')" endpoint="products" :item="value" absolute/>
      </b-col>
    </b-row>
  </b-list-group-item>
</template>

<script>
import AddToCartButton from '@/components/products/product/addToCart/Button'
import CompareButton from '@/components/compare/CompareButton'
import Countdown from '@/components/shared/Countdown'
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'
import FieldsDisplay from '@/components/products/product/fields'
import Thumbnail from '@/components/shared/Thumbnail'

export default {
  name: 'ListItem',
  components: {
    AddToCartButton,
    CompareButton,
    Countdown,
    CurrencyDisplay,
    FieldsDisplay,
    Thumbnail
  },
  props: {
    value: Object,
    type: Object
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
    featuredFields () {
      if (!this.type || !this.type.fieldTypeGroups || !this.type.fieldTypeGroups.length) return []
      if (!this.value.fieldGroups || !this.value.fieldGroups.length) return []

      const groups = []

      this.value.fieldGroups.forEach(fieldGroup => {
        const fieldTypeGroup = this.type.fieldTypeGroups && this.type.fieldTypeGroups.find(o => o.id === fieldGroup.id)

        if (fieldGroup.fields && fieldGroup.fields.length) {
          fieldGroup.fields.forEach(field => {
            const fieldType = fieldTypeGroup && fieldTypeGroup.fieldTypes && fieldTypeGroup.fieldTypes.find(o => o.id === field.id)

            if (fieldType && fieldType.featured && fieldType.fieldTypeOn === 0 && field.value) {
              const group = groups && groups.find(o => o.id === fieldGroup.id)

              if (group) group.fields.push(field)
              else {
                groups.push({
                  id: fieldGroup.id,
                  fields: [field]
                })
              }
            }
          })
        }
      })

      return groups
    },
    hasFeaturedFields () {
      return this.featuredFields && this.featuredFields.length
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
