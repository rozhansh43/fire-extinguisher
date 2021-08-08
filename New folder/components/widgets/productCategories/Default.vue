<template>
  <div v-if="widget.data && widget.data.group && widget.data.categories && widget.data.categories.length">
    <h1>
      product category
    </h1>
    <h2 v-if="widget.title" class="widget-title h4 text-center mb-5">
      {{ widget.title }}
    </h2>

    <p v-if="widget.subtitle" class="widget-subtitle text-center mb-5 text-muted">
      {{ widget.subtitle }}
    </p>

    <b-row>
      <b-col v-for="item in rootCategories" :key="item.id" sm="6" md="4" lg="3" class="mb-3">
        <b-link :to="getCategoryPath(widget.data.group.slug, item.slug)" class="d-block h-100 inherited-link">
          <b-card class="mb-0 h-100" body-class="pb-0">
            <b-row class="align-items-center h-100">
              <b-col v-if="item.image" cols="auto">
                <thumbnail
                  :link="false"
                  :width="65"
                  :height="65"
                  :path="item.image"
                  :alt="item.name"
                  class="rounded mb-3"
                />
              </b-col>

              <b-col>
                <h6 class="text-justify">
                  {{ item.name }}
                </h6>
              </b-col>
            </b-row>
          </b-card>
        </b-link>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Thumbnail from '@/components/shared/Thumbnail'

export default {
  name: 'ProductCategoriesDefault',
  components: {
    Thumbnail
  },
  props: {
    widget: { required: true }
  },
  computed: {
    rootCategories () {
      return this.widget.data && this.widget.data.categories && this.widget.data.categories.length
      ? this.widget.data.categories.filter(o => o.parentIds && o.parentIds.length === 1)
      : null
    }
  },
  methods: {
    getCategoryPath (groupSlug, categorySlug) {
      return this.$api.products.getCategoryPath(this.$hasModule('products_groups') ? groupSlug : null, categorySlug)
    },
    hasClass (key) {
      return this.widget.viewData && this.widget.viewData.includes(key)
    }
  }
}
</script>
