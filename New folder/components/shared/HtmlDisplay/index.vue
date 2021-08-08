<template>
  <div>
    <div v-if="!model" v-html="value"></div>
    <div v-else v-html="model"></div>
    <component v-for="c in componentNames" :key="c" :is="c" :id="`${c}-cmp`" @loaded="moveComponent(c)" style="display:none !important" class="font-weight-normal" />
  </div>
</template>

<script>
const componentNames = [
  'ContactForm',
  'ContactInfo'
]
const components = {}
componentNames.forEach(c => {
  components[c] = () => import(`./components/${c}`)
})

const vm = {
  name: 'HtmlDisplay',
  props: {
    value: { type: String, default: null }
  },
  data() {
    return {
      model: null,
      componentNames: []
    }
  },
  watch: {
    value (val) {
      this.setModel(val)
    }
  },
  mounted() {
    this.setModel(this.value)
  },
  methods: {
    setModel (val) {
      this.model = val

      componentNames.forEach(c => this.renderComponent(c))
    },
    renderComponent (name) {
      const lowerName = name.toLowerCase()
      if (!this.model || (this.model && this.model.toLowerCase().indexOf(`[${lowerName}]`) < 0)) return

      this.model = this.model.replace(new RegExp(`\\[${name}\\]`, 'i'), `<span id="${name}-target"></span>`)
      this.componentNames.push(name)
    },
    moveComponent (name) {
      const cmp = document.querySelector(`#${name}-cmp`)

      const target = document.querySelector(`#${name}-target`)

      target.replaceWith(cmp)

      cmp.style.display = null
    }
  }
}

vm.components = components
export default vm
</script>
