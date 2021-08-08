<template>
  <div v-if="value && value.length">
    <b-card
      v-if="view === 'list' && articlesLength > 1"
      class="overflow-hidden"
      body-class="p-0"
      :header="$t('products.sellers')"
    >
      <b-list-group flush>
        <item
          v-for="item in value"
          :key="item.id"
          :value="item"
          :type="type"
          :selected-model="selectedModel"
          :selected-article="selectedArticle"
          :view="view"
          :product="product"
        />
      </b-list-group>
    </b-card>

    <template v-else-if="view === 'grid'">
      <b-card
        v-if="value.length > 1"
        no-body
        class="d-table shadow-none border"
        header-class="py-2"
      >
        <b-list-group flush>
          <item
            v-for="item in value"
            :key="item.id"
            :value="item"
            :type="type"
            :selected-model="selectedModel"
            :selected-article="selectedArticle"
            :view="view"
            :product="product"
          />
        </b-list-group>
      </b-card>

      <template v-else>
        <item
          v-for="item in value"
          :key="item.id"
          :value="item"
          :type="type"
          :selected-model="selectedModel"
          :selected-article="selectedArticle"
          view="single"
          :product="product"
        />
      </template>
    </template>
  </div>
</template>

<script>
import Item from './Item'

export default {
  name: 'Models',
  components: {
    Item
  },
  props: {
    value: { type: Array, required: true },
    type: Object,
    selectedModel: Object,
    selectedArticle: Object,
    view: { type: String, default: 'list' },
    product: { type: Object, required: true }
  },
  computed: {
    articlesLength () {
      let count = 0

      this.value.forEach(model => {
        if (model.articles && model.articles.length)
          count += model.articles.length
      })

      return count
    }
  }
}
</script>
