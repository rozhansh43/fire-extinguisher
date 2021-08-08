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
      <empty-list
        :message="$t('posts.notFound')"
        return-url="/blog"
        :return-url-title="$t('posts.viewAllPosts')"
      />
    </b-container>
  </div>
</template>

<script>
import progressEnd from '@/mixins/progress-end'
import Breadcrumb from '@/components/shared/Breadcrumb'
import EmptyList from '@/components/shared/EmptyList'
import PostsDefault from '@/components/widgets/posts/Default'

import { mapState } from 'vuex'

function getItems ({ params, query, $api, $config }) {
  return Promise.all([
    $api.posts.getAllPublished({
      categorySlug: params.cat,
      skip: ((query.p - 1) * $config.defaultPageSize) || 0,
      limit: $config.defaultPageSize,
      sort: 'published',
      include: 'PrimaryCategory'
    }),
    $api.posts.count({categorySlug: params.cat})
  ])
}

export default {
  name: 'PostCategory',
  meta: {
    modules: [
      'posts'
    ]
  },
  head () {
    const headers = {
      title: this.category.metaTitle || this.category.name,
      titleTemplate: `%s | ${this.$t('posts.blog')} | ${this.$settings.branding.name}`,
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.category.metaTitle || this.category.name
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.category.metaTitle || this.category.name
        }
      ]
    }

    if (this.category.metaDescription) {
      headers.meta.push({
        hid: 'description',
        name: 'description',
        content: this.category.metaDescription
      })
      headers.meta.push({
        hid: 'og:description',
        name: 'og:description',
        content: this.category.metaDescription
      })
      headers.meta.push({
        hid: 'twitter:description',
        name: 'twitter:description',
        content: this.category.metaDescription
      })
    }

    return headers
  },
  components: {
    Breadcrumb,
    EmptyList,
    PostsDefault
  },
  mixins: [progressEnd],
  computed: {
    ...mapState(['$settings']),
    breadcrumbItems () {
      const items = []
      let path = ''

      path += '/blog'
      items.push({ path, text: this.$t('posts.blog') })

      this.parents.forEach(category => {
        path = `/blog/${category.slug}`
        items.push({ path, text: category.name })
      })

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
  asyncData({ params, query, app, error }) {
    return app.$api.postCategories.getBySlug(params.cat)
    .then(category => {
      return Promise.all([
        app.$api.postCategories.getAll({ ids: category.parentIds.reverse() }),
        app.$api.postCategories.getAll({ parentId: category.id, sort: 'SortOrder-asc' }),
        getItems({ params, query, $api: app.$api, $config: app.$config })
      ])
      .then(all => {
        return {
          category,
          parents: all[0],
          categories: all[1],
          items: all[2][0],
          total: all[2][1]
        }
      })
    })
    .catch(error)
  },
  methods: {
    getItems () {
      return getItems({
        params: this.$route.params,
        query: this.$route.query,
        $api: this.$api,
        $config: this.$config
      })
      .then(all => {
        this.items = all[0]
        this.total = all[1]
        this.page = this.$route.query.p || 1
      })
    }
  }
}
</script>
