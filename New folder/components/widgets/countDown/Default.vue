<template>
  <div
    v-if="widget.date"
    class="text-center"
    :class="{ 'py-5': widget.image }"
  >
    <h2 v-if="widget.title" class="mb-5">
      {{ widget.title }}
    </h2>

    <p v-if="widget.subtitle" class="mb-5">
      {{ widget.subtitle }}
    </p>

    <countdown
      :value="widget.date"
      :letters="widget.letters"
      class="h1 mb-0"
      icon-class=""
    />
  </div>
</template>

<script>
import Countdown from '@/components/shared/Countdown'

export default {
  name: 'CountDownDefault',
  components: {
    Countdown
  },
  props: {
    widget: { required: true }
  },
  methods: {
    hasClass (key) {
      return this.widget.viewData && this.widget.viewData.includes(key)
    }
  }
}
</script>
