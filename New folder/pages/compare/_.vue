<template>
  <b-container class="animated fadeIn">
    <breadcrumb :items="breadcrumbItems"/>
    <b-card no-body class="compare-wrap" @scroll="onHorizontalScroll">
      <compare-items
        :type="type"
        :items="items"
        endpoint="products"
        :column-width="columnWidth"
      />

      <group
        v-for="fieldTypeGroup in type.fieldTypeGroups"
        :key="fieldTypeGroup.id"
        class="px-3 mb-3"
        :render-group-name="type.fieldTypeGroups.length > 1"
        :field-type-group="fieldTypeGroup"
        :items="items"
        :column-width="columnWidth"
      />
    </b-card>
  </b-container>
</template>

<script>
import vm from '@/lib/vm'
import Breadcrumb from '@/components/shared/Breadcrumb'
import CompareItems from '@/components/compare/CompareItems'
import Group from '@/components/compare/Group'
import progressEnd from '@/mixins/progress-end'
import * as types from '@/store/types'
import { isUnsignedInteger } from '@/lib/util'

export default {
  name: 'Compare',
  meta: {
    modules: [
      'products'
    ]
  },
  head () {
    return {
      title: this.$t('compare.compareList', { type: this.type.title }),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:  this.$t('compare.compareList', { type: this.type.title })
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content:  this.$t('compare.compareList', { type: this.type.title })
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content:  this.$t('compare.compareList', { type: this.type.title })
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content:  this.$t('compare.compareList', { type: this.type.title })
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content:  this.$t('compare.compareList', { type: this.type.title })
        }
      ]
    }
  },
  components: {
    Breadcrumb,
    CompareItems,
    Group
  },
  mixins: [progressEnd],
  data () {
    return {
      columnWidth: 300,
      scrollIsReverse: false
    }
  },
  computed: {
    breadcrumbItems () {
      const items = []
      let path = ''

      path += '/products'
      items.push({ path, text: this.$t('products.products') })

      path += '/compare'
      items.push({ path, text: `${this.$t('compare.compare')} ${this.type.title}` })

      return items
    }
  },
  validate ({ params }) {
    return params.pathMatch.split('/').find(o => !isUnsignedInteger(o)) === undefined
  },
  asyncData({ params, app, error, store }) {
    const ids = params.pathMatch.split('/')

    return Promise.all([
      app.$api.products.compare({ ids }),
      app.$api.settings.get('currency')
    ])
    .then(all => {
      if (process.client) store.commit(types.SET_DOWNLOAD_PROGRESS, 25)

      const items = all[0]
      return app.$api.productTypes.getByIds([items[0].typeId])
      .then(pts => {
        if (process.client) store.commit(types.SET_DOWNLOAD_PROGRESS, 75)

        return { items, type: pts[0] }
      })
    })
    .catch(error)
  },
  methods: {
    onHorizontalScroll (e) {
      const wrap = e.target

      this.scrollIsReverse = this.scrollIsReverse || wrap.scrollLeft < 0

      let scroll

      if (this.$dir.ltr) {
        scroll = wrap.scrollLeft
      } else if (this.scrollIsReverse) {
        scroll = -wrap.scrollLeft
      } else {
        const maxScroll = wrap.scrollWidth - wrap.clientWidth
        scroll = maxScroll - wrap.scrollLeft
      }

      vm.$emit('compare-scroll', scroll)
    }
  }
}
</script>
