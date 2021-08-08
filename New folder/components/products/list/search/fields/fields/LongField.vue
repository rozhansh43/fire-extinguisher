<template>
  <b-card class="search-fields" :header-class="collapsed ? 'p-0' : 'rounded-bottom p-0 bg-white'" no-body>
    <collapse-button slot="header" :title="fieldType.displayName" :collapsed="collapsed" @toggle="toggleCollapse"/>
    
    <b-card-body v-show="collapsed">
      <b-input-group>
        <template v-if="fieldType.options && fieldType.options.length">
          <b-form-select
            :options="minOptions"
            class="text-center"
            v-model="min"
          />

          <b-form-select
            :options="maxOptions"
            class="text-center"
            v-model="max"
          />
        </template>

        <template v-else>
          <numeric-input
            class="text-center"
            :placeholder="$t('productTypes.min')"
            :name="$t('productTypes.min')"
            v-validate="`min_value: ${fieldType.min}|max_value: ${fieldType.max}`"
            v-model="min"
          />

          <numeric-input
            class="text-center"
            :placeholder="$t('productTypes.max')"
            :name="$t('productTypes.max')"
            v-validate="`min_value: ${fieldType.min}|max_value: ${fieldType.max}`"
            v-model="max"
          />
        </template>

        <b-input-group-append v-if="fieldType.unit">
          <b-input-group-text class="bg-bright text-dark">
            {{ $t(`productTypes.units.${fieldType.unit}`) }}
          </b-input-group-text>
        </b-input-group-append>
      </b-input-group>
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
  name: 'LongField',
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
      min: null,
      max: null
    }
  },
  computed: {
    value () {
      const fieldFilter = this.filters && this.filters.find(o => o.name === this.fieldType.name)
      return fieldFilter ? fieldFilter.filter : null
    },
    minOptions () {
      return [{ value: null, text: this.$t('productTypes.min') }].concat(this.fieldType.options.map(o => {
        return {
          value: o.text,
          text: o.text
        }
      }))
    },
    maxOptions () {
      return [{ value: null, text: this.$t('productTypes.max') }].concat(this.fieldType.options.map(o => {
        return {
          value: o.text,
          text: o.text
        }
      }))
    }
  },
  watch: {
    value (val) {
      this.min = val && val.min
      this.max = val && val.max
    }
  },
  created () {
    this.min = this.value && this.value.min
    this.max = this.value && this.value.max
    
    if (this.min !== null || this.max !== null)
      this.collapsed = true
  },
  methods: {
    toggleCollapse () {
      this.collapsed = !this.collapsed
    },
    submit () {
      const query = Object.assign({}, this.$route.query)

      if (this.min !== null || this.max !== null) {
        let result = ''

        if (this.min !== null) result += this.min
        result += '~'
        if (this.max !== null) result += this.max

        query[this.fieldType.name] = result
      } else
        delete query[this.fieldType.name]
      
      this.$router.push({ query })
    }
  }
}
</script>
