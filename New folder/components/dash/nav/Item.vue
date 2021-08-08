<template>
  <div v-if="allowed(item)" class="px-3">
    <hr v-if="hasComponent(item, 'divider')" class="my-0"/>

    <template v-else>
      <div class="d-flex align-items-center dash-nav-item">
        <b-list-group-item
          :to="item.url"
          class="px-0 d-flex align-items-center list-group-item-action"
          :class="{'nuxt-link-exact-active': active}"
          :button="hasChildren(item) || hasComponent(item, 'logout')"
          @click="click(item)"
        >
          <font-awesome-icon
            v-if="item.icon"
            :icon="item.icon"
            fixed-width
            :class="{'mr-2': $dir.ltr, 'ml-2': $dir.rtl}"
          />

          <span v-if="item.title">
            {{ $t(item.title) }}
          </span>

          <font-awesome-icon
            v-if="hasChildren(item)"
            :icon="expanded ? 'angle-up' : 'angle-down'"
            class="icon-toggle"
            :class="{'ml-auto': $dir.ltr, 'mr-auto': $dir.rtl}"
          />
        </b-list-group-item>
      </div>

      <template v-if="hasChildren(item)">
        <div v-show="expanded">
          <item v-for="(child, index) in item.children" :key="index" :item="child" @expand="expand"/>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import vm from '@/lib/vm'

export default {
  name: 'Item',
  props: {
    item: Object
  },
  data () {
    return {
      expanded: false,
      active: false
    }
  },
  watch: {
    '$route.fullPath' (val) {
      this.checkActive(val)
    }
  },
  mounted () {
    this.checkActive(this.$route.fullPath)
  },
  methods: {
    allowed (item) {
      return this.$api.account.checkRolesAndStatuses(item)
    },
    checkActive (path) {
      this.active = false
      this.expanded = false
      
      this.$nextTick(() => {
        if (path === this.item.url) {
          if (this.hasChildren(this.item))
            this.expanded = true
          this.$emit('expand')
        }
      })
    },
    hasChildren (item) {
      return item.children && !!item.children.length
    },
    toggle () {
      this.expanded = !this.expanded
    },
    expand () {
      this.expanded = true
      this.active = true
    },
    hasComponent (item, component) {
      return item && item.component === component
    },
    click (item) {
      if (this.hasComponent(item, 'logout'))
        this.logout()
      else
        this.toggle()
    },
    logout () {
      vm.$emit('logout')
    }
  }
}
</script>
