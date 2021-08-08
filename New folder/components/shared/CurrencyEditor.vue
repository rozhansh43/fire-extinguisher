<template>
  <b-input-group v-if="!settings" :size="size" :append="currency">
    <slot name="prepend">
      <b-input-group-prepend v-if="prepend" is-text>
        {{ prepend }}

        <required-symbol v-if="required"/>
      </b-input-group-prepend>
    </slot>

    <b-input value="CURRENCY SETTINGS NOT LOADED" disabled class="text-danger" />
  </b-input-group>

  <b-input-group v-else :size="size">
    <slot name="prepend">
      <b-input-group-prepend v-if="prepend" is-text>
        {{ prepend }}
        <required-symbol v-if="required"/>
      </b-input-group-prepend>
    </slot>

    <numeric-input
      :min="min"
      :class="inputClass"
      :placeholder="placeholder"
      :precision="internalPrecision"
      v-model="amount"
    />

    <slot name="append">
      <b-input-group-append is-text>
        {{ currency }}
      </b-input-group-append>
    </slot>
  </b-input-group>
</template>

<script>
export default {
  name: 'CurrencyEditor',
  props: {
    value: { type: Number, default: null },
    showCurrency: { type: Boolean, default: true },
    inputClass: { default: null },
    min: { type: Number, default: 0 },
    size: { type: String, default: null },
    prepend: String,
    placeholder: String,
    precision: { type: Number, default: null },
    noConversion: { type: Boolean, default: false },
    required: { type: Boolean, default: false }
  },
  data () {
    return {
      internalPrecision: 0
    }
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
    amount: {
      get () {
        let val

        if (this.noConversion)
          val = this.value
        else
          val = this.$api.settings.currencySettings.getDisplayAmount(this.value)

        return val
      },
      set (val) {
        let res

        if (val) {
          if (this.noConversion)
            res = val
          else
            res = val * this.$api.settings.currencySettings.getDisplayRate()
        } else res = val

        this.$emit('input', res)
      }
    }
  },
  mounted () {
    if (this.precision !== null)
      this.internalPrecision = this.precision
    else
      this.internalPrecision = this.$api.settings.currencySettings.getDisplayPrecision()
  }
}
</script>
