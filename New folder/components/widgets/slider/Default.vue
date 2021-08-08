<template>
  <div v-if="widget.items && widget.items.length">
    <b-carousel
      v-if="loaded"
      :interval="6000"
      :id="`carousel-${widget.id}`"
      controls
      indicators
      fade
    >
      <b-carousel-slide v-for="item in widget.items" :key="item.id">
        <template v-slot:img>
          <b-link v-if="item.url" :to="item.url" class="d-block">
            <video
              v-if="item.video"
              autoplay
              muted
              loop
              class="img-fluid w-100"
              :poster="`${$config.files.staticServerUrl}/${item.image}`"
            >
              <source :src="`${$config.files.staticServerUrl}/${item.video}`" type="video/mp4">
            </video>

            <b-img
              v-else
              :src="`${$config.files.staticServerUrl}/${item.image}`"
              fluid-grow
              :alt="item.title"
            />
          </b-link>

          <template v-else>
            <video
              v-if="item.video"
              autoplay
              muted
              loop
              class="img-fluid w-100"
              :poster="`${$config.files.staticServerUrl}/${item.image}`"
            >
              <source :src="`${$config.files.staticServerUrl}/${item.video}`" type="video/mp4">
            </video>

            <b-img
              v-else
              :src="`${$config.files.staticServerUrl}/${item.image}`"
              fluid-grow
              :alt="item.title"
            />
          </template>
        </template>

        <template v-if="!hasClass('hide-caption') && (item.title || item.description || item.url)">
          <h3 v-if="item.title" class="mb-4">
            {{ item.title }}
          </h3>

          <html-display v-if="item.description" :value="item.description" class="mb-4"/>
        </template>
      </b-carousel-slide>
    </b-carousel>

    <b-img
      v-else
      :src="`${$config.files.staticServerUrl}/${widget.items[0].image}`"
      fluid-grow
      :alt="widget.items[0].title"
    />
  </div>
</template>

<script>
import HtmlDisplay from '@/components/shared/HtmlDisplay'

export default {
  name: 'SliderDefault',
  components :{
    HtmlDisplay
  },
  props: {
    widget: { required: true }
  },
  data () {
    return {
      loaded: false
    }
  },
  mounted () {
    this.loaded = true
  },
  methods: {
    hasClass (key) {
      return this.widget.viewData && this.widget.viewData.includes(key)
    }
  }
}
</script>
