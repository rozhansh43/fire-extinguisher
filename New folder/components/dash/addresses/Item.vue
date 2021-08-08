<template>
  <b-card header-bg-variant="primary" body-class="pb-0">
    <b-row class="align-items-center">
      <b-col>
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

        <div v-if="value.coordinates" class="mb-3">
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
      </b-col>

      <b-col lg="auto">
        <b-btn block variant="outline-light" class="text-dark mb-2" :to="`/dash/addresses/${value.id}`">
          <font-awesome-icon
            icon="pencil-alt"
            class="align-middle text-info"
            :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
          />
          
          {{ $t('shared.edit') }}
        </b-btn>
        
        <b-btn block :disabled="progressing" variant="outline-light" class="text-dark mb-3" @click="remove">
          <font-awesome-icon
            :icon="progressing ? 'cog' : 'trash-alt'"
            :spin="progressing"
            class="align-middle text-danger"
            :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
          />
          
          {{ $t('shared.remove') }}
        </b-btn>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import GeopointDisplayLink from '@/components/shared/GeopointDisplayLink'

export default {
  name: 'AddressItem',
  components: {
    GeopointDisplayLink
  },
  props: {
    value: { type: Object, required: true }
  },
  data () {
    return {
      progressing: false
    }
  },
  computed: {
    phoneCode () {
      return this.$config.country.phoneCode
    }
  },
  methods: {
    remove () {
      if (confirm(this.$t('shared.areYouSureToRemoveThisItem'))) {
        this.progressing = true
        this.$api.addresses.delete(this.value.id, true)
        .then(() => {
          this.$showSuccess(this.$t('addresses.addressRemoved'))
          this.$emit('remove', this.value.id)
        })
        .catch(err => {
          this.$showError(this.$getLocaleErrorMessage(err, 'addresses'))
        })
      }
    }
  }
}
</script>
