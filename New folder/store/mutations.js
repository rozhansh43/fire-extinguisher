import * as types from './types'

export default {
  [types.SET_LOCALE]: (state, { value, cookies }) => {
    state.$locale = value
    setCookie({
      name: types.LOCALE_COOKIE,
      value,
      cookies,
      maxAge: 60 * 60 * 24 * 365
    })
  },

  [types.SET_ACCOUNT]: (state, { value, cookies }) => {
    state.$account = value
    setCookie({name: types.ACCOUNT_COOKIE, value, cookies, maxAge: value.refreshTtl * 60})
  },

  [types.SET_ACCOUNT_IMAGE]: (state, { value, cookies }) => {
    state.$account.image = value
    setCookie({name: types.ACCOUNT_COOKIE, value: state.$account, cookies, maxAge: state.$account.refreshTtl * 60})
  },

  [types.SET_REFRESHED_TOKEN]: (state, {value, cookies}) => {
    state.$account.token = value.token
    state.$account.ttl = value.ttl
    setCookie({name: types.ACCOUNT_COOKIE, value: state.$account, cookies, maxAge: state.$account.refreshTtl * 60})
  },

  [types.UNSET_ACCOUNT]: (state, cookies) => {
    state.$account = null
    if (cookies)
      setCookie({name: types.ACCOUNT_COOKIE, cookies})
  },

  [types.SET_UPLOAD_PROGRESS]: (state, value) => {
    state.$uploadProgress = value
  },

  [types.SET_DOWNLOAD_PROGRESS]: (state, value) => {
    state.$downloadProgress = value
  },

  [types.SET_MAIN_MENU]: (state, value) => {
    state.$mainMenu = value
  },

  [types.SET_TOP_BAR_WIDGETS]: (state, value) => {
    state.$topBarWidgets = value
  },

  [types.SET_PRODUCT_GROUPS]: (state, value) => {
    state.$productGroups = value
  },

  [types.SET_FOOTER_WIDGETS]: (state, value) => {
    state.$footerWidgets = value
  },

  [types.SET_OFFLINE]: (state, value) => {
    state.$offline = value
  },

  [types.SET_OFFLINEMODE]: (state, value) => {
    state.$offlineMode = value
  },

  [types.SET_SETTINGS]: (state, value) => {
    Object.keys(value).forEach(key => {
      if (value[key] === null) {
        delete value[key]
      }
    })
    state.$settings = Object.assign(state.$settings, value)
  },

  [types.SET_USER_STATUS]: (state, value) => {
    state.$userStatus = value
  },

  [types.SET_ALLOW_NAVIGATION]: (state, value) => {
    state.$allowNavigation = value
  },

  [types.ADD_PRODUCT_TYPES]: (state, value) => {
    state.$productTypes.push(...value)
  },

  [types.SET_PRODUCTS_LIST_VIEW]: (state, { value, cookies }) => {
    state.$productsListView = value
    setCookie({name: types.PRODUCTS_LIST_VIEW_COOKIE, value, cookies, maxAge: 60 * 60 * 24 * 90})
  },

  [types.PRODUCTS_SET_COMPARE]: (state, { value, cookies }) => {
    state.$productsCompare = value
    if (value && value.length)
      setCookie({name: types.PRODUCTS_COMPARE_COOKIE, value, cookies, maxAge: 60 * 60 * 24 * 7})
  },

  [types.PRODUCTS_COMPARE_ADD]: (state, { value, cookies }) => {
    if (!state.$productsCompare.find(i => i.id === value.id)) state.$productsCompare.push(value)
    setCookie({name: types.PRODUCTS_COMPARE_COOKIE, value: state.$productsCompare, cookies, maxAge: 60 * 60 * 24 * 7})
  },

  [types.PRODUCTS_COMPARE_REMOVE]: (state, { id, cookies }) => {
    state.$productsCompare = state.$productsCompare.filter(i => i.id !== id)
    setCookie({name: types.PRODUCTS_COMPARE_COOKIE, value: state.$productsCompare, cookies, maxAge: 60 * 60 * 24 * 7})
  },

  [types.SET_CART_TOTAL_QUANTITY]: (state, value) => {
    state.$cart.totalQuantity = value
  },

  [types.SET_CART_ID]: (state, { value, cookies }) => {
    state.$cart.id = value
    setCookie({ name: types.CART_ID_COOKIE, value, cookies, maxAge: 60 * 60 * 24 * 30})
  },

  [types.SET_SESSION_ID]: (state, { value, cookies }) => {
    state.$sessionId = value
    setCookie({ name: types.SESSION_COOKIE, value, cookies })
  }
}

function setCookie({ name, value, cookies, maxAge }) {
  if (value) {
    cookies.set(name, value, maxAge ? { maxAge, sameSite: 'Lax', path: '/' } : { sameSite: 'Lax', path: '/' })
  } else {
    cookies.remove(name, { path: '/' })
  }
}
