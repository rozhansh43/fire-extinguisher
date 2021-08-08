<template>
  <div>
    <f-toolbar
      :progressing="progressing"
      :class="[`bg-${variant}`, { 'rounded-xl border-0': !inModal }]"
      @openCreateFolder="openCreateFolderDialog"
      @openUploader="openUploaderDialog"
      @refresh="refresh"
    />

    <f-breadcrumb
      :class="`bg-${variant}`"
      :items="breadcrumbItems"
      @click="getFolder"
    />

    <f-files
      :items="folderItems"
      :class="{ 'rounded-bottom': !picker }"
      :variant="variant"
      :progressing="progressing"
      :selected="selected"
      @select="select"
      @folder="getFolder"
      @copy="copy"
      @cut="cut"
      @paste="paste"
      @remove="remove"
      @rename="openRenameDialog"
      :clipboard="clipboard"
    />

    <f-footer v-if="picker" class="rounded-bottom" :selected="selected" @confirm="emitPick" @cancel="emitClose"/>

    <f-create-folder v-if="createFolderOpen" @confirm="createFolder" @cancel="closeCreateFolderDialog"/>

    <f-uploader v-if="uploaderOpen" :api="api" :doc-type="docType" :path="path" @close="closeUploaderDialog"/>

    <f-rename v-if="!!renameItem" :old-name="renameItem.name" @confirm="rename" @cancel="closeRenameDialog"/>
  </div>
</template>

<script>
import FBreadcrumb from './Breadcrumb'
import FCreateFolder from './CreateFolder'
import FFiles from './Files'
import FFooter from './Footer'
import FRename from './Rename'
import FToolbar from './Toolbar'
import FUploader from './Uploader'

export default {
  name: 'FileManager',
  components: {
    FBreadcrumb,
    FCreateFolder,
    FFiles,
    FFooter,
    FRename,
    FToolbar,
    FUploader
  },
  props: {
    api: { type: Object, required: true },
    picker: { type: Boolean, default: false },
    docType: { type: String, default: 'file' }, // image | file | media
    variant: { type: String, default: 'light' },
    inModal: { type: Boolean, default: true }
  },
  data() {
    return {
      folderItems: [],
      selected: null,
      progressing: true,
      path: '',
      createFolderOpen: false,
      uploaderOpen: false,
      clipboard: {
        item: null,
        action: null
      },
      renameItem: null
    }
  },
  computed: {
    breadcrumbItems () {
      const secs = this.path.split('/').filter(s => s.trim().length)
      if (secs.length < 1) return []

      const result = []
      for (let i = 0; i < secs.length; i++) {
        const prevPath = (i === 0) ? '' : result[i - 1].path
        const sec = secs[i]
        result.push({
          name: sec,
          path: `${prevPath}/${sec}`
        })
      }
      return result
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    copy (item) {
      this.clipboard.item = item
      this.clipboard.action = 'copy'
    },
    cut (item) {
      this.clipboard.item = item
      this.clipboard.action = 'cut'
    },
    paste () {
      let promise = null
      if (`${this.path}/${this.clipboard.item.name}` === this.clipboard.item.path) {
        this.clipboard.item = null
        this.clipboard.action = null
      } else if (this.clipboard.item.folder) {
        if (this.clipboard.action === 'cut') {
          if (this.path.startsWith(this.clipboard.item.path)) {
            this.$showError(this.$t('fileManager.cantMoveFolderToItself'))
          } else {
            this.progressing = true
            promise = this.api.moveFolder(this.docType, this.clipboard.item.path, `${this.path}/${this.clipboard.item.name}`)
          }
        } else {
          this.progressing = true
          promise = this.api.copyFolder(this.docType, this.clipboard.item.path, `${this.path}/${this.clipboard.item.name}`)
        }
      } else {
        if (this.clipboard.action === 'cut') {
          promise = this.api.moveDoc(this.docType, this.clipboard.item.path, `${this.path}/${this.clipboard.item.name}`)
        } else {
          promise = this.api.copyDoc(this.docType, this.clipboard.item.path, `${this.path}/${this.clipboard.item.name}`)
        }
      }

      if (!promise)
        return

      promise
      .then(() => {
        this.clipboard.item = null
        this.clipboard.action = null
      })
      .catch(err => {
        this.$showError(this.$getLocaleErrorMessage(err, 'fileManager'))
      })
      .then(() => {
        this.refresh()
      })
    },
    remove (item) {
      if (confirm(this.$t('shared.areYouSureToRemoveThisItem'))) {
        let promise
        if (item.folder)
          promise = this.api.deleteFolder(this.docType, item.path)
        else
          promise = this.api.deleteDoc(this.docType, item.path)

        promise
        .catch(err => {
          this.$showError(this.$getLocaleErrorMessage(err, 'fileManager'))
        })
        .then(() => {
          this.refresh()
        })
      }
    },
    refresh () {
      this.getFolder(this.path)
    },
    openCreateFolderDialog () {
      this.createFolderOpen = true
    },
    openRenameDialog (item) {
      this.renameItem = item
    },
    closeCreateFolderDialog () {
      this.createFolderOpen = false
    },
    closeRenameDialog () {
      this.renameItem = null
    },
    openUploaderDialog () {
      this.uploaderOpen = true
    },
    closeUploaderDialog (docs) {
      if (docs && docs.length) this.refresh()
      this.uploaderOpen = false
    },
    select (item) {
      this.selected = item

      this.$emit('select', (item && !item.folder) ? item : null)
    },
    getFolder (path) {
      this.progressing = true
      this.path = path

      this.api.getFolderByPath(this.docType, path)
      .then(res => {
        this.folderItems = res.folders.map(f => ({
            url: f.url,
            path: f.path,
            name: f.name,
            folder: true
          }))

        this.folderItems = this.folderItems
        .concat(res.docs.map(d => ({
          url: d.url,
          path: d.path,
          name: d.name,
          size: d.size,
          folder: false
        })))

        this.progressing = false
      })
      .catch(err => {
        this.$showError(this.$getLocaleErrorMessage(err, 'fileManager'))
        this.progressing = false
      })
    },
    createFolder (name) {
      const path = `${this.path}/${name}`
      this.api.createFolder(this.docType, path)
      .then(() => {
        this.refresh()
      })
      .catch(err => {
        this.$showError(this.$getLocaleErrorMessage(err, 'fileManager'))
      })
    },
    rename (newName) {
      let promise
      if (this.renameItem.folder) {
        promise = this.api.renameFolder(this.docType, this.path, this.renameItem.name, newName)
      } else {
        promise = this.api.renameDoc(this.docType, this.path, this.renameItem.name, newName)
      }
      promise
      .then(() => {
        this.refresh()
      })
      .catch(err => {
        this.$showError(this.$getLocaleErrorMessage(err, 'fileManager'))
      })
    },
    emitPick () {
      const url = this.$config.files.staticServerUrl + this.selected.url
      // this.$emit('pick', url, {name: this.selected.name, alt: this.selected.name, text: this.selected.name})
      this.$emit('pick', url)
      this.emitClose()
    },
    emitClose () {
      this.$emit('close')
    }
  }
}
</script>
