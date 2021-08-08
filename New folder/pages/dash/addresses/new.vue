<template>
  <div class="animated fadeIn">
    <title-display :title="$t('addresses.submitNewAddress')" icon="map-marked-alt"/>

    <b-card>
      <fields ref="fields" v-model="model"/>

      <template v-slot:footer>
        <b-btn :disabled="progressing" variant="success" @click.prevent="submit">
          <font-awesome-icon
            :icon="progressing ? 'cog' : 'plus'"
            :spin="progressing"
            class="align-middle"
            :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
          />

          {{ $t('shared.add') }}
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
  name: 'New',
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
      title: this.$t('addresses.submitNewAddress')
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
    app.$api.settings.get('Products')
  },
  created () {
    const account = this.$store.state.$account
    if (account) {
      this.model.firstName = account.firstName
      this.model.lastName = account.lastName
      this.model.mobile = account.phoneNumber
    }
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
          this.$api.addresses.create(this.model, true)
          .then(() => {
            this.progressing = false
            this.$router.push('/dash/addresses')
            this.$showSuccess(this.$t('addresses.newAddressAdded'))
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
