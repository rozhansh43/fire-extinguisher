<template>
  <div
    v-if="progress"
    class="progress-backdrop d-flex justify-content-center align-items-center animated fadeIn"
  >
    <!-- <div
      :style="{ width: `${progress}%`, height: `${height}px` }"
      class="bar bg-success fixed-top"
    /> -->
    
    <b-spinner type="grow" label="Spinning" variant="primary" class="spinner"></b-spinner>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Progress',
  computed: {
    progress() {
      return this.$uploadProgress || this.$downloadProgress
    },
    ...mapState(['$uploadProgress', '$downloadProgress'])
  }
}
</script>

<style lang="scss">
.progress-backdrop {
  background-color: rgba(255, 255, 255, .75);
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1100;

  .spinner {
    width: 3rem;
    height: 3rem;
  }
}
</style>
