<template>
  <div>
    <b-container v-if="breadcrumbItems && breadcrumbItems.length">
      <breadcrumb :items="breadcrumbItems"/>
    </b-container>

    <template v-if="items && items.length">
      <portfolio-default :widget="{data: items}" class="container"/>

      <b-container v-if="total > items.length" class="d-flex" dir="ltr">
        <b-pagination
          v-model="page"
          class="mx-auto shadow-sm"
          :total-rows="total"
          :per-page="$config.defaultPageSize"
        />
      </b-container>
    </template>

    <b-container v-else>
      <empty-list :message="$t('portfolio.notFound')"/>
    </b-container>
  </div>
</template>

<script>
import * as types from '@/store/types'
import progressEnd from '@/mixins/progress-end'
import Breadcrumb from '@/components/shared/Breadcrumb'
import EmptyList from '@/components/shared/EmptyList'
import PortfolioDefault from '@/components/widgets/portfolio/Default'

function getItems ({ $store, query, $api, $config }) {
  $store.commit(types.SET_DOWNLOAD_PROGRESS, 100)
  return Promise.all([
    $api.portfolio.getAll({
      skip: ((query.p - 1) * $config.defaultPageSize) || 0,
      limit: $config.defaultPageSize,
      sort: 'sortOrder-asc'
    }),
    $api.portfolio.count()
  ])
}

export default {
  name: 'PortfolioList',
  meta: {
    modules: [
      'portfolio'
    ]
  },
  head () {
    return {
      title: this.$t('portfolio.portfolios'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('portfolio.metaDescription')
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.$t('portfolio.portfolios')
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.$t('portfolio.metaDescription')
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.$t('portfolio.portfolios')
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.$t('portfolio.metaDescription')
        }
      ]
    }
  },
  components: {
    Breadcrumb,
    EmptyList,
    PortfolioDefault
  },
  mixins: [progressEnd],
  computed: {
    breadcrumbItems () {
      const items = []
      let path = ''

      path += '/portfolio'
      items.push({ path, text: this.$t('portfolio.portfolios') })

      return items
    }
  },
  watch: {
    page (val) {
      if (val > 1)
        this.$router.push({ query: { p: this.page }})
      else
        this.$router.push({ query: { p: undefined }})
    },
    '$route' () {
      this.getItems()
    }
  },
  asyncData({ params, query, app, error, store }) {
    return getItems({
      $store: store,
      query,
      $api: app.$api,
      $config: app.$config
    })
    .then(all => {
      return {
        items: all[0],
        total: all[1],
        page: query.p || 1
      }
    })
    .catch(error)
  },
  methods: {
    getItems () {
      return getItems({
        $store: this.$store,
        query: this.$route.query,
        $api: this.$api,
        $config: this.$config
      })
      .then(all => {
        this.$store.commit(types.SET_DOWNLOAD_PROGRESS, 0)
        this.items = all[0]
        this.total = all[1]
        this.page = this.$route.query.p || 1
      })
    }
  }
}
</script>
