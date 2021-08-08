import moment from 'moment-jalaali'

export default {
  created () {
    this.$setMomentLocale()
  },
  watch: {
    '$store.state.locale' () {
      this.$setMomentLocale()
    }
  },
  methods: {
    $setMomentLocale () {
      const locale = this.$store.state.$locale
      if (locale === 'fa') moment.loadPersian({ dialect: 'persian-modern' })      
      else moment.locale(locale)
    }
  }
}
