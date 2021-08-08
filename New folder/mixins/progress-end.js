import * as types from '@/store/types'

export default {
  mounted () {
    this.$store.commit(types.SET_DOWNLOAD_PROGRESS, 100)
    setTimeout(() => {
      this.$store.commit(types.SET_DOWNLOAD_PROGRESS, 0)
    }, 200)
  }
}
