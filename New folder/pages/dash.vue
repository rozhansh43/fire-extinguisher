<template>
  <div v-if="$store.state.$account" :class="{ 'container dash': !printView }">
    <system-alerts v-if="!printView"/>

    <nuxt-child v-if="printView"/>

    <b-row v-else>
      <b-col xl="3" lg="4" md="5">
        <dash-nav :items="availableItems"/>
      </b-col>

      <b-col xl="9" lg="8" md="7">
        <nuxt-child/>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import DashNav from '@/components/dash/nav'
import Settings from '@/mixins/settings/index'
import SystemAlerts from '@/components/dash/shared/SystemAlerts'

export default {
  name: 'Dash',
  components: {
    DashNav,
    SystemAlerts
  },
  mixins: [Settings],
  meta: {
    auth: true,
    modules: [
      'products_sale'
    ]
  },
  data () {
    const data = {
      menuItems: {
        home: {
          title: 'shared.dashboard',
          url: '/dash',
          icon: 'home'
          // roles: []
          // statuses: []
        },
        items: [
          {
            title: 'account.account',
            url: '#',
            allowed: true,
            icon: 'user',
            accountMenu: true,
            children: []
          },
          {
            title: 'customerOrders.orders',
            url: '#',
            allowed: this.$hasModule('products_sale'),
            icon: 'clipboard-list',
            children: [
              {
                title: 'customerOrders.statuses.pending',
                url: '/dash/orders?status=pending',
                icon: 'hourglass-half'
              },
              {
                title: 'customerOrders.statuses.processing',
                url: '/dash/orders?status=processing',
                icon: 'cogs'
              },
              {
                title: 'customerOrders.statuses.delivered',
                url: '/dash/orders?status=processed',
                icon: 'truck'
              },
              {
                title: 'customerOrders.statuses.canceledOrExpired',
                url: '/dash/orders?status=canceled',
                icon: 'times-circle'
              }
            ]
          },
          {
            title: 'files.files',
            url: '/dash/files',
            allowed: this.$hasModule('products_sale_attachments'),
            icon: 'folder'
          },
          {
            title: 'credit.userCredit',
            url: '/dash/credit',
            allowed: this.$hasModule('pay_credit'),
            icon: 'wallet'
          },
          {
            title: 'wishes.lists',
            url: '/dash/lists',
            allowed: this.$hasModule('products_wishes') || this.$hasModule('products_subscriptions'),
            icon: 'heart'
          },
          {
            title: 'addresses.addresses',
            url: '/dash/addresses',
            allowed: this.$hasModule('products_sale'),
            icon: 'map-marked-alt'
          },
          {
            title: 'tickets.tickets',
            url: '/dash/tickets',
            allowed: this.$hasModule('tickets'),
            icon: 'headset'
          }
        ],
        account: [
          {
            title: 'account.profile',
            url: '/dash/account/profile',
            icon: 'id-card'
          },
          {
            title: 'account.changeEmail',
            url: '/dash/account/change-email',
            icon: 'envelope'
          },
          {
            title: 'account.changePhoneNumber',
            url: '/dash/account/change-phone-number',
            icon: 'mobile'
          },
          {
            title: this.$store.state.$userStatus.hasPassword ? 'account.changePassword' : 'account.setPassword',
            url: '/dash/account/change-password',
            icon: 'key',
            id: 'changePassword'
          }
        ],
        logout: {
          title: 'account.logout',
          icon: 'sign-out-alt',
          component: 'logout'
        }
      }
    }
    const accountMenu = data.menuItems.items.find(o => o.accountMenu)
    accountMenu.children = data.menuItems.account.concat(accountMenu.children)
    return data
  },
  computed: {
    availableItems () {
      const menuItems = Object.assign({}, this.menuItems)

      if (!this.loginViaPasswordEnabled)
        menuItems.account = menuItems.account.filter(o => o.id !== 'changePassword')

      let items = [menuItems.home, { component: 'divider' }]

      if (this.$store.state.$allowNavigation) items = items.concat(menuItems.items.filter(o => o.allowed))
      else items = items.concat(menuItems.account)

      items.push({ component: 'divider' })
      items.push(menuItems.logout)

      return items
    },
    printView () {
      return !!this.$route.query.print
    }
  }
}
</script>
