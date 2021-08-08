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
import Login from '@/components/account/login'
import Settings from '@/mixins/settings'
import vm from '@/lib/vm'

export default {
  name: 'AddToCartButtonBulk',
  components: {
    Login
  },
  mixins: [Settings],
  props: {
    value: { type: Array, required: true },
    variant: { type: String, default: 'success' },
    size: { type: String, default: 'md' },
    needLogin: { type: Boolean, default: false }
  },
  data () {
    return {
      progressing: false,
      uniqId: String(Math.floor(Math.random() * 99999999))
    }
  },
  computed: {
    account () {
      return this.$store.state.$account
    }
  },
  mounted () {
    vm.$on(`loggedIn${this.uniqId}`, () => {
      if (this.$refs.login) this.$refs.login.hide()
      this._addToCart()
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
        this._addToCart()
      }
    },
    _addToCart () {
      this.progressing = true

      this.$api.cartItems.addBulk(this.value, true, true)
      .then(() => {
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
    }
  }
}
</script>
