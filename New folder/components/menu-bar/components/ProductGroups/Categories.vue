<template>
  <div class="px-4 pt-3" style="overflow-x: auto">
        <h1>
      category nav
    </h1>
    <b-link class="inherited-link font-weight-bold d-block mb-3" :to="getPath(item.slug)" @click="emitClicked">
      {{ $t('products.allCategoriesOf', { parent: item.name }) }}

      <font-awesome-icon
        :icon="$dir.ltr ? 'angle-right' : 'angle-left'"
        :class="{ 'ml-2': $dir.rtl, 'mr-2': $dir.ltr }"
      />
    </b-link>

    <div class="nav-columns">
      <template v-if="categories && categories.length">
        <div v-for="rootCategory in categories" :key="rootCategory.id">
          <b-link class="inherited-link font-weight-bold d-block mb-3" :to="getCategoryPath(item.slug, rootCategory.slug)" @click="emitClicked">
            <thumbnail
              v-if="rootCategory.icon"
              :link="false"
              :width="24"
              :height="24"
              :path="rootCategory.icon"
              :alt="rootCategory.name"
              :class="{ 'mr-2': $dir.ltr, 'ml-2': $dir.rtl }"
            />

            {{ rootCategory.name }}

            <font-awesome-icon
              :icon="$dir.ltr ? 'angle-right' : 'angle-left'"
              :class="{ 'ml-2': $dir.rtl, 'mr-2': $dir.ltr }"
            />
          </b-link>

          <template v-if="rootCategory.children && rootCategory.children.length">
            <div v-for="childCategory in rootCategory.children" :key="childCategory.id" :class="{ 'ml-3': $dir.ltr, 'mr-3': $dir.rtl }">
              <b-link class="inherited-link-muted d-block mb-3" :to="getCategoryPath(item.slug, childCategory.slug)" @click="emitClicked">
                <thumbnail
                  v-if="childCategory.icon"
                  :link="false"
                  :width="24"
                  :height="24"
                  :path="childCategory.icon"
                  :alt="childCategory.name"
                  :class="{ 'mr-2': $dir.ltr, 'ml-2': $dir.rtl }"
                />

                {{ childCategory.name }}
              </b-link>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Thumbnail from '@/components/shared/Thumbnail'

export default {
  name: 'Categories',
  components: {
    Thumbnail
  },
  props: {
    categories: { type: Array, defualt: () => [] },
    item: { type: Object, required: true },
    sidebar: { type: Boolean, defualt: false }
  },
  methods: {
    getPath (itemSlug) {
      return this.$hasModule('products_groups') ? this.$api.products.getGroupPath(itemSlug) : this.getCategoryPath(null, itemSlug)
    },
    getCategoryPath (groupSlug, categorySlug) {
      return this.$api.products.getCategoryPath(this.$hasModule('products_groups') ? groupSlug : null, categorySlug)
    },
    emitClicked () {
      this.$emit('clicked')
    }
  }
}
</script>
