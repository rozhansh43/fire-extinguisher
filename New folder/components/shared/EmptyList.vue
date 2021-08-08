<template>
  <div>
    <b-card body-class="text-muted text-center p-5">
      <font-awesome-icon icon="times-circle" class="display-2 d-block mx-auto text-moremuted" :class="{ 'mb-4': message }"/>

      <h5 v-if="message" class="font-weight-normal mb-0">{{ message }}</h5>
    </b-card>

    <div v-if="returnUrl && returnUrlTitle" class="text-center mb-3">
      <b-link :to="returnUrl">
        {{ returnUrlTitle }}
      </b-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyList',
  props: {
    message: String,
    returnUrl: String,
    returnUrlTitle: String
  }
}
</script>
