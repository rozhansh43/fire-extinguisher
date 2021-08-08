<template>
  <b-modal
    ref="modal"
    centered
    :title="title"
    body-class="p-0 position-relative"
    hide-footer
    scrollable
  >
    <div class="p-3 sticky bg-white border-bottom">
      <b-input-group>
        <b-input ref="input" :placeholder="`${$t('shared.search')}...`" v-model="keyword" @input="getItems"/>
      </b-input-group>
    </div>

    <div v-if="initializing" class="text-center my-4">
      <font-awesome-icon spin icon="circle-notch" class="text-moremuted display-2"/>
    </div>

    <template v-else>
      <b-list-group v-if="items && items.length" flush class="list-group-bright">
        <b-list-group-item
          v-for="item in items"
          :key="item.value"
          button
          :class="{ 'bg-success-light': item.value === value }"
          @click="selectItem(item)"
        >
          {{ item.text }}
        </b-list-group-item>
      </b-list-group>

      <div v-else class="text-muted text-center p-4">
        <font-awesome-icon icon="times-circle" class="display-4 d-block mb-3 mx-auto text-moremuted"/>

        {{ $t('shared.thereAreNoResults') }}
      </div>
    </template>
  </b-modal>
</template>

<script>
export default {
  name: 'ItemSelectorItems',
  props: {
    value: { type: [String, Number], default: null },
    title: String,
    select: Function,
    search: Function
  },
  data () {
    return {
      initializing: true,
      keyword: null,
      items: []
    }
  },
  methods: {
    show () {
      this.reset()
      this.$refs.modal.show()
      this.getItems()

      setTimeout(() => {
        this.$refs.input.focus()
      }, 100)
    },
    reset () {
      this.initializing = true
      this.keyword = null
      this.items = []
    },
    getItems () {
      this.initializing = true

      this.search(this.keyword)
      .then(items => {
        this.items = items
        this.initializing = false
      })
      .catch(err => {
        this.$showError(this.$getLocaleErrorMessage(err, 'shared'))
        this.hide()
      })
    },
    hide () {
      this.$refs.modal.hide()
    },
    selectItem (item) {
      this.$emit('input', item)
      this.hide()
    }
  }
}
</script>
