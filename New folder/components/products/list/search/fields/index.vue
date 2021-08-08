<template>
  <div v-if="type && type.fieldTypeGroups && type.fieldTypeGroups.length">
    <div
      v-for="fieldTypeGroup in type.fieldTypeGroups"
      :key="fieldTypeGroup.id"
    >
      <template v-if="fieldTypeGroup && fieldTypeGroup.fieldTypes && fieldTypeGroup.fieldTypes.length">
        <div
          v-for="fieldType in fieldTypeGroup.fieldTypes"
          :key="fieldType.id"
        >
          <component
            v-if="fieldType.filterable"
            :is="`${getFieldTypeKey(fieldType)}Field`"
            :field-type="fieldType"
            :filters="filters"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Fields',
  components: {
    BooleanField: () => import('./fields/BooleanField'),
    DoubleField: () => import('./fields/DoubleField'),
    LongField: () => import('./fields/LongField'),
    MultiSelectField: () => import('./fields/MultiSelectField'),
    SelectField: () => import('./fields/SelectField'),
    StringField: () => import('./fields/StringField')
  },
  props: {
    type: { type: Object, required: true }
  },
  computed: {
    filters () {
      return this.getProductTypeFieldsFilter()
    }
  },
  methods: {
    getFieldTypeKey (fieldType) {
      if (fieldType) {
        switch (fieldType.type) {
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
    getProductTypeFieldsFilter () {
      const route = this.$route
      
      try {
        return this.$api.products.getProductTypeFieldsFilter({ query: route.query, productType: this.type })
      } catch (err) {
        return null
      }
    }
  }
}
</script>
