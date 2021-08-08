<template>
  <b-modal
    ref="modal"
    :title="type && $t('compare.addingItemOfType', { type: type.title })"
    size="lg"
    centered
    hide-footer
    :body-class="items && items.length ? 'pb-0' : null"
    @hidden="resetModal"
  >
    <div v-if="progressing" class="text-center">
      <font-awesome-icon spin icon="circle-notch" class="text-moremuted display-2"/>
    </div>

    <template v-else>
      <b-form v-if="showSearch" @submit.prevent="getItems">
        <b-input-group class="mb-3">
          <template v-slot:prepend>
            <b-input-group-text class="bg-bright">
              <font-awesome-icon icon="search"/>
            </b-input-group-text>
          </template>

          <b-form-input class="bg-bright" :placeholder="`${$t('shared.search')}...`" v-model="search.title"/>
        </b-input-group>
      </b-form>

      <b-row v-if="items && items.length">
          <b-col v-for="item in items" :key="item.id" md="4" class="d-flex mb-3">
            <b-card class="w-100 shadow-none bg-bright" no-body>
              <b-link class="inherited-link" @click="emitSelect(item)">
                <thumbnail
                  :link="false"
                  fluid-grow
                  :width="213"
                  :height="160"
                  :path="item.image"
                  :alt="item.title"
                  show-no-image
                  class="rounded-top card-img-top"
                />

                <b-card-body class="p-3">
                  {{ item.title }}
                </b-card-body>
              </b-link>
            </b-card>
          </b-col>
      </b-row>

      <div v-else class="text-muted text-center py-4">
        <font-awesome-icon icon="times-circle" class="display-1 d-block mb-4 mx-auto text-moremuted"/>

        {{ $t('shared.thereAreNoResults') }}
      </div>
    </template>
  </b-modal>
</template>

<script>
import Thumbnail from '@/components/shared/Thumbnail'

export default {
  name: 'ItemSelector',
  components: {
    Thumbnail
  },
  data () {
    return {
      progressing: false,
      type: null,
      endpoint: null,
      items: null,
      exceptions: null,
      showSearch: true,
      firstGetItems: true,
      search: {
        title: null
      }
    }
  },
  methods: {
    show (type, endpoint, exceptions) {
      this.type = type
      this.endpoint = endpoint
      this.exceptions = exceptions
      this.getItems()
      this.$refs.modal.show()
    },
    resetModal () {
      this.progressing = false
      this.type = null
      this.endpoint = null
      this.items = null
      this.exceptions = null
      this.search.title = null
      this.firstGetItems = true
      this.showSearch = true
    },
    getItems () {
      this.progressing = true

      this.$api[this.endpoint].search({
        args: { keyword: this.search.title },
        model: { selectedType: { id: this.type.id } },
        forceToSendType: true
      })
      .then(res => {
        const items = []

        let add = true

        res.hits.forEach(i => {
          this.exceptions.forEach(j => {
            if (i.id === j.id) add = false
          })

          if (add) items.push(i)
            add = true
        })

        this.items = items

        this.progressing = false

        if (this.firstGetItems) {
          if (!this.items || !this.items.length) this.showSearch = false
          this.firstGetItems = false
        }
      })
      .catch(err => {
        this.progressing = false
        this.$showError(this.$getLocaleErrorMessage(err, this.endpoint))
      })
    },
    emitSelect (item) {
      this.$emit('selected', item)
      this.$refs.modal.hide()
    }
  }
}
</script>
