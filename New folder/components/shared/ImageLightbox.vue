<template>
  <client-only v-if="showGallery">
    <vue-gallery :images="images" :index="index" @close="index = null"/>
  </client-only>
</template>

<script>
// Documents: https://www.npmjs.com/package/vue-gallery
// Demo: https://fiddle.jshell.net/Robin_ck/LffrLb2k/show/light/
// Options: https://github.com/blueimp/Gallery#options
// import VueGallery from 'vue-gallery'

export default {
  name: 'ImageLightbox',
  components: {
    VueGallery: () => import('vue-gallery')
  },
  props: {
    items: Array
  },
  data () {
    return {
      index: null,
      showGallery: false
    }
  },
  computed: {
    images () {
      return this.items.map(i => `${this.$config.files.staticServerUrl}/${i}`)
    }
  },
  mounted () {
    this.showGallery = true
  },
  methods: {
    setIndex (index) {
      this.index = index
    }
  }
}
</script>

<style lang="scss">
#blueimp-gallery {
  display: none;

  .next, .prev, .close {
    color: #fff !important;
  }

  .close {
    font-size: 250%;
  }
}
</style>
