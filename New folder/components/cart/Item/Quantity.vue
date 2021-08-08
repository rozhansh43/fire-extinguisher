<template>
  <b-input-group>
    <b-input-group-prepend>
      <b-btn variant="outline-info" class="border-input" :disabled="model === max || progressing" @click="plus">
        <font-awesome-icon icon="plus" class="align-middle"/>
      </b-btn>
    </b-input-group-prepend>

    <numeric-input
      class="text-center"
      :min="min"
      :max="max"
      :disabled="progressing"
      :precision="precision"
      v-model="model"
    />

    <b-input-group-append>
      <b-btn variant="outline-danger" class="border-input" :disabled="model === min || progressing" @click="minus">
        <font-awesome-icon icon="minus" class="align-middle"/>
      </b-btn>
    </b-input-group-append>
  </b-input-group>
</template>

<script>
import vm from '@/lib/vm'

export default {
  name: 'Quantity',
  props: {
    itemId: Number,
    min: Number,
    max: Number,
    quantity: Number,
    precision: Number
  },
  data () {
    return {
      initializing: true,
      progressing: false,
      model: null
    }
  },
  watch: {
    model () {
      if (!this.initializing)
        this.editItem()
    }
  },
  mounted () {
    if (this.quantity) {
      this.model = this.quantity
      this.$nextTick(() => {
        this.initializing = false
      })
    }
  },
  methods: {
    plus () {
      this.model = this.model + 1
    },
    minus () {
      this.model = this.model - 1
    },
    editItem () {
      this.progressing = true

      this.$api.cartItems.editItem(this.itemId, this.model, true)
      .then(res => {
        this.progressing = false
        vm.$emit('setCartItems', res)
      })
      .catch(err => {
        this.progressing = false
        this.$showError(this.$getLocaleErrorMessage(err, 'cart'))
      })
    }
  }
}
</script>
