<template>
  <div class="p-2 border-bottom d-flex">
    <b-btn size="sm" variant="silver" :disabled="progressing" @click="emitCreateFolder">
      <font-awesome-layers class="align-middle" fixed-width>
        <font-awesome-icon icon="folder" size="lg" class="text-white"/>
        <font-awesome-icon icon="plus" transform="shrink-7 down-1 left-1"/>
      </font-awesome-layers>

      <span :class="{ 'ml-1': $dir.ltr, 'mr-1': $dir.rtl }">
        {{ $t('fileManager.createFolder') }}
      </span>
    </b-btn>

    <b-btn size="sm" variant="silver" class="mx-2" :disabled="progressing" @click="emitUpload">
      <font-awesome-layers class="align-middle" fixed-width>
        <font-awesome-icon icon="cloud" size="lg" class="text-white"/>
        <font-awesome-icon icon="arrow-up" transform="shrink-3 down-1 left-4"/>
      </font-awesome-layers>

      <span :class="{ 'ml-1': $dir.ltr, 'mr-1': $dir.rtl }">
        {{ $t('fileManager.upload') }}
      </span>
    </b-btn>

    <div class="mr-auto">
      <b-btn size="sm" variant="link" :disabled="progressing" @click="emitRefresh">
      <font-awesome-icon icon="sync" :spin="progressing" size="lg" class="text-secondary"/>
    </b-btn>
    </div>
  </div>
</template>

<script>
import { FontAwesomeLayers } from '@fortawesome/vue-fontawesome'

export default {
  name: 'FToolbar',
  components: {
    FontAwesomeLayers
  },
  props: {
    progressing: { type: Boolean, required: true }
  },
  methods: {
    emitRefresh () {
      this.$emit('refresh')
    },
    emitCreateFolder () {
      this.$emit('openCreateFolder')
    },
    emitUpload () {
      this.$emit('openUploader')
    }
  }
}
</script>
