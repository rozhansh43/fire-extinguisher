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
  name: 'Page',
  meta: {
    modules: [
      'pages'
    ]
  },
  head () {
    return {
      title: this.model.metaTitle || this.model.title,
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
  validate ({ params }) {
    return !!params.page && params.page !== 'null'
  },
  asyncData ({ params, app, error, store }) {
    return app.$api.pages.getBySlug(params.page)
    .then(res => {
      if (process.client) store.commit(types.SET_DOWNLOAD_PROGRESS, 25)

      const productTypeIds = app.$api.products.getProductWidgetsTypeIds([
        res.area1,
        res.area2,
        res.area3,
        res.area4
      ])

      if (process.client) store.commit(types.SET_DOWNLOAD_PROGRESS, 50)

      let promises = []
      if (productTypeIds && productTypeIds.length) {
        promises = [app.$api.productTypes.getByIds(productTypeIds), app.$api.settings.get(['currency', 'products'])]
      } else {
        promises.push(Promise.resolve())
      }

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
