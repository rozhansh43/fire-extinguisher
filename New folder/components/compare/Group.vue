<template>
  <div v-if="fieldTypes && fieldTypes.length">
    <h5
      v-if="renderGroupName"
      class="mb-4 mt-3 position-relative"
    >
      <span class="position-absolute" style="top:0" :style="{ right: `${ fieldNamesScroll }px` }">
        <font-awesome-icon
          fixed-width
          :icon="$dir.ltr ? 'caret-right' : 'caret-left'"
          class="align-middle text-primary"
        />
        {{ fieldTypeGroup.name }}
      </span>
      <span>&nbsp;</span>
    </h5>

    <div v-for="fieldType in fieldTypes" :key="fieldType.id">
      <template v-if="hasAnyValue(fieldType.id)">
        <div class="bg-light py-2 px-3 font-weight-bold position-relative">
          <span class="position-absolute py-2 px-3" style="top:0" :style="{ right: `${ fieldNamesScroll }px` }">
            {{ fieldType.displayName }}
          </span>
          <span>&nbsp;</span>
        </div>

        <div class="d-flex bg-bright">
            <div v-for="item in items" :key="item.id" :style="columnStyle">
              <component
                v-if="getFieldValue(item, fieldType.id) !== null"
                :is="`${getFieldTypeKey(fieldType)}Field`"
                :value="getFieldValue(item, fieldType.id)"
                :field="getFieldType(fieldType)"
                value-only
              />

              <div v-else class="py-2">⠀</div>
            </div>

            <div :style="columnStyle" class="py-2"></div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import vm from '@/lib/vm'

export default {
  name: 'Group',
  components: {
    BooleanField: () => import('@/components/products/product/fields/fields/fields/BooleanField'),
    DoubleField: () => import('@/components/products/product/fields/fields/fields/DoubleField'),
    LongField: () => import('@/components/products/product/fields/fields/fields/LongField'),
    MultiSelectField: () => import('@/components/products/product/fields/fields/fields/MultiSelectField'),
    SelectField: () => import('@/components/products/product/fields/fields/fields/SelectField'),
    StringField: () => import('@/components/products/product/fields/fields/fields/StringField')
  },
  props: {
    renderGroupName: { type: Boolean, default: false },
    fieldTypeGroup: { type: Object, required: true },
    items: { type: Array, required: true },
    columnWidth: { type: Number, required: true }
  },
  data () {
    return {
      fieldNamesScroll: 0
    }
  },
  computed: {
    columnStyle () {
      return {
        'min-width': `${this.columnWidth}px`,
        'max-width': `${this.columnWidth}px`
      }
    },
    fieldTypes () {
      return this.fieldTypeGroup.fieldTypes
    }
  },
  mounted () {
    vm.$on('compare-scroll', scroll => {
      this.fieldNamesScroll = scroll
    })
  },
  beforeDestroy () {
    vm.$off('compare-scroll')
  },
  methods: {
    getFieldType (item) {
      return this.fieldTypes && this.fieldTypes.length && this.fieldTypes.find(i => i.id === item.id)
    },
    getFieldTypeKey (item) {
      const field = this.getFieldType(item)
      if (field) {
        switch (field.type) {
          case 0:
            return 'Boolean'
          case 1:
            return 'Double'
          case 2:
            return 'Long'
          case 3:
            return 'MultiSelect'
          case 4:
            return 'Select'
          case 5:
            return 'String'
        }
      }
    },
    getFieldValue (item, fieldTypeId) {
      const group = item.fieldGroups && item.fieldGroups.length && item.fieldGroups.find(o => o.id === this.fieldTypeGroup.id)
      const field = group && group.fields && group.fields.length && group.fields.find(o => o.id === fieldTypeId)
      return field && field.value !== null ? field.value : null
    },
    hasAnyValue (fieldTypeId) {
      let hasAnyValue = false
      for (let index = 0; index < this.items.length; index++) {
        const item = this.items[index]
        if (this.getFieldValue(item, fieldTypeId) !== null) {
          hasAnyValue = true
          break
        }
      }
      return hasAnyValue
    }
  }
}
</script>
