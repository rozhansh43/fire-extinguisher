<template>
  <div class="search-list-view btn-group">
    <b-radio
      v-for="item in options"
      :key="item.value"
      :value="item.value"
      name="list-view-radio-group"
      button
      button-variant="outline-light"
      inline
      size="sm"
      v-model="model"
    >
      <font-awesome-icon size="sm" :icon="item.icon" fixed-width class="text-dark"/>
    </b-radio>
  </div>
</template>

<script>
import * as types from '@/store/types'

export default {
  name: 'ListView',
  props: {
    showTitle: { type: Boolean, default: false }
  },
  data () {
    return {
      options: [
        { value: 'grid', icon: 'th-large' },
        { value: 'list', icon: 'bars' }
      ]
    }
  },
  computed: {
    model: {
      get () {
        return this.$store.state.$productsListView
      },
      set (val) {
        this.submit(val)
      }
    }
  },
  methods: {
    submit (value) {
      this.$store.commit(types.SET_PRODUCTS_LIST_VIEW, { value, cookies: this.$cookies})
    }
  }
}
</script>
