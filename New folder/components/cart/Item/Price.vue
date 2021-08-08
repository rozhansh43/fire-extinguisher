<template>
  <b-card
    class="shadow-none w-100 rounded-0"
    :class="{ 'border-xl-left': $dir.ltr, 'border-xl-right': $dir.rtl }"
    no-body
  >
    <b-card-body class="py-0 px-0" :class="{ 'pl-xl-3': $dir.ltr, 'pr-xl-3': $dir.rtl }">
      <div v-if="item.quantity" class="d-flex justify-content-between mb-3">
        <span class="text-muted" :class="{ 'mr-3': $dir.ltr, 'ml-3': $dir.rtl }">
          {{ $t('products.orderAmount') }} :
        </span>

        <span>
          {{ item.quantity }}

          <template v-if="packagesEnabled && articlePackage">
            {{ articlePackage.name }}

            <span v-if="unit && unit.name !== articlePackage.name && articlePackage.unitsQuantity !== 1" class="text-muted">
            ( {{ $t('products.equivalent') }} {{ (item.quantity * articlePackage.unitsQuantity).toLocaleString() }} {{ unit && unit.name }} )
            </span>
          </template>

          <template v-else>
            {{ unit && unit.name }}
          </template>
        </span>
      </div>

      <div class="d-flex justify-content-between mb-3">
        <span class="text-muted" :class="{ 'mr-3': $dir.ltr, 'ml-3': $dir.rtl }">
          {{ $t('products.totalPrice') }} :
        </span>

        <currency-display
          v-if="item.itemTotal"
          :value="item.itemTotal"
          amount-class="h5 mb-0"
          currency-class="small"
        />

        <span v-else class="text-success">
          {{ $t('products.free') }}
        </span>
      </div>

      <div v-if="item.itemTotalSaleDiscount" class="d-flex justify-content-between mb-3">
        <span class="text-muted" :class="{ 'mr-3': $dir.ltr, 'ml-3': $dir.rtl }">
          {{ $t('products.discount') }} :
        </span>

        <currency-display
          :value="item.itemTotalSaleDiscount"
          amount-class="h5 mb-0 text-danger"
          currency-class="small"
        />
      </div>

      <div v-if="item.itemTotalSaleDiscount && item.itemTotalAfterDiscount" class="d-flex justify-content-between mb-3">
        <span class="text-muted" :class="{ 'mr-3': $dir.ltr, 'ml-3': $dir.rtl }">
          {{ $t('products.priceAfterDiscount') }} :
        </span>

        <currency-display
          :value="item.itemTotalAfterDiscount"
          amount-class="h5 mb-0"
          currency-class="small"
        />
      </div>

      <div v-if="item.itemTotalTax || item.itemTotalToll" class="d-flex justify-content-between mb-3">
        <span class="text-muted" :class="{ 'mr-3': $dir.ltr, 'ml-3': $dir.rtl }">
          {{ $t('cart.taxAndToll') }} :
        </span>

        <span>
          <currency-display
            :value="item.itemTotalTax + item.itemTotalToll"
            amount-class="h5 mb-0"
            currency-class="small"
          />

          <small class="text-muted">
            ( <span class="mb-0">
              {{ item.taxPercent + item.tollPercent }}
            </span>
            {{ $t('products.percent') }} )
          </small>
        </span>
      </div>
    </b-card-body>

    <b-card-footer class="border-top bg-transparent py-3 px-0" :class="{ 'pl-xl-3': $dir.ltr, 'pr-xl-3': $dir.rtl }">
      <div class="d-flex justify-content-between">
        <span class="text-muted" :class="{ 'mr-3': $dir.ltr, 'ml-3': $dir.rtl }">
          {{ $t('products.payableAmount') }} :
        </span>

        <currency-display
          v-if="item.itemTotalPayable"
          :value="item.itemTotalPayable"
          amount-class="h5 mb-0 text-success"
          currency-class="small"
        />

        <span v-else class="text-success">
          {{ $t('products.free') }}
        </span>
      </div>
    </b-card-footer>
  </b-card>
</template>

<script>
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'

export default {
  name: 'CartItemPrice',
  components: {
    CurrencyDisplay
  },
  props: {
    item: { type: Object, required: true },
    unit: Object,
    articlePackage: Object
  },
  computed: {
    product () {
      return this.item && this.item.product
    },
    type () {
      const types = this.$store.state.$productTypes
      return this.product && this.product.typeId && types.find(o => o.id === this.product.typeId)
    },
    packagesEnabled () {
      return this.$hasModule('products_packages')
    }
  }
}
</script>
