<template>
  <div
    v-if="widget.data && widget.data.group && widget.data.categories && widget.data.categories.length"
    class="search-categories"
  >

  <h1>
    product category nav
  </h1>
    <h2 v-if="widget.title && !titleInHeader" class="widget-title h4 text-center mb-5">
      {{ widget.title }}
    </h2>
    
    <p v-if="widget.subtitle && !titleInHeader" class="widget-subtitle text-center mb-5 text-muted">
      {{ widget.subtitle }}
    </p>

    <b-card
      :header="widget.title && titleInHeader ? widget.title : null"
      no-body
    >
      <categories-display
        :group="widget.data.group"
        :items="widget.data.categories"
      />
    </b-card>
  </div>
</template>

<script>
import CategoriesDisplay from '@/components/shared/CategoriesDisplay'

export default {
  name: 'ProdcutCategoriesNav',
  components: {
    CategoriesDisplay
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
