<template>
  <div v-if="widget.data && widget.data.length">
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
          <b-col v-for="item in widget.data" :key="item.id" sm="6" md="4" lg="3" class="mb-3">
            <b-card no-body class="mb-0 h-100 shadow-none" bg-variant="bright">
              <b-link :to="getItemPath(item)" class="d-block">
                <thumbnail
                  :link="false"
                  :width="720"
                  :height="405"
                  :path="item.image"
                  :alt="item.title"
                  fluid-grow
                  show-no-image
                  class="card-img-top"
                />
              </b-link>

              <b-card-body class="pb-0 d-flex flex-column">
                <h6 class="text-justify">
                  <b-link :to="getItemPath(item)" class="inherited-link">
                    {{ item.title }}
                  </b-link>
                </h6>
                
                <b-row class="mt-auto align-items-center justify-content-between">
                  <b-col class="mb-3">
                    <b-link class="inherited-link" :to="`/blog/${item.primaryCategory.slug}`">
                      {{ item.primaryCategory.name }}
                    </b-link>
                  </b-col>

                  <b-col v-if="item.published" lg="auto" :class="{ 'text-lg-right': $dir.ltr, 'text-lg-left': $dir.rtl }" class="mb-3">
                    <date-display
                      :value="item.published"
                      class="text-muted"
                      icon-class="text-muted"
                      :title="$t('widgets.posts.publishDate')"
                      v-b-tooltip
                    />
                  </b-col>
                </b-row>

                <div class="mb-3" style="height:124px">
                  <p v-if="item.excerpt" class="mb-0 text-muted text-justify">
                    {{ item.excerpt }}
                  </p>
                </div>

                <b-btn :to="getItemPath(item)" block variant="primary" class="mb-3">
                  {{ $t('shared.view') }}
                </b-btn>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import DateDisplay from '@/components/shared/DateDisplay'
import Thumbnail from '@/components/shared/Thumbnail'

export default {
  name: 'PostsDefault',
  components: {
    DateDisplay,
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
    getItemPath (item) {
      return `/blog/${item.primaryCategory.slug}/${item.slug}`
    },
    hasClass (key) {
      return this.widget.viewData && this.widget.viewData.includes(key)
    }
  }
}
</script>
