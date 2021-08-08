<script>
export default {
  computed: {
    // ==== ACCOUNT ====

    registerViaUserNameEnabled () {
      return this._accountSettings.registerViaUserNameEnabled
    },
    registerViaEmailEnabled () {
      return this._accountSettings.registerViaEmailEnabled
    },
    registerViaPhoneNumberEnabled () {
      return this._accountSettings.registerViaPhoneNumberEnabled
    },
    registerViaOtpEnabled () {
      return this._accountSettings.registerViaOtpEnabled
    },

    // -----

    loginViaUserNameEnabled () {
      return this._accountSettings.loginViaUserNameEnabled
    },
    loginViaEmailEnabled () {
      return this._accountSettings.loginViaEmailEnabled
    },
    loginViaPhoneNumberEnabled () {
      return this._accountSettings.loginViaPhoneNumberEnabled
    },
    loginViaOtpEnabled () {
      return this._accountSettings.loginViaOtpEnabled
    },

    // -----

    registerViaPasswordEnabled () {
      return this._accountSettings.registerViaPasswordEnabled
    },

    // -----

    loginViaPasswordEnabled () {
      return this._accountSettings.loginViaPasswordEnabled
    },

    // -----

    resetPasswordEnabled () {
      return this._accountSettings.resetPasswordEnabled
    },

    // -----

    showUserNameField () {
      return this._accountSettings.showUserNameField
    },
    requireUserNameField () {
      return this._accountSettings.requireUserNameField
    },
    requireEmailField () {
      return this._accountSettings.requireEmailField
    },
    requirePhoneNumberField () {
      return this._accountSettings.requirePhoneNumberField
    }
  },
  methods: {
    // ==== Helper Methods ====

    getSettings (keys) {
      return this.$api.settings.get(keys)
    }
  }
}
</script>
