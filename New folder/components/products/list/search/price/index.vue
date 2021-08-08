<template>
  <b-card v-if="loaded && min && max" class="search-price" :header-class="collapsed ? 'p-0' : 'rounded-bottom p-0 bg-white'" no-body>
    <collapse-button slot="header" :title="$t('search.priceRange')" :collapsed="collapsed" @toggle="toggleCollapse"/>

    <b-card-body v-show="collapsed" class="p-0">
      <span v-if="!settings" class="text-danger m-3">
        [CURRENCY SETTINGS NOT LOADED]
      </span>

      <template v-else>
        <div class="p-3">
          <client-only>
            <vue-slider
              class="custom-slider"
              :direction="$dir.ltr ? 'ltr': 'rtl'"
              :enable-cross="false"
              tooltip="none"
              :min="min"
              :max="max"
              :height="2"
              :interval="interval"
              v-model="data"
            />
          </client-only>
        </div>

        <b-row class="border-top border-bright">
          <b-col class="text-center p-3 border-bright" :class="{ 'border-right': $dir.ltr, 'border-left': $dir.rtl }">
            <div class="mb-2">
              {{ $t('search.from') }}
            </div>

            <div class="text-info mb-2">
              {{ minLabel }}
            </div>

            <div>
              {{ currency }}
            </div>
          </b-col>

          <b-col class="text-center p-3">
            <div class="mb-2">
              {{ $t('search.to') }}
            </div>

            <div class="text-info mb-2">
              {{ maxLabel }}
            </div>

            <div>
              {{ currency }}
            </div>
          </b-col>
        </b-row>
      </template>
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
// Document: https://nightcatsama.github.io/vue-slider-component
import 'vue-slider-component/theme/default.css'
import CollapseButton from '../shared/CollapseButton'

export default {
  name: 'Price',
  components: {
    CollapseButton,
    VueSlider: () => import('vue-slider-component')
  },
  props: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    interval: Number
  },
  data () {
    return {
      collapsed: false,
      data: [],
      loaded: false
    }
  },
  computed: {
    settings () {
      return this.$api.settings.currencySettings.get()
    },
    currency () {
      return this.settings.displayName
    },
    value () {
      const args = this.getListRouteArgs()
      return args ? args.price : null
    },
    minLabel () {
      return (this.data[0] / this.settings.displayRate).toLocaleString()
    },
    maxLabel () {
      return (this.data[1] / this.settings.displayRate).toLocaleString()
    }
  },
  watch: {
    value (val) {
      this.data = val ? [val.min, val.max] : [this.min, this.max]
    }
  },
  created () {
    this.data = this.value ? [this.value.min, this.value.max] : [this.min, this.max]
    
    if (this.value)
      this.collapsed = true
  },
  mounted () {
    this.loaded = true
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
      
      if (this.data && this.data.length && (this.data[0] !== this.min || this.data[1] !== this.max)) {
        let result = ''

        if (this.data[0] !== null) result += this.data[0]
        result += '~'
        if (this.data[1] !== null) result += this.data[1]

        query.price = result
      } else
        delete query.price
      
      this.$router.push({ query })
    }
  }
}
</script>
