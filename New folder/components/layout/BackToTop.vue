<template>
  <b-btn
    id="bktb"
    variant="primary"
    class="circle-icon-btn shadow"
    size="lg"
    :class="{'scrolled': scrolled}"
    @click="goToTop"
  >
    <font-awesome-icon icon="chevron-up" />
  </b-btn>
</template>

<script>
import { scroll } from '@/lib/scroll'

export default {
  name: 'BackToTop',
  data () {
    return {
      scrolled: false
    }
  },
  beforeMount () {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll () {
      this.scrolled = window.scrollY > 100
    },
    goToTop () {
      scroll(0)
    }
  }
}
</script>

<style lang="scss" scoped>
  #bktb {
    opacity: 0;
    position: fixed;
    right: 20px;
    bottom: -43px;
    z-index: -1;
    transition: all .25s;
  }

  .scrolled {
    bottom: 20px !important;
    z-index: 1030 !important;
    opacity: 1 !important;
  }
</style>

