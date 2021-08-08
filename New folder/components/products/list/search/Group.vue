<template>
  <b-card v-if="value.description" body-class="pb-0">
    <html-display :value="value.description" class="article-body"/>
  </b-card>
</template>

<script>
import HtmlDisplay from '@/components/shared/HtmlDisplay'

export default {
  name: 'ProductGroup',
  components: {
    HtmlDisplay
  },
  props: {
    value: { type: Object, required: true }
  }
}
</script>
