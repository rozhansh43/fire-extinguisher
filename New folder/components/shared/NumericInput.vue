<template>
  <input
    ref="input"
    dir="ltr"
    type="text"
    class="form-control"
    :class="{ 'form-control-lg': size === 'lg', 'form-control-sm': size === 'sm' }"
    :placeholder="placeholder"
    @blur="emitBlur"
  >
    <!-- v-b-popover.focus.top="$store.state.$locale === 'fa' && !hideLetters && (value || 0).toPersianLetter()" -->
</template>

<script>
// import Num2persian from 'num2persian'
import IMask from 'imask'

export default {
  name: 'NumericInput',
  // components: {
  //   Num2persian
  // },
  props: {
    value: { type: Number },
    min: { type: Number, default: null },
    max: { type: Number, default: null },
    placeholder: String,
    size: { type: String, default: 'md' },
    hideLetters: { type: Boolean, default: false },
    precision: { type: Number, default: 0 },
    thousandsSeparator: { type: String, default: ',' }
  },
  data () {
    return {
      mask: null
    }
  },
  computed: {
    maskOptions () {
      return {
        mask: Number, // enable number mask
        prepare: this.fixChar,

        // other options are optional with defaults below
        scale: this.precision, // digits after point, 0 for integers
        signed: true, // disallow negative
        thousandsSeparator: this.thousandsSeparator, // any single char
        padFractionalZeros: false, // if true, then pads zeros at end to the length of scale
        normalizeZeros: true, // appends or removes zeros at ends
        radix: '.', // fractional delimiter
        mapToRadix: ['/'], // symbols to process as radix

        // additional number interval options (e.g.)
        min: this.min,
        max: this.max
      }
    }
  },
  watch: {
    value () {
      this.reinit()
    },
    min () {
      this.reinit()
    },
    max () {
      this.reinit()
    },
    precision () {
      this.reinit()
    }
  },
  mounted () {
    this.init()
  },
  beforeDestroy () {
    this.mask.destroy()
  },
  methods: {
    init () {
      this.mask = IMask(this.$refs.input, this.maskOptions)
      this.mask.unmaskedValue = String(this.value)
      this.mask.on('accept', this.emitInput)
      this.emitInput()
    },
    destroy () {
      this.mask.destroy()
    },
    reinit () {
      this.destroy()
      this.init()
    },
    emitInput () {
      if (this.mask.unmaskedValue === null || this.mask.unmaskedValue.trim() === '' || isNaN(this.mask.unmaskedValue)) {
        this.$emit('input', null)
      } else {
        const val = Number(this.mask.unmaskedValue)

        if (this.value !== val) {
          this.$emit('input', val)
        }
      }
    },
    fixChar (val) {
      return String(val)
      .replace(/۰/g, '0') // Persian digits
      .replace(/۱/g, '1')
      .replace(/۲/g, '2')
      .replace(/۳/g, '3')
      .replace(/۴/g, '4')
      .replace(/۵/g, '5')
      .replace(/۶/g, '6')
      .replace(/۷/g, '7')
      .replace(/۸/g, '8')
      .replace(/۹/g, '9')
      .replace(/٠/g, '0') // Arabic digits
      .replace(/١/g, '1')
      .replace(/٢/g, '2')
      .replace(/٣/g, '3')
      .replace(/٤/g, '4')
      .replace(/٥/g, '5')
      .replace(/٦/g, '6')
      .replace(/٧/g, '7')
      .replace(/٨/g, '8')
      .replace(/٩/g, '9')
    },
    emitBlur () {
      this.$emit('blur')
    }
  }
}
</script>
