<template>
  <b-card class="search-fields" :header-class="collapsed ? 'p-0' : 'rounded-bottom p-0 bg-white'" no-body>
    <collapse-button slot="header" :title="fieldType.displayName" :collapsed="collapsed" @toggle="toggleCollapse"/>
    
    <b-card-body v-show="collapsed">
      <b-form-select :options="options" v-model="selectedItem"/>
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
  name: 'BooleanField',
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
      selectedItem: null
    }
  },
  computed: {
    value () {
      const fieldFilter = this.filters && this.filters.find(o => o.name === this.fieldType.name)
      return fieldFilter ? fieldFilter.filter.value : null
    },
    options () {
      return [
        { value: null, text: this.$t('shared.choose') },
        { value: 'true', text: this.fieldType.trueLabel },
        { value: 'false', text: this.fieldType.falseLabel }
      ]
    }
  },
  watch: {
    value (val) {
      this.selectedItem = val
    }
  },
  created () {
    this.selectedItem = this.value
    
    if (this.selectedItem !== null)
      this.collapsed = true
  },
  methods: {
    toggleCollapse () {
      this.collapsed = !this.collapsed
    },
    submit () {
      const query = Object.assign({}, this.$route.query)

      if (this.selectedItem !== null)
        query[this.fieldType.name] = this.selectedItem
      else
        delete query[this.fieldType.name]
      
      this.$router.push({ query })
    }
  }
}
</script>
