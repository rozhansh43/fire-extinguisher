<template>
  <div>
    <template v-if="roots && roots.length">
      <b-list-group flush class="py-2">
        <item v-for="item in roots" :key="item.id" :item="item" :items="items" :group="group" :active-item="activeItem"/>
      </b-list-group>
    </template>

    <div v-else class="text-muted text-center p-3">
      {{ $t('shared.thereAreNoResults') }}
    </div>
  </div>
</template>

<script>
import Item from './Item'

export default {
  name: 'CategoriesDisplay',
  components: {
    Item
  },
  props: {
    group: { type: Object, required: true },
    items: { type: Array, default: () => []},
    activeItem: Object
  },
  computed: {
    roots () {
      return this.items && this.items.length && this.items.filter(i => i.parentIds.length === 1)
    }
  }
}
</script>
