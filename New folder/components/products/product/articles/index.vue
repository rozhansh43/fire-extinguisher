<template>
  <div>
    <item
      v-for="item in value"
      :key="item.id"
      :value="item"
      :model-id="modelId"
      :type="type"
      :selected-model="selectedModel"
      :selected-article="selectedArticle"
      :product="product"
    />
  </div>
</template>

<script>
import Item from './Item'

export default {
  name: 'Articles',
  components: {
    Item
  },
  props: {
    value: { type: Array, required: true },
    modelId: { type: Number, required: true },
    type: Object,
    selectedModel: Object,
    selectedArticle: Object,
    product: { type: Object, required: true }
  }
}
</script>
