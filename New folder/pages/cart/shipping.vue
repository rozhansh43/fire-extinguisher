<template>
  <div>
    <checkout-steps :current-step="1" class="mt-pull-3"/>

    <b-container>
      <b-row>
        <b-col xl="9" lg="8" md="7">
          <profile-fields
            v-if="$hasModule('profile_fields') && profileFields && profileFields.length"
            ref="profileFields"
            :profile-fields="profileFields"
          />
          
          <addresses
            ref="addresses"
            :items="addresses"
            :progressing="addressesProgressing"
            v-model="selectedAddress"
            @remove="removeAddress"
          />

          <delivery-methods
            :items="deliveryMethods"
            :progressing="deliveryMethodsProgressing"
            v-model="selectedDeliveryMethod"
          />

          <b-link to="/cart" class="d-inline-block mb-3">
            <font-awesome-icon
              :icon="$dir.ltr ? 'angle-left' : 'angle-right'"
              class="align-middle"
              :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
            />

            {{ $t('cart.returnToCart') }}
          </b-link>
        </b-col>

        <b-col xl="3" lg="4" md="5">
          <b-card class="sticky top-3" body-class="pt-4 px-4 pb-2">
            <price
              :item="cart"
              :shipping-cost="selectedDeliveryMethod && selectedDeliveryMethod.fee"
              show-fee
              :delivery-method="selectedDeliveryMethod"
            />

            <continue-button
              :progressing="continueProgressing"
              :selected-delivery-method="selectedDeliveryMethod"
              @continueShopping="continueShopping"
            />
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Addresses from '@/components/cart/shipping/addresses/index'
import CheckoutSteps from '@/components/cart/CheckoutSteps'
import ContinueButton from '@/components/cart/shipping/ContinueButton'
import DeliveryMethods from '@/components/cart/shipping/deliveryMethods/index'
import Price from '@/components/cart/Price'
import ProfileFields from '@/components/cart/shipping/ProfileFields'
import progressEnd from '@/mixins/progress-end'
import vm from '@/lib/vm'

export default {
  name: 'ShippingPage',
  meta: {
    auth: true,
    modules: [
      'products_sale'
    ]
  },
  head () {
    return {
      title: this.$t('cart.shipping')
    }
  },
  components: {
    Addresses,
    CheckoutSteps,
    ContinueButton,
    DeliveryMethods,
    Price,
    ProfileFields
  },
  mixins: [progressEnd],
  data () {
    return {
      addresses: [],
      addressesProgressing: false,
      cart: null,
      continueProgressing: false,
      deliveryMethods: null,
      deliveryMethodsProgressing: false,
      profileFields: [],
      selectedAddress: null,
      selectedDeliveryMethod: null
    }
  },
  watch: {
    selectedAddress (val, oldVal) {
      if (!val) {
        this.deliveryMethods = null
      } else if (val.id !== oldVal) {
        this.getDeliveryMethods()
      }
    }
  },
  asyncData ({ app, error, redirect }) {
    return app.$api.cartItems.getShippingCart()
    .then(cart => {
      const hasAnyCartItem = cart && cart.items && cart.items.length
      const changedCartIem = hasAnyCartItem && cart.items.filter(o => o.change && o.change.type)
      const hasAnyChangedCartIem = changedCartIem && changedCartIem.length

      if (!hasAnyCartItem || hasAnyChangedCartIem) {
        redirect('/cart')
        vm.$emit('cartHasChangedIems')
      } else {
        const promises = [
          app.$api.addresses.getAll({ include: ['Province', 'City', 'District']}),
          app.$api.settings.get(['Currency', 'Products', `${app.$config.auth.userType}Profile`])
        ]
        
        if (app.$hasModule('profile_fields'))
          promises.push(app.$api.cartShipping.getProfileFields())

        return Promise.all(promises)
        .then(all => {
          const addresses = all && all[0]
          const profileFields = app.$hasModule('profile_fields') && all && all[2] ? all[2] : null
          const cartAddress = addresses && addresses.length && cart.addressId && addresses.find(o => o.id === cart.addressId)
          const selectedAddress = addresses && addresses.length ? cartAddress || addresses[0] : null

          if (selectedAddress) {
            return app.$api.cartShipping.getDeliveryMethods(selectedAddress.id)
            .then(deliveryMethods => {
              const cartDeliveryMethod = deliveryMethods && deliveryMethods.length && cart.deliveryMethodId && deliveryMethods.find(o => o.id === cart.deliveryMethodId)
              const selectedDeliveryMethod = deliveryMethods && deliveryMethods.length ? cartDeliveryMethod || deliveryMethods[0] : null

              return {
                addresses,
                cart,
                deliveryMethods,
                profileFields,
                selectedAddress,
                selectedDeliveryMethod
              }
            })
            .catch(err => {
              if (err && err.data && err.data.Details && err.data.Details === 'CartItemsNotApproved')
                redirect('/cart')
              else
                error(err)
            })
          }

          return {
            addresses,
            cart,
            deliveryMethods: null,
            profileFields,
            selectedAddress,
            selectedDeliveryMethod: null
          }
        })
        .catch(error)
      }
    })
  },
  mounted () {
    vm.$on('refreshAddresses', (selectedId) => {
      this.getAddresses(selectedId)
    })
  },
  beforeDestroy () {
    vm.$off('refreshAddresses')
  },
  methods: {
    getAddresses (selectedId) {
      this.addressesProgressing = true

      this.$api.addresses.getAll({ include: ['Province', 'City', 'District']}, true)
      .then(res => {
        this.addresses = res

        this.selectedAddress = selectedId
          ? this.addresses && this.addresses.length && this.addresses.find(o => o.id === selectedId)
          : this.addresses[0]

        this.addressesProgressing = false
        this.$refs.addresses.closeEditing()
      })
      .catch(err => {
        this.addressesProgressing = false
        this.$showError(this.$getLocaleErrorMessage(err, 'addresses'))
      })
    },
    removeAddress (itemId) {
      if (confirm(this.$t('shared.areYouSureToRemoveThisItem'))) {
        this.addressesProgressing = true

        this.$api.addresses.delete(itemId, true)
        .then(() => {
          this.$showSuccess(this.$t('addresses.addressRemoved'))
          this.getAddresses(null)
        })
        .catch(err => {
          this.addressesProgressing = false
          this.$showError(this.$getLocaleErrorMessage(err, 'addresses'))
        })
      }
    },
    getDeliveryMethods () {
      this.deliveryMethodsProgressing = true

      this.$api.cartShipping.getDeliveryMethods(this.selectedAddress.id, true)
      .then(res => {
        this.deliveryMethods = res
        this.selectedDeliveryMethod = this.deliveryMethods && this.deliveryMethods.length ? this.deliveryMethods[0] : null

        this.deliveryMethodsProgressing = false
      })
      .catch(err => {
        this.deliveryMethodsProgressing = false
        this.$showError(this.$getLocaleErrorMessage(err, 'deliveryMethods'))
      })
    },
    fail (err, section) {
      this.continueProgressing = false
      return this.$showError(this.$getLocaleErrorMessage(err, section))
    },
    continueShopping () {
      if (this.$hasModule('profile_fields') && this.profileFields && this.profileFields.length) {
        this.$refs.profileFields.validateAll()
        .then(isValid => {
          if (isValid) {
            this.$refs.profileFields.submit()
            .then(() => {
              this.shipping()
            })
            .catch(err => this.fail(err, 'account'))
          }
        })
      } else {
        this.shipping()
      }
    },
    shipping () {
      this.$api.cartShipping.shipping({
        addressId: this.selectedAddress.id,
        deliveryMethodId: this.selectedDeliveryMethod.id
      }, true)
      .then(() => {
        this.continueProgressing = false
        this.$router.push('/cart/payment')
      })
      .catch(err => this.fail(err, 'deliveryMethods'))
    }
  }
}
</script>
