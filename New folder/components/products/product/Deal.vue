<template>
  <div
    v-if="
        selectedSalePlan &&
        selectedSalePlan.dealName &&
        selectedSalePlan.dealEndDate
      "
    >
      <div class="product-deal pb-3">
        <h5 class="mb-0 font-weight-normal">
          {{ selectedSalePlan.dealName }}
        </h5>

        <countdown
          :value="selectedSalePlan.dealEndDate"
          icon-class="text-danger"
        />
      </div>
  </div>
</template>

<script>
import Countdown from '@/components/shared/Countdown'

export default {
  name: 'Deal',
  components: {
    Countdown
  },
  props: {
    selectedSalePlan: { type: Object, required: true }
  }
}
</script>
