import * as types from '@/store/types'

export default function ({ store }) {
  if (process.client) {
    store.commit(types.SET_DOWNLOAD_PROGRESS, 0)
  }
}
