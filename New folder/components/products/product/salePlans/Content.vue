<template>
  <div>
    <b-table-simple
      bordered
      stacked="lg"
      class="table-bright table-flush mb-0"
    >
      <b-thead class="text-center">
        <b-tr>
          <b-th v-for="(field, index) in fields" :key="index" class="font-weight-bold p-3">
            {{ field }}
          </b-th>
        </b-tr>
      </b-thead>

      <b-tbody class="text-center">
        <b-tr v-for="item in selectedPackage.salePlans" :key="item.id" :class="{ 'bg-success-light': isSelected(item.id) }">
          <b-td :stacked-heading="`${fields[0]} :`" class="text-center p-3">
            {{ item.minOq.toLocaleString() }}
            
            <template v-if="item.minOq !== item.maxOq">
              {{ $t('products.to') }}
              
              {{ item.maxOq.toLocaleString() }}
            </template>
          </b-td>

          <b-td :stacked-heading="`${fields[1]} :`" class="text-center p-3">
            <currency-display
              v-if="item.priceBeforeDiscount"
              :value="item.priceBeforeDiscount"
              amount-class="h5 mb-0"
            />

            <span v-else class="h5 mb-0 text-success">
              {{ $t('products.free') }}
            </span>
          </b-td>

          <b-td :stacked-heading="`${fields[2]} :`" class="text-center p-3">
            <currency-display
              v-if="item.discount"
              :value="item.discount"
              amount-class="h5 mb-0 text-danger"
            />

            <span v-else-if="item.discountPercent" class="text-danger">
              {{ item.discountPercent }} {{ $t('products.percent') }}
            </span>
          </b-td>

          <b-td :stacked-heading="`${fields[3]} :`" class="text-center p-3">
            <currency-display
              v-if="item.priceAfterDiscount"
              :value="item.priceAfterDiscount"
              amount-class="h5 mb-0 text-success"
            />

            <span v-else class="h5 mb-0 text-success">
              {{ $t('products.free') }}
            </span>
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
  </div>
</template>

<script>
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'

export default {
  name: 'SalePlans',
  components: {
    CurrencyDisplay
  },
  props: {
    selectedPackage: Object,
    selectedSalePlanId: Number
  },
  data () {
    return {
      fields: [
        this.$t('products.packageCount', { name: this.selectedPackage && this.selectedPackage.name}),
        this.$t('products.priceBeforeDiscount'),
        this.$t('products.discount'),
        this.$t('products.priceAfterDiscount')
      ]
    }
  },
  methods: {
    isSelected (itemId) {
      return itemId && this.selectedSalePlanId === itemId
    }
  }
}
</script>
