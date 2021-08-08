<template>
  <div class="p-2">
    <b-row class="align-items-center">
      <b-col>
        <template v-if="value.title">
          <h1 class="h3 mb-0">
            {{ value.title }}
          </h1>

          <meta name="product_name" :content="value.title"/>
        </template>

        <h2 v-if="value.altTitle" class="h6 font-weight-normal mb-0 mt-3 text-muted">
          {{ value.altTitle }}
        </h2>
      </b-col>

      <b-col cols="auto" v-if="$hasModule('products_wishes')">
        <lists-button :product="value"/>
      </b-col>

      <b-col cols="auto" v-if="$hasModule('products_subscriptions')">
        <subscription-button :product="value" :show-available="!hasAnyModel"/>
      </b-col>

      <b-col cols="auto" v-if="$hasModule('products_compare')">
        <compare-button :item="value" endpoint="products"/>
      </b-col>

      <b-col cols="auto" v-if="$hasModule('products_share')">
        <share
          modal
          compact
          btn-variant="link"
          btn-class="p-0 text-muted"
          :title="value.title"
          :url="`${$config.websiteUrl}/product/${value.id}/${value.slug || value.slg}`"
        />
      </b-col>
    </b-row>

    <b-alert v-if="value.alert" show variant="warning" class="mb-0 mt-3">
      <font-awesome-icon
        icon="exclamation-triangle"
        class="align-middle"
        :class="{ 'mr-2': $dir.ltr, 'ml-2': $dir.rtl }"
      />

      {{ value.alert }}
    </b-alert>

    <hr/>

    <b-row>
      <b-col :class="{ 'mb-5 mb-lg-0': value.models && value.models.length && selectedArticle }">
        <div v-if="$hasModule('brands') && value.brand" class="mb-4">
          <span class="text-muted">
            {{ $t('products.brand') }} :
          </span>

          <b-link :to="$api.products.getBrandPath(value.brand.id)">
            {{ value.brand.name }}
          </b-link>
        </div>

        <models
          v-if="hasAnyModel"
          :value="value.models"
          :type="type"
          :selected-model="selectedModel"
          :selected-article="selectedArticle"
          view="grid"
          class="mb-4"
          :product="value"
        />

        <div v-if="$hasModule('products_types') && hasFeaturedFields" class="mb-4">
          <h6 class="mb-3">{{ $t('products.specifications') }} :</h6>
          <fields-display :value="featuredFields" :type="type" stacked hide-group-name/>
        </div>

        <p v-if="value.excerpt" class="mb-4">{{ value.excerpt }}</p>
      </b-col>

      <b-col
        v-if="$hasModule('products_sale') && value.saleable"
        :lg="value.image || value.otherImages ? 12 : 6"
        :xl="value.image || value.otherImages ? 6 : 4"
      >
        <selected-article
          v-if="selectedArticle && selectedArticle.availabilityStatus === 1"
          :value="selectedArticle"
          :model-id="selectedModel.id"
          :type="type"
          :product="value"
          view="grid"
        />

        <b-card v-else-if="!selectedArticle || (selectedArticle && selectedArticle.availabilityStatus === 0)" bg-variant="bright" class="shadow-none" body-class="pt-4 pb-2 px-md-4">
          <h5 class="text-center text-muted mb-3">
            {{ $t('products.unavailable') }}
          </h5>

          <hr class="mt-0 mb-3"/>

          <p class="text-muted mb-3">
            {{ $t('products.unavailableDesc') }}.
          </p>

          <subscription-button
            v-if="$hasModule('products_subscriptions')"
            :product="value"
            show-available
            :compact="false"
            class="mb-3"
          />
        </b-card>

        <b-card v-else-if="selectedArticle && selectedArticle.availabilityStatus === 2" bg-variant="bright" class="shadow-none" body-class="pt-4 pb-2 px-md-4">
          <h5 class="text-center text-muted mb-3">
            {{ $t('products.stopProduction') }}
          </h5>
        </b-card>
        
        <b-card v-else-if="selectedArticle && selectedArticle.availabilityStatus === 3" bg-variant="bright" class="shadow-none" body-class="pt-4 pb-2 px-md-4">
          <h5 class="text-center text-muted mb-3">
            {{ $t('products.call') }}
          </h5>
        </b-card>

        <meta name="availability" :content="selectedArticle && selectedArticle.availabilityStatus === 1 ? 'instock' : 'outofstock'"/>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import CompareButton from '@/components/compare/CompareButton'
import FieldsDisplay from '@/components/products/product/fields'
import ListsButton from '@/components/lists/add/Button'
import Models from '@/components/products/product/models'
import SelectedArticle from '@/components/products/product/articles/Item'
import Share from '@/components/shared/Share'
import SubscriptionButton from '@/components/subscriptions/add/Button'

export default {
  name: 'InfoDisplay',
  components: {
    CompareButton,
    SelectedArticle,
    FieldsDisplay,
    Models,
    ListsButton,
    Share,
    SubscriptionButton
  },
  props: {
    value: { type: Object, required: true },
    type: Object,
    selectedModel: Object,
    selectedArticle: Object
  },
  computed: {
    featuredFields () {
      if (!this.type || !this.type.fieldTypeGroups || !this.type.fieldTypeGroups.length) return []
      if (!this.value.fieldGroups || !this.value.fieldGroups.length) return []

      const groups = []


      this.value.fieldGroups.forEach(fieldGroup => {
        const fieldTypeGroup = this.type.fieldTypeGroups && this.type.fieldTypeGroups.find(o => o.id === fieldGroup.id)

        if (fieldGroup.fields && fieldGroup.fields.length) {
          fieldGroup.fields.forEach(field => {
            const fieldType = fieldTypeGroup && fieldTypeGroup.fieldTypes && fieldTypeGroup.fieldTypes.find(o => o.id === field.id)

            if (fieldType && fieldType.featured && fieldType.fieldTypeOn === 0 && field.value) {
              const group = groups && groups.find(o => o.id === fieldGroup.id)

              if (group) group.fields.push(field)
              else {
                groups.push({
                  id: fieldGroup.id,
                  fields: [field]
                })
              }
            }
          })
        }
      })

      return groups
    },
    hasFeaturedFields () {
      return this.featuredFields && this.featuredFields.length
    },
    hasAnyModel () {
      const models = this.value.models
      const anyModelWithColor = models && models.length && models.find(o => o.color)
      const anyModelWithSize = models && models.length && models.find(o => o.size)
      const anyModelWithGuarantee = models && models.length && models.find(o => o.guarantee)
      const anyModelWithFields = models && models.length && models.find(o => o.fieldGroups && o.fieldGroups.length)
      const anyModelWithDescription = models && models.length && models.find(o => o.description && o.description.trim().length)
      return anyModelWithColor || anyModelWithSize || anyModelWithGuarantee || anyModelWithFields || anyModelWithDescription
    }
  }
}
</script>
