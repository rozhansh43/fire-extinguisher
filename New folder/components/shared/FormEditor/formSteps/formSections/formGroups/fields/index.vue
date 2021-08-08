<template>
  <div>
    <item
      v-for="(item, index) in items"
      :key="item.id"
      :ref="`field${index}`"
      :value="value"
      :item="item"
      :field-types="fieldTypes"
    />
  </div>
</template>

<script>
import Item from './Item'

export default {
  name: 'Fields',
  components: {
    Item
  },
  props: {
    value: { type: Array, default: () => [] },
    items: { type: Array, required: true }
  },
  data () {
    return {
      fieldTypes: [
        { value: 0, text: 'Text' },
        { value: 1, text: 'Password' },
        { value: 2, text: 'TextArea' },
        { value: 3, text: 'Regex' },
        { value: 4, text: 'Url' },
        { value: 5, text: 'Email' },
        { value: 6, text: 'Description' },
        { value: 7, text: 'Date' },
        { value: 8, text: 'DateTime' },
        { value: 9, text: 'Select' },
        { value: 10, text: 'Checkbox' },
        { value: 11, text: 'Radio' },
        { value: 12, text: 'File' },
        { value: 13, text: 'NationalCode' },
        { value: 14, text: 'Phone' },
        { value: 15, text: 'Mobile' },
        { value: 16, text: 'Location' },
        { value: 17, text: 'Address' },
        { value: 18, text: 'Coordinates' },
        { value: 19, text: 'ZipCode' }
      ]
    }
  },
  methods: {
    validateAll () {
      const validates = []
      
      this.items.map((field, index) => {
        validates.push(this.$refs[`field${index}`][0].validateAll())
      })
      
      return Promise.all(validates)
      .then(all => {
        return all.every(v => v)
      })
    },
    resetValidator () {
      this.items.forEach((field, index) => {
        this.$refs[`field${index}`][0].resetValidator()
      })
    }
  }
}
</script>
