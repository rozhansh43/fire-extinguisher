<template>    
  <div class="text-center py-5">
    <h2 v-if="widget.title" class="widget-title text-center mb-5">
      {{ widget.title }}
    </h2>
    
    <p v-if="widget.subtitle" class="widget-subtitle text-center mb-5">
      {{ widget.subtitle }}
    </p>
    
    <div v-if="widget.body" class="parallax-title">
      <html-display :value="widget.body" class="article-body"/>
    </div>

    <b-btn v-if="widget.url && widget.url.length" variant="outline-light" class="mb-3" :to="widget.url">
      {{ $t('shared.moreInfo') }}
    </b-btn>
  </div>
</template>

<script>
import HtmlDisplay from '@/components/shared/HtmlDisplay'

export default {
  name: 'TextImgLeft',
  components: {
    HtmlDisplay
  },
  props: {
    widget: { required: true }
  },
  computed: {
    bulletList () {
      return this.widget.viewData && this.widget.viewData.includes('bullet-list')
    }
  }
}
</script>

<style lang="scss" scoped>
.bullet-color {
  ::marker {
    color: var(--primary);
  }
}
</style>
