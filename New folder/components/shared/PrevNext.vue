<template>
  <div class="px-3">
    <font-awesome-icon v-if="initializing" spin icon="circle-notch" class="align-middle text-moremuted" />
    <template v-else-if="prevUrl || nextUrl">
      <b-link v-if="prevUrl" :to="prevUrl" class="text-muted">
        <font-awesome-icon
        icon="angle-right"
        class="align-middle"
        :class="{'mr-2': $dir.ltr, 'ml-2': $dir.rtl}" />
        {{ $t('ads.PrevAd') }}
      </b-link>
      <span v-if="prevUrl && nextUrl" class="mx-3 text-muted">|</span>
      <b-link v-if="nextUrl" :to="nextUrl" class="text-muted">
        {{ $t('ads.NextAd') }}
        <font-awesome-icon
        icon="angle-left"
        class="align-middle"
        :class="{'ml-2': $dir.ltr, 'mr-2': $dir.rtl}" />
      </b-link>
    </template>
  </div>
</template>

<script>
export default {
  name: 'PrevNext',
  props: ['id', 'api'],
  data () {
    return {
      initializing: true,
      prevUrl: null,
      nextUrl: null
    }
  },
  mounted () {
    Promise.all([this.getPrevUrl(), this.getNextUrl()])
    .then(() => {
      this.initializing = false
    })
  },
  methods: {
    getPrevUrl () {
      this.api.prev(this.id)
      .then(res => {
        if (res)
          this.prevUrl = `${res.slug}--${res.id}.html`
      })
      .catch(err => {
        return false
      })
    },
    getNextUrl () {
      this.api.next(this.id)
      .then(res => {
        if (res)
          this.nextUrl = `${res.slug}--${res.id}.html`
      })
      .catch(err => {
        return false
      })
    }
  }
}
</script>
