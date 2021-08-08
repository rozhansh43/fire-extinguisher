<template>
  <div>
    <b-btn
      :disabled="progressing"
      variant="success"
      size="lg"
      block
      class="mb-3"
      @click="continueShopping"
    >
      <font-awesome-icon
        v-if="progressing"
        icon="cog"
        spin
        class="align-middle"
        :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
      />
      
      {{ $t('cart.continueShoppingProcess') }}
    </b-btn>

    <b-modal
      ref="login"
      centered
      hide-header
      hide-footer
      :size="registerViaPasswordEnabled ? 'lg' : 'md'"
      body-class="p-0"
    >
      <login no-redirect in-component/>
    </b-modal>
  </div>
</template>

<script>
import vm from '@/lib/vm'
import Settings from '@/mixins/settings'
import Login from '@/components/account/login'

export default {
  name: 'ContinueButton',
  components: {
    Login
  },
  mixins: [Settings],
  props: {
    progressing: { type: Boolean, default: false }
  },
  computed: {
    account () {
      return this.$store.state.$account
    }
  },
  mounted () {
    vm.$on('loggedIn', () => {
      if (this.$refs.login) this.$refs.login.hide()
      this.$api.cartItems.getCart()
      .then(() => {
        this.$emit('continueShopping')
      })
    })
  },
  beforeDestroy () {
    vm.$off('loggedIn')
  },
  methods: {
    continueShopping () {
      if (this.account) this.$emit('continueShopping')
      else this.$refs.login.show()
    }
  }
}
</script>
