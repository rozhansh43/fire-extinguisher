<template>
  <div>
    <b-row class="align-items-center justify-content-between my-3">
      <b-col>
        <h5 class="mb-0">
          <font-awesome-icon
            v-if="icon"
            :icon="icon"
            class="align-middle text-muted"
            :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
          />

          <template v-if="title">
            <b-link v-if="url" class="inherited-link" :to="url">
              {{ title }}
            </b-link>

            <template v-else>
              {{ title }}
            </template>
          </template>
        </h5>
      </b-col>

      <b-col v-if="hasSideSlot" lg="auto" class="mt-3 mt-lg-0">
        <slot name="side"></slot>
      </b-col>
    </b-row>

    <hr class="mt-0 mb-3"/>
  </div>
</template>

<script>
export default {
  name: 'TitleDisplay',
  props: {
    title: String,
    icon: String,
    url: String
  },
  computed: {
    hasSideSlot () {
      return !!this.$slots.side
    }
  }
}
</script>
