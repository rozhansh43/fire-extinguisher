<template>
  <div>
    <b-row class="align-items-center" :class="{'text-lg-left': $dir.ltr, 'text-lg-right': $dir.rtl}">
      <b-col v-if="widget.image" :lg="fixedWidth ? '6' : 'auto'" class="mb-4 mb-lg-0 text-center">
        <b-img
          fluid-grow
          :src="`${$config.files.staticServerUrl}/${widget.image}`"
          :alt="widget.title"
        />
      </b-col>

      <b-col :class="{'ml-lg-5 pl-lg-5': $dir.ltr, 'mr-lg-5 pr-lg-5': $dir.rtl}">
        <h2 v-if="widget.title" class="widget-title h4 mb-3">
          {{ widget.title }}
        </h2>

        <p v-if="widget.subtitle" class="widget-subtitle mb-3 text-muted">
          {{ widget.subtitle }}
        </p>

        <div v-if="widget.body" :class="{ 'mr-lg-3': $dir.ltr, 'ml-lg-3': $dir.rtl }">
          <html-display :value="widget.body" class="article-body"/>
        </div>

        <b-btn v-if="widget.url" :to="widget.url" target="_blank" variant="outline-primary" class="px-3 py-1">
          {{ $t('shared.moreInfo') }}
        </b-btn>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import HtmlDisplay from '@/components/shared/HtmlDisplay'

export default {
  name: 'TextImgRight',
  components: {
    HtmlDisplay
  },
  props: {
    widget: { required: true }
  },
  computed: {
    fixedWidth () {
      return this.widget.viewData && this.widget.viewData.includes('fixed-width')
    }
  }
}
</script>
