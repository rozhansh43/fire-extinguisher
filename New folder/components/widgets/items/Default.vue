<template>
  <div v-if="widget.items && widget.items.length">
    <h2 v-if="widget.title && !titleInHeader" class="widget-title h4 text-center mb-5">
      {{ widget.title }}
    </h2>

    <p v-if="widget.subtitle && !titleInHeader" class="widget-subtitle text-center mb-5 text-muted">
      {{ widget.subtitle }}
    </p>

    <b-card no-body>
      <b-card-header
        v-if="titleInHeader && (widget.title || widget.url)"
        class="d-flex align-items-center"
        :class="widget.title ? 'justify-content-between' : 'justify-content-end'"
        header-bg-variant="bright"
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

      <b-card-body class="pb-0">
        <b-row>
          <b-col v-for="item in widget.items" :key="item.id" sm="6" md="4" lg="3" class="mb-3">
            <b-link v-if="item.url" :to="item.url" class="d-block h-100 inherited-link">
              <b-card no-body class="mb-0 h-100 shadow-none" bg-variant="bright">
                 <video
                  v-if="item.video"
                  :width="720"
                  :height="405"
                  controls
                  class="img-fluid"
                  :poster="`${$config.files.staticServerUrl}/${item.image}`"
                >
                  <source :src="`${$config.files.staticServerUrl}/${item.video}`" type="video/mp4">
                </video>

                <thumbnail
                  v-else
                  :link="false"
                  :width="720"
                  :height="405"
                  :path="item.image"
                  :alt="item.title"
                  fluid-grow
                  show-no-image
                  class="card-img-top"
                />

                <b-card-body class="pb-0">
                  <h6 class="text-justify">
                    {{ item.title }}
                  </h6>
                  
                  <html-display v-if="item.description" :value="item.description"/>
                </b-card-body>
              </b-card>
            </b-link>

            <b-card v-else no-body class="mb-0 h-100 shadow-none" bg-variant="bright">
              <video
                v-if="item.video"
                :width="720"
                :height="405"
                controls
                class="img-fluid"
                :poster="`${$config.files.staticServerUrl}/${item.image}`"
              >
                <source :src="`${$config.files.staticServerUrl}/${item.video}`" type="video/mp4">
              </video>

              <thumbnail
                v-else
                :link="false"
                :width="720"
                :height="405"
                :path="item.image"
                :alt="item.title"
                fluid-grow
                show-no-image
                class="card-img-top"
              />

              <b-card-body class="pb-0">
                <h6 class="text-justify">
                  {{ item.title }}
                </h6>
                
                <html-display v-if="item.description" :value="item.description"/>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import HtmlDisplay from '@/components/shared/HtmlDisplay'
import Thumbnail from '@/components/shared/Thumbnail'

export default {
  name: 'ItemsDefault',
  components: {
    HtmlDisplay,
    Thumbnail
  },
  props: {
    widget: { required: true }
  },
  computed: {
    titleInHeader () {
      return this.hasClass('title-in-header')
    }
  },
  methods: {
    hasClass (key) {
      return this.widget.viewData && this.widget.viewData.includes(key)
    }
  }
}
</script>
