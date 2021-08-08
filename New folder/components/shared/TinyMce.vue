<template>
  <div :class="title ? 'tiny-rounded-bottom' : 'tiny-rounded'">
    <h6 v-if="title" class="tinymce-title">
      {{ title }}

      <required-symbol v-if="required"/>
    </h6>

    <editor
      v-if="scriptsLoaded"
      api-key="no-api-key"
      :disabled="disabled"
      :initial-value="value"
      :value="value"
      @input="emitInput"
      :init="tinymceConfig"
    />

    <b-modal
      v-if="docsApi"
      ref="fmodal"
      size="xl"
      body-class="p-0"
      centered
      no-fade
      hide-footer
      no-close-on-esc
      no-close-on-backdrop
      lazy
      @hide="closeFileManager"
      :title="$t('fileManager.mediaGallery')"
    >
      <file-manager
        picker
        :doc-type="fileManager.docType"
        @pick="pick"
        @close="closeFileManager"
        :api="docsApi"
      />
    </b-modal>
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import FileManager from './FileManager'

export default {
  name: 'TinyMce',
  components: {
    Editor,
    FileManager
  },
  props: {
    docsApi: { type: Object },
    title: { type: String, default: undefined },
    value: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
    contentSkin: { type: String, default: 'default' }, // default | dark
    resize: { type: Boolean, default: false },
    height: { type: Number, default: undefined },
    maxHeight: { type: Number, default: undefined },
    mode: { type: String, default: 'full' },
    cssUrl: { type: String, default: undefined },
    required: { type: Boolean, default: false }
  },
  data () {
    const language = this.$config.locale === 'fa' ? 'fa_IR' : undefined

    const modes = {
      full: {
        plugins: ['paste', 'link', 'directionality', 'lists', 'advlist', 'autoresize', 'code', 'image', 'media', 'hr', 'fullscreen', 'table', 'wordcount', 'searchreplace'],
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | table | outdent indent | forecolor backcolor | image media | rtl ltr | searchreplace | fullscreen code',
        menubar: 'edit view insert format tools table'
      },
      noMedia: {
        plugins: ['paste', 'link', 'directionality', 'lists', 'advlist', 'autoresize', 'code', 'hr', 'fullscreen', 'table', 'wordcount', 'searchreplace'],
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | table | outdent indent | forecolor backcolor | rtl ltr | searchreplace | fullscreen code',
        menubar: 'edit view insert format tools table'
      },
      simple: {
        plugins: ['paste', 'link', 'directionality', 'lists', 'advlist', 'autoresize', 'fullscreen'],
        toolbar: 'bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | rtl ltr',
        menubar: ''
      }
    }

    const contentCss = [`/tinymce/skins/content/${this.contentSkin}/content.min.css`]
    if (this.cssUrl) contentCss.push(`${this.cssUrl}?v=${new Date().getTime()}`)

    const vm = this

    return {
      tinymceConfig: {
        // skin: 'persina',
        base_url: '/tinymce',
        directionality : vm.$t('direction'),
        language,
        content_css: contentCss,
        plugins: modes[vm.mode].plugins,
        menubar: modes[vm.mode].menubar,
        toolbar: modes[vm.mode].toolbar,
        min_height: vm.height,
        max_height: vm.maxHeight,
        autoresize_bottom_margin: 30,
        resize: vm.resize,
        branding: false,
        table_default_attributes: { class: 'table' },
        table_default_styles: { },
        table_responsive_width: true,
        table_class_list: [
          {title: 'None', value: 'table'},
          {title: 'Striped Rows', value: 'table table-striped'},
          {title: 'Bordered', value: 'table table-bordered'},
          {title: 'Bordered Striped Rows', value: 'table table-bordered table-striped'},
          {title: 'Borderless', value: 'table table-borderless'},
          {title: 'Hoverable', value: 'table table-hover'},
          {title: 'Small', value: 'table table-sm'},
          {title: 'Small Striped Rows', value: 'table table-sm table-striped'},
          {title: 'Small Bordered', value: 'table table-sm table-bordered'},
          {title: 'Small Bordered Striped Rows', value: 'table table-sm table-bordered table-striped'},
          {title: 'Small Borderless', value: 'table table-sm table-borderless'},
          {title: 'Small Hoverable', value: 'table table-sm table-hover'}
        ],
        table_row_class_list: [
          {title: 'None', value: ''},
          {title: 'Primary', value: 'table-primary'},
          {title: 'Success', value: 'table-success'},
          {title: 'Danger', value: 'table-danger'},
          {title: 'Info', value: 'table-info'},
          {title: 'Warning', value: 'table-warning'},
          {title: 'Active', value: 'table-active'},
          {title: 'Secondary', value: 'table-secondary'},
          {title: 'Light', value: 'table-light'},
          {title: 'Dark', value: 'table-dark'}
        ],
        table_cell_class_list: [
          {title: 'None', value: ''},
          {title: 'Primary', value: 'table-primary'},
          {title: 'Success', value: 'table-success'},
          {title: 'Danger', value: 'table-danger'},
          {title: 'Info', value: 'table-info'},
          {title: 'Warning', value: 'table-warning'},
          {title: 'Active', value: 'table-active'},
          {title: 'Secondary', value: 'table-secondary'},
          {title: 'Light', value: 'table-light'},
          {title: 'Dark', value: 'table-dark'}
        ],
        file_picker_callback (callback, value, meta) {
          vm.fileManager.callback = callback
          vm.fileManager.value = value
          vm.fileManager.docType = meta.filetype // image | file | media

          vm.openFileManager()
        }
      },
      fileManager: {
        open: false,
        callback: null,
        docType: null,
        value: null
      },
      scriptsLoaded: false
    }
  },
  mounted () {
    this.loadScripts()
  },
  methods: {
    loadScripts() {
      if (process.server)
        return

      // eslint-disable-next-line no-unused-expressions
      import('tinymce/tinymce')
      .then(() => {
        Promise.all([
          // eslint-disable-next-line no-unused-expressions
          import('tinymce/plugins/advlist'),
          // eslint-disable-next-line no-unused-expressions
          import('tinymce/plugins/autoresize'),
          // eslint-disable-next-line no-unused-expressions
          import('tinymce/plugins/code'),
          // eslint-disable-next-line no-unused-expressions
          import('tinymce/plugins/directionality'),
          // eslint-disable-next-line no-unused-expressions
          import('tinymce/plugins/fullscreen'),
          // eslint-disable-next-line no-unused-expressions
          import('tinymce/plugins/hr'),
          // eslint-disable-next-line no-unused-expressions
          import('tinymce/plugins/image'),
          // eslint-disable-next-line no-unused-expressions
          import('tinymce/plugins/link'),
          // eslint-disable-next-line no-unused-expressions
          import('tinymce/plugins/lists'),
          // eslint-disable-next-line no-unused-expressions
          import('tinymce/plugins/media'),
          // eslint-disable-next-line no-unused-expressions
          import('tinymce/plugins/paste'),
          // eslint-disable-next-line no-unused-expressions
          import('tinymce/plugins/searchreplace'),
          // eslint-disable-next-line no-unused-expressions
          import('tinymce/themes/silver/theme'),
          // eslint-disable-next-line no-unused-expressions
          import('tinymce/plugins/table'),
          // eslint-disable-next-line no-unused-expressions
          import('tinymce/plugins/wordcount')
        ])
        .then(() => {
          this.scriptsLoaded = true
        })
      })

      // const scripts = [
      //   'node_modules/tinymce/tinymce/tinymce.js',
      //   'node_modules/tinymce/tinymce/tinymce.min.js',
      //   'node_modules/tinymce/plugins/advlist/plugin.min.js',
      //   'node_modules/tinymce/plugins/autoresize/plugin.min.js',
      //   'node_modules/tinymce/plugins/code/plugin.min.js',
      //   'node_modules/tinymce/plugins/directionality/plugin.min.js',
      //   'node_modules/tinymce/plugins/fullscreen/plugin.min.js',
      //   'node_modules/tinymce/plugins/hr/plugin.min.js',
      //   'node_modules/tinymce/plugins/image/plugin.min.js',
      //   'node_modules/tinymce/plugins/link/plugin.min.js',
      //   'node_modules/tinymce/plugins/lists/plugin.min.js',
      //   'node_modules/tinymce/plugins/media/plugin.min.js',
      //   'node_modules/tinymce/plugins/paste/plugin.min.js',
      //   'node_modules/tinymce/plugins/searchreplace/plugin.min.js',
      //   'node_modules/tinymce/plugins/table/plugin.min.js',
      //   'node_modules/tinymce/plugins/wordcount/plugin.min.js',
      //   'node_modules/tinymce/themes/silver/theme.min.js'
      // ]

      // scripts.forEach(script => {
      //   const tag = document.createElement('script')
      //   tag.setAttribute('src', script)
      //   document.head.appendChild(tag)
      // })
    },
    emitInput (val) {
      this.$emit('input', val)
    },
    pick (fileUrl, fileMeta) {
      this.fileManager.callback(fileUrl, fileMeta)
    },
    openFileManager () {
      this.fileManager.open = true
      this.$refs.fmodal.show()
    },
    closeFileManager () {
      this.fileManager.open = false
      this.$refs.fmodal.hide()
    }
  }
}
</script>
