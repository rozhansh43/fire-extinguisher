<template>
  <b-list-group-item
    :class="{
      'cursor-pointer': view === 'grid',
      'p-0 border-0': view === 'single',
      'pt-3 px-3 pb-0': view !== 'single'
    }"
    @click="emitSelectModel"
  >
    <b-row class="align-items-center">
      <b-col v-if="view === 'grid'" md="auto" class="mb-3">
        <font-awesome-icon
          size="lg"
          :icon="selectedModel && selectedModel.id === value.id ? 'check-circle' : 'circle'"
          class="aling-middle"
          :class="selectedModel && selectedModel.id === value.id ? 'text-info' : 'text-light'"
        />
      </b-col>

      <b-col>
        <b-row>
          <b-col v-if="$hasModule('products_colors') && hasColor" md="auto" class="mb-3">
            <span class="text-muted">
              <font-awesome-icon
                icon="palette"
                class="align-middle text-moremuted"
                :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
              />

              {{ $t('products.color') }} :
            </span>

            <font-awesome-icon
              icon="circle"
              :style="{ 'color': value.color.code, padding: '1px' }"
              class="rounded-circle border"
              :class="{'mr-1': $dir.ltr, 'ml-1': $dir.rtl}"
            />

            {{ value.color.name }}
          </b-col>

          <b-col v-if="$hasModule('products_sizes') && hasSize" md="auto" class="mb-3">
            <span class="text-muted">
              <font-awesome-icon
                icon="ruler"
                class="align-middle text-moremuted"
                :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
              />

              {{ $t('products.size') }} :
            </span>

            {{ value.size.name }}
          </b-col>

          <b-col v-if="$hasModule('products_guarantees') && hasGuarantee" md="auto" class="mb-3">
            <span class="text-muted">
              <font-awesome-icon
                icon="clipboard-check"
                class="align-middle text-moremuted"
                :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
              />

              {{ $t('products.guarantee') }} :
            </span>

            {{ value.guarantee.name }}
          </b-col>
        </b-row>

        <fields-display
          v-if="$hasModule('products_types') && hasField"
          :value="value.fieldGroups"
          :type="type"
          hide-group-name
          inline
        />

        <p v-if="value.description" class="mb-3">
          {{ value.description }}
        </p>

        <articles
          v-if="view === 'list' && value.articles && value.articles.length"
          :value="value.articles"
          :model-id="value.id"
          :type="type"
          :selected-model="selectedModel"
          :selected-article="selectedArticle"
          :product="product"
        />
      </b-col>
    </b-row>
  </b-list-group-item>
</template>

<script>
import Articles from '@/components/products/product/articles'
import FieldsDisplay from '@/components/products/product/fields'
import vm from '@/lib/vm'

export default {
  name: 'Model',
  components: {
    Articles,
    FieldsDisplay
  },
  props: {
    value: { type: Object, required: true },
    type: Object,
    selectedModel: Object,
    selectedArticle: Object,
    view: { type: String, default: 'list' },
    product: { type: Object, required: true }
  },
  computed: {
    hasColor () {
      return this.value.color && this.value.color.name
    },
    hasSize () {
      return this.value.size && this.value.size.name
    },
    hasGuarantee () {
      return this.value.guarantee && this.value.guarantee.name
    },
    hasField () {
      const val = this.value.fieldGroups
      return this.type && val && val.length && val.find(o => o.fields && o.fields.length && o.fields.find(x => x.value !== null))
    }
  },
  methods: {
    emitSelectModel () {
      if (this.view === 'grid') {
        vm.$emit('setSelectedModel', this.value)
      }
    }
  }
}
</script>
