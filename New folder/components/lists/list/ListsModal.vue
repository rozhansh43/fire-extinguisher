<template>
  <b-modal
    ref="modal"
    centered
    body-class="p-0"
    :title="`${$t('wishes.chooseList')} :`"
    hide-footer
    @hidden="cleanup"
  >
    <div v-if="initializing" class="text-center my-3">
      <font-awesome-icon spin icon="circle-notch" class="text-moremuted display-2"/>
    </div>

    <items
      v-else-if="items && items.length"
      :value="items"
      :selected-id="selectedId"
      @clicked="moveToList"
    />
  </b-modal>
</template>

<script>
import Items from '@/components/lists/items/index'

export default {
  name: 'ListsModal',
  components: {
    Items
  },
  data () {
    return {
      initializing: false,
      items: [],
      item: null,
      selectedId: null
    }
  },
  methods: {
    show (items, item, selectedId) {
      this.items = items
      this.item = item
      this.selectedId = selectedId
      
      this.$refs.modal.show()
    },
    cleanup () {
      this.items = []
      this.item = null
      this.selectedId = null
      this.initializing = false
    },
    moveToList (item, index) {
      this.initializing = true

      this.$api.wishes.update(this.item.id, item.id, true)
      .then(res => {
        this.$emit('addToNewList', this.item, index)
        this.$showSuccess(this.$t('wishes.addedToList', { name: item.name }))
        this.$refs.modal.hide()
      })
      .catch(err => {
        this.$showError(this.$getLocaleErrorMessage(err, 'wishes'))
        this.$refs.modal.hide()
      })
    }
  }
}
</script>
