<template>
  <span>
    <div v-if="images.length === 1" class="d-flex align-items-center rounded">
      <thumbnail
        :path="images[0]"
        :link="false"
        :width="width"
        :height="height"
        :fit-in="fitIn"
        :alt="alt"
        :watermark="watermark"
        :watermark-horizontal-align="$dir.ltr ? 'left' : 'right'"
        class="img-fluid mx-auto rounded"
      />
    </div>

    <b-carousel
      v-else-if="images.length > 1"
      controls
      class="rounded overflow-hidden"
      @sliding-start="slide"
    >
      <div class="slide-number">
        {{ $t('shared.numberFromTotal', { number: slideIndex, total: images.length }) }}
      </div>
      <div
        v-for="(image, index) in images"
        :key="image"
        class="carousel-item"
        :class="{ active: index === 0 }"
      >
        <div class="d-flex align-items-center" :style="slideStyle">
          <thumbnail
            :path="image"
            :link="false"
            :width="width"
            :height="height"
            :alt="`${alt} - ${index + 1}`"
            :fit-in="fitIn"
            :preload="fitIn"
            :watermark="watermark"
            :watermark-horizontal-align="$dir.ltr ? 'left' : 'right'"
            class="img-fluid mx-auto rounded"
            @preloaded="setMaxSize"
          />
        </div>
      </div>
    </b-carousel>
  </span>
</template>

<script>
import Thumbnail from '@/components/shared/Thumbnail'

export default {
  name: 'Carousel',
  components: {
    Thumbnail
  },
  props: {
    images: { type: Array, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    alt: { type: String, required: true },
    fitIn: { type: Boolean, default: false },
    watermark: { type: Boolean, default: false }
  },
  data() {
    return {
      maxHeight: this.height,
      maxWidth: this.width,
      slideIndex: 1
    }
  },
  computed: {
    slideStyle() {
      return this.fitIn ? `height:${this.maxHeight}px !important` : null
    }
  },
  methods: {
    setMaxSize(size) {
      this.maxHeight = Math.max(this.maxHeight, size.height)
      this.maxWidth = Math.max(this.maxWidth, size.width)
    },
    slide(s) {
      this.slideIndex = s + 1
    }
  }
}
</script>
