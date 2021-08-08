<template>
  <span>
    <template v-if="!hasClass(item, 'dropdown-component') && (item.component || !getChilds(item).length)">
      <b-nav-item
        :class="[item.viewData, { 'open-on-hover': item.component === 'groups' }]"
        exact
        :target="item.target"
        :to="getTo(item)"
        :href="getHref(item)"
        @click="click(item)"
        @mouseenter="mouseEnter(item)"
      >
        <div class="d-flex align-items-center">
          <font-awesome-icon
            v-if="item.icon"
            :icon="item.icon"
            fixed-width
            class="align-middle icon"
          />

          <bdi
            class="title"
            :class="[
              { 'ml-2': $dir.ltr && item.icon },
              { 'mr-2': $dir.ltr && hasClass(item, 'caret') },
              { 'mr-2': $dir.rtl && item.icon },
              { 'ml-2': $dir.rtl && hasClass(item, 'caret') }
            ]"
          >
            {{ item.title }}
          </bdi>

          <font-awesome-icon
            v-if="hasClass(item, 'caret')"
            icon="angle-down"
            class="align-middle"
            :class="{ 'ml-auto': $dir.ltr, 'mr-auto': $dir.rtl }"
          />
        </div>
      </b-nav-item>

      <component
        v-if="getComponentName(item)"
        :class="item.viewData"
        :is="getComponentName(item)"
        :sidebar="sidebar"
      />
    </template>

    <b-nav-item-dropdown
      v-else
      :right="hasClass(item, 'dd-reverse')"
      :class="item.viewData"
      class="mx-md-0 py-0"
    >
      <template slot="text">
        <font-awesome-icon
          v-if="item.icon"
          :icon="item.icon"
          fixed-width
          class="align-middle icon"
        />

        <bdi class="title" :class="{ 'ml-2': $dir.ltr && item.icon, 'mr-2': $dir.rtl && item.icon }">
          {{ item.title }}
        </bdi>
      </template>

      <template v-if="getChilds(item) && getChilds(item).length">
        <template v-for="child in getChilds(item)">
          <b-dropdown-divider v-if="hasClass(child, 'divider')" :key="child.id" class="my-3"/>

          <b-dropdown-item
            v-else
            :key="child.id"
            :target="child.target"
            class="py-0 no-py-on-link"
            exact
            :to="getTo(child)"
            :href="getHref(child)"
            @click="click(child)"
            @mouseenter="mouseEnter(child)"
          >
            <font-awesome-icon
              v-if="child.icon"
              :icon="child.icon"
              fixed-width
              class="align-middle text-muted icon"
              :class="{'mr-1': $dir.ltr, 'ml-1': $dir.rtl}"
            />

            <bdi class="title">{{child.title}}</bdi>
          </b-dropdown-item>

          <component
            v-if="getComponentName(child)"
            :key="child.id"
            :is="getComponentName(child)"
            :sidebar="sidebar"
          />
        </template>
      </template>

      <component
        v-else
        :class="item.viewData"
        :is="getComponentName(item)"
        :sidebar="sidebar"
      />
    </b-nav-item-dropdown>
  </span>
</template>

<script>
import vm from '@/lib/vm'

export default {
  name: 'Item',
  components: {
    contact: () => import('./components/Contact'),
    groups: () => import('./components/ProductGroups')
  },
  props: {
    all: { type: Array, required: true },
    items: { type: Array, required: true },
    item: { type: Object, required: true },
    sidebar: { type: Boolean, default: false }
  },
  methods: {
    getChilds (item) {
      return this.all.filter(i => i.parentId === item.id)
    },
    hasClass (item, className) {
      return item.viewData && item.viewData.split(' ').includes(className)
    },
    getComponentName (item) {
      return (item.component && item.component !== 'logout') ? item.component.toLowerCase() : null
    },
    getTo (item) {
      return (!this.getHref(item) && item.url) || null
    },
    getHref (item) {
      return ((this.hasClass(item, 'external') || (!item.component && item.target === '_blank')) && item.url) || null
    },
    click (item) {
      if (item.component === 'logout')
        this.logout()
      else
        vm.$emit(`${this.getComponentName(item)}-click`, item)
    },
    mouseEnter (item) {
      if (!this.sidebar) vm.$emit(`${this.getComponentName(item)}-mouse-enter`, item)
    },
    logout () {
      vm.$emit('logout')
    }
  }
}
</script>

<style>
.no-pd-on-link a {
  padding-top: 0;
  padding-bottom: 0;
}
.open-on-hover {
  position: relative;
  z-index: 1040;
}
</style>
