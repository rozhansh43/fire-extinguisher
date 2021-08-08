<template>
  <div>
    <b-container v-if="breadcrumbItems && breadcrumbItems.length">
      <breadcrumb :items="breadcrumbItems"/>
    </b-container>

    <template v-if="items && items.length">
      <services-default :widget="{data: items}" class="container"/>

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
      <empty-list :message="$t('services.notFound')"/>
    </b-container>
  </div>
</template>

<script>
import * as types from '@/store/types'
import progressEnd from '@/mixins/progress-end'
import Breadcrumb from '@/components/shared/Breadcrumb'
import EmptyList from '@/components/shared/EmptyList'
import ServicesDefault from '@/components/widgets/services/Default'

function getItems ({ $store, query, $api, $config }) {
  $store.commit(types.SET_DOWNLOAD_PROGRESS, 100)
  return Promise.all([
    $api.services.getAll({
      skip: ((query.p - 1) * $config.defaultPageSize) || 0,
      limit: $config.defaultPageSize,
      sort: 'sortOrder-asc'
    }),
    $api.services.count()
  ])
}

export default {
  name: 'Services',
  meta: {
    modules: [
      'services'
    ]
  },
  head () {
    return {
      title: this.$t('services.services'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('services.metaDescription')
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.$t('services.services')
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.$t('services.metaDescription')
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.$t('services.services')
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.$t('services.metaDescription')
        }
      ]
    }
  },
  components: {
    Breadcrumb,
    EmptyList,
    ServicesDefault
  },
  mixins: [progressEnd],
  computed: {
    breadcrumbItems () {
      const items = []
      let path = ''

      path += '/services'
      items.push({ path, text: this.$t('services.services') })

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
