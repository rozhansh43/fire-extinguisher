<template>
  <a v-if="imageSrc && link" target="_blank" :href="staticUrl">
    <b-img
      v-if="fluidGrow"
      :src="imageSrc"
      fluid-grow
      :alt="alt"
      :width="width"
      :height="height"
      :class="imageClass"
    />
    
    <b-img
      v-else
      :src="imageSrc"
      :width="!fitIn || isSvg(path) ? width : null"
      :height="!fitIn || isSvg(path) ? height : null"
      :alt="alt"
      :class="imageClass"
    />
  </a>
  
  <b-img
    v-else-if="imageSrc && fluidGrow"
    :src="imageSrc"
    fluid-grow
    :alt="alt"
    :width="width"
    :height="height"
    :class="imageClass"
  />
  
  <b-img
    v-else-if="imageSrc"
    :src="imageSrc"
    :width="!fitIn || isSvg(path) ? width : null"
    :height="!fitIn || isSvg(path) ? height : null"
    :alt="alt"
    :class="imageClass"
  />
</template>

<script>
import { getThumborThumbnailUrl, getStaticUrl, getThumbnailUrl } from '@/lib/thumbnail.js'

export default {
  name: 'Thumbnail',
  props: {
    path: String,
    alt: String,
    quality: Number,
    watermark: { type: Boolean, default: false },
    watermarkHorizontalAlign: { type: String, default: 'left' }, // left | right
    watermarkVerticalAlign: { type: String, default: 'bottom' }, // bottom | top
    watermarkMargin: { type: Number, default: 50 },
    watermarkOpacity: { type: Number, default: 50 }, // 0 to 100
    fitIn: { type: Boolean, default: false },
    width: { type: Number, default: 40 },
    height: { type: Number, default: 40 },
    link: { type: Boolean, default: true },
    fluidGrow: { type: Boolean, default: false },
    showNoImage: { type: Boolean, default: false },
    preload: { type: Boolean, default: false },
    imageClass: { type: String },
    horizontalAlign: String,
    verticalAlign: String
  },
  data () {
    return {
      imageSrc: null
    }
  },
  computed: {
    staticUrl () {
      return getStaticUrl({
        $config: this.$config,
        path: this.path,
        showNoImage: this.showNoImage,
        noImageUrl: this.noImageUrl
      })
    },
    thumbUrl () {
      return getThumborThumbnailUrl({
        $config: this.$config,
        path: this.path,
        quality: this.quality,
        watermark: this.watermark,
        watermarkHorizontalAlign: this.watermarkHorizontalAlign,
        watermarkVerticalAlign: this.watermarkVerticalAlign,
        watermarkMargin: this.watermarkMargin,
        watermarkOpacity: this.watermarkOpacity,
        fitIn: this.fitIn,
        width: this.width,
        height: this.height,
        showNoImage: this.showNoImage,
        noImageUrl: this.noImageUrl,
        horizontalAlign: this.horizontalAlign,
        verticalAlign: this.verticalAlign
      })
    },
    noImageUrl () {
      return this.$store.state.$settings.branding.noImage && `${this.$config.files.staticServerUrl}/${this.$store.state.$settings.branding.noImage}`
    }
  },
  watch: {
    staticUrl () {
      this.getImageSrc().then(url => {
        this.imageSrc = url
      })
    },
    thumbUrl () {
      this.getImageSrc().then(url => {
        this.imageSrc = url
      })
    }
  },
  mounted () {
    this.getImageSrc().then(url => {
      this.imageSrc = url
      if (this.preload) this.download()
    })
  },
  methods: {
    getImageSrc () {
      return getThumbnailUrl({
        $config: this.$config,
        path: this.path,
        quality: this.quality,
        watermark: this.watermark,
        watermarkHorizontalAlign: this.watermarkHorizontalAlign,
        watermarkVerticalAlign: this.watermarkVerticalAlign,
        watermarkMargin: this.watermarkMargin,
        watermarkOpacity: this.watermarkOpacity,
        fitIn: this.fitIn,
        width: this.width,
        height: this.height,
        showNoImage: this.showNoImage,
        noImageUrl: this.noImageUrl,
        horizontalAlign: this.horizontalAlign,
        verticalAlign: this.verticalAlign
      }, this.isSvg(this.path))
    },
    download () {
      const img = new Image()
      img.onload = () => {
        this.$emit('preloaded', {
          width: img.width,
          height: img.height
        })
      }
      img.src = this.imageSrc
    },
    getExtension (file) {
      return file && file.toUpperCase().split('.').pop()
    },
    isSvg (file) {
      const extension = this.getExtension(file)
      return extension && extension.toLowerCase() === 'svg'
    }
  }
}
</script>
