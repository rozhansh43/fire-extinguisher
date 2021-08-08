<template>
  <div>
    <b-container v-if="(breadcrumbItems && breadcrumbItems.length) || (categories && categories.length)">
      <breadcrumb v-if="breadcrumbItems && breadcrumbItems.length" :items="breadcrumbItems"/>

      <b-row v-if="categories && categories.length">
        <b-col v-for="category in categories" :key="category.id" md="6" lg="3" class="mb-3">
          <b-link :to="`/blog/${category.slug}`" class="d-block inherited-link">
            <b-card class="mb-0" body-class="text-center">
              {{ category.name }}
            </b-card>
          </b-link>
        </b-col>
      </b-row>
    </b-container>

    <template v-if="items && items.length">
      <posts-default :widget="{data: items}" class="container"/>

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
      <empty-list :message="$t('posts.notFound')"/>
    </b-container>
  </div>
</template>

<script>
import * as types from '@/store/types'
import progressEnd from '@/mixins/progress-end'
import Breadcrumb from '@/components/shared/Breadcrumb'
import EmptyList from '@/components/shared/EmptyList'
import PostsDefault from '@/components/widgets/posts/Default'

function getItems ({ $store, query, $api, $config }) {
  $store.commit(types.SET_DOWNLOAD_PROGRESS, 100)
  return Promise.all([
    $api.postCategories.getAll({ sort: 'SortOrder-asc' }),
    $api.posts.getAllPublished({
      skip: ((query.p - 1) * $config.defaultPageSize) || 0,
      limit: $config.defaultPageSize,
      sort: 'published',
      include: 'PrimaryCategory'
    }),
    $api.posts.count()
  ])
}

export default {
  name: 'Blog',
  meta: {
    modules: [
      'posts'
    ]
  },
  head () {
    return {
      title: this.$t('posts.blog'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('posts.metaDescription')
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.$t('posts.blog')
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.$t('posts.metaDescription')
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.$t('posts.blog')
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.$t('posts.metaDescription')
        }
      ]
    }
  },
  components: {
    Breadcrumb,
    EmptyList,
    PostsDefault
  },
  mixins: [progressEnd],
  computed: {
    breadcrumbItems () {
      const items = []
      let path = ''

      path += '/blog'
      items.push({ path, text: this.$t('posts.blog') })

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
  asyncData({ query, app, error, store }) {
    return getItems({
      $store: store,
      query,
      $api: app.$api,
      $config: app.$config
    })
    .then(all => {
      return {
        categories: all[0] && all[0].length ? all[0].filter(o => o.parentIds.length === 1) : null,
        items: all[1],
        total: all[2],
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
        this.categories = all[0] && all[0].length ? all[0].filter(o => o.parentIds.length === 1) : null
        this.items = all[1]
        this.total = all[2]
        this.page = this.$route.query.p || 1
      })
    }
  }
}
</script>
