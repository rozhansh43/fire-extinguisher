<template>
  <div>
    <h2 v-if="widget.title" class="widget-title h4 mb-4">
      {{ widget.title }}
    </h2>

    <p v-if="widget.subtitle" class="mb-4 text-muted">
      {{ widget.subtitle }}
    </p>

    <html-display v-if="widget.body" :value="widget.body" class="article-body"/>
  </div>
</template>

<script>
import HtmlDisplay from '@/components/shared/HtmlDisplay'

export default {
  name: 'TextFooter',
  components: {
    HtmlDisplay
  },
  props: {
    widget: { required: true }
  }
}
</script>
