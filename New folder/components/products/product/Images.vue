<template>
  <div v-if="allItems && allItems.length" class="p-2">
    <b-btn v-if="allItems[selectedIndex]" variant="link" block class="p-0 text-dark border-0 mb-3" @click="setLightboxIndex(selectedIndex)">
      <image-zoomer
        :width="426"
        :height="426"
        :path="allItems[selectedIndex]"
        :alt="value.title"
        image-class="img-fluid"
      />
    </b-btn>

    <b-row v-if="allItems && allItems.length > 1">
      <b-col v-for="(item, index) in allItems" :key="index" cols="6" md="3" class="mb-3">
        <b-btn variant="link" block class="p-0 text-dark border-silver" @click="setSelectedIndex(index)">
          <thumbnail
            :link="false"
            fluid-grow
            :width="350"
            :height="350"
            :path="item"
            :alt="value.title"
            class="rounded"
          />
        </b-btn>
      </b-col>
    </b-row>
    
    <image-lightbox ref="imageLightbox" :items="allItems"/>

    <meta v-if="value.image" name="image_url" :content="getAbsoluteImageUrl(value.image)"/>
  </div>
</template>

<script>
import ImageLightbox from '@/components/shared/ImageLightbox'
import ImageZoomer from '@/components/shared/ImageZoomer'
import Thumbnail from '@/components/shared/Thumbnail'

export default {
  name: 'ImagesDisplay',
  components: {
    ImageLightbox,
    ImageZoomer,
    Thumbnail
  },
  props: {
    value: { type: Object, required: true }
  },
  data () {
    return {
      selectedIndex: 0
    }
  },
  computed: {
    otherImages () {
      const val = this.value
      return val.otherImages && val.otherImages.length ? val.otherImages.split(',') : []
    },
    allItems () {
      let images = this.value.image ? [this.value.image] : []

      if (this.otherImages && this.otherImages.length) 
        images = images.concat(this.otherImages)

      return images
    }
  },
  methods: {
    setLightboxIndex (index) {
      this.$refs.imageLightbox.setIndex(index)
    },
    setSelectedIndex (index) {
      this.selectedIndex = index
    },
    getAbsoluteImageUrl(path) {
      return path ? `${this.$config.files.staticServerUrl}/${path}` : null
    }
  }
}
</script>
