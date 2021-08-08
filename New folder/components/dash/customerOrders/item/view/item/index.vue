<template>
  <div v-if="item && product" class="px-4 pt-4 pb-2">
    <b-row>
      <b-col lg="4" xl="3" class="mb-2 mb-lg-0">
        <b-link class="d-block" target="_blank" :to="getProductPath()">
          <thumbnail
            :path="product.image"
            :link="false"
            :width="720"
            :height="720"
            fluid-grow
            show-no-image
            class="rounded mb-3"
          />
        </b-link>
      </b-col>

      <b-col>
        <div
          class="h-100 d-flex flex-column"
          :class="{ 'ml-lg-2': $dir.ltr, 'mr-lg-2': $dir.rtl }"
        >
          <h5 class="font-weight-normal mb-4">
            <b-link class="inherited-link d-inline-block" target="_blank" :to="getProductPath()">
              {{ product.title }}
            </b-link>
          </h5>

          <b-row class="flex-fill">
            <b-col>
              <div v-if="sellersEnabled && seller" class="mb-3">
                <span class="text-muted">
                  <font-awesome-icon
                    icon="store"
                    class="align-middle text-moremuted"
                    :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
                  />

                  {{ $t('products.seller') }} :
                </span>

                {{ getUserDisplayName(seller) }}
              </div>

              <div v-if="packagesEnabled && articlePackage" class="mb-3">
                <span class="text-muted">
                  <font-awesome-icon
                    icon="box-open"
                    class="align-middle text-moremuted"
                    :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
                  />

                  {{ $t('products.orderAs') }} :
                </span>

                {{ articlePackage.name }}
              </div>

              <div v-if="color" class="mb-3">
                <span class="text-muted">
                  <font-awesome-icon
                    icon="palette"
                    class="align-middle text-moremuted"
                    :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
                  />

                  {{ $t('products.color') }} :
                </span>

              <div v-if="size" class="mb-3">
                <span class="text-muted">
                  <font-awesome-icon
                    icon="ruler"
                    class="align-middle text-moremuted"
                    :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
                  />

                  {{ $t('products.size') }} :
                </span>

                {{ size.name }}
              </div>

              <div v-if="guarantee" class="mb-3">
                <span class="text-muted">
                  <font-awesome-icon
                    icon="clipboard-check"
                    class="align-middle text-moremuted"
                    :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
                  />

                  {{ $t('products.guarantee') }} :
                </span>

                {{ guarantee.name }}
              </div>

                <font-awesome-icon
                  icon="circle"
                  :style="{ 'color': color.code, padding: '1px' }"
                  class="rounded-circle border"
                  :class="{'mr-1': $dir.ltr, 'ml-1': $dir.rtl}"
                />

                {{ color.name }}
              </div>

              <fields-display
                v-if="hasField"
                :value="model.fieldGroups"
                :type="type"
                hide-group-name
                inline-stacked
              />
              
              <div v-if="description" class="mb-3">
                {{ description }}
              </div>
            </b-col>

            <b-col xl="auto" class="d-flex">
              <price
                :item="item"
                :unit="type && type.unit ? type.unit : { name: $t('products.units') }"
                :article-package="articlePackage"
              />
            </b-col>
          </b-row>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import FieldsDisplay from '@/components/products/product/fields'
import Price from './Price'
import Thumbnail from '@/components/shared/Thumbnail'

export default {
  name: 'OrderItem',
  components: {
    FieldsDisplay,
    Price,
    Thumbnail
  },
  props: {
    item: { type: Object, required: true }
  },
  computed: {
    product () {
      return this.item && this.item.product
    },
    type () {
      const types = this.$store.state.$productTypes
      return this.product && this.product.typeId && types.find(o => o.id === this.product.typeId)
    },
    model () {
      return this.product && this.product.model
    },
    article () {
      return this.model && this.model.article
    },
    color () {
      return this.model && this.model.color
    },
    size () {
      return this.model && this.model.size
    },
    guarantee () {
      return this.model && this.model.guarantee
    },
    hasField () {
      const val = this.model && this.model.fieldGroups
      return this.type && val && val.length && val.find(o => o.fields && o.fields.length && o.fields.find(x => x.value))
    },
    description () {
      return this.model && this.model.description
    },
    sellersEnabled () {
      return this.$hasModule('sellers')
    },
    packagesEnabled () {
      return this.$hasModule('products_packages')
    },
    seller () {
      return this.article && this.article.seller
    },
    articlePackage () {
      return this.article && this.article.package
    }
  },
  methods: {
    getProductPath () {
      return this.$api.products.getProductPath(this.product)
    },
    getUserDisplayName (user) {
      return this.$api.account.getUserDisplayName(user)
    }
  }
}
</script>
