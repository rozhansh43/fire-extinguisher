<template>
  <div>
    <b-container>
      <breadcrumb v-if="breadcrumbItems && breadcrumbItems.length" :items="breadcrumbItems"/>

      <b-card body-class="pb-0">
        <b-row class="align-items-center">
          <b-col v-if="productSetType.image" md="4" lg="3">
            <thumbnail
              :path="productSetType.image"
              :alt="productSetType.name"
              :link="false"
              :width="720"
              :height="720"
              fluid-grow
              class="rounded mb-3"
            />
          </b-col>

          <b-col md="8" lg="9">
            <div class="p-md-4">
              <h1 class="h3">
                {{ productSetType.customSetLabel }} {{ productSetType.name }}
              </h1>

              <p v-if="productSetType.description" class="text-justify">
                {{ productSetType.description }}
              </p>
            </div>
          </b-col>
        </b-row>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Breadcrumb from '@/components/shared/Breadcrumb'
import progressEnd from '@/mixins/progress-end'
import Thumbnail from '@/components/shared/Thumbnail'

export default {
  name: 'ProductCustomSet',
  meta: {
    modules: [
      'products_sets'
    ]
  },
  head () {
    const headers = {
      title: this.productSetType.customSetLabel,
      titleTemplate: `%s | ${this.productSetType.metaTitle || this.productSetType.name} | ${this.$t('productSets.productSets')} | ${this.$settings.branding.name}`,
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.productSetType.customSetLabel
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.productSetType.customSetLabel
        }
      ]
    }

    if (this.productSetType.metaTitle || this.productSetType.name) {
      headers.meta.push({
        hid: 'description',
        name: 'description',
        content: `${this.productSetType.metaTitle || this.productSetType.name} | ${this.$t('productSets.productSets')}`
      })
      headers.meta.push({
        hid: 'og:description',
        name: 'og:description',
        content: `${this.productSetType.metaTitle || this.productSetType.name} | ${this.$t('productSets.productSets')}`
      })
      headers.meta.push({
        hid: 'twitter:description',
        name: 'twitter:description',
        content: `${this.productSetType.metaTitle || this.productSetType.name} | ${this.$t('productSets.productSets')}`
      })
    }

    return headers
  },
  components: {
    Breadcrumb,
    Thumbnail
  },
  mixins: [progressEnd],
  data () {
    return {
      productSetType: null
    }
  },
  computed: {
    ...mapState(['$settings']),
    breadcrumbItems () {
      const items = []
      let path = ''

      path += '/sets'
      // items.push({ path, text: this.$t('productSets.productSets') })

      path += `/${this.productSetType.slug}`
      items.push({ path, text: this.productSetType.name })

      path += '/custom-set'
      items.push({ path, text: this.productSetType.customSetLabel })

      return items
    }
  },
  asyncData ({ app, params, error }) {
    return Promise.all([
      app.$api.productSetTypes.getBySlug(params.typeSlug),
      app.$api.settings.get('Currency')
    ])
    .then(all => {
      return {
        productSetType: all[0]
      }
    })
    .catch(error)
  }
}
</script>
