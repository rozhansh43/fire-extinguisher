<template>
  <div>
    <div class="position-relative">
      <div class="table-wrap text-left" dir="ltr" @contextmenu="openCtxMenu">
        <b-table
          small
          stacked="sm"
          hover
          :head-variant="variant"
          :fields="fields"
          :items="files"
          :busy="progressing"
          class="mb-0"
          selectable
          select-mode="single"
          :tbody-tr-class="getRowClass"
          @row-selected="rowSelected"
          @row-contextmenu="rowContextMenu"
        >
          <template v-slot:cell(name)="data">
            <font-awesome-icon
            size="lg"
            class="mx-2"
            :icon="data.item.icon"
            :class="getIconClass(data.item)"
            />
            <strong v-if="data.item.folder">{{ data.item.name }}</strong>
            <span v-else>{{ data.item.name }}</span>
          </template>
          <template v-slot:cell(type)="data">
            <strong v-if="data.item.folder">{{ data.item.type }}</strong>
            <span class="small" v-else>{{ data.item.type }}</span>
          </template>
          <div slot="table-busy" class="text-center text-danger my-5" :dir="$t('direction')">
            <b-spinner class="align-middle"></b-spinner>
            <strong class="mx-3">{{$t('fileManager.loading')}} ...</strong>
          </div>
        </b-table>
      </div>

      <b-list-group
        v-if="ctxMenu.open"
        class="ctx-menu shadow-sm"
        :style="ctxMenuPosStyle"
      >
        <b-list-group-item class="py-2 px-1" button @click="emitCopy" v-if="ctxMenu.item">
          <font-awesome-icon icon="copy" fixed-width class="text-muted align-middle mx-1" />
          {{$t('fileManager.copy')}}
          </b-list-group-item>
        <b-list-group-item class="py-2 px-1" button @click="emitCut" v-if="ctxMenu.item">
          <font-awesome-icon icon="cut" fixed-width class="text-muted align-middle mx-1" />
          {{$t('fileManager.cut')}}
          </b-list-group-item>
        <b-list-group-item class="py-2 px-1" :class="{'bg-light': !clipboard.item}" button :disabled="!clipboard.item" @click="emitPaste">
          <font-awesome-icon icon="paste" fixed-width class="align-middle mx-1" :class="{'text-muted': clipboard.item, 'text-moremuted': !clipboard.item}" />
          {{$t('fileManager.paste')}}
        </b-list-group-item>
        <b-list-group-item class="py-2 px-1" button @click="emitRename" v-if="ctxMenu.item">
          <font-awesome-icon icon="italic" fixed-width class="text-muted align-middle mx-1" />
          {{$t('fileManager.rename')}}
        </b-list-group-item>
        <b-list-group-item class="py-2 px-1" button @click="emitRemove" v-if="ctxMenu.item">
          <font-awesome-icon icon="trash-alt" fixed-width class="text-muted align-middle mx-1" />
          {{$t('fileManager.remove')}}
        </b-list-group-item>
      </b-list-group>
    </div>
    <div
      v-if="ctxMenu.open"
      class="ctx-menu-backdrop"
      @contextmenu.prevent="removeCtxMenuItem"
      @keyup.esc="removeCtxMenuItem"
      @click="removeCtxMenuItem"
      tabindex="0"
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'FFiles',
  props: {
    items: { type: Array, default () { return [] } },
    progressing: { type: Boolean, required: true },
    variant: { type: String, default: 'light' },
    picked: { type: Object },
    clipboard: { type: Object, default () { return null } }
  },
  data() {
    return {
      fields: [
        {
          key: 'name',
          label: this.$t('fileManager.fileName')
        },
        {
          key: 'type',
          label: this.$t('fileManager.type')
        }
      ],
      ctxMenu: {
        open: false,
        item: null,
        x: 0,
        y: 0
      }
    }
  },
  computed: {
    files () {
      return this.items.map(i => {
        i.type = i.folder ? this.$t('fileManager.folder') : this.getType(i)
        i.icon = this.getIcon(i)
        return i
      })
    },
    ctxMenuPosStyle () {
      return {
        left: `${this.ctxMenu.x}px`,
        top: `${this.ctxMenu.y}px`
      }
    }
  },
  watch: {
    'ctxMenu.item' (val) {
      if (!val) {
        window.removeEventListener('keyup', this.onEscapeKeyUp)
      } else {
        window.addEventListener('keyup', this.onEscapeKeyUp)
      }
    }
  },
  methods: {
    emitCopy () {
      this.$emit('copy', this.ctxMenu.item)
      this.removeCtxMenuItem()
    },
    emitCut () {
      this.$emit('cut', this.ctxMenu.item)
      this.removeCtxMenuItem()
    },
    emitRename () {
      this.$emit('rename', this.ctxMenu.item)
      this.removeCtxMenuItem()
    },
    emitRemove () {
      this.$emit('remove', this.ctxMenu.item)
      this.removeCtxMenuItem()
    },
    emitPaste () {
      this.$emit('paste')
      this.removeCtxMenuItem()
    },
    removeCtxMenuItem () {
      this.ctxMenu.item = null
      this.ctxMenu.open = false
    },
    onEscapeKeyUp(event) {
      if (event.which === 27) {
        this.ctxMenu.item = null
        this.ctxMenu.open = false
      }
    },
    getType (item) {
      const re = /(?:\.([^.]+))?$/
      return re.exec(item.name)[1]
    },
    getIcon (item) {
      const type = item.type.toLowerCase()
      switch (type) {
        case 'folder':
          return 'folder'
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'png':
        case 'tif':
        case 'ico':
          return 'file-image'
        case 'html':
        case 'htm':
        case 'php':
        case 'aspx':
          return 'file-code'
        case 'zip':
        case 'gzip':
        case 'rar':
          return 'file-archive'
        case 'mp3':
        case 'wma':
        case 'wav':
          return 'file-audio'
        case 'mp4':
        case '3gp':
        case 'ogg':
        case 'wmv':
        case 'webm':
        case 'flv':
        case 'mov':
          return 'file-video'
        case 'pdf':
          return 'file-pdf'
        case 'doc':
        case 'docx':
          return 'file-word'
        case 'xls':
        case 'xlsx':
        case 'xlsm':
        case 'xltx':
        case 'xltm':
          return 'file-excel'
        case 'ppt':
        case 'pptx':
        case 'pptm':
          return 'file-powerpoint'
        default:
          return 'file'
      }
    },
    rowContextMenu (item, index, e) {
      e.preventDefault()

      this.ctxMenu.open = true
      this.ctxMenu.item = item
      this.ctxMenu.x = e.layerX
      this.ctxMenu.y = e.layerY
    },
    getIconClass (item) {
      if (item.folder) return 'text-warning'
      if (item.icon === 'file-image') return 'text-success'
      if (item.icon === 'file-video' || item.icon === 'file-audio') return 'text-info'
      else return 'text-secondary'
    },
    getRowClass (item) {
      if (!item) return null

      let cls = (item && item.folder) ? 'bg-bright cursor-pointer' : 'cursor-pointer'

      if (this.clipboard.item && this.clipboard.item.path === item.path) {
        if (this.clipboard.action === 'copy')
          cls += ' table-warning'
        else if (this.clipboard.action === 'cut')
          cls += ' table-warning text-muted'
      }

      return cls
    },
    rowSelected (items) {
      const item = items[0]

      this.$emit('select', (item && !item.folder) ? item : null)

      if (item && item.folder)
        this.$emit('folder', item.path)
    },
    openCtxMenu (e) {
      e.preventDefault()
      this.ctxMenu.open = true
      this.ctxMenu.x = e.layerX
      this.ctxMenu.y = e.layerY
    }
  }
}
</script>

<style lang="scss" scoped>
.table-wrap {
  height: 300px;
  overflow-y: auto;
}
.ctx-menu {
  position: absolute;
  z-index: 1;
  min-width: 150px;
}
.ctx-menu-backdrop {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 0;
}
</style>

