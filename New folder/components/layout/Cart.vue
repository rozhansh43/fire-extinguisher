<template>
  <b-btn
    to="/cart"
    variant="success"
    rel="nofollow"
    block
  >
    <font-awesome-icon
      icon="shopping-basket"
      class="align-middle"
      :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
    />
    
    {{ $t('cart.cart') }}

    <transition name="bounce">
      <b-badge
        v-if="totalQuantity"
        pill
        variant="white"
        :class="{ 'ml-1': $dir.ltr, 'mr-1': $dir.rtl }"
      >
        {{ totalQuantity }}
      </b-badge>
    </transition>
  </b-btn>
</template>

<script>
export default {
  name: 'Cart',
  computed: {
    totalQuantity () {
      return this.$store.state.$cart && this.$store.state.$cart.totalQuantity
    }
  }
}
</script>
