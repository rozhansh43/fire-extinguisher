<template>
  <b-container>
    <template v-if="model && model.items && model.items.length">
      <changes :items="changedItems" @confirmChanges="confirmChanges"/>

      <b-row>
        <b-col xl="9" lg="8" md="7">
          <b-card no-body>
            <b-card-header class="d-flex align-items-center justify-content-center py-3">
              <font-awesome-icon icon="shopping-basket" class="align-middle text-success" size="lg" :class="{'mr-2': $dir.ltr, 'ml-2': $dir.rtl}"/>

              <h1 class="h5 mb-0">
                {{ $t('cart.cart') }}
              </h1>
            </b-card-header>

            <items :items="model.items"/>
          </b-card>
        </b-col>

        <b-col xl="3" lg="4" md="5">
          <b-card class="sticky top-3" body-class="pt-4 px-4 pb-2">
            <price :item="model"/>

            <continue-button :progressing="continueProgressing" @continueShopping="continueShopping"/>
          </b-card>

          <p class="text-muted mb-3">
            {{ $t('cart.reservationAlert') }}.
          </p>
        </b-col>
      </b-row>
    </template>

    <b-card v-else body-class="text-center py-5">
      <font-awesome-icon icon="shopping-basket" class="text-moremuted display-1 mb-4"/>

      <div>
        {{ $t('cart.emptyCart') }}
      </div>
    </b-card>
  </b-container>
</template>

<script>
import * as types from '@/store/types'
import Changes from '@/components/cart/changes'
import ContinueButton from '@/components/cart/ContinueButton'
import Items from '@/components/cart/Items'
import Price from '@/components/cart/Price'
import progressEnd from '@/mixins/progress-end'
import vm from '@/lib/vm'

export default {
  name: 'CartPage',
  meta: {
    modules: [
      'products_sale'
    ]
  },
  head () {
    return {
      title: this.$t('cart.cart')
    }
  },
  components: {
    Changes,
    ContinueButton,
    Items,
    Price
  },
  mixins: [progressEnd],
  data () {
    return {
      continueProgressing: false,
      model: {
        id: null,
        items: null
      }
    }
  },
  computed: {
    changedItems () {
      return this.model.items && this.model.items.length && this.model.items.filter(o => o.change && o.change.type)
    },
    hasAnyDeliverableItem () {
      return !!(this.model.items && this.model.items.length && this.model.items.find(o => o.product && !o.product.logical))
    }
  },
  asyncData ({ app, error, store }) {
    return Promise.all([
      app.$api.cartItems.getCart(),
      store.state.$account ? app.$api.account.refreshStatus() : null,
      app.$api.settings.get(`${app.$config.auth.userType}Account`)
    ])
    .then(all => {
      if (process.client) store.commit(types.SET_DOWNLOAD_PROGRESS, 25)
      const hasItems = all[0].items && all[0].items.length
      
      const promises = []

      if (hasItems)
        promises.push(app.$api.settings.get('currency'))

      if (app.$hasModule('products_types')) {
        const productTypeIds = hasItems ? app.$api.products.getCartProductsTypeIds(all[0].items) : null
        
        if (productTypeIds && productTypeIds.length) {
          promises.push(app.$api.productTypes.getByIds(productTypeIds))
        } else {
          promises.push(Promise.resolve())
        }
      }

      if (process.client) store.commit(types.SET_DOWNLOAD_PROGRESS, 50)

      return Promise.all(promises)
      .then(() => {
        if (process.client) store.commit(types.SET_DOWNLOAD_PROGRESS, 75)

        return {
          model: all[0]
        }
      })
    })
    .catch(err => {
      error(err)
    })
  },
  mounted () {
    vm.$on('setCartItems', (value) => {
      this.setItems(value)
    })

    vm.$on('removeCartItem', (itemId) => {
      this.remove(itemId)
    })

    vm.$on('cartHasChangedIems', () => {
      this.getCart()
    })
  },
  beforeDestroy () {
    vm.$off('setCartItems')
    vm.$off('removeCartItem')
    vm.$off('cartHasChangedIems')
  },
  methods: {
    getCart () {
      this.$api.cartItems.getCart()
      .then(res => {
        this.setItems(res)
      })
      .catch(this.fail)
    },
    fail (err) {
      this.$showError(this.$getLocaleErrorMessage(err, 'cart'))
    },
    success (successMessage, path) {
      this.$showSuccess(this.$t(successMessage))
    },
    setItems (items) {
      this.model = items
      return this.model
    },
    remove (itemId) {
      if (confirm(this.$t('shared.areYouSureToRemoveThisItem'))) {
        this.$api.cartItems.removeItem(itemId, true)
        .then(res => {
          this.setItems(res)
          this.success('products.productRemovedFromCart')
        })
        .catch(this.fail)
      }
    },
    confirmChanges () {
      return this.$api.cartItems.confirmChanges()
      .then(res => {
        return this.setItems(res)
      })
      .catch(this.fail)
    },
    continueShopping () {
      this.continueProgressing = true

      if (this.changedItems && this.changedItems.length) {
        this.confirmChanges()
        .then(() => {
          this._continueShopping()
        })
      } else {
        this._continueShopping()
      }
    },
    _continueShopping () {
      this.$api.cartItems.approve()
      .then(() => {
        this.continueProgressing = false
        let path = '/cart/payment'

        if (this.hasAnyDeliverableItem)
          path = '/cart/shipping'

        this.$router.push(path)
      })
      .catch(err => {
        this.continueProgressing = false
        this.fail(err)
      })
    }
  }
}
</script>
