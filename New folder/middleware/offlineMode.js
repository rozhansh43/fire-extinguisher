import * as types from '@/store/types'

export default function ({ app, store, error }) {
  if (app.$api.settings.modules.has('offlineMode') && !store.state.$offlineMode) {
    return app.$api.settings.getOffline()
    .then(res => {
      store.commit(types.SET_OFFLINEMODE, res)
    })
    .catch(err => {
      error(err)
    })
  }
}
