<template>
  <div>
    <draggable
      class="row"
      :disabled="disabled"
      v-bind="getSortableOptions()"
      v-model="model"
      @change="emit('emitInput')"
    >
      <b-col cols="auto" v-for="(item, index) in model" :key="item" :class="{ 'mb-3': multiple }">
        <item
          :value="item"
          :index="index"
          :disabled="disabled"
          :lightbox="lightbox"
          @setLightboxIndex="setLightboxIndex"
          @delete="deleteItem"
        />
      </b-col>
    </draggable>

    <image-lightbox v-if="lightbox" ref="imageLightbox" :items="model"/>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import ImageLightbox from '../ImageLightbox'
import Item from './Item'

export default {
  name: 'FilesDisplay',
  components: {
    draggable,
    ImageLightbox,
    Item
  },
  props: {
    value: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    lightbox: { type: Boolean, default: true }
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    getSortableOptions () {
      return {
        animation: 200
      }
    },
    emit (key) {
      this.$emit(key)
    },
    setLightboxIndex (index) {
      this.$refs.imageLightbox.setIndex(index)
    },
    deleteItem (item) {
      if (confirm(this.$t('forms.areYouSureToRemoveThisFile'))) {
        if (item.startsWith('Temp/')) {
          const name = item.split('/')[1]
          this.$api.files.delete(name, true)
        }

        this.model = this.model.filter(f => f !== item)
        this.emit('onChange')
        this.emit('emitInput')
      }
    }
  }
}
</script>
