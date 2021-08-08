<template>
  <component
    :is="layout"
    :area1="area1"
    :area2="area2"
    :area3="area3"
    :area4="area4"
  />
</template>

<script>
export default {
  name: 'Areas',
  components: {
    oneArea: () => import('./OneArea'),
    twoAreas: () => import('./TwoAreas'),
    threeAreas: () => import('./ThreeAreas'),
    fourAreas: () => import('./FourAreas')
  },
  props: {
    layout: { type: String, required: true },
    area1: Array,
    area2: Array,
    area3: Array,
    area4: Array
  }
}
</script>
