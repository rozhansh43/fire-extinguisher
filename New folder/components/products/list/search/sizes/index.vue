<template>
  <b-card class="search-sizes" :header-class="collapsed ? 'p-0' : 'rounded-bottom p-0 bg-white'" no-body>
    <collapse-button slot="header" :title="$t('search.size')" :collapsed="collapsed" @toggle="toggleCollapse"/>
    
    <b-card-body v-show="collapsed" class="p-0">
      <b-form-group class="mb-0 p-3">
        <b-input-group>
          <b-form-input :placeholder="`${$t('search.sizeNameSearch')}...`" v-model="searchKey"/>
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
          :key="item.id"
          class="p-0 checkbox-item cursor-pointer"
          :value="item.id"
        >
          <div>
            {{ item.name }}
          </div>

          <div v-if="item.altName" class="text-moremuted">
            {{ item.altName }}
          </div>
        </b-form-checkbox>
      </b-form-checkbox-group>

      <div v-else class="text-muted text-center p-3">
        {{ $t('shared.thereAreNoResults') }}
      </div>
    </b-card-body>

    <b-card-footer v-if="items && items.length" v-show="collapsed" class="p-0">
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
import CollapseButton from '../shared/CollapseButton'

export default {
  name: 'Sizes',
  components: {
    CollapseButton
  },
  props: {
    items: { type: Array, default: () => []}
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
      const args = this.getListRouteArgs()
      return args ? args.sizeIds : null
    },
    filteredItems () {
      const key = this.searchKey && this.searchKey.trim().length && this.searchKey.trim().toLowerCase()
      return key
      ? this.items.filter(i => i.name.toLowerCase().includes(this.searchKey) || (i.altName && i.altName.toLowerCase().includes(this.searchKey)))
      : this.items
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
    getListRouteArgs () {
      const route = this.$route
      
      try {
        return this.$api.products.getListRouteArgs({ params: route.params, query: route.query })
      } catch (err) {
        return null
      }
    },
    submit () {
      const query = Object.assign({}, this.$route.query)

      if (this.selectedItems && this.selectedItems.length)
        query.sizes = this.selectedItems.join()
      else
        delete query.sizes
      
      this.$router.push({ query })
    }
  }
}
</script>
