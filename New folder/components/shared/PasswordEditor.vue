<template>
  <b-input-group :size="size">
    <slot name="prepend"></slot>

    <b-input-group-prepend v-if="prepend" is-text>
      {{ prepend }}
      <required-symbol v-if="required"/>
    </b-input-group-prepend>

    <div class="form-control p-0" :class="{ 'input-border-color-focus': focused }">
      <b-input
        :placeholder="placeholder"
        :type="fieldType"
        dir="ltr"
        class="border-0 h-100"
        :autocomplete="autocomplete"
        @focus="focused = true"
        @blur="focused = false"
        v-model="model"
      />

      <b-btn
        v-if="model && model.length"
        variant="link"
        class="position-absolute p-0"
        :style="`top:${iconYPos};right:${iconXPos}`"
        tabindex="-1"
        @mousedown="showPass"
        @mouseup="hidePass"
        @touchstart.prevent="showPass"
        @touchend.prevent="hidePass"
      >
        <font-awesome-icon icon="eye" class="align-middle text-muted"/>
      </b-btn>
    </div>
  </b-input-group>
</template>

<script>
export default {
  name: 'PasswordEditor',
  props: {
    value: String,
    prepend: { type: String, required: false },
    placeholder: { type: String, required: false },
    required: { type: Boolean, default: false },
    autocomplete: { type: String, default: 'new-password' },
    size: { type: String, default: 'md' }
  },
  data () {
    return {
      fieldType: 'password',
      focused: false
    }
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    iconYPos () {
      if (this.size === 'sm') return '3px'
      else if (this.size === 'md') return '6px'
      else if (this.size === 'lg') return '11px'
      else return null
    },
    iconXPos () {
      return '0.75rem'
    }
  },
  methods: {
    showPass () {
      this.fieldType = 'text'
    },
    hidePass () {
      this.fieldType = 'password'
    }
  }
}
</script>
