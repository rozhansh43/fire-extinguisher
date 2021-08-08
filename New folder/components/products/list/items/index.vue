<template>
  <div class="products-list position-relative">
    <b-card v-if="items && items.length" no-body class="overflow-hidden">
      <b-row class="py-2 px-3 border-bottom align-items-center">
        <b-col>
          <sort v-if="$hasModule('products_search')"/>
        </b-col>

        <b-col lg="auto" class="mt-3 mt-lg-0 d-flex align-items-center justify-content-between">
          <span class="text-muted" :class="{ 'mr-3': $dir.ltr, 'ml-3': $dir.rtl }">
            {{ $tc('search.totalCount', total.toLocaleString()) }}
          </span>

          <list-view/>
        </b-col>
      </b-row>

      <items-grid v-if="view === 'grid'" :value="items" :types="types"/>
      <items-list v-else-if="view === 'list'" :value="items" :types="types"/>
    </b-card>

    <empty-list v-else/>

    <progressing v-if="progressing"/>
    <compare-list-button endpoint="products"/>
  </div>
</template>

<script>
import Sort from '../search/Sort'
import ItemsGrid from './grid'
import ItemsList from './list'
import ListView from './ListView'
import Progressing from './Progressing'
import EmptyList from './EmptyList'
import CompareListButton from '@/components/compare/CompareListButton'

export default {
  name: 'ProductsList',
  components: {
    CompareListButton,
    EmptyList,
    ItemsGrid,
    ItemsList,
    ListView,
    Progressing,
    Sort
  },
  props: {
    items: Array,
    progressing: { type: Boolean, default: false },
    total: Number,
    types: { type: Array, default: () => [] }
  },
  computed: {
    view () {
      return this.$store.state.$productsListView
    }
  }
}
</script>
