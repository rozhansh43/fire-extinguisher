import * as types from '@/store/types'

export default function ({ app, store }) {
  if (!store.state.$account) {
    const account = app.$cookies.get(types.ACCOUNT_COOKIE)
    if (account) {
      store.commit(types.SET_ACCOUNT, { value: account, cookies: app.$cookies })
    }
  }
}
