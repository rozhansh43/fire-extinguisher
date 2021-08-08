<template>
  <div>
    <b-btn
      variant="link"
      :title="$t('wishes.addToList')"
      v-b-tooltip.hover
      class="inherited-link p-0"
      @click="showModal"
    >
      <font-awesome-icon icon="heart" class="text-muted"/>
    </b-btn>

    <lists-modal ref="listsModal"/>
    
    <b-modal
      ref="login"
      centered
      hide-header
      hide-footer
      :size="registerViaPasswordEnabled ? 'lg' : 'md'"
      body-class="p-0"
    >
      <login no-redirect in-component event-append="Lists"/>
    </b-modal>
  </div>
</template>

<script>
import ListsModal from './ListsModal'
import Login from '@/components/account/login'
import Settings from '@/mixins/settings'
import vm from '@/lib/vm'

export default {
  name: 'AddButton',
  components: {
    ListsModal,
    Login
  },
  mixins: [Settings],
  props: {
    product: { type: Object, required: true }
  },
  computed: {
    account () {
      return this.$store.state.$account
    }
  },
  mounted () {
    vm.$on('loggedInLists', () => {
      if (this.$refs.login) {
        this.$refs.login.hide()
        this._showModal()
      }
    })
  },
  beforeDestroy () {
    vm.$off('loggedInLists')
  },
  methods: {
    showModal () {
      if (this.account) this._showModal()
      else this.$refs.login.show()
    },
    _showModal () {
      this.$refs.listsModal.show(this.product)
    }
  }
}
</script>
