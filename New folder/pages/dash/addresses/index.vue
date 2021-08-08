<template>
  <div class="animated fadeIn">
    <title-display :title="$t('addresses.addresses')" icon="map-marked-alt">
      <template v-slot:side>
        <b-btn variant="success" to="/dash/addresses/new">
          <font-awesome-icon icon="plus" class="align-middle" :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"/>
          {{ $t('addresses.submitNewAddress') }}
        </b-btn>
      </template>
    </title-display>

    <div v-if="initializing" class="text-center">
      <font-awesome-icon spin icon="circle-notch" class="text-moremuted display-2"/>
    </div>

    <template v-else>
      <template v-if="items && items.length">
        <item v-for="item in items" :key="item.id" :value="item" @remove="remove"/>
      </template>

      <b-card v-else body-class="p-4">
        <font-awesome-icon icon="times-circle" class="display-4 d-block mb-4 mx-auto text-moremuted"/>

        <h5 class="text-muted font-weight-normal text-center mb-0">
          {{ $t('shared.thereAreNoResults') }}
        </h5>
      </b-card>
    </template>
  </div>
</template>

<script>
import progressEnd from '@/mixins/progress-end'
import TitleDisplay from '@/components/dash/shared/TitleDisplay'
import Item from '@/components/dash/addresses/Item'

export default {
  name: 'Addresses',
  components: {
    TitleDisplay,
    Item
  },
  meta: {
    modules: [
      'products_sale'
    ]
  },
  head () {
    return {
      title: this.$t('addresses.addresses')
    }
  },
  mixins: [progressEnd],
  data () {
    return {
      initializing: false,
      items: []
    }
  },
  asyncData ({ app, error }) {
    return app.$api.addresses.getAll({ include: ['Province', 'City', 'District']})
    .then(res => {
      return {
        items: res
      }
    })
    .catch(err => {
      error(err)
    })
  },
  methods: {
    remove (itemId) {
      this.items = this.items.filter(o => o.id !== itemId)
    }
  }
}
</script>
