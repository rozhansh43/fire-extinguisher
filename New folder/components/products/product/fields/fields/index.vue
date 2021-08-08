<template>
  <div :class="{ 'row': inline, 'd-inline-block': simpleInline }">
    <template v-for="f in value">
      <component
        v-if="getFieldType(f) && f.value !== null"
        :is="`${getFieldTypeKey(f)}Field`"
        :key="f.id"
        :value="f.value"
        :field="getFieldType(f)"
        :reverse-variant="reverseVariant"
        :inline="inline"
        :stacked="stacked"
        :inline-stacked="inlineStacked"
        :simple-inline="simpleInline"
        :separator="separator"
        :class="{'col-md-auto mb-3': inline}"
      />
    </template>
  </div>
</template>

<script>
import BooleanField from './fields/BooleanField'
import DoubleField from './fields/DoubleField'
import LongField from './fields/LongField'
import MultiSelectField from './fields/MultiSelectField'
import SelectField from './fields/SelectField'
import StringField from './fields/StringField'

export default {
  name: 'Fields',
  components: {
    BooleanField,
    DoubleField,
    LongField,
    MultiSelectField,
    SelectField,
    StringField
  },
  props: {
    value: { type: Array, required: true },
    fieldTypes: { type: Array, required: true },
    reverseVariant: { type: Boolean, default: false },
    inline: { type: Boolean, default: false },
    stacked: { type: Boolean, default: false },
    inlineStacked: { type: Boolean, default: false },
    simpleInline: { type: Boolean, default: false },
    separator: String
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
    }
  }
}
</script>
