<template>
  <table class="table table-bordered mb-3">
    <tr>
      <td rowspan="2" class="text-center font-weight-bold bg-bright">
        {{ $t('customerOrders.buyer') }}
      </td>

      <td>
        <span class="font-weight-bold">
          {{ $t('addresses.firstNameAndLastName') }} :
        </span>
          
        {{ (`${value.firstName} ${value.lastName}`).trim()}}
      </td>

      <td>
        <span class="font-weight-bold">
          {{ $t('addresses.telephone') }} :
        </span>
        
        <span v-if="value.telephone" dir="ltr">
          {{ phoneCode }}{{ value.telephone }}
        </span>
      </td>

      <td>
        <span class="font-weight-bold">
          {{ $t('addresses.phoneNumber') }} :
        </span>
        
        <span v-if="value.mobile" dir="ltr">
          {{ phoneCode }}{{ value.mobile }}
        </span>
      </td>

      <td>
        <span class="font-weight-bold">
          {{ $t('addresses.zipCode') }} :
        </span>
        
        {{ value.zipCode }}
      </td>
    </tr>

    <tr>
      <td colspan="4">
        <span class="font-weight-bold">
          {{ $t('addresses.address') }} :
        </span>

        <template v-if="value.province">
          {{ value.province.name }}
        </template>

        <template v-if="value.city">
          <template v-if="$dir.ltr">,</template>
          <template v-else-if="$dir.rtl">،</template>
          
          {{ value.city.name }}
        </template>

        <template v-if="value.district">
          <template v-if="$dir.ltr">,</template>
          <template v-else-if="$dir.rtl">،</template>
          
          {{ value.district.name }}
        </template>

        <template v-if="value.street">
          <template v-if="$dir.ltr">,</template>
          <template v-else-if="$dir.rtl">،</template>
          
          {{ value.street }}
        </template>  
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'Address',
  props: {
    value: { type: Object, required: true }
  },
  computed: {
    phoneCode () {
      return this.$config.country.phoneCode
    }
  }
}
</script>
