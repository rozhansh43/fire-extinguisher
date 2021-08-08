<template>
  <div v-if="widget.data && widget.data.length">
    <h1>
      product grid
    </h1>
    <h2 v-if="widget.title && !titleInHeader" class="widget-title h4 text-center mb-5">
      {{ widget.title }}
    </h2>

    <p v-if="widget.subtitle && !titleInHeader" class="widget-subtitle text-center mb-5 text-muted">
      {{ widget.subtitle }}
    </p>

    <b-card :class="cardClass" :bg-variant="cardVariant" no-body>
      <b-card-header
        v-if="titleInHeader && (widget.title || widget.url)"
        class="d-flex align-items-center"
        :class="widget.title ? 'justify-content-between' : 'justify-content-end'"
        :header-bg-variant="cardHeaderVariant"
      >
        <div v-if="widget.title || widget.subtitle">
          <div v-if="widget.title">
            {{ widget.title }}
          </div>

          <small v-if="widget.subtitle" class="text-muted">
            {{ widget.subtitle }}
          </small>
        </div>

        <b-link
          v-if="widget.url"
          :to="widget.url"
          class="inherited-link"
        >
          <font-awesome-icon
            icon="plus"
            size="sm"
            class="align-middle"
            :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
          />

          {{ $t('shared.more') }}
        </b-link>
      </b-card-header>

      <b-card-body :body-class="[cardBodyClass, 'pb-0']">
        <b-row>
          <b-col v-for="(item, index) in widget.data" :key="index" sm="6" md="4" lg="3" class="mb-3">
            <item
              :value="item"
              :card-item-variant="cardItemVariant"
              :item-title-class="itemTitleClass"
              :item-target="itemTarget"
            />
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>

    <div v-if="widget.url && !titleInHeader" class="text-center">
      <b-btn variant="outline-primary" :to="widget.url" class="px-4 mb-3">
        <font-awesome-icon
          icon="plus"
          size="sm"
          class="align-middle"
          :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
        />

        {{ $t('shared.more') }}
      </b-btn>
    </div>
  </div>
</template>

<script>
import Item from './Item'

export default {
  name: 'ProductSetsGrid',
  components: {
    Item
  },
  props: {
    widget: { required: true },
    cardClass: String,
    cardBodyClass: String,
    cardVariant: String,
    cardHeaderVariant: { type: String, default: 'bright' },
    cardItemVariant: String,
    itemTitleClass: String,
    itemTarget: String
  },
  computed: {
    titleInHeader () {
      return this.hasClass('title-in-header')
    }
  },
  methods: {
    hasClass (key) {
      return this.widget.viewData && this.widget.viewData.includes(key)
    }
  }
}
</script>
