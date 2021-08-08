<template>
  <div v-if="widget.data && widget.data.length">
    <h2 v-if="widget.title" class="widget-title h4 text-center mb-5">
      {{ widget.title }}
    </h2>

    <p v-if="widget.subtitle" class="widget-subtitle text-center mb-5 text-muted">
      {{ widget.subtitle }}
    </p>

    <item v-for="item in widget.data" :key="item.id" :item="item"/>
  </div>
</template>

<script>
import Item from './Item'

export default {
  name: 'FaqsDefault',
  components: {
    Item
  },
  props: {
    widget: { required: true }
  }
}
</script>
