<template>
  <div class="animated fadeIn">
    <title-display :title="$t('addresses.editAddress')" icon="map-marked-alt"/>

    <b-card>
      <fields ref="fields" v-model="model"/>

      <template v-slot:footer>
        <b-btn :disabled="progressing" variant="success" @click.prevent="submit">
          <font-awesome-icon
            :icon="progressing ? 'cog' : 'check'"
            :spin="progressing"
            class="align-middle"
            :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
          />

          {{ $t('shared.save') }}
        </b-btn>
      </template>
    </b-card>
  </div>
</template>

<script>
import progressEnd from '@/mixins/progress-end'
import TitleDisplay from '@/components/dash/shared/TitleDisplay'
import Fields from '@/components/dash/addresses/Fields'

export default {
  name: 'Edit',
  components: {
    TitleDisplay,
    Fields
  },
  meta: {
    modules: [
      'products_sale'
    ]
  },
  head () {
    return {
      title: this.$t('addresses.editAddress')
    }
  },
  mixins: [progressEnd],
  data () {
    return {
      progressing: false,
      model: {
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
  asyncData ({ app, error, params }) {
    return Promise.all([
      app.$api.addresses.getById(params.id, { include: ['Province', 'City', 'District'] }, true),
      app.$api.settings.get('Products')
    ])
    .then(all => {
      const model = all[0]

      model.provinceId = model.province && model.province.id
      model.cityId = model.city && model.city.id
      model.districtId = model.district && model.district.id

      return {
        model
      }
    })
    .catch(err => {
      error(err)
    })
  },
  methods: {
    preSubmit () {
      return this.$refs.fields.validateAll()
      .then(isValid => {
        this.progressing = isValid
        return isValid
      })
    },
    submit () {
      this.preSubmit()
      .then(proceed => {
        if (proceed) {
          this.$api.addresses.update(this.model.id, this.model, true)
          .then(() => {
            this.progressing = false
            this.$showSuccess(this.$t('addresses.addressUpdated'))
          })
          .catch(err => {
            this.$showError(this.$getLocaleErrorMessage(err, 'addresses'))
            this.progressing = false
          })
        }
      })
    }
  }
}
</script>
