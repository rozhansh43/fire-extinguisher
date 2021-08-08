import config from 'SrcConfig'
import * as types from '@/store/types'

export default function ({ app, store }) {
  if (app.$api.settings.modules.has('products') && !store.state.$productsListView) {
    const productsListView = app.$cookies.get(types.PRODUCTS_LIST_VIEW_COOKIE) || config.defaultProductsListView
    store.commit(types.SET_PRODUCTS_LIST_VIEW, { value: productsListView, cookies: app.$cookies })
  }
}
