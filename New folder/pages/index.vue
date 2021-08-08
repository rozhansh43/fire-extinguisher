<template>
  <div class="animated fadeIn">
    <areas
      :layout="model.layout"
      :area1="model.area1"
      :area2="model.area2"
      :area3="model.area3"
      :area4="model.area4"
    />
  </div>
</template>

<script>
import Areas from '@/components/areas/index'
import progressEnd from '@/mixins/progress-end'
import * as types from '@/store/types'

export default {
  name: 'HomePage',
  head () {
    return {
      title: this.model.metaTitle || this.model.title,
      titleTemplate: '%s',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.model.metaDescription
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.model.metaTitle || this.model.title
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.model.metaDescription
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.model.metaTitle || this.model.title
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.model.metaDescription
        }
      ]
    }
  },
  components: {
    Areas
  },
  mixins: [progressEnd],
  data () {
    return {
      brands: [],
      model: {
        title: null,
        slug: null,
        layout: null,
        area1: [],
        area2: [],
        area3: [],
        area4: []
      }
    }
  },
  asyncData({ app, error, store }) {
    return app.$api.pages.getHomePageDisplay()
    .then(res => {
      if (process.client) store.commit(types.SET_DOWNLOAD_PROGRESS, 25)
      
      const promises = []

      if (app.$hasModule(['products', 'products_sale']))
        promises.push(app.$api.settings.get(['currency', 'products']))

      if (app.$hasModule('products_types')) {
        const productTypeIds = app.$api.products.getProductWidgetsTypeIds([
          res.area1,
          res.area2,
          res.area3,
          res.area4
        ])
        
        if (productTypeIds && productTypeIds.length) {
          promises.push(app.$api.productTypes.getByIds(productTypeIds))
        } else {
          promises.push(Promise.resolve())
        }
      }

      if (process.client) store.commit(types.SET_DOWNLOAD_PROGRESS, 50)

      return Promise.all(promises)
      .then(() => {
        if (process.client) store.commit(types.SET_DOWNLOAD_PROGRESS, 75)

        return {
          model: res
        }
      })
    })
    .catch(error)
  }
}
</script>
