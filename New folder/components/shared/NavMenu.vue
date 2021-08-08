<template>
  <b-nav vertical>
    <span v-for="item in items" :key="item.url">
      <b-nav-item :to="item.url" exact>
        <font-awesome-icon v-if="item.icon" :icon="item.icon" />
        <span class="mx-1">{{ item.title }}</span>
      </b-nav-item>
    </span>
  </b-nav>
</template>

<script>
export default {
  name: 'NavMenu',
  props: {
    items: { type: Array, default: () => [] }
  }
}
</script>
