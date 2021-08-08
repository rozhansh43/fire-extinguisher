<template>
  <div>
    <b-container>
      <breadcrumb v-if="breadcrumbItems && breadcrumbItems.length" :items="breadcrumbItems"/>

      <b-card body-class="pb-0">
        <b-row class="align-items-center">
          <b-col v-if="value.image" md="4" lg="3">
            <thumbnail
              :path="value.image"
              :alt="value.name"
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
                {{ value.name }}
              </h1>

              <p v-if="value.description" class="text-justify">
                {{ value.description }}
              </p>

              <b-btn
                v-if="value.customSetLabel"
                class="mb-3"
                variant="outline-info"
                :to="`/sets/${value.slug}/custom-set`"
              >
                {{ value.customSetLabel }}
              </b-btn>
            </div>
          </b-col>
        </b-row>
      </b-card>

      <product-sets-grid v-if="value.sets" :widget="{ data: value.sets }"/>

      <empty-list v-else :message="$t('shared.thereAreNoResults')"/>
    </b-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Breadcrumb from '@/components/shared/Breadcrumb'
import EmptyList from '@/components/shared/EmptyList'
import ProductSetsGrid from '@/components/widgets/productSets/grid'
import progressEnd from '@/mixins/progress-end'
import Thumbnail from '@/components/shared/Thumbnail'

export default {
  name: 'ProductSets',
  meta: {
    modules: [
      'products_sets'
    ]
  },
  head () {
    const headers = {
      title: this.value.metaTitle || this.value.name,
      titleTemplate: `%s | ${this.$t('productSets.productSets')} | ${this.$settings.branding.name}`,
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.value.metaTitle || this.value.name
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.value.metaTitle || this.value.name
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
    EmptyList,
    ProductSetsGrid,
    Thumbnail
  },
  mixins: [progressEnd],
  data () {
    return {
      value: null
    }
  },
  computed: {
    ...mapState(['$settings']),
    breadcrumbItems () {
      const items = []
      let path = ''

      path += '/sets'
      // items.push({ path, text: this.$t('productSets.productSets') })

      path += `/${this.value.slug}`
      items.push({ path, text: this.value.name })

      return items
    }
  },
  asyncData ({ app, params, error }) {
    return Promise.all([
      app.$api.productSetTypes.getBySlug(params.typeSlug, { include: 'Sets' }),
      app.$api.settings.get('Currency')
    ])
    .then(all => {
      const value = all[0]
      if (value && value.sets && value.sets.length) {
        const type = Object.assign({}, value)
        delete type.sets

        value.sets.forEach(set => {
          set.type = type
        })
      }

      return {
        value
      }
    })
    .catch(error)
  }
}
</script>
