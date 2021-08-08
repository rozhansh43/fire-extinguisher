<template>
  <div>
    <div class="mb-3">
      <font-awesome-icon
        icon="map-signs"
        class="align-middle text-moremuted"
        :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
      />
      
      <span class="text-muted">
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
    </div>
    
    <div v-if="value.coordinates.lat && value.coordinates.lon" class="mb-3">
      <font-awesome-icon
        icon="globe-americas"
        class="align-middle text-moremuted"
        :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
      />
      
      <span class="text-muted">
        {{ $t('addresses.coordinates') }} :
      </span>

      <geopoint-display-link :value="value.coordinates"/>
    </div>

    <div v-if="value.zipCode" class="mb-3">
      <font-awesome-icon
        icon="envelope"
        class="align-middle text-moremuted"
        :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
      />
      
      <span class="text-muted">
        {{ $t('addresses.zipCode') }} :
      </span>

      {{ value.zipCode }}
    </div>

    <div v-if="value.firstName || value.lastName" class="mb-3">
      <font-awesome-icon
        icon="user"
        class="align-middle text-moremuted"
        :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
      />
      
      <span class="text-muted">
        {{ $t('addresses.firstNameAndLastName') }} :
      </span>
      
      {{ (`${value.firstName} ${value.lastName}`).trim()}}
    </div>
    
    <div v-if="value.telephone" class="mb-3">
      <font-awesome-icon
        icon="phone"
        class="align-middle text-moremuted"
        :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
      />
      
      <span class="text-muted">
        {{ $t('addresses.telephone') }} :
      </span>
      
      <span dir="ltr">
        {{ phoneCode }}{{ value.telephone }}
      </span>
    </div>

    <div v-if="value.mobile" class="mb-3">
      <font-awesome-icon
        icon="mobile-alt"
        class="align-middle text-moremuted"
        :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
      />
      
      <span class="text-muted">
        {{ $t('addresses.phoneNumber') }} :
      </span>
      
      <span dir="ltr">
        {{ phoneCode }}{{ value.mobile }}
      </span>
    </div>
  </div>
</template>

<script>
import GeopointDisplayLink from '@/components/shared/GeopointDisplayLink'

export default {
  name: 'AddressItemHorizontal',
  components: {
    GeopointDisplayLink
  },
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
