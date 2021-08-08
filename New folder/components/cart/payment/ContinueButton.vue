<template>
  <b-btn
    :disabled="progressing || disabled"
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
    
    {{ $t('cart.paymentAndOrderFinalRegistration') }}
  </b-btn>
</template>

<script>
export default {
  name: 'ContinueButton',
  props: {
    progressing: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },
  methods: {
    continueShopping () {
      this.$emit('continueShopping')
    }
  }
}
</script>
