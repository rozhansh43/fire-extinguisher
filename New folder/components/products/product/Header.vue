<template>
  <b-img
    :src="`${$config.files.staticServerUrl}/${value}`"
    class="mb-3"
    fluid-grow
  />
</template>

<script>
export default {
  name: 'HeaderDisplay',
  props: {
    value: { type: String, required: true }
  }
}
</script>
