<template>
  <div v-if="filteredItems && filteredItems.length">
        <h1>
      index nav
    </h1>
    <div v-if="sidebar" class="d-flex py-3">
      <b-btn
        variant="link"
        class="p-0 text-white navbar-toggler"
        :class="{ 'ml-auto': $dir.ltr, 'mr-auto': $dir.rtl }"
        v-b-toggle="`navbar-${id}-sidebar`"
      >
        <font-awesome-icon
          :icon="sidebarShown ? 'times' : 'bars'"
          class="align-middle"
          size="lg"
        />
      </b-btn>
      
      <b-sidebar
        :id="`navbar-${id}-sidebar`"
        :right="$dir.rtl"
        bg-variant="primary"
        backdrop-variant="dark"
        backdrop
        shadow
        no-header
        :sidebar-class="['sidebar', { 'sidebar-light': type === 'light', 'sidebar-dark': type === 'dark' }]"
        @change="toggleSidebarShown"
      >
        <b-link v-if="$settings.branding.logoAlt" href="/" class="text-center d-block p-3">
          <thumbnail
            :path="$settings.branding.logoAlt"
            :alt="$settings.branding.name"
            fit-in
            :width="208"
            :height="40"
            :link="false"
            :quality="90"
          />
        </b-link>

        <b-nav vertical tag="div">
          <item
            v-for="item in filteredItems"
            :key="item.id"
            :items="filteredItems"
            :item="item"
            :all="items"
            :sidebar="sidebar"
          />
        </b-nav>
      </b-sidebar>
    </div>
    
    <b-navbar
      v-else
      :toggleable="toggleable"
      vertical
      :type="type"
      class="justify-content-between"
      :class="{'navbar-expand': toggleable === 'expand'}"
    >
      <b-navbar-toggle :target="`navbar-${id}-collapse`"/>

      <b-navbar-brand v-if="navbarBrand" href="/" class="py-0" :class="`order-${toggleable}-2`">
        <thumbnail
          :path="$settings.branding.logo"
          :alt="$settings.branding.name"
          fit-in
          :width="208"
          :height="40"
          :link="false"
          :quality="90"
          class="my-2 py-1"
        />
      </b-navbar-brand>

      <b-collapse :id="`navbar-${id}-collapse`" is-nav v-model="showCollapse">
        <b-navbar-nav :align="align" class="w-100" tag="div">
          <item v-for="item in filteredItems" :key="item.id" :items="filteredItems" :item="item" :all="items"/>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import Item from './Item'
import Thumbnail from '@/components/shared/Thumbnail'
import { mapState } from 'vuex'

export default {
  name: 'Menu',
  components: {
    Item,
    Thumbnail
  },
  props: {
    items: Array,
    id: String,
    toggleable: { type: String, default: 'lg' },
    navbarBrand: { type: Boolean, default: false },
    align: { type: String, default: null },
    type: { type: String, default: 'dark' },
    sidebar: { type: Boolean, default: false }
  },
  data () {
    return {
      sidebarShown: false,
      showCollapse: false
    }
  },
  computed: {
    ...mapState(['$settings']),
    filteredItems () {
      return this.items && this.items.length ? this.items.filter(i => !i.parentId) : null
    }
  },
  watch: {
    '$route' () {
      this.showCollapse = false
    }
  },
  methods: {
    toggleSidebarShown () {
      this.sidebarShown = !this.sidebarShown
    }
  }
}
</script>
