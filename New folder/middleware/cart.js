export default function ({ app, store }) {
  if (app.$api.settings.modules.hasAll(['products', 'products_sale']) && (!store.state.$cart || store.state.$cart.totalQuantity === null)) { // We dont want do this on 0
    return app.$api.cartItems.setTotalQuantityInStore()
  }
}
