<template>
  <b-input-group ref="cntr" :size="size">
    <b-input-group-prepend v-if="prepend" is-text>
      {{ prepend }}

      <required-symbol v-if="required"/>
    </b-input-group-prepend>

    <b-input
      :dir="dir"
      :placeholder="placeholder"
      :disabled="disabled"
      :style="$dir.rtl ? 'padding-left:25px' : 'padding-right:25px'"
      v-model="selected.text"
      @keyup.native="inputKeyup"
      @blur.native="inputBlur"
      @focus.native="inputFocus"
    >
    </b-input>

    <span
      style="z-index:1000"
      :style="$dir.rtl ? `top:${iconYPos};left:${iconXPos}` : `top:${iconYPos};right:${iconXPos}`"
      class="text-moremuted position-absolute">
      <font-awesome-icon icon="circle-notch" spin v-if="progressing" />
      <font-awesome-icon icon="search" v-else />
    </span>

    <b-list-group v-if="results.length" class="position-absolute" style="top:100%;left:0;right:0;z-index:1001;">
      <b-list-group-item class="p-1" button v-for="item in results" :key="item.value" @click.prevent="choose(item)">
        <b-row>
          <b-col>
            {{item.text}}
          </b-col>

          <b-col v-if="badge" cols="auto">
            <b-badge variant="silver" class="pt-1 mx-1">
              {{item.value}}
            </b-badge>
          </b-col>
        </b-row>
        
        <template v-if="showDetails">
          <p class="small text-muted mt-1 mb-0" v-for="k in getOtherTextKeys(item)" :key="k">{{item[k]}}</p>
        </template>
      </b-list-group-item>
    </b-list-group>

    <b-input-group-append>
      <b-btn
        :disabled="disabled"
        variant="bright"
        size="sm"
        class="border border-input"
        :class="{'rounded-right': $dir.ltr, 'rounded-left': $dir.rtl}"
        @click="setSearchResults(' ')"
        @blur="inputBlur"
      >
        <font-awesome-icon icon="angle-down" class="align-middle" />
      </b-btn>
    </b-input-group-append>

    <b-input-group-append v-if="this.$slots.default">
      <slot></slot>
    </b-input-group-append>
  </b-input-group>
</template>

<script>
export default {
  name: 'AutoComplete',
  props: {
    value: {type: [String, Number], default: null},
    text: {type: String, default: null},
    prepend: String,
    required: { type: Boolean, default: false },
    dir: String,
    size: String,
    placeholder: null,
    delay: {type: Number, default: 400},
    minChars: {type: Number, default: 0},
    count: {type: Number, default: 15}, // limit results count
    select: Function, // Promise : gets value and returns {value,text} object
    search: Function, // Promise : gets keyword and returns [{value,text}] array,
    autoEmpty: Boolean,
    disabled: {type: Boolean, default: false},
    badge: {type: Boolean, default: false},
    iconXPos: {
      type: String,
      default: '43px'
    },
    iconYPos: {
      type: String,
      default: '8px'
    },
    showDetails: { type: Boolean, default: false }
  },
  data () {
    return {
      selected: {
        value: null,
        text: null
      },
      results: [],
      progressing: false,
      choosing: false,
      searchTimeout: null
    }
  },
  watch: {
    text (val) {
      if (!val) {
        this.setSelected(null)
      }
    },
    value (val, oldVal) {
      if (val !== oldVal && !this.choosing) {
        this.setSelected(val)
      }
      this.choosing = false
    },
    'selected.text': function (val) {
      this.$emit('textChanged', val)
      if (!val) {
        this.$emit('input', null)
        this.$emit('change', null)
      }
    },
    'selected.value': function (val, oldVal) {
      if (val !== oldVal) {
        this.$emit('input', val)
        this.$emit('textSet', this.selected.text)
        this.$emit('valueSet', this.selected.value)
        if (this.autoEmpty) this.setSelected(null)
      }
    }
  },
  mounted () {
    this.setSelected(this.value)
  },
  methods: {
    // exSearch (keyword) {
    //   return this.$api.exercises.getAll({
    //     title: keyword,
    //    })
    //   .then(items => items.map(item => {
    //     return {
    //       text: item.name,
    //       value: item.id
    //     }
    //   }))
    // },
    // exSelect (value) {
    //   return this.$api.exercises.getById(value)
    //   .then(item => {
    //     return {
    //       text: item.name,
    //       value: item.id
    //     }
    //   })
    // },
    choose (item) {
      this.choosing = true
      this.selected.value = item.value
      this.selected.text = item.text
      this.results = []
      this.$emit('change', item)
    },
    setSelected (value) {
      if (value && String(value).length) {
        this.progressing = true
        this.select(value).then(o => {
          this.selected.value = o.value
          this.selected.text = o.text
        }).catch(err => {
          if (err.statusCode !== 404) {
            this.$showError('auto-complete : ' + this.$getLocaleErrorMessage(err, 'shared'))
          }
          this.selected.value = null
          this.selected.text = null
        }).then(() => {
          this.progressing = false
        })
      } else {
        this.selected.value = null
        this.selected.text = null
      }
    },
    setSearchResults (keyword) {
      if (keyword && keyword.length >= this.minChars) {
        this.progressing = true
        this.search(keyword, this.count).then(items => {
          this.results = items
        }).catch(err => {
          this.$showError('auto-complete : ' + this.$getLocaleErrorMessage(err, 'shared'))
        }).then(() => {
          this.progressing = false
        })
      } else {
        this.results = []
      }
    },
    inputKeyup () {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.setSearchResults(this.selected.text)
      }, this.delay)
    },
    inputBlur (e) {
      if (!e.relatedTarget || !this.$refs.cntr.contains(e.relatedTarget)) {
        this.results = []
      }
    },
    inputFocus () {
      this.setSearchResults(this.selected.text)
    },
    getOtherTextKeys (item) {
      return Object.keys(item)
        .filter(key => key !== 'text' && key !== 'value' && key !== 'image')
    }
  }
}
</script>
