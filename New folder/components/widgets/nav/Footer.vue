<template>
  <div v-if="widget.items && widget.items.length">
    <h1>
      nav footer
    </h1>
    <h2 v-if="widget.title" class="widget-title h4 mb-4">
      {{ widget.title }}
    </h2>

    <p v-if="widget.subtitle" class="mb-4 text-muted">
      {{ widget.subtitle }}
    </p>

    <b-nav vertical>
      <b-nav-item
        v-for="item in widget.items"
        :key="item.url"
        :to="item.url"
        exact
        link-classes="inherited-link px-0 py-0 d-inline-block"
        class="mb-3"
      >
        <font-awesome-icon
          v-if="item.icon"
          :icon="item.icon"
          :class="{ 'mr-2': $dir.ltr && item.title, 'ml-2': $dir.rtl && item.title }"
        />
        
        <template v-if="item.title">
          {{ item.title }}
        </template>
      </b-nav-item>
    </b-nav>
  </div>
</template>

<script>
export default {
  name: 'NavVertical',
  props: {
    widget: { required: true }
  }
}
</script>
