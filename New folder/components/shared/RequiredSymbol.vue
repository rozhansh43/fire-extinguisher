<template>
  <span class="text-danger" :class="{ 'ml-1': $dir.ltr, 'mr-1': $dir.rtl }">
    *
  </span>
</template>

<script>
export default {
  name: 'RequiredSymbol'
}
</script>
