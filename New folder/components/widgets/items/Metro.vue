<template>
  <b-row v-if="widget.items && widget.items.length">
    <div v-for="item in widget.items" :key="item.id" :class="item.viewData">
      <b-link :to="item.url">
        <b-card no-body class="overflow-hidden">
          <b-img
            fluid-grow
            :src="getAbsoluteImageUrl(item.image)"
            :alt="item.title"
          />
        </b-card>
      </b-link>
    </div>
  </b-row>
</template>

<script>
export default {
  name: 'ItemsMetro',
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
