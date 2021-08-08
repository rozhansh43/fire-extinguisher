<template>
  <div v-if="widget.component">
    <h2 v-if="widget.title" class="widget-title h4 text-center mb-5">
      {{ widget.title }}
    </h2>

    <p v-if="widget.subtitle" class="widget-subtitle text-center mb-5 text-muted">
      {{ widget.subtitle }}
    </p>

    <component :is="widget.component.toLowerCase()" :component-data="widget.componentData"/>
  </div>
</template>

<script>
export default {
  name: 'ComponentDefault',
  components: {
    Coordinates: () => import('./Components/Coordinates')
  },
  props: {
    widget: { required: true }
  }
}
</script>
