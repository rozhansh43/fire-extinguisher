<template>
  <div v-if="items && items.length">
    <div class="bg-primary">
      <b-container class="px-3 px-lg-2">
        <menu-bar
          :id="'main'"
          :items="items"
          class="navbar-main"
          type="dark"
          :sidebar="$mdAndLower"
        />
      </b-container>
    </div>
  </div>
</template>

<script>
import MenuBar from '@/components/menu-bar'
import * as types from '@/store/types'

export default {
  name: 'NavbarMain',
  components: {
    MenuBar
  },
  computed: {
    items () {
      return this.$store.state.$mainMenu
    }
  },
  watch: {
    '$store.state.$account' (val, oldVal) {
      if (val !== oldVal)
        this.getItems()
    }
  },
  methods: {
    getItems () {
      this.$api.menus.getById('main')
      .then(res => {
        this.$store.commit(types.SET_MAIN_MENU, res)
      })
      .catch(err => {
        this.$showError(this.$getLocaleErrorMessage(err, 'menus'))
      })
    }
  }
}
</script>
