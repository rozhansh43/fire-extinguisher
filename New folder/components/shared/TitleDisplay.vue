<template>
  <div>
    <h4 v-if="title">
      {{ title }}
    </h4>
    <p v-if="subtitle" class="text-muted">
      {{ subtitle }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'TitleDisplay',
  props: ['title', 'subtitle']
}
</script>
