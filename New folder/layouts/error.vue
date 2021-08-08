<template>
  <div class="my-5 flex-row align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-7">
          <img class="d-block mx-auto mb-4" :src="image">
          <div class="clearfix">
            <h1 class="float-left display-3 mr-4">
              {{ error.statusCode }}
            </h1>
            <h4 class="pt-3">
              {{ message }}
            </h4>
            <p class="text-muted">
              {{ description }}
            </p>
          </div>
          <pre v-if="stack" dir="ltr" class="text-left">
            {{ stack }}
          </pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as types from '@/store/types'

export default {
  name: 'Error',
  props: ['error'],
  computed: {
    image() {
      if (this.error.statusCode < 500) {
        return '/img/404.png'
      } else {
        return '/img/500.png'
      }
    },
    message() {
      if (this.error.statusCode === 404) {
        return this.$t('shared.oopsYouAreLost')
      } else {
        return this.$t('shared.oopsWeHaveAProblem')
      }
    },
    description() {
      if (this.error.statusCode === 404) {
        return this.$t('shared.thePageYouAreLookingForWasNotFound')
      } else if (this.error.statusCode >= 500) {
        return this.$t('shared.thePageYouAreLookingForIsTemporaryUnavailable')
      } else {
        return this.error.message
      }
    },
    stack() {
      if (process.env.NODE_ENV === 'development' && this.error.stack) {
        return this.error.stack
      } else {
        return null
      }
    }
  },
  mounted () {
    this.$store.commit(types.SET_DOWNLOAD_PROGRESS, 0)
  }
}
</script>
