<template>
  <b-modal
    ref="modal"
    centered
    size="xl"
    :title="isNew ? $t('addresses.submitNewAddress') : $t('addresses.editAddress')"
    @hidden="cleanup"
  >
    <fields ref="fields" :geopoint-editor-delay="500" v-model="model"/>

    <template v-slot:modal-footer>
      <b-btn block size="lg" :disabled="progressing" variant="success" @click.prevent="submit">
        <font-awesome-icon
          :icon="progressing ? 'cog' : (isNew ? 'plus' : 'check')"
          :spin="progressing"
          class="align-middle"
          :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
        />

        <template v-if="isNew">
          {{ $t('shared.add') }}
        </template>

        <template v-else>
          {{ $t('shared.save') }}
        </template>
      </b-btn>
    </template>
  </b-modal>
</template>

<script>
import Fields from '@/components/dash/addresses/Fields'
import vm from '@/lib/vm'

export default {
  name: 'AddressEditor',
  components: {
    Fields
  },
  data () {
    return {
      progressing: false,
      isNew: true,
      model: null,
      baseModel: {
        firstName: null,
        lastName: null,
        telephone: null,
        mobile: null,
        street: null,
        zipCode: null,
        coordinates: {},
        provinceId: null,
        cityId: null,
        districtId: null
      }
    }
  },
  methods: {
    show (item) {
      if (item) {
        this.isNew = false
        this.model = Object.assign(item, {
          provinceId: item.province && item.province.id,
          cityId: item.city && item.city.id,
          districtId: item.district && item.district.id
        })
      } else {
        const account = this.$store.state.$account
        if (account) {
          this.baseModel.firstName = account.firstName
          this.baseModel.lastName = account.lastName
          this.baseModel.mobile = account.phoneNumber
        }
        
        this.model = Object.assign({}, this.baseModel)
      }
      
      this.$refs.modal.show()
    },
    cleanup () {
      this.model = null
      this.isNew = true
    },
    preSubmit () {
      return this.$refs.fields.validateAll()
      .then(isValid => {
        this.progressing = isValid
        return isValid
      })
    },
    submit () {
      if (this.isNew) this._create()
      else this._edit()
    },
    _create () {
      this.preSubmit()
      .then(proceed => {
        if (proceed) {
          this.progressing = true
    
          this.$api.addresses.create(this.model, true)
          .then(res => {
            this.progressing = false
            this.$showSuccess(this.$t('addresses.newAddressAdded'))
            this._hide()
            this._emitRefresh(res.id)
          })
          .catch(err => {
            this.progressing = false
            this.$showError(this.$getLocaleErrorMessage(err, 'addresses'))
          })
        }
      })
    },
    _edit () {
      this.preSubmit()
      .then(proceed => {
        if (proceed) {
          this.progressing = true
    
          this.$api.addresses.update(this.model.id, this.model, true)
          .then(res => {
            this.progressing = false
            this.$showSuccess(this.$t('addresses.addressUpdated'))
            this._hide()
            this._emitRefresh(res.id)
          })
          .catch(err => {
            this.progressing = false
            this.$showError(this.$getLocaleErrorMessage(err, 'addresses'))
          })
        }
      })
    },
    _hide () {
      this.$refs.modal.hide()
    },
    _emitRefresh (selectedId) {
      vm.$emit('refreshAddresses', selectedId)
    }
  }
}
</script>
