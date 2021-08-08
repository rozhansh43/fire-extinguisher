<template>
  <b-card class="search-fields" :header-class="collapsed ? 'p-0' : 'rounded-bottom p-0 bg-white'" no-body>
    <collapse-button slot="header" :title="fieldType.displayName" :collapsed="collapsed" @toggle="toggleCollapse"/>
    
    <b-card-body v-show="collapsed" class="p-0">
      <b-form-group class="mb-0 p-3">
        <b-input-group>
          <b-form-input :placeholder="`${$t('search.search')}...`" v-model="searchKey"/>
        </b-input-group>
      </b-form-group>

      <hr class="m-0"/>

      <b-form-checkbox-group
        v-if="filteredItems && filteredItems.length"
        stacked
        v-model="selectedItems"
        class="search-checkbox-group py-2"
      >
        <b-form-checkbox
          v-for="item in filteredItems"
          :key="item.value"
          class="p-0 checkbox-item cursor-pointer"
          :value="item.value"
        >
          <div>
            {{ item.text }}
          </div>
        </b-form-checkbox>
      </b-form-checkbox-group>

      <div v-else class="text-muted text-center p-3">
        {{ $t('shared.thereAreNoResults') }}
      </div>
    </b-card-body>

    <b-card-footer v-if="fieldType.options && fieldType.options.length" v-show="collapsed" class="p-0">
      <b-btn block variant="link" class="inherited-link p-2" @click="submit">
        <div class="p-1">
          <font-awesome-icon icon="filter" class="align-middle" :class="{'mr-1': $dir.ltr, 'ml-1': $dir.rtl}"/>

          {{ $t('search.filter') }}
        </div>
      </b-btn>
    </b-card-footer>
  </b-card>
</template>

<script>
import CollapseButton from '@/components/products/list/search/shared/CollapseButton'

export default {
  name: 'SelectField',
  components: {
    CollapseButton
  },
  props: {
    fieldType: { type: Object, required: true },
    filters: { type: Array, default: () => [] }
  },
  data () {
    return {
      collapsed: false,
      selectedItems: [],
      searchKey: null
    }
  },
  computed: {
    value () {
      const fieldFilter = this.filters && this.filters.find(o => o.name === this.fieldType.name)
      return fieldFilter ? fieldFilter.filter.value : []
    },
    filteredItems () {
      if (!this.fieldType.options || !this.fieldType.options.length) return []

      const key = this.searchKey && this.searchKey.trim().length && this.searchKey.trim().toLowerCase()
      return key
      ? this.fieldType.options.filter(i => i.text.toLowerCase().includes(this.searchKey))
      : this.fieldType.options
    }
  },
  watch: {
    value (val) {
      this.selectedItems = [].concat(val)
    }
  },
  created () {
    this.selectedItems = [].concat(this.value)

    if (this.selectedItems && this.selectedItems.length)
      this.collapsed = true
  },
  methods: {
    toggleCollapse () {
      this.collapsed = !this.collapsed
    },
    submit () {
      const query = Object.assign({}, this.$route.query)

      if (this.selectedItems && this.selectedItems.length)
        query[this.fieldType.name] = this.selectedItems.join()
      else
        delete query[this.fieldType.name]
      
      this.$router.push({ query })
    }
  }
}
</script>
