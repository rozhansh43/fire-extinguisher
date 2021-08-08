<template>
  <div v-if="widget.items && widget.items.length">
    <h2 v-if="widget.title" class="widget-title h4 mb-4">
      {{ widget.title }}
    </h2>

    <p v-if="widget.subtitle" class="widget-subtitle text-center mb-4 text-muted">
      {{ widget.subtitle }}
    </p>

    <b-row>
      <b-col cols="auto" v-for="item in widget.items" :key="item.id">
        <b-link :href="item.url" target="_blank" :title="item.title">
          <b-img width="32" height="32" :src="getAbsoluteImageUrl(item.image)" :alt="item.title" :class="item.viewData"/>
        </b-link>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'ItemsSocial',
  props: {
    widget: { required: true }
  },
  methods: {
    getAbsoluteImageUrl(path) {
      return path ? `${this.$config.files.staticServerUrl}/${path}` : null
    }
  }
}
</script>

<style lang="scss" scoped>
ul li::marker {
  color: var(--primary);
}
</style>
