<template>
  <div class="d-flex justify-content-center">
    <div style="width: 29.7cm">
      <b-row class="align-items-center mb-4">
        <b-col>
          <h3 class="mb-0">
            <template v-if="status.value">
              {{ $t('customerOrders.invoice') }}
            </template>

            <template v-else>
              {{ $t('customerOrders.preInvoice') }}
            </template>

            {{ $settings.branding.name }}
          </h3>
        </b-col>

        <b-col cols="auto">
          <thumbnail
            :path="$settings.branding.logo"
            :alt="$settings.branding.name"
            fit-in
            :width="250"
            :height="250"
            :link="false"
            :quality="90"
          />
        </b-col>
      </b-row>

      <table class="table table-bordered mb-3">
        <tr>
          <td>
            <span class="font-weight-bold">
              {{ $t('customerOrders.orderId') }} :
            </span>

            {{ value.id }}
          </td>

          <td>
            <span class="font-weight-bold">
              {{ $t('shared.created') }} :
            </span>

            <date-display
              v-if="value.created"
              :value="value.created"
              time
              icon-class="text-dark"
              :class="{ 'ml-1': $dir.ltr, 'mr-1': $dir.rtl }"
            />
          </td>

          <td>
            <span class="font-weight-bold">
              {{ $t('shared.status') }} :
            </span>

            <font-awesome-icon
              :icon="status.icon"
              class="align-middle mx-1"
            />

            {{ status.text }}
          </td>

          <td v-if="status.value">
            <span class="font-weight-bold">
              {{ $t('payments.paymentMethod') }} :
            </span>

            <template v-if="value.payments && value.payments.length && value.payments[0].payAdapterType">
              {{ getPayAdapterType(value.payments[0].payAdapterType).text }}
            </template>
          </td>
        </tr>
      </table>

      <address-details v-if="value.address" :value="value.address"/>

      <!-- <div v-if="hasAnyProfileFields" class="border p-3 mb-3">
        <profile-fields
          :value="value.customer.profileFields"
          :column="3"
          simple
        />
      </div> -->

      <items
        :value="value.items"
        :product-types="productTypes"
        :order="value"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AddressDetails from './Address'
import DateDisplay from '@/components/shared/DateDisplay'
import Items from './Items'
// import ProfileFields from '../profileFields'
import Thumbnail from '@/components/shared/Thumbnail'

export default {
  name: 'OrderDetailsPrint',
  components: {
    AddressDetails,
    DateDisplay,
    Items,
    // ProfileFields,
    Thumbnail
  },
  props: {
    value: { type: Object, required: true },
    adapterTypes: { type: Array, required: true },
    status: { type: Object, required: true },
    productTypes: { type: Array, required: true }
  },
  computed: {
    ...mapState(['$settings'])
    // hasAnyProfileFields () {
    //   const types = this.$store.state.$settings.customerProfile
      
    //   return this.value &&
    //     this.value.customer &&
    //     this.value.customer.profileFields &&
    //     this.value.customer.profileFields.length &&
    //     this.value.customer.profileFields.find(field => {
    //       const type = types.find(o => o.id === field.id)
    //       return type ? type.onInvoice : false
    //     })
    // }
  },
  methods: {
    getPayAdapterType (payAdapterType) {
      return this.adapterTypes.find(i => i.value === payAdapterType)
    }
  }
}
</script>
