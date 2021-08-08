<template>
  <b-btn
    class="d-flex align-items-center justify-content-between text-dark py-2 px-3"
    block
    variant="link"
    @click="emitToggle"
  >
    <template v-if="title">
      {{ title }}
    </template>

    <font-awesome-icon :icon="collapsed ? 'angle-up' : 'angle-down'" class="align-middle"/>
  </b-btn>
</template>

<script>
export default {
  name: 'CollapseButton',
  props: {
    title: String,
    collapsed: Boolean
  },
  methods: {
    emitToggle () {
      this.$emit('toggle')
    }
  }
}
</script>
