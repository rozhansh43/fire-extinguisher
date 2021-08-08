<template>
  <b-card no-body>
    <b-card-header class="p-0" :class="{ 'rounded-bottom bg-white': !collapsed }">
      <b-btn
        block
        class="p-3 inherited-link d-flex align-items-center justify-content-between"
        variant="link"
        @click="toggleCollapsed"
      >
        <h5 class="mb-0">
          <font-awesome-icon
            icon="file-alt"
            class="align-middle text-info"
            :class="{ 'mr-2': $dir.ltr, 'ml-2': $dir.rtl }"
          />

          {{ $t('cart.orderSummary') }}
        </h5>

        <font-awesome-icon
          :icon="collapsed ? 'angle-up' : 'angle-down'"
          class="align-middle"
        />
      </b-btn>
    </b-card-header>

    <b-card-body v-if="collapsed" class="pb-0">
      <item v-for="item in value.items" :key="item.id" :item="item"/>
    </b-card-body>
  </b-card>
</template>

<script>
import Item from './Item'

export default {
  name: 'OrderSummary',
  components: {
    Item
  },
  props: {
    value: { type: Object, required: true }
  },
  data () {
    return {
      collapsed: false
    }
  },
  methods: {
    toggleCollapsed () {
      this.collapsed = !this.collapsed
    }
  }
}
</script>
