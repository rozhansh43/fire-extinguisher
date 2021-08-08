<template>
  <div v-if="groups && groups.length">
        <h1>
      internal index nav
    </h1>
    <div v-if="sidebar" v-show="showItems" class="menu-bar menu-bar-light">
      <div v-for="(item, index) in filteredItems" :key="item.id">
        <b-nav-item
          :to="getTo(item)"
          @click="click(item, index)"
        >
          <div class="d-flex align-items-center">
            {{ item.name }}

            <font-awesome-icon
              v-if="(item.categories && item.categories.length) || (item.children && item.children.length)"
              :icon="activeItemIndex === index ? 'angle-up' : 'angle-down'"
              class="align-middle"
              :class="{ 'ml-auto': $dir.ltr, 'mr-auto': $dir.rtl }"
            />
          </div>
        </b-nav-item>

        <categories
          v-if="activeItem && activeItemIndex === index"
          :item="activeItem"
          :categories="categories"
          :sidebar="sidebar"
        />
      </div>
    </div>

    <div v-else class="menu-bar">
      <div class="mega-menu">
        <div v-show="showItems" class="overlay" @mouseenter="hideItems"></div>

        <div v-show="showItems" class="content">
          <b-row no-gutters class="align-items-stretch">
            <b-col cols="auto">
              <div class="bg-bright py-2 h-100">
                <b-nav-item
                  v-for="(item, index) in filteredItems"
                  :key="item.id"
                  class="item-root"
                  :class="{ 'hovered': index === activeItemIndex }"
                  :to="getPath(item)"
                  @mouseover="setActiveItemIndex(index)"
                >
                  <thumbnail
                    v-if="item.image"
                    :link="false"
                    :width="24"
                    :height="24"
                    :path="item.image"
                    :alt="item.name"
                    :class="{ 'mr-2': $dir.ltr, 'ml-2': $dir.rtl }"
                  />

                  {{ item.name }}
                </b-nav-item>
              </div>
            </b-col>

            <b-col class="text-dark">
              <categories
                v-if="activeItem"
                :item="activeItem"
                :categories="categories"
                :sidebar="sidebar"
                @clicked="hideItems"
              />
            </b-col>
          </b-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Categories from './Categories'
import Thumbnail from '@/components/shared/Thumbnail'
import vm from '@/lib/vm'

export default {
  name: 'ProductGroups',
  components: {
    Categories,
    Thumbnail
  },
  props: {
    sidebar: { type: Boolean, default: false }
  },
  data () {
    return {
      showItems: false,
      activeItemIndex: null,
      groups: this.$store.state.$productGroups
    }
  },
  computed: {
    filteredItems () {
      return this.$hasModule('products_groups') ? this.groups : this.groups[0].categories
    },
    activeItem () {
      return this.filteredItems && this.filteredItems.length && this.filteredItems[this.activeItemIndex]
    },
    categories () {
      return this.$hasModule('products_groups') ? this.activeItem.categories : this.activeItem.children
    }
  },
  mounted () {
    vm.$on('groups-click', () => {
      this.toggleItems()
    })
    
    vm.$on('groups-mouse-enter', () => {
      this.openItems()
    })
  },
  methods: {
    toggleItems () {
      this.activeItemIndex = this.sidebar ? null : 0
      this.showItems = !this.showItems
    },
    openItems () {
      this.activeItemIndex = this.sidebar ? null : 0
      this.showItems = true
    },
    hideItems () {
      this.activeItemIndex = this.sidebar ? null : 0
      this.showItems = false
    },
    getPath (item) {
      return this.$hasModule('products_groups') ? this.$api.products.getGroupPath(item.slug) : this.$api.products.getCategoryPath(null, item.slug)
    },
    setActiveItemIndex(index) {
      this.activeItemIndex = index
    },
    getTo (item) {
      if ((this.$hasModule('products_groups') && (!item.categories || !item.categories.length)) || (!this.$hasModule('products_groups') && (!item.children || !item.children.length))) {
        return this.getPath(item)
      }
    },
    click (item, index) {
      if ((item.categories && item.categories.length) || (item.children && item.children.length)) {
        this.toggleActiveItemIndex(index)
      }
    },
    toggleActiveItemIndex (index) {
      if (this.activeItemIndex === index) this.activeItemIndex = null
      else this.activeItemIndex = index
    }
  }
}
</script>

<style lang="scss">
.rounded-top-0 {
  border-top-right-radius : 0 !important;
  border-top-left-radius: 0 !important;
}

.transform-custom {
  transform: translate3d(0,0,0) !important;
  top: 100% !important;
}

.menu-design {
  border-top: 2px solid transparent;
  border-bottom: 2px solid transparent;

  &:hover , &:active{
    border-bottom-color: red ;
  }
}
</style>
