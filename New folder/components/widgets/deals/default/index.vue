<template>
  <div v-if="widget.data && widget.data.length">
    <b-row>
      <b-col sm="6" md="4" lg="3" class="d-flex flex-column align-items-center">
        <countdown
          :value="countdown"
          class="h5 text-center mb-4 mb-lg-5 py-2 px-4 rounded-pill"
          :class="countdownClass"
          :icon-class="countdownClass"
        />

        <div>
          <h2 v-if="widget.title" class="h3 text-center mb-4 mb-lg-5">
            {{ widget.title }}
          </h2>

          <p v-if="widget.subtitle" class="text-center mb-4 mb-lg-5 text-muted">
            {{ widget.subtitle }}
          </p>
        </div>

        <thumbnail
          v-if="widget.image"
          :link="false"
          :width="175"
          :height="175"
          :path="widget.image"
          :alt="widget.title"
          class="rounded mb-4 mb-lg-5"
        />

        <div v-if="widget.url" class="mt-auto mb-4 mb-lg-0">
          <b-btn :variant="btnVariant" class="px-4" :to="widget.url">
            <font-awesome-icon
              icon="plus"
              size="sm"
              class="align-middle"
              :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
            />

            {{ $t('shared.more') }}
          </b-btn>
        </div>
      </b-col>

      <b-col sm="6" md="8" lg="9" class="text-dark">
        <carousel
          v-if="showCarousel"
          :rtl="$dir.rtl"
          :per-page="1"
          :per-page-custom="perPageCustom"
          loop
          :pagination-enabled="false"
          autoplay-hover-pause
          :scroll-per-page="false"
          navigation-enabled
          :navigation-next-label="nextLabel"
          :navigation-prev-label="prevLabel"
        >
          <slide v-for="item in widget.data" :key="item.id" class="px-2">
            <item
              :value="item"
              :type="getType(item.typeId)"
              :variant="hasClass('bg-white') ? 'bright' : 'white'"
            />
          </slide>
        </carousel>

        <b-row v-else>
          <b-col v-for="(item, index) in widget.data" :key="index" md="3" class="mb-3">
            <item
              :value="item"
              :type="getType(item.typeId)"
              :variant="hasClass('bg-white') ? 'bright' : 'white'"
            />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Countdown from '@/components/shared/Countdown'
import Item from './Item'
import Thumbnail from '@/components/shared/Thumbnail'

export default {
  name: 'DealsDefault',
  components: {
    Countdown,
    Item,
    Thumbnail
  },
  props: {
    widget: { required: true },
    perPageCustom: { type: Array, default: () => [[576, 1], [768, 2], [992, 3], [1200, 4]] }
  },
  data () {
    return {
      showCarousel: false
    }
  },
  computed: {
    nextLabel () {
      return `
      <svg viewBox="0 0 224 512" class="svg-inline--fa fa-2x">
        <path fill="currentColor" d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z" class=""></path>
      </svg>`
    },
    prevLabel () {
      return `
      <svg viewBox="0 0 225 512" class="svg-inline--fa fa-2x">
        <path fill="currentColor" d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z" class=""></path>
      </svg>`
    },
    titleInHeader () {
      return this.hasClass('title-in-header')
    },
    btnVariant () {
      const textClass = this.widget.viewData && this.widget.viewData.match(/text\S+/g)
      return textClass && textClass[0] && `outline-${textClass[0].split('-')[1]}`
    },
    countdown () {
      return this.widget.data[0].models[0].articles[0].packages[0].salePlans[0].dealEndDate
    },
    countdownClass () {
      const result = []
      
      const textClass = this.widget.viewData && this.widget.viewData.match(/bg\S+/g)
      const bgClass = this.widget.viewData && this.widget.viewData.match(/text\S+/g)

      if (textClass && textClass[0]) result.push(`text-${textClass[0].split('-')[1]}`)
      else result.push('text-dark')

      if (bgClass && bgClass[0]) result.push(`bg-${bgClass[0].split('-')[1]}`)
      else result.push('bg-white')
      
      return result.join().replace(',', ' ')
    }
  },
  mounted () {
    this.showCarousel = true
  },
  methods: {
    getType (typeId) {
      return this.$store.state.$productTypes &&
        this.$store.state.$productTypes.length
        ? this.$store.state.$productTypes.find(o => o.id === typeId) : null
    },
    hasClass (key) {
      return this.widget.viewData && this.widget.viewData.includes(key)
    }
  }
}
</script>
