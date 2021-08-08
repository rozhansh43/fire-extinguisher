<template>
  <span v-if="!settings" class="text-danger">
    [CURRENCY SETTINGS NOT LOADED]
  </span>

  <span v-else-if="value !== null">
    <span :class="amountClass">
      {{ amount }}
    </span>

    <span v-if="showCurrency" :class="currencyClass">
      {{ currency }}
    </span>
  </span>
</template>

<script>
export default {
  name: 'CurrencyDisplay',
  props: {
    value: { type: Number, default: null },
    showCurrency: { type: Boolean, default: true },
    currencyClass: { type: [Object, String], default: null },
    amountClass: { type: [Object, String], default: null },
    noConversion: { type: Boolean, default: false }
  },
  computed: {
    settings () {
      return this.$api.settings.currencySettings.get()
    },
    currency () {
      let name

      if (this.noConversion)
        name = this.settings && this.settings.baseName
      else
        name = this.$api.settings.currencySettings.getDisplayName()

      return name
    },
    amount () {
      let val

      if (this.noConversion)
        val = this.value
      else
        val = this.$api.settings.currencySettings.getDisplayAmount(this.value)

      const precision = this.$api.settings.currencySettings.getDisplayPrecision()
      const factor = Math.pow(10, precision)
      val = val * factor
      val = Math.round(val)
      val = val / factor

      return val && val.toLocaleString()
    }
  }
}
</script>
