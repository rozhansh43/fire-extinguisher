<template>
  <div>
    <template v-if="value.header">
      <b-img
        :src="`${$config.files.staticServerUrl}/${value.header}`"
        :alt="value.title"
        class="mt-pull-3 mb-3"
        fluid-grow
      />
    </template>

    <b-container>
      <breadcrumb v-if="breadcrumbItems && breadcrumbItems.length" :items="breadcrumbItems"/>

      <b-card>
        <b-row class="align-items-center mb-3">
          <b-col>
            <h1 class="h3 mb-0">
              {{ value.title }}
            </h1>
          </b-col>

          <b-col cols="auto">
            <share
              compact
              modal
              btn-variant="link"
              btn-class="p-0 text-muted"
              :title="value.title"
              :url="`${$config.websiteUrl}/services/${value.slug}`"
            />
          </b-col>
        </b-row>

        <html-display v-if="value.body" :value="value.body" class="article-body"/>
      </b-card>
    </b-container>

    <portfolio-default v-if="$hasModule('portfolio')" :widget="{ data: portfolio }" class="container"/>
  </div>
</template>

<script>
import Breadcrumb from '@/components/shared/Breadcrumb'
import DateDisplay from '@/components/shared/DateDisplay'
import HtmlDisplay from '@/components/shared/HtmlDisplay'
import PortfolioDefault from '@/components/widgets/portfolio/Default'
import progressEnd from '@/mixins/progress-end'
import Share from '@/components/shared/Share'
import { mapState } from 'vuex'

export default {
  name: 'Service',
  meta: {
    modules: [
      'services'
    ]
  },
  head () {
    const headers = {
      title: this.value.metaTitle || this.value.title,
      titleTemplate: `%s | ${this.$t('services.services')} | ${this.$settings.branding.name}`,
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.value.metaTitle || this.value.title
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.value.metaTitle || this.value.title
        }
      ]
    }

    if (this.value.metaDescription) {
      headers.meta.push({
        hid: 'description',
        name: 'description',
        content: this.value.metaDescription
      })
      headers.meta.push({
        hid: 'og:description',
        name: 'og:description',
        content: this.value.metaDescription
      })
      headers.meta.push({
        hid: 'twitter:description',
        name: 'twitter:description',
        content: this.value.metaDescription
      })
    }

    return headers
  },
  components: {
    Breadcrumb,
    DateDisplay,
    HtmlDisplay,
    PortfolioDefault,
    Share
  },
  mixins: [progressEnd],
  data () {
    return {
      value: null,
      portfolio: null
    }
  },
  computed: {
    ...mapState(['$settings']),
    breadcrumbItems () {
      const items = []
      let path = ''

      path += '/services'
      items.push({ path, text: this.$t('services.services') })

      path += `/${this.value.slug}`
      items.push({ path, text: this.value.title })

      return items
    }
  },
  asyncData({ app, params, error }) {
    return app.$api.services.getBySlug(params.slug)
    .then(value => {
      if (app.$hasModule('portfolio') && value.tags && value.tags.length) {
        return app.$api.portfolio.getAll({
          tags: value.tags,
          limit: app.$config.defaultPageSize,
          sort: 'sortOrder-asc'
        })
        .then(portfolio => {
          return {
            value,
            portfolio
          }
        })
        .catch(error)
      } else {
        return {
          value,
          portfolio: null
        }
      }
    })
    .catch(error)
  }
}
</script>
