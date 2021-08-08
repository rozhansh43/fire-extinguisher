<template>
  <header class="mb-3 shadow-sm bg-white">
    <top-bar/>

    <b-container class="px-3 px-lg-2">
      <b-row class="align-items-center pt-3">
        <b-col v-if="$settings.branding.logo" lg="auto" sm="6" class="text-center mb-3" :class="{'text-sm-left': $dir.ltr, 'text-sm-right': $dir.rtl}">
          <b-link href="/" class="d-block">
            <thumbnail
              :path="$settings.branding.logo"
              :alt="$settings.branding.name"
              fit-in
              :width="208"
              :height="40"
              :link="false"
              :quality="90"
            />
          </b-link>
        </b-col>

        <b-col v-if="$hasModule('products_search')" lg="5" sm="6" class="mb-3">
          <keyword no-card class="px-lg-3"/>
        </b-col>
        
        <b-col
          v-if="$hasAllModules(['products', 'products_sale'])"
          lg="auto"
          sm="6"
          class="mb-3"
          :class="{'ml-lg-auto': $dir.ltr, 'mr-lg-auto': $dir.rtl}"
        >
          <account/>
        </b-col>

        <b-col v-if="$hasAllModules(['products', 'products_sale'])" lg="auto" sm="6" class="mb-3">
          <cart/>
        </b-col>
      </b-row>
    </b-container>

    <navbar-main/>

    <!-- <product-groups
      v-if="$hasAllModules(['products', 'products_groups'])"
      :sidebar="$mdAndLower"
    /> -->
  </header>
</template>

<script>
import Account from './Account'
import Cart from './Cart'
import Keyword from '@/components/products/list/search/keyword'
import NavbarMain from './NavbarMain'
// import ProductGroups from './productGroups/index'
import Thumbnail from '@/components/shared/Thumbnail'
import TopBar from './TopBar'
import { mapState } from 'vuex'

export default {
  name: 'AppHeader',
  components: {
    Account,
    Cart,
    Keyword,
    NavbarMain,
    // ProductGroups,
    Thumbnail,
    TopBar
  },
  computed: {
    ...mapState(['$settings'])
  }
}
</script>
