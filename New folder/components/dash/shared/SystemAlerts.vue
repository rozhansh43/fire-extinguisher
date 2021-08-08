<template>
  <b-alert v-if="hasAnyUnconfirmedStatus" show variant="warning" class="p-4">
    <h5 class="mb-3">
      <font-awesome-icon
        icon="exclamation-triangle"
        class="align-middle"
        :class="{ 'mr-2': $dir.ltr, 'ml-2': $dir.rtl }"
      />

      {{ $t('shared.systemMessage') }} :
    </h5>

    <ul class="mb-0">
      <li v-if="phoneNumberMustConfirmed">
        <a href="/dash/account/confirm-phone-number" class="inherited-link">
          {{ $t('account.confirmYourPhoneNumber') }}.
        </a>
      </li>

      <li v-if="emailMustConfirmed">
        <a href="/dash/account/confirm-email" class="inherited-link">
          {{ $t('account.confirmYourEmail') }}.
        </a>
      </li>
    </ul>
  </b-alert>
</template>

<script>
export default {
  name: 'SystemAlerts',
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
    hasAnyUnconfirmedStatus () {
      return this.phoneNumberMustConfirmed || this.emailMustConfirmed
    }
  }
}
</script>
