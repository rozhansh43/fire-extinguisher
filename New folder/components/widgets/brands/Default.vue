<template>
  <div v-if="widget.data && widget.data.length" class="brands-widget">
    <h2 v-if="widget.title" class="widget-title h4 text-center mb-5">
      {{ widget.title }}
    </h2>
    
    <p v-if="widget.subtitle" class="widget-subtitle text-center mb-5 text-muted">
      {{ widget.subtitle }}
    </p>

    <carousel
      v-if="showCarousel"
      :rtl="$dir.rtl"
      :per-page="1"
      :per-page-custom="[[0, 2], [576, 3], [768, 4], [992, 5], [1200, 6]]"
      autoplay
      autoplay-hover-pause
      loop
      :autoplay-timeout="7000"
      :pagination-enabled="false"
      :scroll-per-page="false"
    >
      <slide v-for="item in widget.data" :key="item.id" class="item text-center px-2">
        <b-link :to="`/products?brands=${item.id}`" class="d-block">
          <thumbnail
            :link="false"
            :width="150"
            :height="85"
            :path="item.image"
            :alt="item.name"
            show-no-image
            :title="item.name"
            v-b-tooltip.bottom
            class="rounded"
          />
        </b-link>
      </slide>
    </carousel>

    <div v-else>
      <b-row>
        <b-col v-for="item in widget.data" :key="item.id" lg="3" md="4" sm="6" class="item text-center">
          <b-link :to="`/products?brands=${item.id}`" class="d-block">
            <thumbnail
              :link="false"
              :width="150"
              :height="85"
              :path="item.image"
              :alt="item.name"
              show-no-image
              class="rounded"
            />
          </b-link>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import Thumbnail from '@/components/shared/Thumbnail'

export default {
  name: 'BrandsCarousel',
  components: {
    Thumbnail
  },
  props: {
    widget: { required: true }
  },
  data () {
    return {
      showCarousel: false
    }
  },
  mounted () {
    this.showCarousel = true
  }
}
</script>
