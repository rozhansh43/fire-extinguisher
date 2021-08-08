<template>
  <div class="text-muted small text-center">
    <p>
      <font-awesome-icon
      icon="copy"
      class="align-middle"
      :class="{'mr-1': $dir.ltr, 'ml-1': $dir.rtl}" />
      {{$t('shared.shareLink')}}
    </p>
    <span @click="copy" dir="ltr" class="text-muted cursor-pointer">
      {{`${$config.websiteUrl}/${model}/${id}`}}
    </span>
    <input class="sr-only" ref="url" :value="`${$config.websiteUrl}/${model}/${id}`" />
  </div>
</template>

<script>
export default {
  name: 'ShareLink',
  props: ['id', 'model'],
  methods: {
    copy () {
      this.$refs.url.select()
      document.execCommand('copy')
      this.$showInfo(this.$t('shared.shareLinkCopiedToYourClipboard'))
    }
  }
}
</script>
