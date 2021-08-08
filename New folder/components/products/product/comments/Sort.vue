<template>
  <div class="search-sort">
    <font-awesome-icon
      icon="sort-amount-down"
      size="lg"
      class="align-middle text-moremuted"
      :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
    />

    {{ $t('search.sortBy') }} :

    <b-radio
      v-for="item in options"
      :key="item.value"
      :value="item.value"
      name="sort-radio-group"
      button
      inline
      size="sm"
      button-variant="link"
      v-model="model"
    >
      {{ item.text }}
    </b-radio>
  </div>
</template>

<script>
export default {
  name: 'Sort',
  props: {
    value: String
  },
  data () {
    return {
      options: [
        { value: 'created', text: this.$t('productComments.sortOptions.newest') },
        { value: 'likesCount', text: this.$t('productComments.sortOptions.mostHelpful') }
      ]
    }
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
        this.$emit('change')
      }
    }
  }
}
</script>
