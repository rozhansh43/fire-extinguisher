<template>
  <html-display v-if="field.description" :value="field.description" class="article-body"/>
</template>

<script>
import HtmlDisplay from '@/components/shared/HtmlDisplay'

export default {
  name: 'DescriptionField',
  components: {
    HtmlDisplay
  },
  props: {
    field: { type: Object, required: true }
  }
}
</script>
