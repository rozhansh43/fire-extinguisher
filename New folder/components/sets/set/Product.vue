<template>
  <b-row v-if="value" class="align-items-center">
    <b-col v-if="value.image" md="2" lg="1">
      <b-link :to="getProductPath()" class="d-inline-block mb-3">
        <thumbnail
          :path="value.image"
          :alt="value.title"
          :link="false"
          :width="720"
          :height="720"
          fluid-grow
          class="rounded"
        />
      </b-link>
    </b-col>

    <b-col>
      <h6>
        <b-link :to="getProductPath()" class="inherited-link">
          {{ value.title }}
        </b-link>
      </h6>
    </b-col>

    <b-col lg="auto">
      <div class="text-lg-left mb-3">
        <b-row v-if="selectedSalePlan" class="align-items-center">
          <b-col class="mb-2 mb-sm-0">
            <span v-if="packagesEnabled && selectedPackage && selectedPackage.name">
              {{ $t('products.eachPackagePrice', { name: selectedPackage.name }) }}
            </span>

            <template v-else-if="type && type.unit">
              {{ $t('products.eachPackagePrice', { name: type.unit.name }) }}
            </template>

            <template v-else>
              {{ $t('products.eachPackagePrice', { name: this.$t('products.units') }) }}
            </template>

            <b-btn
              v-if="selectedPackage.salePlans && selectedPackage.salePlans.length > 1"
              class="p-0"
              variant="link"
              :class="{ 'ml-1': $dir.ltr, 'mr-1': $dir.rtl }"
              :title="$t('products.priceTable')"
              v-b-tooltip.hover
              @click="emitShowSalePlans"
            >
              <font-awesome-icon icon="info-circle" size="lg" class="align-middle text-info"/>
            </b-btn>
          </b-col>

          <b-col sm="auto" :class="{ 'text-right': $dir.ltr, 'text-left': $dir.rtl }">
            <div v-if="$hasModule('products_discounts', 'deals') && (selectedSalePlan.discount || selectedSalePlan.discountPercent)" class="mb-2">
              <currency-display
                :value="selectedSalePlan.priceBeforeDiscount"
                class="h5 mb-0 font-weight-normal text-muted text-line-through"
                :show-currency="false"
              />

              <b-badge
                v-if="Math.round(selectedSalePlan.discountPercent)"
                variant="danger"
                pill
                style="font-size: 120%"
                :class="{ 'ml-1': $dir.ltr, 'mr-1': $dir.rtl }"
              >
                {{ Math.round(selectedSalePlan.discountPercent) }}%
              </b-badge>
            </div>

            <currency-display
              v-if="selectedSalePlan.priceAfterDiscount"
              :value="selectedSalePlan.priceAfterDiscount"
              amount-class="h3"
              currency-class="font-weight-normal"
              class="h5 mb-3"
            />

            <span v-else class="mb-3 text-success">
              {{ $t('products.free') }}
            </span>
          </b-col>
        </b-row>

        <template v-else>
          {{ $t('products.salePlanNotFound') }}
        </template>
      </div>
    </b-col>

    <b-col lg="auto">
      <add-to-cart-button
        v-if="selectedSalePlan"
        variant="outline-success"
        :article-id="firstArticle.id"
        :selected-package="selectedPackage"
        :selected-sale-plan="selectedSalePlan"
        :unit="type && type.unit ? type.unit : { name: this.$t('products.units') }"
        :need-login="addToCartNeedLogin"
        v-model="quantity"
      />
    </b-col>
  </b-row>
</template>

<script>
import AddToCartButton from '@/components/products/product/addToCart/Button'
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'
import Thumbnail from '@/components/shared/Thumbnail'

export default {
  name: 'Product',
  components: {
    AddToCartButton,
    CurrencyDisplay,
    Thumbnail
  },
  props: {
    value: { type: Object, required: true }
  },
  data () {
    return {
      selectedPackageId: null,
      quantity: 1
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
    selectedPackage () {
      return this.selectedPackageId ? this.packages.find(o => o.id === this.selectedPackageId) : null
    },
    selectedSalePlan () {
      if (this.selectedPackage && this.selectedPackage.salePlans && this.selectedPackage.salePlans.length) {
        const salePlan = this.selectedPackage.salePlans.find(o => this.quantity >= o.minOq && this.quantity <= o.maxOq)
        return salePlan || null
      } else
        return null
    },
    packagesEnabled () {
      return this.$hasModule('products_packages')
    },
    type () {
      const types = this.$store.state.$productTypes
      return types && types.length ? types.find(o => o.id === this.value.typeId) : null
    },
    addToCartNeedLogin () {
      const account = this.$store.state.$account
      const userGroups = this.value.userGroupIds
      return !!(this.$hasModule('userGroups') && userGroups && userGroups.length && !account)
    }
  },
  mounted () {
    this.setSelectedPackageId()
  },
  methods: {
    getProductPath () {
      return this.$api.products.getProductPath(this.value)
    },
    setSelectedPackageId () {
      this.quantity = this.firstPackage && this.firstPackage.minOq
      this.selectedPackageId = this.firstPackage && this.firstPackage.id
    }
  }
}
</script>
