<template>
  <b-card :header-class="[headerClass, 'py-3']" body-class="p-0" class="overflow-hidden">
    <template v-slot:header>
      <h5 class="mb-0">
        <font-awesome-icon
          icon="money-check-alt"
          class="align-middle text-info"
          :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
        />
        
        {{ $t('payments.paymentMethod') }}
      </h5>
    </template>

    <b-list-group v-if="items && items.length" flush>
      <item v-for="item in items" :key="item.id" :value="item" :selected="isSelected(item.id)" @select="select"/>
    </b-list-group>

    <div v-else class="px-4 pt-4 pb-2">
      <font-awesome-icon icon="times-circle" class="display-4 d-block mb-4 mx-auto text-moremuted"/>

      <p class="text-muted text-center mb-3">
        {{ $t('payments.thereAreNoPaymentMethod') }}.
      </p>
    </div>
  </b-card>
</template>

<script>
import Item from './Item'

export default {
  name: 'PayAdapters',
  components: {
    Item
  },
  props: {
    value: Object,
    items: { type: Array, default: () => [] },
    headerClass: String
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
