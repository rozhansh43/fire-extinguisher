<template>
  <span v-if="payAdapterType || payType">
    <span
      v-if="showIcon"
      class="fa-layers align-middle"
      style="font-size:215%"
      :class="{'mr-2': $dir.ltr, 'ml-2': $dir.rtl}"
    >
      <font-awesome-icon icon="circle" fixed-width :class="'text-' + (payAdapterType ? payAdapterType.variant : payType.variant)"/>
      <font-awesome-icon :icon="payAdapterType ? payAdapterType.icon : payType.icon" fixed-width class="fa-inverse" transform="shrink-9"/>
    </span>

    <template v-if="prefix">{{ prefix }}</template>

    {{ payAdapterType ? payAdapterType.text : payType.text }}
  </span>
</template>

<script>
export default {
  name: 'PayAdapterDisplay',
  props: {
    value: { type: Object, required: true },
    prefix: String,
    showIcon: { type: Boolean, default: false }
  },
  data () {
    return {
      adapterTypes: [
        { value: 110, text: this.$t('payments.credit'), icon: 'wallet', variant: 'danger' },
        { value: 210, text: this.$t('payments.bankReceipt'), icon: 'receipt', variant: 'dark' },
        { value: 310, text: this.$t('payments.zarinpalIpg'), icon: 'globe', variant: 'info' },
        { value: 311, text: this.$t('payments.zarinpalSandboxIpg'), icon: 'globe', variant: 'info' },
        { value: 320, text: this.$t('payments.pasargadIpg'), icon: 'globe', variant: 'info' },
        { value: 330, text: this.$t('payments.mellatIpg'), icon: 'globe', variant: 'info' },
        { value: 340, text: this.$t('payments.samanIpg'), icon: 'globe', variant: 'info' },
        { value: 410, text: this.$t('payments.payOnDelivery'), icon: 'truck-loading', variant: 'success' }
      ],
      payTypes: [
        { value: 100, text: this.$t('payments.credit'), icon: 'wallet', variant: 'danger' },
        { value: 200, text: this.$t('payments.bankReceipt'), icon: 'receipt', variant: 'dark' },
        { value: 300, text: this.$t('payments.ipg'), icon: 'globe', variant: 'info' },
        { value: 400, text: this.$t('payments.payOnDelivery'), icon: 'truck-loading', variant: 'success' }
      ]
    }
  },
  computed: {
    payAdapterType () {
      return this.adapterTypes.find(i => i.value === this.value.payAdapterType)
    },
    payType () {
      return this.payTypes.find(i => i.value === this.value.payType)
    }
  }
}
</script>
