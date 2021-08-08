<script>
import { getThumbnailUrl } from '@/lib/thumbnail.js'
import { mapState } from 'vuex'
import { registerEventHandlers } from '@/lib/vm-events'
import Settings from '@/mixins/settings/index'
import VeeValidateFa from 'vee-validate/dist/locale/fa'

export default {
  mixins: [Settings],
  data () {
    return {
      icon16: null,
      icon32: null,
      icon48: null,
      icon180: null,
      scripts: []
    }
  },
  computed: {
    ...mapState(['$settings']),
    account () {
      return this.$store.state.$account
    },
    checkOfflineMode () {
      let active = false
      if (this.$store.state.$offlineMode && this.$store.state.$offlineMode.active)
        active = true
      if (this.account && this.account.roles && this.account.roles.length)
        active = false
      return active
    },
    printView () {
      return !!this.$route.query.print
    }
  },
  created () {
    this.setLocale(this.$store.state.$locale)
    registerEventHandlers({
      cookies: this.$cookies,
      config: this.$config,
      api: this.$api,
      store: this.$store,
      router: this.$router
    })
    this.populateIconUrls()
    this.populateScripts()
  },
  mounted () {
    if (this.printView) this.setBackgrounds()
  },
  destroyed () {
    if (this.printView) this.unsetBackgrounds()
  },
  head () {
    const iconLinks = (this.$settings.branding.favicon) ? [
      { rel: 'apple-touch-icon', sizes: '180x180', href: this.icon180 },
      { rel: 'shortcut icon', href: this.icon48 },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: this.icon32 },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: this.icon16 }
    ] : []

    return {
      titleTemplate: (titleChunk) => {
        return titleChunk ? `${titleChunk} | ${this.$settings.branding.name}` : this.$settings.branding.name
      },
      htmlAttrs: {
        dir: this.$t('direction')
      },
      meta: [
        { charset: 'utf-8' },
        {
          hid: 'viewport',
          name: 'viewport',
          content: 'width=device-width,initial-scale=1.0'
        },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        { hid: 'robots', name: 'robots', content: 'index, follow' },
        { name: 'apple-mobile-web-app-title', content: this.$settings.branding.name },
        { name: 'application-name', content: this.$settings.branding.name },
        { name: 'msapplication-TileColor', content: this.$settings.branding.color },
        { name: 'theme-color', content: this.$settings.branding.color },
        { hid: 'og:type', name: 'og:type', content: 'website' },
        { hid: 'og:locale', name: 'og:locale', content: this.$config.locale },
        {
          hid: 'og:site_name',
          name: 'og:site_name',
          content: this.$settings.branding.name
        },
        {
          hid: 'og:url',
          name: 'og:url',
          content: `${this.$config.websiteUrl}${this.$route.fullPath}`
        },
        { hid: 'og:image', name: 'og:image', content: `${this.$config.files.staticServer}/${this.$settings.branding.logo}` },
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary' },
        {
          hid: 'twitter:site',
          name: 'twitter:site',
          content: this.$settings.branding.data && this.$settings.branding.data.twitter
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: `${this.$config.files.staticServer}/${this.$settings.branding.logo}`
        }
      ],
      link: [
        ...iconLinks,
        {
          rel: 'canonical',
          href: `${this.$config.websiteUrl}${this.$route.fullPath}`
        },
        { rel: 'manifest', href: `${this.$config.apiServerUrl}/api/shared/settings/webmanifest/${this.$config.clientName}` }
      ],
      script: this.scripts
    }
  },
  methods: {
    setLocale (locale) {
      if (locale === 'fa') {
        this.$validator.localize('fa', VeeValidateFa)
      } else {
        this.$validator.localize(locale)
      }
      this.$i18n.locale = locale
    },
    populateIconUrls () {
      const faviconPath = this.$settings.branding.favicon

      if (!faviconPath) return Promise.resolve()
      
      return Promise.all([
        this.getImageSrc({ path: faviconPath, width: 16, height: 16 }),
        this.getImageSrc({ path: faviconPath, width: 32, height: 32 }),
        this.getImageSrc({ path: faviconPath, width: 48, height: 48 }),
        this.getImageSrc({ path: faviconPath, width: 180, height: 180 })
      ])
      .then(all => {
        this.icon16 = all[0]
        this.icon32 = all[1]
        this.icon48 = all[2]
        this.icon180 = all[3]
      })
    },
    getImageSrc ({ path, width, height }) {
      return getThumbnailUrl({
        $config: this.$config,
        path,
        fitIn: true,
        width,
        height
      })
    },
    populateScripts () {
      if (!this.$hasModule('serviceTags')) return null

      this.getSettings('serviceTags')
      .then(() => {
        const serviceTags = this.$settings.serviceTags
        
        const gaTagScripts = this.getGaTagScripts(serviceTags)
        this.scripts.push(...gaTagScripts)
      })
    },
    getGaTagScripts (serviceTags) {
      if (!serviceTags || !serviceTags.ga || !serviceTags.ga.length) return []

      return [{
        src: `https://www.googletagmanager.com/gtag/js?id=${serviceTags.ga}`,
        async: true
      }, {
        innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${serviceTags.ga}');
        `
      }]
    },
    setBackgrounds () {
      document.querySelectorAll('body')
      .forEach(o => {
        o.style.cssText = 'background: #fff !important'
      })
    },
    unsetBackgrounds () {
      document.querySelectorAll('body')
      .forEach(o => {
        o.removeAttribute('style')
      })
    }
  }
}
</script>
