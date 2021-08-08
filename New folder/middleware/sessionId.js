import * as types from '@/store/types'

export default function ({ app, store }) {
  if (app.$api.settings.modules.has('popups') && !store.state.$sessionId) {
    const sessionId = app.$cookies.get(types.SESSION_COOKIE) || Math.floor(Math.random() * 99999999)
    store.commit(types.SET_SESSION_ID, { value: sessionId, cookies: app.$cookies })
  }
}
