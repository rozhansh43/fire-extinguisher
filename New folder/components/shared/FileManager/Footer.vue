<template>
  <div class="p-2 bg-light border-top" :class="{'text-right': $dir.ltr, 'text-left': $dir.rtl}">
    <b-btn size="sm" variant="secondary" class="mx-2" @click="emitCancel">
      {{ $t('shared.cancel') }}
    </b-btn>
    <b-btn size="sm" variant="success" @click="emitConfirm" v-if="selected">
      <font-awesome-icon icon="check" size="lg"></font-awesome-icon>
      <span class="ml-2"></span>
      {{ $t('shared.select') }}
    </b-btn>
  </div>
</template>

<script>
export default {
  name: 'FFooter',
  props: {
    selected: {Type: [Boolean, Object], default: false}
  },
  methods: {
    emitConfirm () {
      this.$emit('confirm')
    },
    emitCancel () {
      this.$emit('cancel')
    }
  }
}
</script>
