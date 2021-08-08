<template>
  <b-form-group>
    <label v-if="label" :class="labelClass">
      {{ label }} :
      <required-symbol v-if="required"/>
    </label>

    <b-input-group :size="size">
      <b-input-group-prepend v-if="prepend" is-text>
        {{ prepend }}

        <required-symbol v-if="required"/>
      </b-input-group-prepend>

      <b-input
        :placeholder="placeholder || `${$t('shared.clickToSelect')}...`"
        :disabled="disabled"
        readonly
        :class="{ 'bg-input cursor-pointer': !disabled }"
        :value="selected.text"
        @click="showItems"
      />

      <b-input-group-append v-if="value">
        <b-btn variant="white" class="border-input" @click="setSelected(null)">
          <font-awesome-icon icon="times" class="align-middle text-muted"/>
        </b-btn>
      </b-input-group-append>
    </b-input-group>

    <items
      ref="items"
      :title="$t('shared.selectWithName', { name })"
      :select="select"
      :search="search"
      :value="value"
      @input="setSelected"
    />
  </b-form-group>
</template>

<script>
import Items from './Items'

export default {
  name: 'ItemSelector',
  components: {
    Items
  },
  props: {
    value: { type: [String, Number], default: null },
    label: String,
    labelClass: String,
    prepend: String,
    required: { type: Boolean, default: false },
    name: String,
    size: String,
    placeholder: String,
    select: Function, // Promise : gets value and returns { value,text } object
    search: Function, // Promise : gets keyword and returns [{ value,text }] array,
    disabled: { type: Boolean, default: false }
  },
  data () {
    return {
      items: [],
      selected: {
        value: null,
        text: null
      }
    }
  },
  watch: {
    value (val) {
      if (val) {
        if (this.selected && this.selected.value !== val)
          this.getSelected()
      } else {
        this.setSelected(null)
      }
    }
  },
  mounted () {
    const val = this.value
    
    if (val) {
      if (this.selected && this.selected.value !== val)
        this.getSelected()
    } else {
      this.setSelected(null)
    }
  },
  methods: {
    showItems () {
      this.$refs.items.show()
    },
    getSelected () {
      this.select(this.value)
      .then(res => {
        this.selected = res
      })
      .catch(err => {
        this.$showError(this.$getLocaleErrorMessage(err, 'shared'))
      })
    },
    setSelected (item) {
      this.selected.value = item && item.id
      this.selected.text = item && item.text
      this.$emit('input', item && item.id)
      this.$emit('change', item)
    }
  }
}
</script>
