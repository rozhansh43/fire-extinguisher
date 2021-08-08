<template>
  <b-modal
    v-if="$hasModule('contactForms')"
    ref="contactModal"
    centered
    no-close-on-backdrop
    no-close-on-esc
    :busy="progressing"
    :title="title"
    header-text-variant="dark"
    :cancel-title="$t('shared.cancel')"
    :ok-title="$t('contactForms.send')"
    ok-variant="success"
    @ok="submit"
    @shown="resetValidation"
  >
      <h1>
      contact nav
    </h1>
    <contact-form ref="form" hide-submit-button @progressing="setProgressing" @success="hideModal"/>
  </b-modal>
</template>

<script>
import vm from '@/lib/vm'
import ContactForm from '@/components/shared/ContactForm'

export default {
  name: 'Contact',
  components: {
    ContactForm
  },
  data () {
    return {
      progressing: false,
      item: null
    }
  },
  computed: {
    title () {
      return this.item && this.item.title ? this.item.title : this.$t('contactForms.contactTitle', { brandingName: this.$store.state.$settings.branding.name })
    }
  },
  mounted () {
    if (this.$hasModule('contactForms')) {
      vm.$on('contact-click', (item) => {
        this.item = item
        this.showContactModal()
      })
    }
  },
  beforeDestroy () {
    if (this.$hasModule('contactForms'))
      vm.$off('contact-click')
  },
  methods: {
    showContactModal() {
      this.$refs.contactModal.show()
    },
    submit (e) {
      e.preventDefault()
      this.$refs.form.submit()
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    },
    setProgressing (value) {
      this.progressing = value
    },
    hideModal () {
      this.$refs.contactModal.hide()
    }
  }
}
</script>
