<template>    
  <div>
    <h2 v-if="widget.title" class="widget-title h4 text-center mb-5">
      {{ widget.title }}
    </h2>
    
    <p v-if="widget.subtitle" class="widget-subtitle text-center mb-5 text-muted">
      {{ widget.subtitle }}
    </p>

    <b-img
      v-if="widget.image"
      :src="`${$config.files.staticServerUrl}/${widget.image}`"
      :alt="widget.title"
      fluid-grow
      class="rounded"
      :class="{'mb-4': widget.body}"
    />

    <html-display v-if="widget.body" :value="widget.body" class="article-body"/>
  </div>
</template>

<script>
import HtmlDisplay from '@/components/shared/HtmlDisplay'

export default {
  name: 'TextDefault',
  components: {
    HtmlDisplay
  },
  props: {
    widget: { required: true }
  }
}
</script>
