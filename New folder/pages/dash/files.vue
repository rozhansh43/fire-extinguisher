<template>
  <div class="animated fadeIn">
    <title-display :title="$t('files.files')" icon="folder"/>

    <template v-if="products && products.length">
      <b-card v-for="product in products" :key="product.id" body-class="p-0">
        <div class="pt-3 px-3">
          <b-row class="align-items-center">
            <b-col md="2" lg="1">
              <b-link :to="getProductPath(product)" class="d-block mb-3">
                <thumbnail
                  :path="product.image"
                  :alt="product.title"
                  :link="false"
                  :width="720"
                  :height="720"
                  fluid-grow
                  show-no-image
                  class="rounded"
                />
              </b-link>
            </b-col>

            <b-col md="9" lg="10">
              <h6 class="text-justify">
                <b-link :to="getProductPath(product)" class="inherited-link d-block mb-3">
                  {{ product.title }}
                </b-link>
              </h6>
            </b-col>
          </b-row>
        </div>

        <div class="py-2 px-3 bg-bright">
          {{ $t('files.files') }} :
        </div>

        <div v-if="product.attachments && product.attachments.length" class="pt-3 px-3">
          <attachments-display :value="product.attachments" downloadable/>
        </div>
      </b-card>
    </template>

    <b-card v-else body-class="p-4">
      <font-awesome-icon icon="times-circle" class="display-4 d-block mb-4 mx-auto text-moremuted"/>

      <h5 class="text-muted font-weight-normal text-center mb-0">
        {{ $t('shared.thereAreNoResults') }}
      </h5>
    </b-card>
  </div>
</template>

<script>
import AttachmentsDisplay from '@/components/products/product/attachmentsDisplay'
import progressEnd from '@/mixins/progress-end'
import Thumbnail from '@/components/shared/Thumbnail'
import TitleDisplay from '@/components/dash/shared/TitleDisplay'

export default {
  name: 'Files',
  head () {
    return {
      title: this.$t('files.files')
    }
  },
  components: {
    AttachmentsDisplay,
    TitleDisplay,
    Thumbnail
  },
  mixins: [progressEnd],
  meta: {
    modules: [
      'products_sale_attachments'
    ]
  },
  data () {
    return {
      products: null
    }
  },
  asyncData ({ app, query, error }) {
    const filter = {}
    if (query && query.oid && !isNaN(query.oid)) {
      filter.customerOrderId = query.oid
    }

    return app.$api.productAttachments.getAll(filter)
    .then(res => {
      return {
        products: res
      }
    })
    .catch(error)
  },
  methods: {
    getProductPath (product) {
      return this.$api.products.getProductPath(product)
    }
  }
}
</script>
