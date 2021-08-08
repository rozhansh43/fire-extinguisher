<template>
  <span>
    <filter-item
      v-for="item in value"
      :key="item.name"
      :text="getItemText(item)"
      @remove="remove(item.name)"
    />
  </span>
</template>

<script>
import FilterItem from '../filters/Item'

export default {
  name: 'FieldsFilter',
  components: {
    FilterItem
  },
  props: {
    value: { type: Array, required: true },
    type: { type: Object, required: true }
  },
  computed: {
    fieldTypes () {
      const fieldTypes = []

      if (this.type && this.type.fieldTypeGroups && this.type.fieldTypeGroups.length) {
        this.type.fieldTypeGroups.forEach(fieldTypeGroup => {
          fieldTypes.push(...fieldTypeGroup.fieldTypes)
        })
      }

      return fieldTypes
    }
  },
  methods: {
    getItemText (item) {
      const fieldType = this.fieldTypes.find(o => o.name === item.name)

      if (!fieldType || !item.filter) return null

      let data = null

      switch (fieldType.type) {
        case 0: // Boolean
          data = item.filter.value ? fieldType.trueLabel : fieldType.falseLabel
          break
        case 1: // Double
        case 2: // Long
          data = ''
          if (item.filter.min) {
            data += this.$t('search.from')
            data += ' '
            data += item.filter.min
          }
          if (item.filter.max) {
            if (item.filter.min) data += ' '
            data += this.$t('search.to')
            data += ' '
            data += item.filter.max
          }
          break
        case 3: // MultiSelect
        case 4: // Select
          data = []
          item.filter.value.forEach(val => {
            const option = fieldType.options.find(o => o.value === val)
            data.push(option && option.text)
          })
          data = data.join(` ${this.$dir.ltr ? ',' : '،'} `)
          break
        case 5: // String
          data = item.filter.value
      }

      return `${fieldType.displayName} : ${data}`
    },
    remove (itemName) {
      const key = itemName
      const query = Object.assign({}, this.$route.query)
      delete query[key]
      this.$router.push({ query })
    }
  }
}
</script>
