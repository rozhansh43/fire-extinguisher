<template>
  <transition name="slide">
    <b-alert v-if="items && items.length" show variant="warning" class="px-3 pt-3 pb-0 mb-3">
      <b-row class="align-items-center justify-content-between">
        <b-col>
          <h6 class="mb-3">
            {{ $t('cart.changesHeader') }} :
          </h6>

          <ul class="mb-0">
            <li v-for="item in items" :key="item.id" class="mb-3">
              <item :item="item"/>
            </li>
          </ul>
        </b-col>

        <b-col lg="auto">
          <b-btn size="sm" variant="warning" block class="mb-3 px-3" @click="emitConfirmChanges">
            {{ $t('shared.ok') }}
          </b-btn>
        </b-col>
      </b-row>
    </b-alert>
  </transition>
</template>

<script>
import Item from './Item'

export default {
  name: 'Changes',
  components: {
    Item
  },
  props: {
    items: { type: Array, required: true }
  },
  methods: {
    emitConfirmChanges () {
      this.$emit('confirmChanges')
    }
  }
}
</script>
