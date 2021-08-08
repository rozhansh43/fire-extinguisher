<template>
  <b-modal
      centered
      no-fade
      no-close-on-backdrop
      no-close-on-esc
      hide-footer
      :title="$t('fileManager.upload')"
      visible
      lazy
      @hide="emitClose"
      body-class="p-1"
    >
      <uploader :doc-upload-model="uploadModel" @change="emitClose" :accept="accept" />
    </b-modal>
</template>

<script>
import Uploader from '../Uploader'

export default {
  name: 'FUpload',
  components: {
    Uploader
  },
  props: {
    api: { type: Object, required: true },
    docType: {type: String, required: true}, // image | file | media
    path: {type: String, required: true}
  },
  data () {
    return {
      uploadModel: {
        api: this.api,
        type: this.docType,
        path: this.path
      }
    }
  },
  computed: {
    accept () {
      switch (this.docType) {
        case 'image':
          return '.jpg,.jpeg,.gif,.png,.tif,.ico,.bmp,.zip'
        case 'media':
          return '.mp3,.wma,.wav,.mp4,.3gp,.ogg,.wmv,.webm,.flv,.mov.zip'
        case 'file':
        default:
          return '*'
      }
    }
  },
  methods: {
    emitClose (uploadedDocs) {
      this.$emit('close', uploadedDocs)
    }
  }
}
</script>
