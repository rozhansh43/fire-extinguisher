<template>
  <div>
    <products-default
      v-for="(item, index) in value"
      :key="index"
      :widget="{ title: getTitle(item), data: item.products, viewData: 'title-in-header' }"
      class="container"
    />
  </div>
</template>

<script>
import ProductsDefault from '@/components/widgets/products/default'

export default {
  name: 'Relations',
  components: {
    ProductsDefault
  },
  props: {
    value: { type: Array, required: true }
  },
  methods: {
    getTitle (item) {
      let title = null
      
      if (item.relationType) {
        if (item.side === 0) title = item.relationType.primarySideName
        else if (item.side === 1) title = item.relationType.relatedSideName
      }

      return title
    }
  }
}
</script>
