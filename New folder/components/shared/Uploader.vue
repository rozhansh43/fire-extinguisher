<template>
  <div v-if="filePaths.length || !disabled">
    <p v-if="label" class="mb-3">
      {{ label }}

      <required-symbol v-if="required"/>
    </p>

    <b-alert class="mb-3 mt-2" variant="danger" show v-for="error in uploadErrors" :key="error">
      {{error}}
    </b-alert>

    <files-display
      :disabled="disabled"
      :multiple="multiple"
      :lightbox="lightbox"
      v-model="filePaths"
      @emitInput="emitInput"
    />

    <div v-if="!disabled && (multiple || !filePaths.length)">
      <input
        v-show="false"
        ref="input"
        type="file"
        name="file"
        :multiple="multiple && !editor"
        :accept="accept"
        :disabled="uploading"
        @change="onChangeInputFile"
      />

      <div style="overflow:auto">
        <b-btn
          :variant="uploading ? 'success' : 'silver'"
          @click="openBrowse"
          size="sm"
          :class="$dir.rtl ? 'float-right ml-2' : 'float-left mr-2'"
        >
          <font-awesome-icon :icon="uploading ? 'cog' : 'cloud-upload-alt'" :spin="uploading" class="mx-1 align-middle" />

          {{ uploading ? $t('forms.uploading') : $t('forms.chooseFile') }}
        </b-btn>

        <b-progress
          v-if="progress"
          class="mt-2"
          :class="`bg-${bgVariant}`"
          :value="progress"
          variant="success"
          striped
          :animated="uploading"
        />
      </div>
    </div>

    <image-editor v-if="editor" ref="imageEditor" :aspect-ratio="editorAspectRatio" @change="editorChanged"/>
  </div>
</template>

<script>
import { scaleImage } from '@/lib/images.js'
import FilesDisplay from './FilesDisplay'
import ImageEditor from './ImageEditor'

export default {
  name: 'Uploader',
  components: {
    FilesDisplay,
    ImageEditor
  },
  props: {
    value: { type: String },
    label: { type: String },
    required: { type: Boolean, default: false },
    bgVariant: { type: String, default: 'light' },
    uploadMaxSize: { type: Number, default: 1073741824 }, // 1073741824 bytes = (1 Gig)
    autoScale: { type: Number, default: null }, // pixels
    hasError: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    accept: { type: String, default: '.png,.jpg,.jpeg,.gif,.tiff' },
    docUploadModel: { type: Object, default () { return null } },
    max: { type: Number }, // maximum count of uploadable items in multi
    disabled: { type: Boolean, default: false },
    editor: { type: Boolean, default: false },
    editorAspectRatio: Number,
    lightbox: { type: Boolean, default: true }
  },
  data () {
    return {
      progress: 0,
      filePaths: [],
      uploadErrors: [],
      imageExtensions: ['png', 'jpg', 'jpeg', 'gif', 'tiff']
    }
  },
  computed: {
    showErrorState () {
      return this.hasError || !!this.uploadErrors.length
    },
    uploading () {
      return this.progress > 0
    }
  },
  watch: {
    value: function (val) { // watch it
      if (val) {
        this.filePaths = val.split(',')
      } else {
        this.uploadErrors = []
        this.filePaths = []
      }
    },
    accept (newVal, oldVal) {
      if (newVal !== oldVal) this.checkExtensions()
    }
  },
  mounted () {
    if (this.value) {
      this.filePaths = this.value.split(',')
    }

    this.checkExtensions()
  },
  methods: {
    checkExtensions () {
      this.uploadErrors = []
      if (this.value && this.value.length) {
        this.value.split(',').forEach(f => {
          const ex = f.toLowerCase().split('.').pop()
          if (this.accept && !this.accept.includes('*') && !this.accept.toLowerCase().includes(ex)) {
            this.uploadErrors.push(this.$t('forms.file_extension_not_accepted', { fileName: f, accepted: this.accept }))
          }
        })
      }
    },
    getExtension (file) {
      return file.toUpperCase().split('.').pop()
    },
    isImage (file) {
      return this.imageExtensions.includes(this.getExtension(file).toLowerCase())
    },
    openBrowse () {
      this.$refs.input.click()
    },
    onChangeInputFile (e) {
      this.uploadErrors = []

      const files = e.target.files || e.dataTransfer.files
      if (!files.length) return

      if (this.max && files.length > this.max) {
        this.uploadErrors.push(this.$t('forms.filesNumberExceedsTheLimit', {max: this.max}))
        return
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const ex = file.name.toLowerCase().split('.').pop()
        if (this.accept && !this.accept.includes('*') && !this.accept.toLowerCase().includes(ex)) {
          this.uploadErrors.push(this.$t('forms.file_extension_not_accepted', { fileName: file.name, accepted: this.accept }))
          return
        } else if (file.size > this.uploadMaxSize) {
          this.uploadErrors.push(this.$t('forms.file_max_size_exceeded', { fileName: file.name, maxSize: Math.floor(this.uploadMaxSize / 1024) }))
          return
        }
      }

      if (this.autoScale) {
        const scales = []
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          if (file.type.match(/image.*/)) {
            scales.push(scaleImage(file, this.autoScale))
          } else {
            scales.push(file)
          }
        }
        Promise.all(scales).then(all => {
          if (this.editor && this.isImage(all[0].name))
            this.openEditor(all[0])
          else
            this.upload(all)
        })
      } else {
        if (this.editor && this.isImage(files[0].name))
          this.openEditor(files[0])
        else
          this.upload(files)
      }
    },
    upload (files) {
      this.progress = 0.1
      let promise
      if (this.docUploadModel) {
        promise = this.docUploadModel.api.upload(this.docUploadModel.type, this.docUploadModel.path, files, this.onProgress)
        .then(res => {
          res.forEach(file => {
            this.filePaths.push(file.url.substring(1))
          })
        })
      } else {
        promise = this.$api.files.upload(files, this.onProgress, true)
        .then(res => {
          res.forEach(fileName => {
            this.filePaths.push(`Temp/${fileName}`)
          })
        })
      }
      promise
      .then(() => {
        this.onChange()
        this.emitInput()
        this.progress = 0
        this.cleanInput()
      })
      .catch(e => {
        this.uploadErrors.push(e.message)
        this.progress = 0
        this.cleanInput()
      })
    },
    emitInput () {
      const value = this.filePaths.length ? this.filePaths.toString() : null
      this.$emit('input', value)
    },
    cleanInput () {
      if (this.$refs.input) this.$refs.input.value = ''
    },
    onProgress (e) {
      this.progress = parseInt(e.loaded * 100 / e.total)
      this.$emit('progress', this.progress)
    },
    onChange () {
      this.$emit('change', this.filePaths)
    },
    deleteLocalFiles () {
      this.filePaths = []
    },
    openEditor (file) {
      this.$refs.imageEditor.show(file)
    },
    editorChanged (file) {
      this.upload([file])
    }
  }
}
</script>
