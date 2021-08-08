<template>
  <span>
    <div v-if="modal">
      <b-btn
        :id="modalId"
        :variant="btnVariant"
        :size="btnSize"
        v-b-modal="modalId"
        :class="btnClass"
        :block="!compact"
      >
        <font-awesome-icon fixed-width icon="share-alt" class="align-middle" :class="btnIconClass"/>

        <span v-if="!compact" class="font-weight-bold" :class="{ 'ml-1': $dir.ltr, 'mr-1': $dir.rtl }">
          {{ $t('shared.share') }}
        </span>
      </b-btn>

      <b-tooltip v-if="compact" :target="modalId" triggers="hover">
        {{ $t('shared.share') }}
      </b-tooltip>

      <b-modal
        :id="modalId"
        ref="modal"
        hide-footer
        centered
        :title="$t('shared.share')"
        @hide="reset"
      >
        <items ref="items" :url="url" :title="title" :gray-scale="grayScale" :tooltip="tooltip"/>
      </b-modal>
    </div>

    <div v-else>
      <items :url="url" :title="title" compact :gray-scale="grayScale" :tooltip="tooltip"/>
    </div>
  </span>
</template>

<script>
import Items from './Items'

export default {
  name: 'ShareButton',
  components: {
    Items
  },
  props: {
    url: { type: String, required: true },
    title: { type: String, required: true },
    compact: { type: Boolean, default: false },
    modal: { type: Boolean, default: false },
    modalId: { type: String, default: 'shareModal' },
    btnVariant: { type: String },
    btnSize: { type: String },
    btnClass: { type: String },
    btnIconClass: { type: String },
    grayScale: { type: Boolean, default: false },
    tooltip: { type: Boolean, default: false }
  },
  methods: {
    reset () {
      this.$refs.items.reset()
    }
  }
}
</script>
