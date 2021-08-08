<template>
  <b-card v-if="items && items.length" class="search-groups" :header-class="collapsed ? 'p-0' : 'rounded-bottom p-0 bg-white'" no-body>
    <collapse-button slot="header" :title="$t('search.group')" :collapsed="collapsed" @toggle="toggleCollapse"/>
    
    <b-card-body v-show="collapsed" class="p-0">
      <b-list-group flush class="py-2">
        <div v-for="item in items" :key="item.id" class="item">
          <b-list-group-item
            :to="$api.products.getGroupPath(item.slug)"
            class="border-0 py-2 px-3 text-dark"
          >
            {{ item.name }}
          </b-list-group-item>
        </div>
      </b-list-group>
    </b-card-body>
  </b-card>
</template>

<script>
import CollapseButton from './shared/CollapseButton'

export default {
  name: 'ProductsGroups',
  components: {
    CollapseButton
  },
  props: {
    items: Array
  },
  data () {
    return {
      collapsed: true
    }
  },
  methods: {
    toggleCollapse () {
      this.collapsed = !this.collapsed
    }
  }
}
</script>
