<template>
  <b-modal
    ref="modal"
    centered
    size="lg"
    hide-header
    no-close-on-backdrop
    body-class="p-2"
    footer-class="p-2 d-block"
  >
    <vue-cropper
      v-if="src"
      ref="cropper"
      :src="src"
      :aspect-ratio="aspectRatio"
      :auto-crop-area="1"
    />

    <template v-slot:modal-footer>
      <div class="m-0">
        <b-row class="align-items-center">
          <b-col class="mb-2 mb-md-0">
            <b-row dir="ltr" class="justify-content-center justify-content-md-start" :class="{'justify-content-md-end': $dir.rtl}">
              <b-col cols="auto">
                <b-btn class="p-0 text-dark" variant="link" @click="zoomIn">
                  <font-awesome-icon icon="search-plus" size="lg"/>
                </b-btn>
              </b-col>

              <b-col cols="auto">
                <b-btn class="p-0 text-dark" variant="link" @click="zoomOut">
                  <font-awesome-icon icon="search-minus" size="lg"/>
                </b-btn>
              </b-col>

              <b-col cols="auto">
                <b-btn class="p-0 text-dark" variant="link" @click="rotateRight">
                  <font-awesome-icon icon="redo-alt" size="lg"/>
                </b-btn>
              </b-col>

              <b-col cols="auto">
                <b-btn class="p-0 text-dark" variant="link" @click="rotateLeft">
                  <font-awesome-icon icon="undo-alt" size="lg"/>
                </b-btn>
              </b-col>

              <b-col cols="auto">
                <b-btn ref="flipY" class="p-0 text-dark" variant="link" @click="flipY">
                  <font-awesome-icon icon="arrows-alt-v" size="lg"/>
                </b-btn>
              </b-col>

              <b-col cols="auto">
                <b-btn ref="flipX" class="p-0 text-dark" variant="link" @click="flipX">
                  <font-awesome-icon icon="arrows-alt-h" size="lg"/>
                </b-btn>
              </b-col>
            </b-row>
          </b-col>

          <b-col md="auto">
            <b-row no-gutters>
              <b-col order-md="2" md="6" class="mb-2 mb-md-0" :class="{'pl-md-2': $dir.ltr, 'pr-md-2': $dir.rtl}">
                <b-btn variant="success" block @click="submit">
                  {{ $t('shared.save') }}
                </b-btn>
              </b-col>

              <b-col md="6">
                <b-btn @click="hide" block>
                  {{ $t('shared.cancel') }}
                </b-btn>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </div>
    </template>
  </b-modal>
</template>

<script>
// Documents: https://github.com/Agontuk/vue-cropperjs
// Demo: https://agontuk.github.io/vue-cropperjs/
// Demo Code: https://github.com/Agontuk/vue-cropperjs/blob/master/example/src/App.vue
// Props: https://github.com/Agontuk/vue-cropperjs/blob/master/dist/VueCropper.js
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import { getDataUrlFromFile, getBlobFromDataUrl, getMimeTypeExtension } from '@/lib/images.js'

export default {
  name: 'ImageEditor',
  components: {
    VueCropper
  },
  props: {
    aspectRatio: Number
  },
  data () {
    return {
      fileName: null,
      src: null
    }
  },
  methods: {
    show (file) {
      this.fileName = null
      this.src = null
      getDataUrlFromFile(file)
      .then(dataUrl => {
        this.fileName = file.name
        this.src = dataUrl
        this.$refs.modal.show()
      })
    }, 
    hide () {
      this.$refs.modal.hide()
    },
    zoomIn () {
      this.$refs.cropper.relativeZoom(0.5)
    },
    zoomOut () {
      this.$refs.cropper.relativeZoom(-0.5)
    },
    rotateLeft () {
      this.$refs.cropper.rotate(-90)
    },
    rotateRight () {
      this.$refs.cropper.rotate(90)
    },
    flipX() {
      const dom = this.$refs.flipX
      let scale = dom.getAttribute('data-scale')
      scale = scale ? -scale : -1
      this.$refs.cropper.scaleX(scale)
      dom.setAttribute('data-scale', scale)
    },
    flipY() {
      const dom = this.$refs.flipY
      let scale = dom.getAttribute('data-scale')
      scale = scale ? -scale : -1
      this.$refs.cropper.scaleY(scale)
      dom.setAttribute('data-scale', scale)
    },
    submit () {
      const blob = getBlobFromDataUrl(this.$refs.cropper.getCroppedCanvas().toDataURL())
      blob.name = this.changeExtensionBasedOnMimeType(this.fileName, blob.type)
      this.$emit('change', blob)
      this.$refs.modal.hide()
    },
    changeExtensionBasedOnMimeType (fileName, mimeType) {
      const name = fileName.split('.').slice(0, -1).join('.')
      const ext = getMimeTypeExtension(mimeType)
      return `${name}.${ext}`
    }
  }
}
</script>

<style>
.cropper-view-box {
  outline: 1px solid #FFF !important;
}
.cropper-dashed.dashed-v, .cropper-dashed.dashed-h {
  border: 1px solid rgba(255, 255, 255, .5) !important;
}
.cropper-point {
  background-color: #FFF !important;
  border-radius: 50% !important;
  opacity: 1 !important;
  width: 10px !important;
  height: 10px !important;
}
.cropper-line {
  background: none !important;
}
.point-e {
  margin-top: -5px !important;
  right: -5px !important;
}
.point-n {
  margin-left: -5px !important;
  top: -5px !important;
}
.point-w {
  margin-top: -5px !important;
  left: -5px !important;
}
.point-s {
  margin-left: -5px !important;
  bottom: -5px !important;
}
.point-ne {
  right: -5px !important;
  top: -5px !important;
}
.point-nw {
  left: -5px !important;
  top: -5px !important;
}
.point-sw {
  bottom: -5px !important;
  left: -5px !important;
}
.point-se {
  bottom: -5px !important;
  right: -5px !important;
}
</style>
