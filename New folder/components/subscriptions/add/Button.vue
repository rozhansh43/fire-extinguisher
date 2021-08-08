<template>
  <div>
    <b-btn
      :variant="compact ? 'link' : 'dark'"
      :title="compact ? $t('subscriptions.notify') : null"
      v-b-tooltip.hover
      :class="{ 'inherited-link p-0': compact }"
      :block="!compact"
      :size="compact ? 'md' : 'lg'"
      @click="showModal"
    >
      <font-awesome-icon
        icon="bell"
        :class="{ 'align-middle': !compact, 'text-muted': compact }"
      />

      <span v-if="!compact" :class="{ 'ml-1': $dir.ltr, 'mr-1': $dir.rtl }">
        {{ $t('subscriptions.notifyMeWhenProductWasAvailable') }}
      </span>
    </b-btn>

    <modal ref="modal" :show-available="showAvailable"/>
    
    <b-modal
      ref="login"
      centered
      hide-header
      hide-footer
      :size="registerViaPasswordEnabled ? 'lg' : 'md'"
      body-class="p-0"
    >
      <login no-redirect in-component event-append="Subscriptions"/>
    </b-modal>
  </div>
</template>

<script>
import Modal from './Modal'
import Login from '@/components/account/login'
import Settings from '@/mixins/settings'
import vm from '@/lib/vm'

export default {
  name: 'AddButton',
  components: {
    Modal,
    Login
  },
  mixins: [Settings],
  props: {
    product: { type: Object, required: true },
    showAvailable: Boolean,
    compact: { type: Boolean, default: true }
  },
  computed: {
    account () {
      return this.$store.state.$account
    }
  },
  mounted () {
    vm.$on('loggedInSubscriptions', () => {
      if (this.$refs.login) {
        this.$refs.login.hide()
        this._showModal()
      }
    })
  },
  beforeDestroy () {
    vm.$off('loggedInSubscriptions')
  },
  methods: {
    showModal () {
      if (this.account) this._showModal()
      else this.$refs.login.show()
    },
    _showModal () {
      this.$refs.modal.show(this.product.id)
    }
  }
}
</script>
