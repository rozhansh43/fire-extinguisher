<template>
  <div v-if="items && items.length" class="cart-items">
    <item
      v-for="item in items"
      :key="item.id"
      :item="item"
      class="item border-bottom"
    />
  </div>
</template>

<script>
import Item from './Item/index'

export default {
  name: 'CartItems',
  components: {
    Item
  },
  props: {
    items: { type: Array, required: true }
  }
}
</script>
