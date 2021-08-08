<template>
  <b-btn
    v-if="absolute"
    variant="link"
    class="absolute-btn"
    @click="toggleCompare"
  >
    <div class="d-flex align-items-center">
      <font-awesome-icon
        v-if="isInCompareList"
        icon="check-circle"
        class="align-middle text-success"
        style="font-size: 10px"
      />

      <div v-else class="transparent-circle"></div>

      <small class="text-dark" :class="{'ml-1': $dir.ltr, 'mr-1': $dir.rtl}">
        {{ $t('compare.compare') }}
      </small>
    </div>
  </b-btn>

  <b-btn
    v-else
    variant="link"
    :title="isInCompareList ? $t('compare.removeFromCompare') : $t('compare.compare')"
    v-b-tooltip.hover
    class="p-0"
    @click="toggleCompare"
  >
    <font-awesome-icon icon="sliders-h" :class="isInCompareList ? 'text-info' : 'text-muted'"/>
  </b-btn>
</template>

<script>
export default {
  name: 'CompareButton',
  props: {
    item: { type: Object, required: true },
    endpoint: { type: String, required: true },
    absolute: { type: Boolean, default: false }
  },
  computed:{
    items () {
      return this.$api.compare.getAll(this.endpoint)
    },
    isInCompareList () {
      return this.items.find(i => i.id === this.item.id)
    }
  },
  methods: {
    toggleCompare () {
      if (this.isInCompareList) this.remove()
      else this.add()
    },
    add () {
      this.$api.compare.add(this.endpoint, this.item)
    },
    remove () {
      this.$api.compare.remove(this.endpoint, this.item.id)
    }
  }
}
</script>
