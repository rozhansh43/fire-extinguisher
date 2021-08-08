<template>
  <div>
    <div class="d-flex align-items-center justify-content-between item">
      <b-list-group-item
        :to="getCategoryPath(group.slug, item.slug)"
        class="border-0 py-2 px-3"
        :class="{'font-weight-bold text-link-active': isActive(item), 'text-dark': !isActive(item)}"
      >
        {{ item.name }}
      </b-list-group-item>

      <b-btn
        v-if="getChildren(item).length"
        variant="link inherited-link"
        class="py-2 px-3"
        @click="toggleCollapse"
      >
        <font-awesome-icon :icon="collapsed ? 'angle-up' : 'angle-down'" class="align-middle"/>
      </b-btn>
    </div>

    <div v-if="getChildren(item).length" v-show="collapsed" :class="{'ml-3 border-left': $dir.ltr, 'mr-3 border-right': $dir.rtl}">
      <item
        v-for="child in getChildren(item)"
        :key="child.id"
        :item="child"
        :items="items"
        :group="group"
        :active-item="activeItem"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Item',
  props: {
    item: Object,
    items: Array,
    group: Object,
    activeItem: Object
  },
  data () {
    return {
      collapsed: false
    }
  },
  created () {
    if (this.isActive(this.item)) this.collapsed = true
  },
  methods: {
    isActive (item) {
      return this.activeItem && (this.activeItem.id === item.id || this.activeItem.parentIds.find(i => i === item.id))
    },
    getCategoryPath (groupSlug, categorySlug) {
      return this.$api.products.getCategoryPath(this.$hasModule('products_groups') ? groupSlug : null, categorySlug)
    },
    getChildren (item) {
      return this.items.filter(i => i.parentIds[1] === item.id) || []
    },
    toggleCollapse () {
      this.collapsed = !this.collapsed
    }
  }
}
</script>
