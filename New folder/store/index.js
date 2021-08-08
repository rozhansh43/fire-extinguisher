import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'

import createLogger from './plugins/logger'
import devtool from './plugins/devtool'

Vue.use(Vuex)

const debug = process.env.NODE_ENV === 'development'

const createStore = () => {
  return new Vuex.Store({
    state: {
      $account: null,
      $allowNavigation: false,
      $cart: {
        id: null,
        totalQuantity: null
      },
      $downloadProgress: 0,
      $topBarWidgets: null,
      $productGroups: null,
      $footerWidgets: null,
      $locale: null,
      $mainMenu: null,
      $offline: false,
      $offlineMode: null,
      $productsCompare: null,
      $productsListView: null,
      $productTypes: [],
      $settings: {},
      $uploadProgress: 0,
      $userStatus: null,
      $sessionId: null
    },
    actions,
    mutations,
    plugins: debug ? [createLogger(), devtool] : []
  })
}

export default createStore
