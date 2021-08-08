<template>
  <div class="d-flex flex-row">
    <item
      v-for="item in items"
      :key="item.id"
      :item="item"
      :items-count="items.length"
      :type="type"
      :endpoint="endpoint"
      @remove="remove"
      :column-width="columnWidth"
    />

    <add-button
      @click="showItemSelector"
      :column-width="columnWidth"
    />

    <item-selector ref="itemSelector" @selected="add"/>
  </div>
</template>

<script>
import ItemSelector from './ItemSelector'
import Item from './Item'
import AddButton from './AddButton'

export default {
  name: 'CompareItems',
  components: {
    Item,
    AddButton,
    ItemSelector
  },
  props: {
    type: { type: Object, required: true },
    items: { type: Array, required: true },
    endpoint: { type: String, required: true },
    columnWidth: { type: Number, required: true }
  },
  methods: {
    showItemSelector () {
      this.$refs.itemSelector.show(this.type, this.endpoint, this.items)
    },
    add (item) {
      this.$api.compare.add(this.endpoint, item)
      this.changePath(item.id, 'add')
    },
    remove (itemId) {
      this.$api.compare.remove(this.endpoint, itemId)
      this.changePath(itemId, 'remove')
    },
    getPath (item) {
      return this.$api[this.endpoint].getProductPath(item)
    },
    changePath (itemId, status) {
      let path = null
      const ids = this.items.map(o => o.id)

      if (status === 'remove')
        path = this.$api.compare.getPath(ids.filter(o => o !== itemId))

      else if (status === 'add')
        path = this.$api.compare.getPath(ids.concat(itemId))

      this.$router.push(path)
    }
  }
}
</script>
