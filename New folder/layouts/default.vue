<template>
  <offline v-if="$store.state.$offline"/>

  <div v-else :class="{ 'app': !printView }">
    <notifications/>
    <progress-bar/>
    
    <offline-mode v-if="checkOfflineMode"/>
    
    <template v-else>
      <app-header v-if="!printView" class="app-header"/>

      <nuxt :class="{ 'app-body': !printView,'pt-3': printView }"/>

      <template v-if="!printView">
        <app-footer class="app-footer"/>
        <back-to-top/>
        <popups v-if="$hasModule('popups')"/>
      </template>
    </template>
  </div>
</template>

<script>
import AppFooter from '@/components/layout/Footer'
import AppHeader from '@/components/layout/Header'
import BackToTop from '@/components/layout/BackToTop'
import Notifications from '@/components/layout/Notifications'
import OfflineMode from '@/components/layout/OfflineMode'
import ProgressBar from '@/components/layout/ProgressBar'

import Offline from '@/components/shared/Offline'
import Popups from '@/components/layout/Popups'

import master from './_master'

export default {
  components: {
    AppFooter,
    AppHeader,
    BackToTop,
    Notifications,
    Offline,
    OfflineMode,
    ProgressBar,
    Popups
  },
  mixins: [master]
}
</script>
