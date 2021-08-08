<template>
  <b-row v-if="model && model.length" class="custom-rating">
    <b-col v-for="(item, index) in model" :key="index" md="6" class="mb-4">
      <label class="mb-2">
        {{ item.title }}
      </label>

      <client-only>
        <b-row class="align-items-center">
          <b-col>
            <vue-slider
              :min="0"
              :max="10"
              :interval="2.5"
              :direction="$dir.ltr ? 'ltr': 'rtl'"
              :tooltip="tooltip"
              :marks="marks"
              :hide-label="hideLabel"
              :dot-size="dotSize"
              :value="item.rate.value"
              @change="(value) => setItem(value, index)"
            />
          </b-col>

          <b-col cols="3" lg="2">
            <div class="px-2 text-muted">
              {{ getItemText(item.rate.value) }}
            </div>
          </b-col>
        </b-row>
      </client-only>
    </b-col>
  </b-row>
</template>

<script>
// Document: https://nightcatsama.github.io/vue-slider-component
import 'vue-slider-component/theme/default.css'

export default {
  name: 'Rating',
  components: {
    VueSlider: () => import('vue-slider-component')
  },
  props: {
    value: { type: Array, required: true },
    marks: { type: Boolean, default: false },
    dotSize: { type: Number, default: 14 },
    hideLabel: { type: Boolean, default: true },
    tooltip: { type: String, default: 'none' }
  },
  data () {
    return {
      model: null,
      data: [
        { value: 0, text: this.$t('shared.veryBad') },
        { value: 2.5, text: this.$t('shared.bad') },
        { value: 5, text: this.$t('shared.normal') },
        { value: 7.5, text: this.$t('shared.good') },
        { value: 10, text: this.$t('shared.excellent') }
      ]
    }
  },
  mounted () {
    this.model = [].concat(this.value)
  },
  methods: {
    setItem (value, index) {
      const item = this.data.find(o => o.value === value)
      this.model[index].rate = item
    },
    getItemText (value) {
      const item = this.data.find(o => o.value === value)
      return item && item.text
    }
  }
}
</script>
