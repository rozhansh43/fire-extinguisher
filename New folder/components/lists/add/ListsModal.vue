<template>
  <b-modal
    ref="modal"
    centered
    body-class="p-0"
    :title="`${$t('wishes.chooseList')} :`"
    footer-class="d-block"
    :hide-footer="initializing"
    @hidden="cleanup"
  >
    <div v-if="initializing" class="text-center my-3">
      <font-awesome-icon spin icon="circle-notch" class="text-moremuted display-2"/>
    </div>

    <items
      v-else-if="items && items.length"
      :value="items"
      :selected-id="selectedId"
      editable
      show-bullet
      @clicked="addToList"
      @removed="remove"
    />

    <template v-slot:modal-footer>
      <template v-if="addMode">
        <b-form class="mb-2 mt-0 mx-0" @submit.prevent="addItem">
          <b-input-group>
            <b-input ref="createModelInput" :placeholder="`${$t('wishes.enterListName')}...`" v-model="createModel.name"/>

            <b-input-group-append>
              <b-btn
                variant="success"
                :title="$t('shared.add')"
                v-b-tooltip
                :disabled="progressing"
                type="submit"
              >
                <font-awesome-icon
                  :icon="progressing ? 'cog' : 'plus'"
                  :spin="progressing"
                  class="align-middle"
                />
              </b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-form>
      </template>
      
      <b-btn class="m-0" block variant="success" @click="toggleAdd">
        <font-awesome-icon
          icon="plus"
          class="align-middle"
          :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
        />

        {{ $t('wishes.submitNewList') }}
      </b-btn>
    </template>
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
      initializing: true,
      progressing: false,
      addMode: false,
      product: null,
      items: [],
      selectedId: null,
      createModel: {
        name: null
      }
    }
  },
  methods: {
    show (product) {
      this.product = product
      this.$refs.modal.show()

      this.getModel()
    },
    toggleAdd () {
      this.addMode = !this.addMode
    },
    cleanup () {
      this.product = null
      this.selectedId = null
      this.initializing = true
    },
    getModel () {
      this.initializing = true

      this.$api.wishLists.getAll()
      .then(res => {
        this.items = res.map(o => {
          return {
            id: o.id,
            name: o.name,
            wishes: o.wishes
          }
        })
        
        const defaultList = this.items.find(o => o.id === -1)
        
        if (defaultList)
          defaultList.name = this.$t('wishes.wishList')

        const selectedList = this.items.find(o => o.wishes.find(o => o.productId === this.product.id))
        this.selectedId = selectedList ? selectedList.id : null

        this.initializing = false
      })
      .catch(err => {
        this.$showError(this.$getLocaleErrorMessage(err, 'wishes'))
        this.$refs.modal.hide()
      })
    },
    addItem () {
      if (!this.createModel.name || this.createModel.name === '') return

      this.progressing = true

      this.$api.wishLists.create(this.createModel, true)
      .then(res => {
        this.createModel.name = null
        
        this.items.push({
          id: res.id,
          name: res.name
        })
        
        this.addMode = false
        this.progressing = false
        this.$showSuccess(this.$t('wishes.newListAdded'))
      })
      .catch(err => {
        this.progressing = false
        this.$showError(this.$getLocaleErrorMessage(err, 'wishes'))
      })
    },
    addToList (item) {
      this.initializing = true

      this.$api.wishes.create({ productId: this.product.id, wishListId: item.id }, true)
      .then(res => {
        this.selectedId = item.id
        this.$showSuccess(this.$t('wishes.addedToList', { name: item.name }))

        this.$refs.modal.hide()
      })
      .catch(err => {
        this.$showError(this.$getLocaleErrorMessage(err, 'wishes'))
        this.$refs.modal.hide()
      })
    },
    remove (itemId) {
      this.items = this.items.filter(o => o.id !== itemId)
    }
  }
}
</script>
