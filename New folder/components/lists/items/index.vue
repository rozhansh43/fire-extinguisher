<template>
  <b-list-group v-if="value && value.length" flush>
    <item
      v-for="(item, index) in value"
      :key="item.id"
      :value="item"
      :selected-id="selectedId"
      :editable="editable"
      :show-bullet="showBullet"
      @clicked="(val) => emitClicked(val, index)"
      @removed="emitRemoved"
    />
  </b-list-group>
</template>

<script>
import Item from './Item'

export default {
  name: 'Lists',
  components: {
    Item
  },
  props: {
    value: Array,
    selectedId: Number,
    editable: Boolean,
    showBullet: Boolean
  },
  methods: {
    emitClicked (item, index) {
      this.$emit('clicked', item, index)
    },
    emitRemoved (itemId) {
      this.$emit('removed', itemId)
    }
  }
}
</script>
