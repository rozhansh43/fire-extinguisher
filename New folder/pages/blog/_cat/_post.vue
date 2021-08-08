<template>
  <div itemscope itemtype="http://schema.org/BlogPosting">
    <template v-if="item.header">
      <b-img
        :src="`${$config.files.staticServerUrl}/${item.header}`"
        :alt="item.title"
        class="mt-pull-3 mb-3"
        fluid-grow
      />

      <meta itemprop="image" :content="`${$config.files.staticServerUrl}/${item.header}`"/>
    </template>

    <b-container>
      <breadcrumb v-if="breadcrumbItems && breadcrumbItems.length" :items="breadcrumbItems"/>

      <b-card>
        <b-row class="align-items-center mb-4">
          <b-col>
            <h1 class="h3 mb-0" itemprop="mainEntityOfPage">
              <span itemprop="headLine">
                {{ item.title }}
              </span>
            </h1>
          </b-col>

          <b-col cols="auto">
            <share
              compact
              modal
              btn-variant="link"
              btn-class="p-0 text-muted"
              :title="item.title"
              :url="`${$config.websiteUrl}/blog/${item.primaryCategory.slug}/${item.slug}`"
            />
          </b-col>
        </b-row>

        <b-row class="align-items-center justify-content-between mb-4">
          <b-col class="mb-4 mb-lg-0">
            <b-link class="d-block text-muted" :to="`/blog/${item.primaryCategory.slug}`" itemprop="articleSection">
              {{ item.primaryCategory.name }}
            </b-link>
          </b-col>

          <b-col v-if="item.published" lg="auto" :class="{'text-lg-right': $dir.ltr, 'text-lg-left': $dir.rtl}">
            <date-display
              :value="item.published"
              class="text-muted"
              icon-class="text-muted"
              :title="$t('widgets.posts.publishDate')"
              v-b-tooltip
            />
            <meta itemprop="datePublished" :content="item.published" />
            <meta itemprop="dateModified" :content="item.updated" />
          </b-col>
        </b-row>

        <div class="sr-only" itemprop="author" itemscope itemtype="http://schema.org/Organization">
          <meta itemprop="name" :content="$settings.branding.name"/>
        </div>

        <div class="sr-only" itemprop="publisher" itemscope itemtype="http://schema.org/Organization">
          <meta itemprop="name" :content="$settings.branding.name"/>
          <span itemprop="logo" itemscope itemtype="https://schema.org/ImageObject">
            <img :src="`${$config.websiteUrl}/img/logo.png`"/>
            <meta itemprop="url" :content="`${$config.websiteUrl}/img/logo.png`">
            <meta itemprop="width" content="400">
            <meta itemprop="height" content="120">
          </span>
        </div>

        <div v-if="item.lead" class="bg-light text-center rounded p-3 mb-4" itemprop="description">
          {{ item.lead }}
        </div>

        <html-display v-if="item.body" :value="item.body" class="article-body" itemprop="articleBody"/>
      </b-card>
    </b-container>

    <widgets v-if="bottomWidgets && bottomWidgets.length" :widgets="bottomWidgets" class="container"/>

    <!-- <b-container>
      <comments allow-new related-model="post" :related-id="item.id" class="my-4" />
    </b-container> -->
  </div>
</template>

<script>
// , CommentsEditor as Comments
import Breadcrumb from '@/components/shared/Breadcrumb'
import DateDisplay from '@/components/shared/DateDisplay'
import HtmlDisplay from '@/components/shared/HtmlDisplay'
import progressEnd from '@/mixins/progress-end'
import Share from '@/components/shared/Share'
import Widgets from '@/components/widgets'
import { mapState } from 'vuex'

export default {
  name: 'Post',
  meta: {
    modules: [
      'posts'
    ]
  },
  head () {
    const headers = {
      title: this.item.metaTitle || this.item.title,
      titleTemplate: `%s | ${this.$t('posts.blog')} | ${this.$settings.branding.name}`,
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.item.metaTitle || this.item.title
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.item.metaTitle || this.item.title
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
    // Comments,
    Breadcrumb,
    DateDisplay,
    HtmlDisplay,
    Share,
    Widgets
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

      path += `/${this.item.slug}`
      items.push({ path, text: this.item.title })

      return items
    }
  },
  asyncData({ app, params, error }) {
    return Promise.all([
      app.$api.posts.getBySlug(params.post, {
        include: 'PrimaryCategory'
      }),
      app.$api.widgetAreas.getById('web posts bottom')
    ])
    .then(all => {
      const category = all[0].primaryCategory
      
      if (category.slug !== params.cat) return error({ status: 404 })
      
      const bottomWidgets = all[1]
      const productTypeIds = app.$api.products.getProductWidgetsTypeIds([bottomWidgets])

      let promises = [app.$api.postCategories.getAll({ ids: category.parentIds.reverse() })]

      if (productTypeIds && productTypeIds.length) {
        promises = [app.$api.productTypes.getByIds(productTypeIds), app.$api.settings.get('currency')]
      } else {
        promises.push(Promise.resolve())
      }

      return Promise.all(promises)
      .then(res => {
        return {
          parents: res[0],
          item: all[0],
          bottomWidgets
        }
      })
    })
    .catch(error)
  }
}
</script>
