<template>
  <div class="product-fields" :class="{ 'row': inline, 'd-inline-block': simpleInline }">
    <template v-for="fg in value">
      <div
        v-if="fg.fields && fg.fields.length && hasFieldValue(fg.fields)"
        :key="fg.id"
        :class="{ 'col-md-auto': inline, 'd-inline-block': inline || simpleInline, 'mb-4': !inline && !stacked && !inlineStacked && !simpleInline }"
      >
        <h5 v-if="!hideGroupName" class="mb-3">
          <font-awesome-icon
            :icon="$dir.ltr ? 'caret-right' : 'caret-left'"
            :class="{'mr-2': $dir.ltr, 'ml-2': $dir.rtl}"
            class="align-middle text-primary"
          />
          
          {{ getFieldGroupName(fg.id) }}
        </h5>

        <fields
          :value="fg.fields"
          :field-types="getFieldTypes(fg.id)"
          :reverse-variant="reverseVariant"
          :inline="inline"
          :stacked="stacked"
          :inline-stacked="inlineStacked"
          :simple-inline="simpleInline"
          :separator="separator"
        />
      </div>
    </template>
  </div>
</template>

<script>
import Fields from './fields'

export default {
  name: 'FieldsDisplay',
  components: {
    Fields
  },
  props: {
    value: { type: Array, required: true },
    type: { type: Object, required: true },
    reverseVariant: { type: Boolean, default: false },
    hideGroupName: { type: Boolean, default: false },
    inline: { type: Boolean, default: false },
    stacked: { type: Boolean, default: false },
    inlineStacked: { type: Boolean, default: false },
    simpleInline: { type: Boolean, default: false },
    separator: String
  },
  methods: {
    getFieldGroup (itemId) {
      if (!this.type) return null
      return this.type.fieldTypeGroups.find(i => i.id === itemId)
    },
    getFieldGroupName (itemId) {
      const group = this.getFieldGroup(itemId)
      return group ? group.name : null
    },
    getFieldTypes (itemId) {
      const group = this.getFieldGroup(itemId)
      return group ? group.fieldTypes : []
    },
    hasFieldValue (group) {
      return group.find(i => i.value !== null)
    }
  }
}
</script>
