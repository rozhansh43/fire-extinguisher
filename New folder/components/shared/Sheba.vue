<template>
  <b-input-group :size="size">
    <template v-if="prepend">
      <b-input-group-prepend v-if="$dir.ltr" is-text>
        {{ prepend }}
        <required-symbol v-if="required"/>
      </b-input-group-prepend>

      <b-input-group-prepend is-text>
        <template v-if="$dir.ltr">
          IR
        </template>

        <template v-else>
          {{ prepend }}
          <required-symbol v-if="required"/>
        </template>
      </b-input-group-prepend>
    </template>

    <b-form-input
      dir="auto"
      :name="$t('customers.bankAccounts.shebaNumber')"
      v-model="model"
    />

    <b-input-group-append v-if="$dir.rtl" is-text dir="ltr">
      IR
    </b-input-group-append>
  </b-input-group>
</template>

<script>
export default {
  name: 'Sheba',
  props: {
    value: String,
    prepend: String,
    required: Boolean,
    size: { type: String, default: 'md' }
  },
  computed: {
    sheba () {
      const data = this.value
      return data ? data.substr(2) : null
    },
    model: {
      get () {
        return this.sheba
      },
      set (val) {
        this.$emit('input', `IR${val}`)
      }
    }
  }
}
</script>
