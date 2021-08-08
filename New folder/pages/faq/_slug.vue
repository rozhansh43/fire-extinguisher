<template>
  <div>
    <b-container>
      <breadcrumb :items="breadcrumbItems"/>

      <h1 v-if="item.question" class="h3 my-4">
        {{ item.question }}
      </h1>
      <b-card>
        <h6 class="mb-3 text-muted">{{ $t('faqs.Answer') }}:</h6>
        <html-display v-if="item.answer" :value="item.answer" class="article-body"/>
      </b-card>
    </b-container>

    <widgets v-if="bottomWidgets && bottomWidgets.length" :widgets="bottomWidgets" class="container"/>

    <b-container v-if="item.relatedFaqs && item.relatedFaqs.length" class="mb-4">
      <h5 class="text-center my-4">
        {{ $t('faqs.RelatedFaqs') }}
      </h5>

      <b-list-group>
        <b-list-group-item v-for="item in item.relatedFaqs" :key="item.id" :to="`/faq/${item.slug}`">
          {{ item.question }}
        </b-list-group-item>
      </b-list-group>
    </b-container>
  </div>
</template>

<script>
import * as types from '@/store/types'
import progressEnd from '@/mixins/progress-end'
import Breadcrumb from '@/components/shared/Breadcrumb'
import HtmlDisplay from '@/components/shared/HtmlDisplay'
import Widgets from '@/components/widgets'

let item
let bottomWidgets

export default {
  name: 'FAQ',
  meta: {
    modules: [
      'faqs'
    ]
  },
  head () {
    const headers = {
      title: this.item.metaTitle || this.item.question,
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.item.metaTitle || this.item.question
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.item.metaTitle || this.item.question
        }
      ]
    }

    if (this.item.metaDescription) {
      headers.meta.push({
        hid: 'description',
        name: 'description',
        content: this.item.metaDescription
      })
      headers.meta.push({
        hid: 'og:description',
        name: 'og:description',
        content: this.item.metaDescription
      })
      headers.meta.push({
        hid: 'twitter:description',
        name: 'twitter:description',
        content: this.item.metaDescription
      })
    }

    return headers
  },
  components: {
    Breadcrumb,
    HtmlDisplay,
    Widgets
  },
  mixins: [progressEnd],
  computed: {
    breadcrumbItems () {
      const items = []
      items.push({ text: this.item.question, to: `/faq/${this.item.slug}`})

      return items
    }
  },
  validate({ params, query, app, store, error }) {
    if (!params.slug)
      return false


    return Promise.all([
      app.$api.faqs.getBySlug(params.slug, { include: 'RelatedFaqs' }),
      app.$api.widgetAreas.getById('web faqs bottom')
    ])
    .then(all => {
      item = all[0]
      bottomWidgets = all[1]
      return true
    })
    .catch(err => {
      const errrMessage = `${err.status} : ${err.config && err.config.url}`
      console.log(errrMessage)
      error(err)
    })
  },
  asyncData({ params, store }) {
    store.commit(types.SET_DOWNLOAD_PROGRESS, 100)
    return {
      item,
      bottomWidgets
    }
  }
}
</script>
