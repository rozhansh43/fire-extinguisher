<template>
  <div v-if="widget.video">
    <h2 v-if="widget.title" class="widget-title h4 text-center mb-5">
      {{ widget.title }}
    </h2>

    <p v-if="widget.subtitle" class="widget-subtitle text-center mb-5 text-muted">
      {{ widget.subtitle }}
    </p>

    <video
      class="w-100"
      :poster="`${$config.files.staticServerUrl}/${widget.poster}`"
      :autoplay="widget.autoPlay"
      :controls="!widget.autoPlay"
      :loop="widget.autoPlay"
      :muted="widget.autoPlay"
    >
      <source :src="`${$config.files.staticServerUrl}/${widget.video}`">
    </video>
  </div>
</template>

<script>
export default {
  name: 'VideoDefault',
  props: {
    widget: { required: true }
  }
}
</script>
