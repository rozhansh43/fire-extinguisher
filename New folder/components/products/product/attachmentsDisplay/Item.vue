<template>
  <div v-if="value" :class="{ 'border-top pt-3': index }">
    <b-row class="align-items-center">
      <b-col :class="{ 'mb-3': !noSpaceOnBottom || index !== listLength - 1 }">
        <font-awesome-icon
          :icon="downloadable ? 'lock-open' : 'lock'"
          class="text-moremuted align-middle"
          size="lg"
          :class="{ 'mr-2': $dir.ltr, 'ml-2': $dir.rtl }"
        />

        {{ value.name }}
      </b-col>

      <b-col v-if="downloadable" md="auto">
        <b-btn
          block
          variant="info"
          :class="{ 'mb-3': !noSpaceOnBottom || index !== listLength - 1 }"
          :disabled="progressing"
          @click="download"
        >
          <font-awesome-icon
            :icon="progressing ? 'cog' : 'download'"
            :spin="progressing"
            class="align-middle"
            :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
          />

          {{ $t('files.download') }}
        </b-btn>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'AttachmentsDisplay',
  props: {
    value: { type: Object, required: true },
    downloadable: { type: Boolean, default: false },
    noSpaceOnBottom: { type: Boolean, default: false },
    listLength: { type: Number, required: true },
    index: { type: Number, required: true }
  },
  data () {
    return {
      progressing: false
    }
  },
  methods: {
    download () {
      this.progressing = true

      this.$api.productAttachments.download(this.value.id)
      .then(file => {
        this.progressing = false
        
        const fileURL = window.URL.createObjectURL(new Blob([file]))
        const fileLink = document.createElement('a')

        fileLink.href = fileURL
        fileLink.setAttribute('download', this.value.name)
        document.body.appendChild(fileLink)

        fileLink.click()
        fileLink.remove()
      })
      .catch(err => {
        this.progressing = false
        this.$showError(this.$getLocaleErrorMessage(err, 'files'))
      })
    }
  }
}
</script>
