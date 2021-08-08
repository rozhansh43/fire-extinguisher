<script>
import Base from './settings-base'

export default {
  mixins: [Base],
  computed: {
    _accountSettings () {
      return this.$api.settings[`${this.$config.auth.userType}Account`]
    }
  }
}
</script>
