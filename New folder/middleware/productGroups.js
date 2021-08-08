import * as types from '@/store/types'

export default function ({ app, store, error }) {
  if (app.$api.settings.modules.has('products') && !store.state.$productGroups) {
    return app.$api.productGroups.getAll({ sort: 'sortOrder-asc', include: 'Categories' })
    .then(groups => {
      groups.forEach(group => {
        const allCategories = [].concat(group.categories)
        group.categories = allCategories.filter(o => !o.parentId)

        group.categories.forEach(category => {
          category.children = _getChildCategories(category.id, allCategories)
        })
      })

      store.commit(types.SET_PRODUCT_GROUPS, groups)
    })
    .catch(err => {
      error(err)
    })
  }
}

function _getChildCategories (parentId, allCategories) {
  const childs = allCategories.filter(o => o.parentId === parentId)

  childs.forEach(child => {
    child.children = _getChildCategories(child.id, allCategories)
  })

  return childs
}
