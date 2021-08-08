<template>
  <b-modal
    ref="modal"
    centered
    :title="$t('cart.addToCart')"
    body-class="p-0"
    size="lg"
  >
    <h5 class="bg-bright p-3 mb-0">
      {{ $t('products.shoppingGuide') }} :
    </h5>
    
    <sale-plans
      class="border-top border-bottom"
      :selected-package="selectedPackage"
      :selected-sale-plan-id="selectedSalePlan.id"
    />

    <h5 class="bg-bright p-3 mb-0">
      {{ $t('products.yourOrder') }} :
    </h5>

    <div class="px-3 pt-3">
      <b-row class="align-items-center">
        <b-col lg="6" class="d-flex align-items-center justify-content-lg-center mb-3">
          <p class="font-weight-bold text-nowrap mb-0" :class="{ 'mr-3': $dir.ltr, 'ml-3': $dir.rtl }">
            {{ $t('products.oq') }} :
          </p>
          
          <quantity
            :min="selectedPackage.minOq"
            :max="selectedPackage.maxOq"
            :selected-package="selectedPackage"
            :precision="unit ? unit.precision : 0"
            v-model="model"
          />
        </b-col>

        <b-col lg="6" class="d-flex align-items-center justify-content-lg-center mb-3">
          <p class="font-weight-bold text-center mb-0">
            {{ $t('products.totalPrice') }} :
          </p>

          <div :class="{ 'ml-3': $dir.ltr, 'mr-3': $dir.rtl }">
            <currency-display
              v-if="selectedSalePlan"
              :value="selectedSalePlan.priceAfterDiscount * model"
              amount-class="h5 mb-0 text-success"
            />

            <template v-else>
              {{ $t('products.salePlanNotFound') }}
            </template>
          </div>
        </b-col>
      </b-row>
    </div>

    <template v-slot:modal-footer>
      <b-btn
        :disabled="progressing"
        variant="success"
        size="lg"
        block
        @click="emitSubmit"
      >
        <font-awesome-icon
          :icon="progressing ? 'cog' : 'shopping-basket'"
          :spin="progressing"
          class="align-middle"
          :class="{'mr-1': $dir.ltr, 'ml-1': $dir.rtl}"
        />
        
        {{ $t('cart.addToCart') }}
      </b-btn>
    </template>
  </b-modal>
</template>

<script>
import vm from '@/lib/vm'
import SalePlans from '@/components/products/product/salePlans/Content'
import Quantity from '@/components/products/product/Quantity'
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'

export default {
  name: 'AddToCartModal',
  components: {
    SalePlans,
    Quantity,
    CurrencyDisplay
  },
  props: {
    value: { type: Number, required: true },
    articleId: { type: Number, required: true },
    selectedPackage: { type: Object, required: true },
    selectedSalePlan: { type: Object, required: true },
    unit: { type: Object, required: true },
    progressing: Boolean
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  mounted () {
    vm.$on('showAddToCartModal', (articleId) => {
      if (this.$refs.modal && this.articleId === articleId)
        this.$refs.modal.show()
    })

    vm.$on('hideAddToCartModal', (articleId) => {
      if (this.$refs.modal && this.articleId === articleId)
        this.$refs.modal.hide()
    })
  },
  beforeDestroy () {
    vm.$off('showAddToCartModal')
    vm.$off('hideAddToCartModal')
  },
  methods: {
    emitSubmit () {
      this.$emit('submit')
    }
  }
}
</script>
