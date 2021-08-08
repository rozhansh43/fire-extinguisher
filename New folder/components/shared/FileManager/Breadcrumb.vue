<template>
  <ol dir="ltr" class="breadcrumb m-0 px-3 py-2 border-bottom">
    <li class="breadcrumb-item">
      <span v-if="!items.length">
        <font-awesome-icon icon="home" class="align-middle" />
      </span>
      <b-link @click="emitClick({path: '/'})" v-else>
        <font-awesome-icon icon="home" class="align-middle" />
      </b-link>
    </li>
    <li v-for="(path, index) in items" :key="path.path" class="breadcrumb-item" :class="{ active: index == items.length - 1 }">
      <span v-if="index == items.length - 1">
        {{path.name}}
      </span>
      <b-link @click="emitClick(path)" v-else>
       {{path.name}}
      </b-link>
    </li>
  </ol>
</template>

<script>
export default {
  name: 'FBreadcrumb',
  props: {
    items: { type: Array, required: true }
  },
  methods: {
    emitClick (path) {
      this.$emit('click', path.path)
    }
  }
}
</script>

<style lang="scss" scoped>
.breadcrumb-item::before {
  padding-left: 0 !important;
  padding-right: 0.5rem !important;
}
</style>

