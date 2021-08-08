<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col :xl="showTickets ? 6 : 12">
        <profile/>
      </b-col>

      <b-col v-if="showTickets" xl="6">
        <open-tickets/>
      </b-col>
    </b-row>

    <customer-orders v-if="showCustomerOrders"/>
  </div>
</template>

<script>
import CustomerOrders from '@/components/dash/widgets/customerOrders/index'
import OpenTickets from '@/components/dash/widgets/tickets/Opens'
import Profile from '@/components/dash/widgets/profile'
import progressEnd from '@/mixins/progress-end'

export default {
  name: 'DashIndex',
  components: {
    CustomerOrders,
    OpenTickets,
    Profile
  },
  mixins: [progressEnd],
  meta: {
    auth: {
      allowUnconfirmedEmail: true,
      allowUnconfirmedPhoneNumber: true
    }
  },
  head () {
    return {
      title: this.$t('shared.dashboard')
    }
  },
  computed: {
    userStatus () {
      return this.$store.state.$userStatus
    },
    userSettings () {
      return this.$store.state.$settings[`${this.$config.auth.userType}Account`]
    },
    phoneNumberMustConfirmed () {
      return this.userStatus && this.userSettings && this.userSettings.requireConfirmedPhoneNumber && !this.userStatus.phoneNumberConfirmed
    },
    emailMustConfirmed () {
      return this.userStatus && this.userSettings && this.userSettings.requireConfirmedEmail && !this.userStatus.emailConfirmed
    },
    showTickets () {
      return this.$hasModule('tickets') && !this.phoneNumberMustConfirmed && !this.emailMustConfirmed
    },
    showCustomerOrders () {
      return this.$hasModule('products_sale') && !this.phoneNumberMustConfirmed && !this.emailMustConfirmed
    }
  }
}
</script>
