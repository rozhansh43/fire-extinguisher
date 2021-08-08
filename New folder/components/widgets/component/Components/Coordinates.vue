<template>
  <geopoint-display
    :value="branding.coordinates"
    :direction-url="branding.directionUrl"
    :height="350"
  />
</template>

<script>
import GeopointDisplay from '@/components/shared/GeopointDisplay'

export default {
  name: 'Coordinates',
  components: {
    GeopointDisplay
  },
  computed: {
    branding () {
      return this.$store.state.$settings.branding
    }
  }
}
</script>
