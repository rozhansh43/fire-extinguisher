<template>
  <div v-if="groups && groups.length" class="product-groups bg-bright">
    <b-container class="px-3 px-lg-0">
      <div v-if="sidebar" class="d-flex py-3">
        <b-btn
          variant="link"
          class="p-0 text-dark navbar-toggler"
          :class="{ 'ml-auto': $dir.ltr, 'mr-auto': $dir.rtl }"
          v-b-toggle="'product-groups-sidebar'"
        >
          <font-awesome-icon
            :icon="sidebarShown ? 'times' : 'bars'"
            class="align-middle"
            size="lg"
          />
        </b-btn>
        
        <b-sidebar
          :id="'product-groups-sidebar'"
          :right="$dir.rtl"
          bg-variant="bright"
          backdrop-variant="dark"
          backdrop
          shadow
          no-header
          sidebar-class="sidebar sidebar-light"
          @change="toggleSidebarShown"
        >
          <b-link v-if="$settings.branding.logo" href="/" class="text-center d-block p-3">
            <thumbnail
              :path="$settings.branding.logo"
              :alt="$settings.branding.name"
              fit-in
              :width="208"
              :height="40"
              :link="false"
              :quality="90"
            />
          </b-link>

          <b-nav vertical tag="div">
            <div v-for="group in groups" :key="group.id">
              <b-nav-item
                :to="getTo(group)"
                @click="click(group)"
              >
                <div class="d-flex align-items-center">
                  {{ group.name }}

                  <font-awesome-icon
                    v-if="group.categories && group.categories.length"
                    :icon="activeGroupId === group.id ? 'angle-up' : 'angle-down'"
                    class="align-middle"
                    :class="{ 'ml-auto': $dir.ltr, 'mr-auto': $dir.rtl }"
                  />
                </div>
              </b-nav-item>

              <categories
                v-if="group.categories && group.categories.length"
                v-show="group.id === activeGroupId"
                :group="group"
                :categories="group.categories"
                :sidebar="sidebar"
              />
            </div>
          </b-nav>
        </b-sidebar>
      </div>
      
      <b-navbar
        v-else
        toggleable="lg"
        vertical
        type="light"
        class="justify-content-between"
      >
        <b-collapse :id="`product-groups-collapse`" is-nav v-model="showCollapse">
          <b-navbar-nav class="w-100 position-relative">
            <li
              v-for="group in groups"
              :key="group.id"
              class="d-none d-lg-block nav-item"
              @mouseenter="showCategories(group.id)"
              @mouseleave="hideCategories"
            >
              <b-link
                class="nav-link"
                :to="getGroupPath(group)"
                :active="group.id === activeGroupId"
              >
                {{ group.name }}

                <font-awesome-icon
                  v-if="group.categories && group.categories.length"
                  icon="caret-down"
                  class="align-middle"
                />
              </b-link>

              <div v-if="group.categories && group.categories.length" v-show="group.id === activeGroupId" class="mega-menu">
                <categories
                  :group="group"
                  :categories="group.categories"
                  :sidebar="sidebar"
                  @clicked="hideCategories"
                />
              </div>
            </li>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </b-container>
  </div>
</template>

<script>
import Categories from './Categories'
import Thumbnail from '@/components/shared/Thumbnail'
import { mapState } from 'vuex'

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
      sidebarShown: false,
      showCollapse: false,
      activeGroupId: null,
      groups: this.$store.state.$productGroups
    }
  },
  computed: {
    ...mapState(['$settings'])
  },
  watch: {
    '$route' () {
      this.showCollapse = false
    }
  },
  methods: {
    showCategories (groupId) {
      this.activeGroupId = groupId
    },
    hideCategories () {
      this.activeGroupId = null
    },
    getGroupPath (group) {
      return this.$api.products.getGroupPath(group.slug)
    },
    toggleSidebarShown () {
      this.sidebarShown = !this.sidebarShown
    },
    getTo (item) {
      if (!item.categories || !item.categories.length) {
        return this.getGroupPath(item)
      }
    },
    click (item) {
      if (item.categories && item.categories.length) {
        this.toggleActiveGroupId(item.id)
      }
    },
    toggleActiveGroupId (itemId) {
      if (this.activeGroupId === itemId) this.activeGroupId = null
      else this.activeGroupId = itemId
    }
  }
}
</script>
