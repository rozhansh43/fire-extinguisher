<template>
  <div>
    <b-input-group ref="cntr" :size="size" :class="{'mb-1': selected.length}">
      <b-input-group-prepend v-if="prepend" is-text>
        {{ prepend }}

        <required-symbol v-if="required"/>
      </b-input-group-prepend>

      <b-input
        :dir="dir"
        :placeholder="placeholder"
        :disabled="disabled"
        :style="$dir.rtl ? 'padding-left:25px' : 'padding-right:25px'"
        v-model="keyword"
        @keyup.native="inputKeyup"
        @blur.native="inputBlur"
        @focus.native="inputFocus"
      >
      </b-input>

      <span
        style="top:8px;z-index:1000"
        :style="$dir.rtl ? `top:${iconYPos};left:${iconXPos}` : `top:${iconYPos};right:${iconXPos}`"
        class="text-moremuted position-absolute"
      >
        <font-awesome-icon icon="circle-notch" spin v-if="progressing"/>

        <font-awesome-icon icon="search" v-else/>
      </span>

      <b-list-group v-if="results.length" class="position-absolute" style="top:100%;left:0;right:0;z-index:1100;">
        <b-list-group-item class="p-1" button v-for="item in results" :key="item.value" @click.prevent="add(item)">
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
          <font-awesome-icon icon="angle-down" class="align-middle"/>
        </b-btn>
      </b-input-group-append>

      <b-input-group-append v-if="this.$slots.default">
        <slot></slot>
      </b-input-group-append>
    </b-input-group>

    <b-list-group v-if="selected.length" :size="size">
      <b-list-group-item class="p-1 bg-bright" v-for="item in selected" :key="item.value">
        <a href="#"
          style="top:8px;z-index:1000;line-height:0"
          :style="$dir.rtl ? 'left:8px' : 'right:8px'"
          class="text-danger position-absolute"
        >
          <font-awesome-icon size="sm" icon="times" @click.prevent="remove(item)" />
        </a>
        {{item.text}}

        <template v-if="showDetails">
          <p class="small text-muted mt-1 mb-0" v-for="k in getOtherTextKeys(item)" :key="k">{{item[k]}}</p>
        </template>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'AutoCompleteMulti',
  props: {
    value: {type: Array, default: null},
    prepend: String,
    required: { type: Boolean, default: false },
    dir: String,
    placeholder: null,
    size: String,
    delay: {type: Number, default: 400},
    minChars: {type: Number, default: 0},
    count: {type: Number, default: 15}, // limit results count
    select: Function, // Promise : gets [value] array and returns [{value,text}] array
    search: Function, // Promise : gets keyword and returns [{value,text}] array,
    badge: {type: Boolean, default: false},
    disabled: {type: Boolean, default: false},
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
      keyword: null,
      selected: [],
      results: [],
      progressing: false,
      choosing: false,
      searchTimeout: null
    }
  },
  watch: {
    value (val, oldVal) {
      if (!_.isEqual(val, oldVal) && !this.choosing) {
        this.setSelected(val)
      }
      this.choosing = false
    }
  },
  mounted () {
    this.setSelected(this.value)
  },
  methods: {
    // altSearch (keyword) {
    //   return this.$api.exercises.getAll({
    //     title: keyword,
    //    })
    //   .then(exs => exs.map(ex => {
    //     return {
    //       text: ex.name,
    //       value: ex.id,
    //       nameEn: ex.nameEn
    //     }
    //   }))
    // },
    // altSelect (ids) {
    //   return this.$api.exercises.getAll({where: {
    //     or: ids.map(i => { return { id: i } })
    //   }})
    //   .then(exs => exs.map(ex => {
    //     return {
    //       text: ex.name,
    //       value: ex.id,
    //       nameEn: ex.nameEn
    //     }
    //   }))
    // },
    add (item) {
      this.choosing = true
      if (!this.selected.some(i => i.value === item.value)) {
        this.selected.push(item)
        this.$emit('input', this.selected.map(v => v.value))
        this.$emit('change', this.selected)
        this.keyword = null
      }
      this.results = []
    },
    remove (item) {
      if (confirm(this.$t('shared.areYouSureToRemoveThisItem'))) {
        this.choosing = true
        this.selected = this.selected.filter(v => v.value !== item.value)
        this.$emit('input', this.selected.map(v => v.value))
        this.$emit('change', this.selected)
      }
    },
    setSelected (value) {
      if (value && value.length) {
        this.progressing = true
        this.select(value).then(selected => {
          this.selected = selected
        }).catch(err => {
          if (err.statusCode !== 404) {
            this.$showError('auto-complete : ' + this.$getLocaleErrorMessage(err, 'shared'))
          }
          this.selected = []
        }).then(() => {
          this.progressing = false
        })
      } else {
        this.selected = []
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
        this.setSearchResults(this.keyword)
      }, this.delay)
    },
    inputBlur (e) {
      if (!e.relatedTarget || !this.$refs.cntr.contains(e.relatedTarget)) {
        this.results = []
      }
    },
    inputFocus () {
      this.setSearchResults(this.keyword)
    },
    getOtherTextKeys (item) {
      return Object.keys(item)
        .filter(key => key !== 'text' && key !== 'value' && key !== 'image')
    }
  }
}
</script>
