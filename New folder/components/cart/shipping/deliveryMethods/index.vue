<template>
  <b-card header-class="py-3" body-class="pb-0">
    <template v-slot:header>
      <h5 class="mb-0">
        <font-awesome-icon
          icon="truck"
          class="align-middle text-info"
          :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
        />
        
        {{ $t('deliveryMethods.deliveryMethod') }}
      </h5>
    </template>

    <div v-if="progressing" class="text-center p-3">
      <font-awesome-icon spin icon="circle-notch" class="text-moremuted display-2 mb-3"/>
    </div>

    <template v-else>
      <b-row v-if="items && items.length">
        <b-col v-for="item in items" :key="item.id" xl="4" lg="6" class="mb-3">
          <item :value="item" :selected="isSelected(item.id)" @select="select"/>
        </b-col>
      </b-row>

      <div v-else class="p-3">
        <font-awesome-icon icon="times-circle" class="display-4 d-block mb-4 mx-auto text-moremuted"/>

        <p class="text-muted text-center mb-2">
          {{ $t('deliveryMethods.thereAreNoDeliveryMethodsForSelectedAddress') }}.
        </p>

        <p class="text-muted text-center mb-3">
          {{ $t('deliveryMethods.selectAnotherAddress') }}.
        </p>
      </div>
    </template>
  </b-card>
</template>

<script>
import Item from './Item'

export default {
  name: 'DeliveryMethods',
  components: {
    Item
  },
  props: {
    value: Object,
    items: { type: Array, default: () => [] },
    progressing: Boolean
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    isSelected (itemId) {
      return this.model && this.model.id === itemId
    },
    select (item) {
      this.model = item
    }
  }
}
</script>
