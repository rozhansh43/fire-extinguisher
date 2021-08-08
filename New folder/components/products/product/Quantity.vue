<template>
  <div>
    <b-input-group>
      <b-input-group-prepend>
        <b-btn variant="outline-info" class="border-input" :disabled="model === max" @click="plus">
          <font-awesome-icon icon="plus" class="align-middle"/>
        </b-btn>
      </b-input-group-prepend>

      <numeric-input
        class="text-center"
        :min="min"
        :max="max"
        :precision="precision"
        v-model="model"
      />

      <b-input-group-append>
        <b-btn variant="outline-danger" class="border-input" :disabled="model === min" @click="minus">
          <font-awesome-icon icon="minus" class="align-middle"/>
        </b-btn>
      </b-input-group-append>
    </b-input-group>
  </div>
</template>

<script>
export default {
  name: 'Quantity',
  props: {
    max: Number,
    min: Number,
    value: Number,
    precision: Number
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
    plus () {
      this.model = this.model + 1
    },
    minus () {
      this.model = this.model - 1
    }
  }
}
</script>
