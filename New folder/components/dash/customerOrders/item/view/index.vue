<template>
  <div>
    <title-display
      :title="$t('customerOrders.orderDetailsNumber', { number: value.id })"
      icon="clipboard-list"
    >
      <template v-if="status || value.hasFiles" v-slot:side>
        <b-row class="align-items-center">
          <b-col v-if="status" :class="{ 'mb-3 mb-md-0': status }">
            <span class="text-muted">
              {{ $t('shared.status') }} :
            </span>

            <font-awesome-icon
              :icon="status.icon"
              class="align-middle mx-1"
              :class="'text-' + status.variant"
            />

            {{ status.text }}
          </b-col>

          <b-col v-if="value.hasFiles" md="auto">
            <b-btn variant="info" block :to="`/dash/files?oid=${value.id}`">
              <font-awesome-icon
                icon="folder"
                class="align-middle"
                :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
              />

              {{ $t('files.viewFiles') }}
            </b-btn>
          </b-col>

          <b-col md="auto">
            <b-btn
              variant="warning"
              block
              :to="`/dash/orders/${value.id}?print=true`"
              target="_blank"
            >
              <font-awesome-icon
                icon="file-invoice-dollar"
                class="align-middle"
                :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
              />

              {{ $t('customerOrders.seeInvoice') }}
            </b-btn>
          </b-col>
        </b-row>
      </template>
    </title-display>
    
    <b-alert v-if="value.status === 30 && value.cancellationMessage" show variant="danger">
      <font-awesome-icon
        icon="times-circle"
        class="align-middle"
        :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
      />

      {{ $t('customerOrders.canceledOrderWithReason', { reason: value.cancellationMessage }) }}.
    </b-alert>

    <b-card class="overflow-hidden" body-class="p-0">
      <div class="pt-3 px-3">
        <b-row class="align-items-center">
          <b-col xl="4" lg="6" class="mb-3">
            <span class="text-muted">
              {{ $t('shared.created') }} :
            </span>

            <date-display v-if="value.created" :value="value.created" time :class="{ 'ml-1': $dir.ltr, 'mr-1': $dir.rtl }"/>
          </b-col>

          <b-col xl="4" lg="6" class="mb-3">
            <span class="text-muted">
              {{ $t('deliveryMethods.deliveryMethod') }} :
            </span>

            <template v-if="value.deliveryMethod">
              {{ value.deliveryMethod.name }}
            </template>
          </b-col>

          <b-col
            v-if="(value.payments && value.payments.length && value.payments[0].payAdapterType) || value.payOnDelivery"
            xl="4"
            lg="6"
            class="mb-3"
          >
            <span class="text-muted">
              {{ $t('payments.paymentMethod') }} :
            </span>

            <template v-if="value.payments && value.payments.length && value.payments[0].payAdapterType">
              {{ getPayAdapterType(value.payments[0].payAdapterType).text }}
            </template>

            <template v-else-if="value.payOnDelivery">
              {{ getPayAdapterType(410).text }}

              <span
                :class="{
                  'text-muted': value.payOnDelivery === 1,
                  'text-success': value.payOnDelivery === 2,
                  'text-danger': value.payOnDelivery === 3,
                  'ml-1': $dir.ltr,
                  'mr-1': $dir.rtl
                }"
              >
                <template v-if="value.payOnDelivery === 1">
                  ( {{ $t('shared.pending') }} )
                </template>

                <template v-if="value.payOnDelivery === 2">
                  ( {{ $t('shared.approved') }} )
                </template>

                <template v-else-if="value.payOnDelivery === 3">
                  ( {{ $t('shared.disapproved') }} )
                </template>
              </span>
            </template>
          </b-col>

          <b-col xl="4" lg="6" class="mb-3">
            <span class="text-muted">
              {{ $t('products.discount') }} :
            </span>

            <currency-display
              :value="value.itemsSaleDiscount + value.itemsCouponDiscount"
              amount-class="h5 mb-0 text-danger"
            />
          </b-col>

          <b-col v-if="value.deliveryMethod && !value.deliveryMethod.hideFee" xl="4" lg="6" class="mb-3">
            <span class="text-muted">
              {{ $t('deliveryMethods.shippingCost') }} :
            </span>

            <currency-display
              v-if="value.deliveryPayable"
              :value="value.deliveryPayable"
              amount-class="h5 mb-0 text-success"
            />

            <span v-else class="h5 mb-0 text-success">
              {{ $t('products.free') }}
            </span>
          </b-col>

          <b-col xl="4" lg="6" class="mb-3">
            <span class="text-muted">
              {{ $t('products.payable') }} :
            </span>

            <currency-display
              v-if="value.payable"
              :value="value.payable"
              amount-class="h5 mb-0 text-success"
            />

            <span v-else class="h5 mb-0 text-success">
              {{ $t('products.free') }}
            </span>
          </b-col>
        </b-row>
      </div>

      <pay v-if="!value.status" :order="value"/>
    </b-card>

    <b-card v-if="value.address" header-class="py-3" body-class="pb-0">
      <template v-slot:header>
        <h5 class="mb-0">
          <font-awesome-icon
            icon="map-marked-alt"
            class="align-middle text-info"
            :class="{ 'mr-2': $dir.ltr, 'ml-2': $dir.rtl }"
          />

          {{ $t('addresses.orderDeliveryAddress') }}
        </h5>
      </template>

      <address-details :value="value.address"/>

      <div v-if="value.description" class="text-justify mb-3">
        <font-awesome-icon
          icon="sticky-note"
          class="align-middle text-moremuted"
          :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
        />
        
        <span class="text-muted">
          {{ $t('shared.description') }} :
        </span>

        {{ value.description }}
      </div>
    </b-card>

    <payments v-if="value" :value="value"/>

    <b-card v-if="value.items && value.items.length" header-class="py-3" body-class="p-0 cart-items">
      <template v-slot:header>
        <h5 class="mb-0">
          <font-awesome-icon
            icon="boxes"
            class="align-middle text-info"
            :class="{ 'mr-2': $dir.ltr, 'ml-2': $dir.rtl }"
          />

          {{ $t('products.products') }}
        </h5>
      </template>

      <div class="order-items">
        <item v-for="item in value.items" :key="item.id" :item="item" class="item border-bottom"/>
      </div>
    </b-card>
  </div>
</template>

<script>
import AddressDetails from '@/components/cart/shipping/addresses/item/Horizontal'
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'
import DateDisplay from '@/components/shared/DateDisplay'
import Item from './item/index'
import Pay from './Pay'
import Payments from './payments/index'
import TitleDisplay from '@/components/dash/shared/TitleDisplay'

export default {
  name: 'OrderDetailsView',
  components: {
    AddressDetails,
    CurrencyDisplay,
    DateDisplay,
    Item,
    Pay,
    Payments,
    TitleDisplay
  },
  props: {
    value: { type: Object, required: true },
    adapterTypes: { type: Array, required: true },
    status: { type: Object, required: true }
  },
  methods: {
    getPayAdapterType (payAdapterType) {
      return this.adapterTypes.find(i => i.value === payAdapterType)
    }
  }
}
</script>
