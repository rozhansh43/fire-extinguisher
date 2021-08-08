<template>
  <div>
    <div
      v-if="progress"
      :style="{ height: `${height}px` }"
      class="bar bg-transparent w-100 fixed-top"
    />
    <div
      :style="{ width: `${progress}%`, height: `${height}px` }"
      class="bar bg-info fixed-top"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'

let body
if (process.client) body = document.getElementsByTagName('body')[0]

export default {
  name: 'ProgressBar',
  props: {
    height: { default: 3, type: Number }
  },
  computed: {
    progress() {
      const progress = this.$uploadProgress || this.$downloadProgress

      if (process.client) {
        if (progress)
          body.classList.add('cursor-wait')
        else
          body.classList.remove('cursor-wait')
      }

      return progress
    },
    ...mapState(['$uploadProgress', '$downloadProgress'])
  }
}
</script>

<style lang="scss">
.bar {
  // opacity: 0.5;
  transition: width 0.3s;
}
.cursor-wait {
  cursor: wait !important
}
</style>
