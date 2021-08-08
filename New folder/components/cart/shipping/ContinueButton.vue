<template>
  <b-btn
    :disabled="progressing"
    :variant="selectedDeliveryMethod ? 'success' : 'outline-success'"
    size="lg"
    block
    class="mb-3"
    @click="continueShopping"
  >
    <template v-if="selectedDeliveryMethod">
      <font-awesome-icon
        v-if="progressing"
        icon="cog"
        spin
        class="align-middle"
        :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
      />
      
      {{ $t('cart.continueShoppingProcess') }}
    </template>

    <template v-else>
      {{ $t('deliveryMethods.selectDeliveryMethodToContinue') }}
    </template>
  </b-btn>
</template>

<script>
export default {
  name: 'ContinueButton',
  props: {
    selectedDeliveryMethod: Object,
    progressing: { type: Boolean, default: false }
  },
  methods: {
    continueShopping () {
      if (this.selectedDeliveryMethod)
        this.$emit('continueShopping')
    }
  }
}
</script>
