<template>
  <widgets v-if="hasArea1" :widgets="area1"/>
</template>

<script>
import Widgets from '@/components/widgets'

export default {
  name: 'OneArea',
  components: {
    Widgets
  },
  props: {
    area1: Array
  },
  computed: {
    hasArea1 () {
      return this.area1 && this.area1.length
    }
  }
}
</script>
