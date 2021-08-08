<template>
  <b-list-group-item
    :class="{ 'bg-success-light': selected }"
    class="cursor-pointer"
    @click="emitSelect"
  >
    <b-row class="align-items-center">
      <b-col cols="auto">
        <font-awesome-icon
          :icon="selected ? 'check-circle' : 'circle'"
          class="align-middle"
          size="lg"
          :class="selected ? 'text-success' : 'text-silver'"
        />
      </b-col>

      <b-col>
        <div>
          <pay-adapter-display :value="value"/>
        </div>
        
        <small v-if="value.description" class="text-muted mt-2">
          {{ value.description }}
        </small>
      </b-col>
    </b-row>
  </b-list-group-item>
</template>

<script>
import PayAdapterDisplay from '@/components/shared/PayAdapterDisplay'

export default {
  name: 'Item',
  components: {
    PayAdapterDisplay
  },
  props: {
    value: { type: Object, required: true },
    selected: Boolean
  },
  methods: {
    emitSelect () {
      this.$emit('select', this.value)
    }
  }
}
</script>
