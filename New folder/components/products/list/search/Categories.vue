<template>
  <div class="search-categories">
    <b-card :header-class="collapsed ? 'p-0' : 'rounded-bottom p-0 bg-white'" no-body>
      <collapse-button slot="header" :title="$t('search.category')" :collapsed="collapsed" @toggle="toggleCollapse"/>
      
      <b-card-body v-show="collapsed" class="p-0">
        <categories-display
          :group="group"
          :items="items"
          :active-item="activeItem"
        />
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import CategoriesDisplay from '@/components/shared/CategoriesDisplay'
import CollapseButton from './shared/CollapseButton'

export default {
  name: 'Categories',
  components: {
    CategoriesDisplay,
    CollapseButton
  },
  props: {
    group: { type: Object, required: true },
    items: { type: Array, default: () => []},
    activeItem: Object
  },
  data () {
    return {
      collapsed: true
    }
  },
  created () {
    if (this.activeItem)
      this.collapsed = true
  },
  methods: {
    toggleCollapse () {
      this.collapsed = !this.collapsed
    }
  }
}
</script>
