<template>
  <div class="p-3">
    <b-btn variant="link" class="add-button rounded text-muted h-100" :style="columnStyle" @click="$emit('click')">
      <font-awesome-icon icon="plus" class="display-3 mb-4"/>

      <div>{{ $t('compare.addNewItem') }}</div>
    </b-btn>
  </div>
</template>

<script>
export default {
  name: 'AddButton',
  props: {
    columnWidth: { type: Number, required: true }
  },
  computed: {
    columnStyle () {
      return {
        'min-width': `${this.columnWidth}px`,
        'max-width': `${this.columnWidth}px`
      }
    }
  }
}
</script>
