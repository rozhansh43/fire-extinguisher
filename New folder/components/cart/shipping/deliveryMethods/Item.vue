<template>
  <b-card
    :bg-variant="selected ? 'success-light' : 'bright'"
    class="shadow-none border mb-0 h-100 cursor-pointer"
    :class="{ 'border-success': selected }"
    body-class="d-flex"
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

      <b-col v-if="value.image" cols="auto">
        <thumbnail
          :path="value.image"
          :link="false"
          :width="35"
          :height="35"
          class="rounded"
        />
      </b-col>

      <b-col>
        <div>
          {{ value.name }}
        </div>
        
        <small v-if="value.description" class="text-muted mt-2">
          {{ value.description }}
        </small>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import Thumbnail from '@/components/shared/Thumbnail'

export default {
  name: 'Item',
  components: {
    Thumbnail
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
