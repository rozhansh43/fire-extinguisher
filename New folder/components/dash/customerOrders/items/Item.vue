<template>
  <b-card>
    <template v-slot:header>
      <b-row class="align-items-center">
        <b-col lg="auto" class="mb-2 mb-lg-0">
          <span class="text-muted">
            {{ $t('shared.created') }} :
          </span>

          <date-display :value="value.created" time :class="{ 'ml-1': $dir.ltr, 'mr-1': $dir.rtl }"/>
        </b-col>

        <b-col class="mb-2 mb-lg-0">
          <span class="text-muted">
            {{ $t('customerOrders.orderId') }} :
          </span>

          {{ value.id }}
        </b-col>

        <b-col lg="auto">
          <b-btn block variant="link" class="p-0" :to="`/dash/orders/${value.id}`">
            <font-awesome-icon
              icon="eye"
              class="align-middle"
              :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
            />

            {{ $t('customerOrders.seeOrderDetails') }}

            <font-awesome-icon
              :icon="$dir.ltr ? 'angle-right' : 'angle-left'"
              class="align-middle"
              :class="{ 'ml-1': $dir.ltr, 'mr-1': $dir.rtl }"
            />
          </b-btn>
        </b-col>
      </b-row>
    </template>

    <products-default
      :widget="{ data: products, viewData: 'title-in-header' }"
      card-class="shadow-none mb-0"
      card-body-class="p-0"
      :per-page-custom="[[600, 1], [768, 3], [1200, 5]]"
      item-target="_blank"
    />

    <template v-slot:footer>
      <b-row class="justify-content-between">
        <b-col v-if="value.payable" lg="auto" class="mb-2 mb-lg-0">
          <span class="text-muted">
            {{ $t('products.payable') }} :
          </span>

          <currency-display
            :value="value.payable"
            amount-class="h5 mb-0 text-success"
          />
        </b-col>

        <b-col lg="auto">
          <b-btn
            block
            variant="link"
            class="p-0"
            :to="`/dash/orders/${value.id}?print=true`"
            target="_blank"
          >
            <font-awesome-icon
              icon="file-invoice-dollar"
              class="align-middle"
              :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
            />

            {{ $t('customerOrders.seeInvoice') }}

            <font-awesome-icon
              :icon="$dir.ltr ? 'angle-right' : 'angle-left'"
              class="align-middle"
              :class="{ 'ml-1': $dir.ltr, 'mr-1': $dir.rtl }"
            />
          </b-btn>
        </b-col>
      </b-row>
    </template>
  </b-card>
</template>

<script>
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'
import DateDisplay from '@/components/shared/DateDisplay'
import ProductsDefault from '@/components/widgets/products/default'

export default {
  name: 'OrderItem',
  components: {
    CurrencyDisplay,
    DateDisplay,
    ProductsDefault
  },
  props: {
    value: { type: Object, required: true }
  },
  computed: {
    products () {
      return this.value.items && this.value.items.length && this.value.items.map(o => o.product)
    }
  }
}
</script>
