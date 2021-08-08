<template>
  <div v-if="widget.data && widget.data.length && widget.client === 0">
    <h2 v-if="widget.title" class="widget-title h4 text-center mb-5">
      {{ widget.title }}
    </h2>

    <p v-if="widget.subtitle" class="widget-subtitle text-center mb-5 text-muted">
      {{ widget.subtitle }}
    </p>

    <b-card
      v-for="item in widget.data"
      :key="item.id"
      no-body
      :header="item.name && hasClass('title-in-header') ? item.name : null"
    >
      <div v-if="item.body" class="px-3 pt-3">
        <html-display :value="item.body" class="article-body"/>
      </div>
    </b-card>
  </div>
</template>

<script>
import HtmlDisplay from '@/components/shared/HtmlDisplay'

export default {
  name: 'AdsDefault',
  components: {
    HtmlDisplay
  },
  props: {
    widget: { required: true }
  },
  methods: {
    hasClass (key) {
      return this.widget.viewData && this.widget.viewData.includes(key)
    }
  }
}
</script>
