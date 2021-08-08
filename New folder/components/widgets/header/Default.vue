<template>
  <div v-if="widget.image">
    <h1>
      top nav
    </h1>
    <div class="position-relative">
      <b-img
        :src="`${$config.files.staticServerUrl}/${widget.image}`"
        fluid-grow
        :alt="widget.title"
      />

      <div v-if="!hasClass('hide-caption') && widget.description" class="header-caption">
        <h3 v-if="widget.title" class="mb-4">
          {{ widget.title }}
        </h3>

        <html-display v-if="widget.description" :value="widget.description" class="mb-4"/>

        <div v-if="widget.url" class="text-center">
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
    </div>
  </div>
</template>

<script>
import HtmlDisplay from '@/components/shared/HtmlDisplay'

export default {
  name: 'HeaderDefault',
  components :{
    HtmlDisplay
  },
  props: {
    widget: { required: true }
  },
  methods: {
    hasClass (key) {
      return this.widget.viewData && this.widget.viewData.includes(key)
    }
  }
}
</script>
