<template>
  <vue-snotify />
</template>

<script>
export default {
  name: 'Notifications'
}
</script>

<style>
@import '~/node_modules/vue-snotify/styles/material.css';
.snotify {
  width: 400px;
  max-width: 92%;
}
.snotifyToast__title {
  font-size: 1.3em;
}
.snotify-icon {
  background-size: 75%;
  background-repeat: no-repeat;
  background-position: center;
}
.snotify-success .snotifyToast__body,
.snotify-info .snotifyToast__body,
.snotify-error .snotifyToast__body,
.snotify-warning .snotifyToast__body {
  color: #fff;
}
</style>
