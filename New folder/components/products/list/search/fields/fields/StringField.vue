<template>
  <b-card class="search-fields" :header-class="collapsed ? 'p-0' : 'rounded-bottom p-0 bg-white'" no-body>
    <collapse-button slot="header" :title="fieldType.displayName" :collapsed="collapsed" @toggle="toggleCollapse"/>
    
    <b-card-body v-show="collapsed">
      <b-input v-model="keyword"/>
    </b-card-body>

    <b-card-footer v-show="collapsed" class="p-0">
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
  name: 'StringField',
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
      keyword: null
    }
  },
  computed: {
    value () {
      const fieldFilter = this.filters && this.filters.find(o => o.name === this.fieldType.name)
      return fieldFilter ? fieldFilter.filter.value : null
    }
  },
  watch: {
    value (val) {
      this.keyword = val
    }
  },
  created () {
    this.keyword = this.value
    
    if (this.keyword)
      this.collapsed = true
  },
  methods: {
    toggleCollapse () {
      this.collapsed = !this.collapsed
    },
    submit () {
      const query = Object.assign({}, this.$route.query)

      if (this.keyword)
        query[this.fieldType.name] = this.keyword
      else
        delete query[this.fieldType.name]
      
      this.$router.push({ query })
    }
  }
}
</script>
