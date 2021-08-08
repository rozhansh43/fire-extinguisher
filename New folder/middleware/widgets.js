import * as types from '@/store/types'

export default function ({ app, store, error }) {
  if (app.$api.settings.modules.has('widgets')) {
    const promises = []
    
    promises.push(store.state.$topBarWidgets ? null : app.$api.widgetAreas.getById('top bar'))
    promises.push(store.state.$footerWidgets ? null : app.$api.widgetAreas.getById('web footer'))
    
    return Promise.all(promises)
    .then(all => {
      if (all && all[0] && all[0].widgets) store.commit(types.SET_TOP_BAR_WIDGETS, all[0].widgets)
      if (all && all[1] && all[1].widgets) store.commit(types.SET_FOOTER_WIDGETS, all[1].widgets)
    })
    .catch(error)
  }
}
