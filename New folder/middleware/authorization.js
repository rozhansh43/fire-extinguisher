import * as types from '@/store/types'

function guard (api, config, store, path, fromPath, auth, modules, allModules, next) {
  const redirectPath = (path === config.homeUrl || path === '/login') ? '/login' : `/login?returnUrl=${path}`
  
  const accountSettingsKeyName = `${config.auth.userType}Account`
  
  const promises = [api.settings.get([accountSettingsKeyName, 'branding', 'modules', 'serviceTags'])]
  
  if (store.state.$account)
  promises.push(api.account.refreshStatus())
  
  return Promise.all(promises)
  .then(() => {
    if (!auth && !modules && !allModules) return next()

    if (modules && modules.length && !api.settings.modules.has(modules))
      return next(redirectPath)

    if (allModules && allModules.length && !api.settings.modules.hasAll(allModules))
      return next(redirectPath)

    if (auth) {
      if (!store.state.$account) return next(redirectPath)

      const needsRoles = auth.roles && auth.roles.length
      const hasNeededRoles = needsRoles ? api.account.isInAnyOfRoles(auth.roles) : true

      if (!hasNeededRoles) return next(redirectPath)

      const accountSettings = api.settings[accountSettingsKeyName]

      const conf = config.auth.forbiddenErrorConfigs.find(conf => {
        const isRequiredGlobally = accountSettings[conf.settingsKey]
        const userHasStatus = api.account.hasStatus(conf.status)

        const isRequiredOnRoute = auth.statuses && auth.statuses.includes(conf.status)
        const isAllowed = auth[conf.allowKey]

        return (isRequiredGlobally || isRequiredOnRoute) && !userHasStatus && !isAllowed
      })

      const disallowNavigation = config.auth.forbiddenErrorConfigs.find(conf => {
        const isRequiredGlobally = accountSettings[conf.settingsKey]
        const userHasStatus = api.account.hasStatus(conf.status)

        return isRequiredGlobally && !userHasStatus && conf.disallowNavigation
      })

      if (disallowNavigation) store.commit(types.SET_ALLOW_NAVIGATION, false)
      else store.commit(types.SET_ALLOW_NAVIGATION, true)

      next(conf ? (conf.redirectPath || redirectPath) : undefined)
    // } else {
    //   sendPageView(api, store, path, fromPath)
    }
  })
  .catch(() => {
    if (!store.state.$offline)
      return next(redirectPath)
  })
}

// function sendPageView (api, store, path, fromPath) {
//   if (typeof gtag !== 'undefined' && api.settings.modules.has('serviceTags') && process.client) {
//     const serviceTags = store.state.$settings.serviceTags
//     if (serviceTags && serviceTags.ga && serviceTags.ga.length) {
//       setTimeout(() => {
//         // eslint-disable-next-line no-undef
//         gtag('event', 'page_view', { page_location: path, page_referrer: fromPath })
//       }, 700)
//     }
//   }
// }

export default function ({ app, store, route, redirect, from }) {
  const path = route.path
  const fromPath = from && from.path

  let auth = null
  const authMeta = route.meta && route.meta.slice().reverse().find(i => i.auth)
  auth = authMeta && authMeta.auth

  let modules = null
  const modulesMeta = route.meta && route.meta.slice().reverse().find(i => i.modules)
  modules = modulesMeta && modulesMeta.modules

  let allModules = null
  const allModulesMeta = route.meta && route.meta.slice().reverse().find(i => i.allModules)
  allModules = allModulesMeta && allModulesMeta.allModules

  return guard(app.$api, app.$config, store, path, fromPath, auth, modules, allModules, redirectPath => {
    // sendPageView(app.$api, store, path, fromPath)
    if (redirectPath) redirect(redirectPath)
  })
}
