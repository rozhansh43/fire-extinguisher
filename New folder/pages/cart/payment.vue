<template>
  <div>
    <checkout-steps :current-step="2" class="mt-pull-3"/>

    <b-container>
      <b-row>
        <b-col xl="9" lg="8" md="7">
          <b-alert v-if="ipgError" show variant="danger" class="mb-3">
            <div class="d-flex align-items-cneter justify-content-between mb-3">
              <h6 class="mb-0">
                {{ $t('payments.ipgError') }}
              </h6>

              <button type="button" class="close" @click="resetIpgError">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <ul class="mb-0" :class="{ 'pl-3': $dir.ltr, 'pr-3': $dir.rtl }">
              <li>
                {{ $t('payments.error') }} : {{ ipgError.error }}
              </li>

              <li>
                {{ $t('payments.code') }} : {{ ipgError.code }}
              </li>
            </ul>
          </b-alert>

          <coupon
            v-if="$hasModule('coupons')"
            v-model="couponDiscount"
            @refreshCart="getCart"
          />

          <pay-adapters :items="payAdapters" v-model="selectedPayAdapter"/>

          <order-summary v-if="cart" :value="cart"/>

          <b-card>
            <b-alert :show="errors.any()" variant="danger" class="px-4">
              <ul class="m-0 px-1">
                <li v-for="err in errors.all()" :key="err">
                  {{ err }}
                </li>
              </ul>
            </b-alert>

            <b-textarea
              :rows="3"
              :placeholder="`${$t('shared.description')}...`"
              :name="$t('shared.description')"
              v-validate="'max: 1000'"
              v-model="description"
            />
          </b-card>

          <b-link to="/cart/shipping" class="d-inline-block mb-3">
            <font-awesome-icon
              :icon="$dir.ltr ? 'angle-left' : 'angle-right'"
              class="align-middle"
              :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
            />

            {{ $t('cart.returnToShipping') }}
          </b-link>
        </b-col>

        <b-col xl="3" lg="4" md="5">
          <b-card class="sticky top-3" body-class="pt-4 px-4 pb-2">
            <div v-if="priceProgressing" class="text-center mb-3">
              <font-awesome-icon spin icon="circle-notch" class="text-moremuted display-2"/>
            </div>

            <template v-else>
              <price :item="cart" show-fee/>

              <continue-button :disabled="!selectedPayAdapter" :progressing="continueProgressing" @continueShopping="handlePay"/>
            </template>
          </b-card>
        </b-col>
      </b-row>
    </b-container>

    <bank-receipt
      ref="bankReceipt"
      :pay-adapter-id="selectedPayAdapter && selectedPayAdapter.id"
      :payable-amount="cart.itemsPayable + cart.deliveryPayable"
    />

    <form
      v-if="payFormData"
      ref="payForm"
      :action="payFormData.url"
      :method="payFormData.method ? 'POST' : 'GET'"
    >
      <template v-if="payFormData.params">
        <input
          v-for="key in Object.keys(payFormData.params)"
          :key="key"
          :name="key"
          type="hidden"
          :value="payFormData.params[key]"
        >
      </template>
    </form>
  </div>
</template>

<script>
import BankReceipt from '@/components/cart/payment/BankReceipt'
import CheckoutSteps from '@/components/cart/CheckoutSteps'
import ContinueButton from '@/components/cart/payment/ContinueButton'
import Coupon from '@/components/cart/payment/Coupon'
import OrderSummary from '@/components/cart/payment/orderSummary'
import PayAdapters from '@/components/cart/payment/payAdapters'
import Price from '@/components/cart/Price'
import progressEnd from '@/mixins/progress-end'
import Qs from 'qs'
import vm from '@/lib/vm'

export default {
  name: 'PaymentPage',
  meta: {
    auth: true,
    modules: [
      'products_sale'
    ]
  },
  head () {
    return {
      title: this.$t('cart.payment')
    }
  },
  components: {
    BankReceipt,
    CheckoutSteps,
    ContinueButton,
    Coupon,
    OrderSummary,
    PayAdapters,
    Price
  },
  mixins: [progressEnd],
  data () {
    return {
      cart: null,
      continueProgressing: false,
      couponDiscount: null,
      description: null,
      ipgError: null,
      payAdapters: [],
      payFormData: null,
      priceProgressing: false,
      selectedPayAdapter: null
    }
  },
  asyncData ({ app, redirect }) {
    return app.$api.cartItems.getPaymentCart()
    .then(cart => {
      const hasAnyCartItem = cart && cart.items && cart.items.length
      const changedCartIem = hasAnyCartItem && cart.items.filter(o => o.change && o.change.type)
      const hasAnyChangedCartIem = changedCartIem && changedCartIem.length

      if (!hasAnyCartItem || hasAnyChangedCartIem) {
        redirect('/cart')
        vm.$emit('cartHasChangedIems')
      } else {
        const promises = [
          app.$api.cartPayment.getPayConfig(),
          app.$api.settings.get('currency')
        ]

        const hasItems = cart.items && cart.items.length

        if (app.$hasModule('products_types')) {
          const productTypeIds = hasItems ? app.$api.products.getCartProductsTypeIds(cart.items) : null
          
          if (productTypeIds && productTypeIds.length) {
            promises.push(app.$api.productTypes.getByIds(productTypeIds))
          } else {
            promises.push(Promise.resolve())
          }
        }
        return Promise.all(promises)
        .then(all => {
          let payAdapters = all[0] && all[0].availableAdapters
          const selectedPayAdapter = payAdapters && payAdapters.length ? payAdapters[0] : null
          const payOnDeliveryAllowed = all[0] && all[0].payOnDeliveryAllowed

          if (payOnDeliveryAllowed) {
            if (!payAdapters || !payAdapters.length) payAdapters = []

            payAdapters.push({
              id: -1,
              payType: 400,
              payAdapterType: 410
            })
          }

          return {
            cart,
            payAdapters,
            selectedPayAdapter,
            couponDiscount: { discount: cart.itemsCouponDiscount, deliveryDiscount: cart.deliveryCouponDiscount }
          }
        })
        .catch(error => {
          if (error && error.details === 'noAddressOrDeliveryMethodSet') {
            redirect('/cart/shipping')
          } else {
            throw error
          }
        })
      }
    })
  },
  methods: {
    getCart () {
      this.priceProgressing = true

      this.$api.cartItems.getPaymentCart()
      .then(res => {
        this.cart = res
        this.couponDiscount = { discount: res.itemsCouponDiscount, deliveryDiscount: res.deliveryCouponDiscount }
        this.priceProgressing = false
      })
      .catch(err => {
        this.priceProgressing = false
        this.$showError(this.$getLocaleErrorMessage(err, 'cart'))
      })
    },
    handlePay () {
      this.$validator.validateAll()
      .then(isValid => {
        if (isValid && this.selectedPayAdapter) {
          if (this.selectedPayAdapter.payType === 100) this.handleCredit()
          else if (this.selectedPayAdapter.payType === 200) this.handleBankReceipt()
          else if (this.selectedPayAdapter.payType === 300) this.handleIpg()
          else if (this.selectedPayAdapter.payType === 400) this.handleOnDelivery()
        }
      })
    },
    handleCredit () {
      this.continueProgressing = true

      this.$api.cartPayment.payViaCredit({ description: this.description })
      .then(res => {
        this.$router.push(`/paid?pid=${res}&credit=true`)
      })
      .catch(err => {
        this.continueProgressing = false
        this.$showError(this.$getLocaleErrorMessage(err, 'payments'))
      })
    },
    handleBankReceipt () {
      this.$refs.bankReceipt.show({ description: this.description })
    },
    handleIpg () {
      this.continueProgressing = true

      const query = Object.assign({}, this.$route.query)
      delete query.ref
      delete query.rec
      delete query.rev
      delete query.err
      delete query.errMsg
      delete query.errCode
      
      let callbackUrl = `${window.location.protocol}//${window.location.host}/paid?pid={orderId}`

      // eslint-disable-next-line no-undef
      const protocol = (typeof Medium !== 'undefined') && Medium.getProtocol()
      if (protocol) callbackUrl += `&protocol=${protocol}`
      
      if (Object.keys(query).length)
        callbackUrl += `?${Qs.stringify(query)}`

      this.$api.cartPayment.payViaIpg({
        ipgPay: {
          payAdapterId: this.selectedPayAdapter.id,
          callbackUrl
        },
        description: this.description
      })
      .then(res => {
        if (res.ipgError) {
          this.ipgError = { code: res.ipgCode, error: res.ipgError }
        } else {
          if (res.method === 0) {
            const qs = Qs.stringify(res.params)
            const url = res.url.includes('?') ? `${res.url}&${qs}` : `${res.url}?${qs}`
            window.location.href = url
          } else if (res.method === 1) {
            this.payFormData = res

            this.$nextTick(() => {
              this.$refs.payForm.submit()
            })
          }
        }

        this.continueProgressing = false
      })
      .catch(err => {
        this.continueProgressing = false
        this.$showError(this.$getLocaleErrorMessage(err, 'payments'))
      })
    },
    handleOnDelivery () {
      this.continueProgressing = true

      this.$api.cartPayment.payOnDelivery({ description: this.description })
      .then(res => {
        this.$router.push(`/paid?pid=${res}&payOnDelivery=true`)
      })
      .catch(err => {
        this.continueProgressing = false
        this.$showError(this.$getLocaleErrorMessage(err, 'payments'))
      })
    },
    resetIpgError () {
      this.ipgError = null
    }
  }
}
</script>
