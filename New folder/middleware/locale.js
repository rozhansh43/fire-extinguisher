import config from 'SrcConfig'
import * as types from '@/store/types'

export default function ({ app, store }) {
  if (!store.state.$locale) {
    const locale = app.$cookies.get(types.LOCALE_COOKIE) || config.locale
    store.commit(types.SET_LOCALE, { value: locale, cookies: app.$cookies })
  }
}
