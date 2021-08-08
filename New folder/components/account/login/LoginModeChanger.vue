<template>
  <div v-if="modesCount > 1" class="mt-4">
    <h5 class="mb-0">
      {{ $t('account.otherLoginMethods') }}
    </h5>

    <b-btn v-if="value !== 'loginViaPassword'" block variant="light" class="p-3 mt-3" @click="emitInput('loginViaPassword')">
      <font-awesome-icon icon="key" size="lg" class="text-muted align-middle" :class="{'mr-1': $dir.ltr, 'ml-1': $dir.rtl}"/>

      {{ $t('account.login') }} {{ $t('account.viaPassword') }}
    </b-btn>
    
    <b-btn v-if="value !== 'loginViaOtp'" block variant="light" class="p-3 mt-3" @click="emitInput('loginViaOtp')">
      <font-awesome-icon icon="comment" size="lg" class="text-muted align-middle" :class="{'mr-1': $dir.ltr, 'ml-1': $dir.rtl}"/>

      {{ $t('account.login') }}

      <template v-if="registerViaOtpEnabled">
        /
        {{ $t('account.register') }}
      </template>

      {{ $t('account.viaOtp') }}
    </b-btn>
  </div>
</template>

<script>
import Settings from '@/mixins/settings/index'

export default {
  name: 'LoginModeChanger',
  mixins: [Settings],
  props: {
    value: String
  },
  data () {
    return {
      modesCount: 0
    }
  },
  created () {
    this.modesCount = this.getModesCount()
  },
  methods: {
    getModesCount () {
      let count = 0

      if (this.loginViaPasswordEnabled)
        count += 1

      if (this.loginViaOtpEnabled)
        count += 1

      return count
    },
    emitInput (value) {
      this.$emit('input', value)
    }
  }
}
</script>
