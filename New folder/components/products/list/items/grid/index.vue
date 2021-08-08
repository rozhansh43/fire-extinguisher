<template>
  <b-row no-gutters class="products-grid-view">
    <item
      v-for="(item, index) in value"
      :key="item.id"
      :value="item"
      :index="index"
      :count="value.length"
      :type="getType(item.typeId)"
    />
  </b-row>
</template>

<script>
import Item from './Item'

export default {
  name: 'Grid',
  components: {
    Item
  },
  props: {
    value: Array,
    types: { type: Array, default: () => [] }
  },
  methods: {
    getType (typeId) {
      return this.types && this.types.length ? this.types.find(o => o.id === typeId) : null
    }
  }
}
</script>
