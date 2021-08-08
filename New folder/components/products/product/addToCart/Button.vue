<template>
  <div>
    <b-btn
      :disabled="progressing"
      :variant="variant"
      :size="size"
      block
      class="mb-3"
      @click="submit"
    >
      <font-awesome-icon
        :icon="progressing ? 'cog' : 'shopping-basket'"
        :spin="progressing"
        class="align-middle"
        :class="{'mr-1': $dir.ltr, 'ml-1': $dir.rtl}"
      />
      
      {{ $t('cart.addToCart') }}
    </b-btn>

    <add-to-cart-modal
      :article-id="articleId"
      :selected-package="selectedPackage"
      :selected-sale-plan="selectedSalePlan"
      :progressing="progressing"
      :unit="unit"
      v-model="model"
      @submit="_addToCart"
    />

    <b-modal
      ref="login"
      centered
      hide-header
      hide-footer
      :size="registerViaPasswordEnabled ? 'lg' : 'md'"
      body-class="p-0"
    >
      <login
        no-redirect
        in-component
        :event-append="uniqId"
      />
    </b-modal>
  </div>
</template>

<script>
import AddToCartModal from './Modal'
import Login from '@/components/account/login'
import Settings from '@/mixins/settings'
import vm from '@/lib/vm'

export default {
  name: 'AddToCartButton',
  components: {
    AddToCartModal,
    Login
  },
  mixins: [Settings],
  props: {
    value: { type: Number, required: true },
    variant: { type: String, default: 'success' },
    size: { type: String, default: 'md' },
    articleId: { type: Number, required: true },
    selectedPackage: { type: Object, required: true },
    selectedSalePlan: { type: Object, required: true },
    unit: { type: Object, required: true },
    needLogin: { type: Boolean, default: false }
  },
  data () {
    return {
      progressing: false,
      uniqId: String(Math.floor(Math.random() * 99999999))
    }
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    account () {
      return this.$store.state.$account
    },
    twoStepsAddToCard () {
      return this.$store.state.$settings.products.twoStepsAddToCard
    }
  },
  mounted () {
    vm.$on(`loggedIn${this.uniqId}`, () => {
      if (this.$refs.login) this.$refs.login.hide()
      this._submit()
    })
  },
  beforeDestroy () {
    vm.$off(`loggedIn${this.uniqId}`)
  },
  methods: {
    submit () {
      if (this.needLogin && !this.account) {
        this.$refs.login.show()
      } else {
        this._submit()
      }
    },
    _submit () {
      if (this.twoStepsAddToCard)
        this._openModal()
      else
        this._addToCart()
    },
    _addToCart () {
      this.progressing = true

      this.$api.cartItems.add({
        packageId: this.selectedPackage.id,
        quantity: this.model
      }, true, true)
      .then(() => {
        if (this.twoStepsAddToCard) {
          vm.$emit('hideAddToCartModal', this.articleId)
        }
        
        if (this.$store.state.$settings.products.redirectToCartAfterAdd) {
          this.$router.push('/cart')
        } else {
          this.progressing = false
        }
        this.$showSuccess(this.$t('products.productAddedToCart'))
      })
      .catch(err => {
        this.progressing = false
        this.$showError(this.$getLocaleErrorMessage(err, 'cart'))
      })
    },
    _openModal () {
      vm.$emit('showAddToCartModal', this.articleId)
    }
  }
}
</script>
