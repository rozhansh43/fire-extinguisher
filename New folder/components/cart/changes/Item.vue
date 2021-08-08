<template>
  <span v-if="item">
    <template v-if="item.change.type === 1">
      {{ $t('cart.payableChanged', {
        productTitle,
        oldPayable: getAmount(item.change.oldPayable),
        payable: getAmount(item.payable),
        unit: currencyDisplay
      }) }}
    </template>

    <template v-if="item.change.type === 2">
      {{ $t('cart.quantityChanged', {
        productTitle,
        oldQuantity: item.change.oldQuantity,
        quantity: item.quantity,
        quantityChangeReason: this.$t(`cart.changeReasons.${item.change.quantityChangeReason}`),
        unit: item.product.model.article.package.name
      }) }}
    </template>

    <template v-if="item.change.type === 3">
      {{ $t('cart.itemWillBeRemoved', {
        productTitle,
        removeReason: this.$t(`cart.changeReasons.${item.change.removeReason}`)
      }) }}
    </template>
  </span>
</template>

<script>
export default {
  name: 'ChangeItem',
  props: {
    item: { type: Object, required: true },
    noProductTitle: { type: Boolean, default: false }
  },
  computed: {
    productTitle () {
      return this.noProductTitle ? this.$t('cart.thisProduct') : (this.item.product && this.item.product.title)
    },
    currencyDisplay () {
      return this.$api.settings.currencySettings.getDisplayName()
    }
  },
  methods: {
    getAmount (value) {
      return this.$api.settings.currencySettings.getDisplayAmount(value).toLocaleString()
    }
  }
}
</script>
