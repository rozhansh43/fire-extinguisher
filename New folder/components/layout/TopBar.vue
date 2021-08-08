<template>
  <widgets v-if="widgets && widgets.length" :widgets="widgets"/>
</template>

<script>
import Widgets from '@/components/widgets'

export default {
  name: 'TopBar',
  components: {
    Widgets
  },
  computed: {
    widgets () {
      return this.$store.state.$topBarWidgets
    }
  }
}
</script>
