<template>
  <div v-if="widget.data && widget.data.length">
    <h1>
      product default
    </h1>
    <h2 v-if="widget.title && !titleInHeader" class="widget-title h4 text-center mb-5">
      {{ widget.title }}
    </h2>

    <p v-if="widget.subtitle && !titleInHeader" class="widget-subtitle text-center mb-5 text-muted">
      {{ widget.subtitle }}
    </p>

    <b-card :class="cardClass" :bg-variant="cardVariant" no-body>
      <b-card-header
        v-if="titleInHeader && (widget.title || widget.url)"
        class="d-flex align-items-center"
        :class="widget.title ? 'justify-content-between' : 'justify-content-end'"
        :header-bg-variant="cardHeaderVariant"
      >
        <div v-if="widget.title || widget.subtitle">
          <div v-if="widget.title">
            {{ widget.title }}
          </div>

          <small v-if="widget.subtitle" class="text-muted">
            {{ widget.subtitle }}
          </small>
        </div>

        <b-link
          v-if="widget.url"
          :to="widget.url"
          class="inherited-link"
        >
          <font-awesome-icon
            icon="plus"
            size="sm"
            class="align-middle"
            :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
          />

          {{ $t('shared.more') }}
        </b-link>
      </b-card-header>

      <b-card-body :body-class="cardBodyClass">
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
              :card-item-variant="cardItemVariant"
              :item-title-class="itemTitleClass"
              :item-target="itemTarget"
            />
          </slide>
        </carousel>

        <b-row v-else>
          <b-col v-for="(item, index) in widget.data" :key="index" sm="6" md="4" lg="3" class="mb-3">
            <item
              :value="item"
              :type="getType(item.typeId)"
              :card-item-variant="cardItemVariant"
              :item-title-class="itemTitleClass"
              :item-target="itemTarget"
            />
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>

    <div v-if="widget.url && !titleInHeader" class="text-center">
      <b-btn variant="outline-primary" :to="widget.url" class="px-4 mb-3">
        <font-awesome-icon
          icon="plus"
          size="sm"
          class="align-middle"
          :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
        />

        {{ $t('shared.more') }}
      </b-btn>
    </div>
  </div>
</template>

<script>
import Item from './Item'

export default {
  name: 'ProductsDefault',
  components: {
    Item
  },
  props: {
    widget: { required: true },
    cardClass: String,
    cardBodyClass: String,
    cardVariant: String,
    cardHeaderVariant: { type: String, default: 'bright' },
    cardItemVariant: String,
    perPageCustom: { type: Array, default: () => [[0, 1], [576, 2], [768, 3], [992, 4], [1200, 5]] },
    itemTitleClass: String,
    itemTarget: String
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
