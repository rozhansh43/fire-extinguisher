<template>
  <div>
    <div class="d-flex justify-content-between mb-3">
      <span class="text-muted" :class="{ 'mr-3': $dir.ltr, 'ml-3': $dir.rtl }">
        {{ $t('products.productsPrice') }} :
      </span>

      <currency-display
        v-if="item.itemsTotal"      
        :value="item.itemsTotal"
        amount-class="h5 mb-0"
        currency-class="small"
      />

      <h5 v-else class="text-success mb-0">
        {{ $t('products.free') }}
      </h5>
    </div>

    <template v-if="item.itemsTotal">
      <div v-if="item.itemsSaleDiscount" class="d-flex justify-content-between mb-3">
        <span class="text-muted" :class="{ 'mr-3': $dir.ltr, 'ml-3': $dir.rtl }">
          {{ $t('products.productsDiscount') }} :
        </span>

        <currency-display
          :value="item.itemsSaleDiscount"
          amount-class="h5 mb-0 text-danger"
          currency-class="small"
        />
      </div>

      <div v-if="item.itemsCouponDiscount" class="d-flex justify-content-between mb-3">
        <span class="text-muted" :class="{ 'mr-3': $dir.ltr, 'ml-3': $dir.rtl }">
          {{ $t('coupons.discountCode') }} :
        </span>

        <currency-display
          :value="item.itemsCouponDiscount"
          amount-class="h5 mb-0 text-danger"
          currency-class="small"
        />
      </div>

      <div v-if="item.itemsSaleDiscount && item.itemsAfterDiscount" class="d-flex justify-content-between mb-3">
        <span class="text-muted" :class="{ 'mr-3': $dir.ltr, 'ml-3': $dir.rtl }">
          {{ $t('products.total') }} :
        </span>

        <currency-display
          :value="item.itemsAfterDiscount"
          amount-class="h5 mb-0"
          currency-class="small"
        />
      </div>

      <div v-if="item.itemsTax || item.itemsToll" class="d-flex justify-content-between mb-3">
        <span class="text-muted" :class="{ 'mr-3': $dir.ltr, 'ml-3': $dir.rtl }">
          <template v-if="item.itemsCouponDiscount">
            {{ $t('cart.totalWithTaxAndToll') }} :
          </template>

          <template v-else>
            {{ $t('cart.productsPriceWithTaxAndToll') }} :
          </template>
        </span>

        <currency-display
          :value="item.itemsAfterDiscount + item.itemsTax + item.itemsToll"
          amount-class="h5 mb-0"
          currency-class="small"
        />
      </div>
    </template>

    <template v-if="showFee && ((deliveryMethod && !deliveryMethod.hideFee) || item.deliveryMethodHideFee === false)">
      <div class="d-flex justify-content-between mb-3">
        <span class="text-muted" :class="{ 'mr-3': $dir.ltr, 'ml-3': $dir.rtl }">
          {{ $t('deliveryMethods.shippingCost') }} :
        </span>

        <currency-display
          v-if="shippingCost || item.delivery"
          :value="shippingCost || item.delivery"
          amount-class="h5 mb-0"
          currency-class="small"
        />
        
        <h5 v-else class="text-success mb-0">
          {{ $t('products.free') }}
        </h5>
      </div>

      <template v-if="!shippingCost">
        <div v-if="item.deliveryCouponDiscount" class="d-flex justify-content-between mb-3">
          <span class="text-muted" :class="{ 'mr-3': $dir.ltr, 'ml-3': $dir.rtl }">
            {{ $t('cart.deliveryDiscount') }} :
          </span>

          <currency-display
            :value="item.deliveryCouponDiscount"
            amount-class="h5 mb-0 text-danger"
            currency-class="small"
          />
        </div>

        <div v-if="item.deliveryCouponDiscount || item.deliveryTax || item.deliveryToll" class="d-flex justify-content-between mb-3">
          <span class="text-muted" :class="{ 'mr-3': $dir.ltr, 'ml-3': $dir.rtl }">
            <template v-if="item.deliveryTax || item.deliveryToll">
              {{ $t('cart.deliveryWithTaxAndToll') }} :
            </template>

            <template v-else>
              {{ $t('cart.deliveryAfterDiscount') }} :
            </template>
          </span>

          <currency-display
            v-if="item.deliveryPayable"
            :value="item.deliveryPayable"
            amount-class="h5 mb-0"
            currency-class="small"
          />

          <h5 v-else class="text-success mb-0">
            {{ $t('products.free') }}
          </h5>
        </div>
      </template>
    </template>

    <hr class="mt-0 mb-3">

    <div class="d-flex justify-content-between mb-3">
      <span class="text-muted" :class="{ 'mr-3': $dir.ltr, 'ml-3': $dir.rtl }">
        {{ $t('products.payableAmount') }} :
      </span>

      <currency-display
        v-if="item.itemsPayable + (shippingCost || item.deliveryPayable)"
        :value="item.itemsPayable + (shippingCost || item.deliveryPayable)"
        amount-class="h5 mb-0 text-success"
        currency-class="small"
      />

      <h5 v-else class="text-success mb-0">
        {{ $t('products.free') }}
      </h5>
    </div>
  </div>
</template>

<script>
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'

export default {
  name: 'CartPrice',
  components: {
    CurrencyDisplay
  },
  props: {
    item: { type: Object, required: true },
    shippingCost: { type: Number, default: 0 },
    showFee: { type: Boolean, default: false },
    deliveryMethod: Object
  }
}
</script>
