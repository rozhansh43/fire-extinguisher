<template>
  <div>
    <b-nav v-if="sidebar" vertical tag="div" :class="{ 'ml-3': $dir.ltr, 'mr-3': $dir.rtl }">
      <div v-for="rootCategory in categories" :key="rootCategory.id">
        <b-nav-item
          :to="getTo(rootCategory)"
          @click="click(rootCategory)"
        >
          <div class="d-flex align-items-center">
            {{ rootCategory.name }}

            <font-awesome-icon
              v-if="rootCategory.children && rootCategory.children.length"
              :icon="activeCategoryId === rootCategory.id ? 'angle-up' : 'angle-down'"
              class="align-middle"
              :class="{ 'ml-auto': $dir.ltr, 'mr-auto': $dir.rtl }"
            />
          </div>
        </b-nav-item>

        <b-nav
          v-if="rootCategory.children && rootCategory.children.length"
          v-show="rootCategory.id === activeCategoryId"
          vertical
          tag="div"
          :class="{ 'ml-3': $dir.ltr, 'mr-3': $dir.rtl }"
        >
          <div v-for="category in rootCategory.children" :key="category.id">
            <b-nav-item :to="getCategoryPath(group.slug, category.slug)">
              {{ category.name }}
            </b-nav-item>
          </div>
        </b-nav>
      </div>
    </b-nav>
    
    <b-navbar v-else>
      <ul class="navbar-nav w-100 position-relative">
        <li
          v-for="rootCategory in categories"
          :key="rootCategory.id"
          class="nav-item"
          @mouseenter="showSubCategories(rootCategory.id)"
          @mouseleave="hideSubCategories"
        >
          <b-link
            class="nav-link"
            :to="getCategoryPath(group.slug, rootCategory.slug)"
            :active="rootCategory.id === activeCategoryId"
          >
            {{ rootCategory.name }}

            <font-awesome-icon
              v-if="rootCategory.children && rootCategory.children.length"
              icon="caret-down"
              class="align-middle"
            />
          </b-link>

          <ul
            v-if="rootCategory.children && rootCategory.children.length && rootCategory.id === activeCategoryId"
            class="mega-menu border-top px-4 pt-3 pb-0 nav-columns"
          >
            <li v-for="category in rootCategory.children" :key="category.id" class="nav-item">
              <b-link
                class="inherited-link font-weight-bold d-block mb-3 nav-link p-0"
                :to="getCategoryPath(group.slug, category.slug)"
                @click="emitClicked"
              >
                {{ category.name }}
              </b-link>

              <ul v-if="category.children && category.children.length" class="p-0">
                <li v-for="childCategory in category.children" :key="childCategory.id" class="nav-item">
                  <b-link
                    class="inherited-link-muted d-block mb-3 nav-link p-0"
                    :to="getCategoryPath(group.slug, childCategory.slug)"
                    @click="emitClicked"
                  >
                    {{ childCategory.name }}
                  </b-link>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'Categories',
  props: {
    categories: { type: Array, defualt: () => [] },
    group: { type: Object, required: true },
    sidebar: { type: Boolean, default: false }
  },
  data () {
    return {
      activeCategoryId: null
    }
  },
  methods: {
    getCategoryPath (groupSlug, categorySlug) {
      return this.$api.products.getCategoryPath(this.$hasModule('products_groups') ? groupSlug : null, categorySlug)
    },
    showSubCategories (categoryId) {
      this.activeCategoryId = categoryId
    },
    hideSubCategories () {
      this.activeCategoryId = null
    },
    emitClicked () {
      this.$emit('clicked')
    },
    getTo (item) {
      if (!item.children || !item.children.length) {
        return this.getCategoryPath(this.group.slug, item.slug)
      }
    },
    click (item) {
      if (item.children && item.children.length) {
        this.toggleActiveCategoryId(item.id)
      }
    },
    toggleActiveCategoryId (itemId) {
      if (this.activeCategoryId === itemId) this.activeCategoryId = null
      else this.activeCategoryId = itemId
    }
  }
}
</script>
