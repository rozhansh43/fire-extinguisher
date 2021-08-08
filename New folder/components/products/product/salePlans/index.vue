<template>
  <b-modal
    ref="modal"
    :title="$t('products.priceTable')"
    centered
    hide-footer
    size="lg"
    header-border-variant="light"
    body-class="p-0 rounded-bottom overflow-hidden"
    @hidden="cleanup"
  >
    <sale-plans
      :selected-package="selectedPackage"
      :selected-sale-plan-id="selectedSalePlanId"
    />
  </b-modal>
</template>

<script>
import SalePlans from './Content'

export default {
  name: 'SalePlansModal',
  components: {
    SalePlans
  },
  data () {
    return {
      selectedPackage: null,
      selectedSalePlanId: null
    }
  },
  methods: {
    show (selectedPackage, selectedSalePlanId) {
      this.cleanup()
      this.selectedPackage = selectedPackage
      this.selectedSalePlanId = selectedSalePlanId
      this.$refs.modal.show()
    },
    cleanup () {
      this.selectedPackage = null
      this.selectedSalePlanId = null
    }
  }
}
</script>
