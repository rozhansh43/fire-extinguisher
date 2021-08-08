<template>
  <small
    v-if="text"
    class="card-header py-2 px-3 mb-2 rounded-pill d-inline-block"
    :class="{ 'mr-2': $dir.ltr, 'ml-2': $dir.rtl }"
  >
    {{ text }}

    <button
      type="button"
      class="close"
      aria-label="Close"
      :class="{ 'ml-2': $dir.ltr, 'mr-2': $dir.rtl }"
      @click="emitRemove"
    >
      <small aria-hidden="true">&times;</small>
    </button>
  </small>
</template>

<script>
export default {
  name: 'FilterItem',
  props: {
    text: { type: String, required: true }
  },
  methods: {
    emitRemove () {
      this.$emit('remove')
    }
  }
}
</script>
