<template>
  <b-card bg-variant="bright" class="shadow-none h-100" body-class="pb-0">
    <b-row class="align-items-center">
      <b-col lg="4" xl="3" class="mb-3">
        <b-link class="d-block" target="_blank" :to="getProductPath()">
          <thumbnail
            :path="product.image"
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
        <b-row>
          <b-col>
            <h5 class="font-weight-normal mb-3">
              <b-link class="inherited-link d-inline-block" target="_blank" :to="getProductPath()">
                {{ product.title }}
              </b-link>
            </h5>

            <div class="mb-3">
              <span class="text-muted">
                <font-awesome-icon
                  icon="boxes"
                  class="align-middle text-moremuted"
                  :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
                />

                {{ $t('products.orderAmount') }} :
              </span>

              {{ item.quantity }}

              <template v-if="packagesEnabled && articlePackage">
                {{ articlePackage.name }}

                <span v-if="type && type.unit && type.unit.name !== articlePackage.name && articlePackage.unitsQuantity !== 1" class="text-muted">
                  ( {{ $t('products.equivalent') }} {{ (item.quantity * articlePackage.unitsQuantity).toLocaleString() }} {{ type.unit.name }} )
                </span>
              </template>

              <template v-else-if="type && type.unit">
                {{ type.unit.name }}
              </template>

              <template v-else>
                {{ $t('products.units') }}
              </template>
            </div>

            <div v-if="color" class="mb-3">
              <span class="text-muted">
                <font-awesome-icon
                  icon="palette"
                  class="align-middle text-moremuted"
                  :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
                />

                {{ $t('products.color') }} :
              </span>

              <font-awesome-icon
                icon="circle"
                :style="{ 'color': color.code, padding: '1px' }"
                class="rounded-circle border"
                :class="{'mr-1': $dir.ltr, 'ml-1': $dir.rtl}"
              />

              {{ color.name }}
            </div>

            <div v-if="size" class="mb-3">
              <span class="text-muted">
                <font-awesome-icon
                  icon="ruler"
                  class="align-middle text-moremuted"
                  :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
                />

                {{ $t('products.size') }} :
              </span>

              {{ size.name }}
            </div>

            <div v-if="guarantee" class="mb-3">
              <span class="text-muted">
                <font-awesome-icon
                  icon="clipboard-check"
                  class="align-middle text-moremuted"
                  :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
                />

                {{ $t('products.guarantee') }} :
              </span>

              {{ guarantee.name }}
            </div>

            <fields-display
              v-if="hasField"
              :value="model.fieldGroups"
              :type="type"
              hide-group-name
              inline-stacked
            />
          </b-col>

          <b-col lg="auto" class="align-self-center mb-3 mb-lg-0">
            <span class="text-muted">
              {{ $t('products.payableAmount') }} :
            </span>

            <currency-display
              v-if="defaultSalePlan.priceAfterDiscount"
              :value="defaultSalePlan.priceAfterDiscount"
              amount-class="h5 mb-0 text-success"
            />

            <span v-else class="h5 mb-0 text-success">
              {{ $t('products.free') }}
            </span>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'
import FieldsDisplay from '@/components/products/product/fields'
import Thumbnail from '@/components/shared/Thumbnail'

export default {
  name: 'OrderSummaryItem',
  components: {
    CurrencyDisplay,
    FieldsDisplay,
    Thumbnail
  },
  props: {
    item: { type: Object, required: true }
  },
  computed: {
    type () {
      const types = this.$store.state.$productTypes
      return this.product && this.product.typeId && types.find(o => o.id === this.product.typeId)
    },
    product () {
      return this.item && this.item.product
    },
    model () {
      return this.product && this.product.model
    },
    article () {
      return this.model && this.model.article
    },
    color () {
      return this.model && this.model.color
    },
    size () {
      return this.model && this.model.size
    },
    guarantee () {
      return this.model && this.model.guarantee
    },
    hasField () {
      const val = this.model && this.model.fieldGroups
      return this.type && val && val.length && val.find(o => o.fields && o.fields.length && o.fields.find(x => x.value))
    },
    packagesEnabled () {
      return this.$hasModule('products_packages')
    },
    articlePackage () {
      return this.article && this.article.package
    },
    salePlans () {
      const salePlans = this.articlePackage && this.articlePackage.salePlans
      return salePlans && salePlans.length ? salePlans : null
    },
    defaultSalePlan () {
      return this.salePlans && (this.salePlans.find(o => o.default) || this.salePlans[0])
    }
  },
  methods: {
    getProductPath () {
      return this.$api.products.getProductPath(this.product)
    }
  }
}
</script>
