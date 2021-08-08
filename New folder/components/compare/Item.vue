<template>
  <div
    class="align-self-stretch py-3"
    :class="{ 'pl-3': $dir.ltr, 'pr-3': $dir.rtl }"
    :style="columnStyle"
  >
    <b-card bg-variant="bright" no-body class="compare-item mb-0 shadow-none h-100">
      <b-link :to="getPath(item)" class="d-block inherited-link d-flex flex-column h-100">
        <thumbnail
          :link="false"
          fluid-grow
          :width="columnWidth"
          :height="columnWidth"
          :path="item.image"
          :alt="item.title"
          show-no-image
          class="card-img-top"
        />

        <b-card-body class="d-flex flex-column h-100 pb-0">
          <h4 class="h5 font-weight-normal mb-3">
            {{ item.title }}
          </h4>

          <div class="mt-auto">
            <div v-if="defaultArticle && defaultArticle.availabilityStatus === 1" class="text-left">
              <template v-if="defaultPackage && defaultSalePlan">
                <div v-if="$hasModule('products_discounts', 'deals') && (defaultSalePlan.discount || defaultSalePlan.discountPercent)" class="mb-2">
                  <currency-display
                    :value="defaultSalePlan.priceBeforeDiscount"
                    class="text-muted text-line-through"
                    :show-currency="false"
                  />

                  <b-badge
                    v-if="Math.round(defaultSalePlan.discountPercent)"
                    variant="danger"
                    pill
                    style="font-size: 120%"
                    :class="{ 'ml-1': $dir.ltr, 'mr-1': $dir.rtl }"
                  >
                    {{ Math.round(defaultSalePlan.discountPercent) }}%
                  </b-badge>
                </div>

                <currency-display
                  v-if="defaultSalePlan.priceAfterDiscount"
                  :value="defaultSalePlan.priceAfterDiscount"
                  currency-class="font-weight-normal"
                  class="d-block h5 mb-3"
                />

                <span v-else class="d-block h5 mb-3 text-success">
                  {{ $t('products.free') }}
                </span>
              </template>
            </div>

            <h5
              v-else-if="!defaultArticle || (defaultArticle && defaultArticle.availabilityStatus === 0)"
              class="text-center text-muted font-weight-normal mb-3"
            >
              {{ $t('products.unavailable') }}
            </h5>

            <h5 v-else-if="defaultArticle && defaultArticle.availabilityStatus === 2" class="text-center text-muted font-weight-normal mb-3">
              {{ $t('products.stopProduction') }}
            </h5>

            <h5 v-else-if="defaultArticle && defaultArticle.availabilityStatus === 3" class="text-center text-muted font-weight-normal mb-3">
              {{ $t('products.call') }}
            </h5>

            <template v-if="sellersEnabled && defaultArticle && defaultArticle.seller">
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

                {{ getUserDisplayName(defaultArticle.seller) }}
              </div>
            </template>
          </div>
        </b-card-body>
      </b-link>

      <template v-if="itemsCount !== 1">
        <div class="d-none d-md-block">
          <b-btn
            size="sm"
            variant="link"
            v-b-tooltip.hover
            :title="$t('compare.removeFromCompare')"
            class="remove-btn"
            @click="emitRemove(item.id)"
          >
            <font-awesome-icon icon="times" class="align-middle text-dark"/>
          </b-btn>
        </div>

        <div class="d-md-none p-1 text-center mb-3">
          <b-btn size="sm" variant="outline-danger" @click="emitRemove(item.id)">
            <font-awesome-icon icon="times" class="align-middle m-1"/>
          </b-btn>
        </div>
      </template>
    </b-card>
  </div>
</template>

<script>
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'
import Thumbnail from '@/components/shared/Thumbnail'

export default {
  name: 'CompareItems',
  components: {
    CurrencyDisplay,
    Thumbnail
  },
  props: {
    item: { type: Object, required: true },
    type: { type: Object, required: true },
    endpoint: { type: String, required: true },
    itemsCount: { type: Number, required: true },
    columnWidth: { type: Number, required: true }
  },
  computed: {
    columnStyle () {
      return {
        'min-width': `${this.columnWidth}px`,
        'max-width': `${this.columnWidth}px`
      }
    },
    models () {
      const models = this.item && this.item.models
      return models && models.length ? models : null
    },
    defaultModel () {
      return this.models && (this.models.find(o => o.default) || this.models[0])
    },
    articles () {
      const articles = this.defaultModel && this.defaultModel.articles
      return articles && articles.length ? articles : null
    },
    defaultArticle () {
      return this.articles && (this.articles.find(o => o.default) || this.articles[0])
    },
    packages () {
      const packages = this.defaultArticle && this.defaultArticle.packages
      return packages && packages.length ? packages : null
    },
    defaultPackage () {
      return this.packages && (this.packages.find(o => o.default) || this.packages[0])
    },
    salePlans () {
      const salePlans = this.defaultPackage && this.defaultPackage.salePlans
      return salePlans && salePlans.length ? salePlans : null
    },
    defaultSalePlan () {
      return this.salePlans && (this.salePlans.find(o => o.default) || this.salePlans[0])
    },
    unit () {
      return this.type && this.type.unit
    },
    sellersEnabled () {
      return this.$hasModule('sellers')
    }
  },
  methods: {
    emitRemove (itemId) {
      this.$emit('remove', itemId)
    },
    getUserDisplayName (user) {
      return this.$api.account.getUserDisplayName(user)
    },
    getPath (item) {
      return this.$api[this.endpoint].getProductPath(item)
    }
  }
}
</script>
