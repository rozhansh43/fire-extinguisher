<template>
  <b-card class="cursor-pointer mb-2" body-class="pb-0" v-b-toggle="`faq${item.id}`">
    <div v-if="item.question" class="d-flex align-items-center justify-content-between pb-3" :class="{'text-left': $dir.ltr, 'text-right': $dir.rtl}">
      {{ item.question }}
      <font-awesome-icon :icon="expanded ? 'minus' : 'plus'" fixed-width class="align-middle text-primary"/>
    </div>

    <b-collapse v-if="item.answer" :id="`faq${item.id}`" accordion="faqs-accordion" @show="toggleCollapse" @hide="toggleCollapse">
      <hr class="mt-0">
      <html-display :value="item.answer"/>
    </b-collapse>
  </b-card>
</template>

<script>
import HtmlDisplay from '@/components/shared/HtmlDisplay'

export default {
  name: 'Item',
  components: {
    HtmlDisplay
  },
  props: {
    item: { type: Object, required: true }
  },
  data () {
    return {
      expanded: null
    }
  },
  methods: {
    toggleCollapse () {
      this.expanded = !this.expanded
    }
  }
}
</script>
