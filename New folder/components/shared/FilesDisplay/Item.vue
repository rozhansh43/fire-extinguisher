<template>
  <div class="image-item border rounded overflow-hidden">
    <div class="position-relative">
      <template v-if="isImage()">
        <b-btn v-if="lightbox" variant="link" class="p-0 text-dark border-0" @click="emitLightboxIndex">
          <thumbnail :path="value" :link="false" :width="100" :height="100"/>
        </b-btn>

        <thumbnail v-else :path="value" :width="100" :height="100"/>
      </template>

      <div v-else class="d-flex justify-content-center align-items-center h5 mb-0" style="width: 100px; height: 100px;">
        <b-link target="_blank" :href="staticUrl()" class="text-dark">
          {{ getExtension() }}
        </b-link>
      </div>

      <template v-if="!disabled">
        <div class="d-none d-md-block">
          <b-btn size="sm" variant="link" class="remove-btn" @click="emitDelete">
            <font-awesome-icon icon="times" class="align-middle text-dark" />
          </b-btn>
        </div>

        <div class="d-md-none p-1 text-center">
          <b-btn size="sm" variant="outline-danger" @click="emitDelete">
            <font-awesome-icon icon="times" class="align-middle m-1" />
          </b-btn>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Thumbnail from '../Thumbnail'

export default {
  name: 'Item',
  components: {
    Thumbnail
  },
  props: {
    value: { type: String, required: true },
    index: { type: Number, required: true },
    disabled: { type: Boolean, default: false },
    lightbox: { type: Boolean, default: true }
  },
  data () {
    return {
      imageExtensions: ['png', 'jpg', 'jpeg', 'gif', 'tiff']
    }
  },
  methods: {
    isImage () {
      return this.imageExtensions.includes(this.getExtension(this.value).toLowerCase())
    },
    getExtension () {
      return this.value.toUpperCase().split('.').pop()
    },
    emitLightboxIndex () {
      this.$emit('setLightboxIndex', this.index)
    },
    staticUrl () {
      return `${this.$config.files.staticServerUrl}/${this.value}`
    },
    emitDelete () {
      this.$emit('delete', this.value)
    }
  }
}
</script>
