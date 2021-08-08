<template>
  <b-list-group flush class="products-list-view">
    <item
      v-for="item in value"
      :key="item.id"
      :value="item"
      :type="getType(item.typeId)"
    />
  </b-list-group>
</template>

<script>
import Item from './Item'

export default {
  name: 'List',
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
