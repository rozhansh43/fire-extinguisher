<template>
  <div class="animated fadeIn">
    <b-card no-body class="wish-list">
      <b-row no-gutters>
        <b-col xl="4" lg="5" style="min-height: 300px;">
          <div class="d-flex flex-column h-100">
            <items
              v-if="$hasModule('products_wishes') && items && items.length"
              :value="items"
              :selected-id="activeIndex !== null ? items[activeIndex].id : 0"
              editable
              @clicked="setActiveIndex"
              @removed="remove"
            />

            <b-list-group v-if="$hasModule('products_subscriptions')" flush class="border-top">
              <b-list-group-item
                class="py-2 px-3 inherited-link cursor-pointer"
                :class="displaySubscriptions ? 'bg-bright text-primary' : 'bg-white'"
                @click="showSubscriptions"
              >
                {{ $t('subscriptions.notifications') }}
              </b-list-group-item>
            </b-list-group>

            <div v-if="$hasModule('products_wishes')" class="mt-auto border-top p-3">
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
            </div>
          </div>
        </b-col>

        <b-col xl="8" lg="7" class="bg-bright">
          <wishes
            v-if="$hasModule('products_wishes') && items && items.length && activeIndex !== null"
            :value="activeIndex !== null && items[activeIndex].wishes"
            @move="showListsModal"
            @remove="removeWish"
          />

          <subscriptions
            v-else-if="$hasModule('products_subscriptions') && displaySubscriptions"
            :value="subscriptions"
            @remove="removeSubscriptions"
          />
        </b-col>
      </b-row>
    </b-card>

    <lists-modal v-if="$hasModule('products_wishes')" ref="listsModal" @addToNewList="addToNewList"/>
  </div>
</template>

<script>
import progressEnd from '@/mixins/progress-end'
import Items from '@/components/lists/items/index'
import Wishes from '@/components/lists/list/Wishes'
import ListsModal from '@/components/lists/list/ListsModal'
import Subscriptions from '@/components/subscriptions/Items'

export default {
  name: 'Lists',
  components: {
    Items,
    Wishes,
    ListsModal,
    Subscriptions
  },
  meta: {
    modules: [
      'products',
      'products_subscriptions'
    ]
  },
  head () {
    return {
      title: this.$t('wishes.lists')
    }
  },
  mixins: [progressEnd],
  data () {
    return {
      activeIndex: 0,
      items: null,
      progressing: false,
      addMode: false,
      createModel: {
        name: null
      },
      displaySubscriptions: false,
      subscriptions: null
    }
  },
  asyncData ({ app, error }) {
    return Promise.all([
      app.$hasModule('products_wishes') ? app.$api.wishLists.getAll() : null,
      app.$hasModule('products_subscriptions') ? app.$api.productSubscriptions.getAll({ include: 'Product' }) : null
    ])
    .then(all => {
      const items = all[0]
      const defaultList = items && items.find(o => o.id === -1)

      if (defaultList)
        defaultList.name = app.i18n.t('wishes.wishList')

      return {
        items,
        subscriptions: all[1],
        displaySubscriptions: !defaultList
      }
    })
    .catch(err => {
      error(err)
    })
  },
  methods: {
    toggleAdd () {
      this.addMode = !this.addMode
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
    showListsModal (item) {
      this.$refs.listsModal.show(this.items, item, this.items[this.activeIndex].id)
    },
    remove (itemId) {
      if (this.items.findIndex(o => o.id === itemId) === this.activeIndex)
        this.activeIndex = 0

      this.items = this.items.filter(o => o.id !== itemId)
    },
    addToNewList (wish, index) {
      this.items[index].wishes.push(wish)

      this._removeWish(wish.id, this.activeIndex)
    },
    _removeWish (wishId, index) {
      this.items[index].wishes = this.items[index].wishes.filter(o => o.id !== wishId)
    },
    removeWish (itemId) {
      if (confirm(this.$t('shared.areYouSureToRemoveThisItem'))) {
        this.$api.wishes.delete(itemId, true)
        .then(() => {
          this._removeWish(itemId, this.activeIndex)
          this.$showSuccess(this.$t('wishes.wishRemoved'))
        })
        .catch(err => {
          this.$showError(this.$getLocaleErrorMessage(err, 'wishes'))
        })
      }
    },
    setActiveIndex (val, index) {
      this.activeIndex = index
      this.displaySubscriptions = false
    },
    showSubscriptions () {
      this.displaySubscriptions = true
      this.activeIndex = null
    },
    removeSubscriptions (itemId) {
      if (confirm(this.$t('shared.areYouSureToRemoveThisItem'))) {
        this.$api.productSubscriptions.delete(itemId, true)
        .then(() => {
          this.subscriptions = this.subscriptions.filter(o => o.id !== itemId)
          this.$showSuccess(this.$t('subscriptions.notifyRemoved'))
        })
        .catch(err => {
          this.$showError(this.$getLocaleErrorMessage(err, 'subscriptions'))
        })
      }
    }
  }
}
</script>
