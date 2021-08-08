import * as types from '@/store/types'

export default function ({ app, store, error }) {
  if (app.$api.settings.modules.has('menus') && !store.state.$mainMenu) {
    return app.$api.menus.getById('main')
    .then(res => {
      store.commit(types.SET_MAIN_MENU, res)
    })
    .catch(err => {
      error(err)
    })
  }
}
