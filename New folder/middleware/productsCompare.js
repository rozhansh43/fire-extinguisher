import * as types from '@/store/types'

export default function ({ app, store }) {
  if (app.$api.settings.modules.has('products') && !store.state.$productsCompare) {
    const productsCompare = app.$cookies.get(types.PRODUCTS_COMPARE_COOKIE) || []
    store.commit(types.PRODUCTS_SET_COMPARE, { value: productsCompare, cookies: app.$cookies })
  }
}
