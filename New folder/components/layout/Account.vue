<template>
  <div>
    <b-btn-group v-if="account" class="w-100">
      <b-btn
        to="/dash"
        variant="outline-silver"
        class="text-dark"
        rel="nofollow"
      >
        <font-awesome-icon
          icon="home"
          class="align-middle"
          :class="{'mr-1': $dir.ltr, 'ml-1': $dir.rtl}"
        />

        {{ $t('shared.dashboard') }}
      </b-btn>

      <b-btn
        variant="outline-silver"
        class="text-danger"
        rel="nofollow"
        @click="logout"
      >
        <font-awesome-icon icon="sign-out-alt" class="align-middle" :class="{'mr-1': $dir.ltr, 'ml-1': $dir.rtl}"/>
        {{ $t('account.logout') }}
      </b-btn>
    </b-btn-group>

    <b-btn
      v-else
      to="/login"
      block
      variant="outline-silver"
      class="text-dark py-2 px-3"
      rel="nofollow"
    >
      <font-awesome-icon
        icon="user"
        class="align-middle"
        :class="{'mr-1': $dir.ltr, 'ml-1': $dir.rtl}"
      />

      {{ $t('account.login') }} / {{ $t('account.register') }}
    </b-btn>
  </div>
</template>

<script>
import vm from '@/lib/vm'

export default {
  name: 'Account',
  computed: {
    account () {
      return this.$store.state.$account
    }
  },
  methods: {
    logout () {
      vm.$emit('logout')
    }
  }
}
</script>
