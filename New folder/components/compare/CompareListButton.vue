<template>
  <div v-if="items && items.length">
    <b-btn variant="info" class="float-button rounded-pill shadow" @click="showModal">
      <font-awesome-icon icon="sliders-h" class="align-middle" :class="{'mr-1': $dir.ltr, 'ml-1': $dir.rtl}"/>

      {{ $t('compare.compare') }}

      <div class="badge-absolute border-info">
        {{ items.length }}
      </div>
    </b-btn>

    <compare-list ref="modal"/>
  </div>
</template>

<script>
import CompareList from './CompareList'

export default {
  name: 'CompareListButton',
  components: {
    CompareList
  },
  props: {
    endpoint: { type: String, required: true }
  },
  computed: {
    items () {
      return this.$api.compare.getAll(this.endpoint)
    }
  },
  methods: {
    showModal () {
      this.$refs.modal.show(this.endpoint)
    }
  }
}
</script>

<style lang="scss" scoped>
  .float-button {
    z-index: 1030;
    position: fixed;
    left: 20px;
    bottom: 20px;
  }
</style>
