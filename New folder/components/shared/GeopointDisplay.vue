<template>
  <geopoint-editor :value="value" :direction-url="directionUrl" :height="height" :format="format"/>
</template>

<script>
import GeopointEditor from '@/components/shared/GeopointEditor'

export default {
  name: 'GeopointDisplay',
  components: {
    GeopointEditor
  },
  props: {
    value: { type: Object },
    directionUrl: { type: String },
    height: { type: Number },
    format: String
  }
}
</script>
