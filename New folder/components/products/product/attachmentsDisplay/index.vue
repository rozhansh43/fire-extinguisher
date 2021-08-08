<template>
  <div v-if="value && value.length">
    <item
      v-for="(item, index) in value"
      :key="item.id"
      :value="item"
      :downloadable="downloadable"
      :no-space-on-bottom="noSpaceOnBottom"
      :list-length="value.length"
      :index="index"
    />
  </div>
</template>

<script>
import Item from './Item'

export default {
  name: 'AttachmentsDisplay',
  components: {
    Item
  },
  props: {
    value: { type: Array, required: true },
    downloadable: { type: Boolean, default: false },
    noSpaceOnBottom: { type: Boolean, default: false }
  }
}
</script>
