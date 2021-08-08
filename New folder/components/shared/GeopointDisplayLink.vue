<template>
  <b-link
    v-if="show"
    class="inherited-link"
    :href="mapUrl"
    :target="target"
  >
    <font-awesome-icon :icon="icon"/>
  </b-link>
</template>

<script>
export default {
  name: 'GeopointDisplayLink',
  props: {
    value: { type: Object },
    target: { type: String, default:'_blank' },
    size: { type: String, default: 'lg' },
    icon: { type: String, default: 'map-marker-alt' },
    basemap: { type: String, default: 'roadmap' }, // roadmap | satellite | terrain
    layer: { type: String, default: 'none' }, // none | transit | traffic | bicycling
    format: { type: String, default: 'latlon' } // latlon | latlng
  },
  computed: {
    show () {
      switch (this.format) {
        case 'latlon':
          return this.value && this.value.lat && this.value.lon
        case 'latlng':
        default:
          return this.value && this.value.lat && this.value.lng
      }
    },
    mapUrl () {
      let lat, lng
      switch (this.format) {
        case 'latlon':
          lat = this.value.lat
          lng = this.value.lon
          break
        case 'latlng':
        default:
          lat = this.value.lat
          lng = this.value.lng
      }
      let baseUrl = 'https://www.google.com/maps/@?api=1&map_action=map'
      baseUrl += `&zoom=${this.value.zoom}`
      baseUrl += `&basemap=${this.basemap}`
      baseUrl += `&layer=${this.layer}`
      baseUrl += `&center=${lat},${lng}`
      return baseUrl
    }
  }
}
</script>
