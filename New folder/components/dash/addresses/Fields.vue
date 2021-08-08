<template>
  <div>
    <b-alert :show="errors.any()" variant="danger" class="px-4">
      <ul class="m-0 px-1">
        <li v-for="err in errors.all()" :key="err">{{ err }}</li>
      </ul>
    </b-alert>

    <b-row>
      <b-col md="6">
        <b-form-group>
          <label for="firstName" class="text-muted">
            {{ $t('addresses.firstName') }} :
            <required-symbol/>
          </label>

          <b-input-group>
            <b-form-input
              id="firstName"
              dir="auto"
              :name="$t('addresses.firstName')"
              v-validate="'required|max: 50'"
              v-model="model.firstName"
            />
          </b-input-group>
        </b-form-group>

        <b-form-group>
          <label for="lastName" class="text-muted">
            {{ $t('addresses.lastName') }} :
            <required-symbol/>
          </label>

          <b-input-group>
            <b-form-input
              id="lastName"
              dir="auto"
              :name="$t('addresses.lastName')"
              v-validate="'required|max: 50'"
              v-model="model.lastName"
            />
          </b-input-group>
        </b-form-group>

        <b-form-group>
          <label for="telephone" class="text-muted">
            {{ $t('addresses.telephone') }} :
          </label>

          <b-input-group>
            <b-input-group-prepend v-if="$dir.ltr" is-text>
              {{ this.$config.country.phoneCode }}
            </b-input-group-prepend>

            <b-form-input
              id="telephone"
              autocomplete="off"
              dir="ltr"
              placeholder="21xxxxxxxx"
              :name="$t('addresses.telephone')"
              v-validate="'digits:10'"
              v-model="model.telephone"
            />

            <b-input-group-append v-if="$dir.rtl" is-text dir="ltr">
              {{ this.$config.country.phoneCode }}
            </b-input-group-append>
          </b-input-group>
        </b-form-group>

        <b-form-group>
          <label for="phoneNumber" class="text-muted">
            {{ $t('addresses.phoneNumber') }} :
            <required-symbol/>
          </label>

          <b-input-group>
            <b-input-group-prepend v-if="$dir.ltr" is-text>
              {{ this.$config.country.phoneCode }}
            </b-input-group-prepend>

            <b-form-input
              id="phoneNumber"
              autocomplete="off"
              dir="ltr"
              placeholder="912xxxxxxx"
              :name="$t('addresses.phoneNumber')"
              v-validate="'required|digits:10'"
              v-model="model.mobile"
            />

            <b-input-group-append v-if="$dir.rtl" is-text dir="ltr">
              {{ this.$config.country.phoneCode }}
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col md="6">
        <item-selector
          required
          :label="`${$t('addresses.province')} :`"
          label-class="text-muted"
          :select="provinceSelect"
          :search="provinceSearch"
          :name="$t('addresses.province')"
          v-validate="'required'"
          v-model="model.provinceId"
          @change="setProvince"
        />

        <item-selector
          required
          :disabled="!model.provinceId"
          :label="`${$t('addresses.city')} :`"
          label-class="text-muted"
          :select="citySelect"
          :search="citySearch"
          :name="$t('addresses.city')"
          v-validate="'required'"
          v-model="model.cityId"
          @change="setCity"
        />

        <item-selector
          v-if="model.cityId && city && city.hasDistricts"
          :label="`${$t('addresses.district')} :`"
          label-class="text-muted"
          :select="districtSelect"
          :search="districtSearch"
          :name="$t('addresses.district')"
          v-model="model.districtId"
          @change="setDistrict"
        />

        <b-form-group>
          <label for="zipCode" class="text-muted">
            {{ $t('addresses.zipCode') }} :
            <required-symbol v-if="$settings.products.requiredAddressZipCode"/>
          </label>

          <b-input-group>
            <b-form-input
              v-model="model.zipCode"
              dir="ltr"
              :name="$t('addresses.zipCode')"
              v-validate="$settings.products.requiredAddressZipCode ? 'required|digits:10' : 'digits:10'"
            />
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>

    <b-form-group>
      <label for="postalAddress" class="text-muted">
        {{ $t('addresses.postalAddress') }} :
        <required-symbol/>
      </label>

      <b-input-group>
        <b-textarea
          id="postalAddress"
          :rows="3"
          dir="auto"
          :name="$t('addresses.postalAddress')"
          v-validate="'required|max: 500'"
          v-model="model.street"
        />
      </b-input-group>
    </b-form-group>

    <label for="coordinates" class="text-muted">
      {{ $t('addresses.coordinates') }} :
    </label>

    <geopoint-editor
      :name="$t('addresses.coordinates')"
      v-validate="'required'"
      auto-detect
      class="shadow-none"
      :delay="geopointEditorDelay"
      v-model="model.coordinates"
    />
  </div>
</template>

<script>
import GeopointEditor from '@/components/shared/GeopointEditor'
import ItemSelector from '@/components/shared/item-selector'
import { mapState } from 'vuex'

export default {
  name: 'Fields',
  components: {
    GeopointEditor,
    ItemSelector
  },
  props: {
    value: Object,
    geopointEditorDelay: Number
  },
  data () {
    return {
      city: null
    }
  },
  computed: {
    ...mapState(['$settings']),
    model: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    'model.provinceId' (val, oldVal) {
      if (!val || val !== oldVal) {
        this.model.cityId = null
        this.model.districtId = null
      }
    },
    'model.cityId' (val, oldVal) {
      if (!val || val !== oldVal) {
        this.model.districtId = null
      }
    }
  },
  methods: {
    provinceSearch (keyword) {
      return this.$api.provinces.getInfos({
        name: keyword,
        active: true,
        sort: 'sortOrder-asc'
      })
      .then(items => items.map(item => {
        return Object.assign(item, {
          text: item.name,
          value: item.id
        })
      }))
    },
    provinceSelect (value) {
      return this.$api.provinces.getInfos({
        id: value
      })
      .then(items => {
        return {
          text: items[0].name,
          value: items[0].id
        }
      })
    },
    citySearch (keyword) {
      return this.$api.cities.getInfos({
        name: keyword,
        active: true,
        provinceId: this.model.provinceId,
        sort: 'sortOrder-asc'
      })
      .then(items => items.map(item => {
        return Object.assign(item, {
          text: item.name,
          value: item.id
        })
      }))
    },
    citySelect (value) {
      return this.$api.cities.getInfos({
        id: value
      })
      .then(items => {
        return {
          text: items[0].name,
          value: items[0].id
        }
      })
    },
    districtSearch (keyword) {
      return this.$api.districts.getInfos({
        name: keyword,
        active: true,
        cityId: this.model.cityId,
        sort: 'sortOrder-asc'
      })
      .then(items => items.map(item => {
        return Object.assign(item, {
          text: item.name,
          value: item.id
        })
      }))
    },
    districtSelect (value) {
      return this.$api.districts.getInfos({
        id: value
      })
      .then(items => {
        return {
          text: items[0].name,
          value: items[0].id
        }
      })
    },
    validateAll () {
      return this.$validator.validateAll()
    },
    setProvince (item) {
      if (item && item.coordinates) this._setCoordinates(item.coordinates)
    },
    setCity (item) {
      this.city = item
      if (item && item.coordinates) this._setCoordinates(item.coordinates)
    },
    setDistrict (item) {
      if (item && item.coordinates) this._setCoordinates(item.coordinates)
    },
    _setCoordinates (coordinates) {
      this.model.coordinates = coordinates
    }
  }
}
</script>
