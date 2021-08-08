<template>
  <div v-if="widget.showDate || widget.showTime">
    <h2 v-if="widget.title && !titleInHeader" class="widget-title h4 text-center mb-5">
      {{ widget.title }}
    </h2>

    <p v-if="widget.subtitle && !titleInHeader" class="widget-subtitle text-center mb-5 text-muted">
      {{ widget.subtitle }}
    </p>

    <b-card no-body>
      <b-card-header
        v-if="titleInHeader && (widget.title || widget.url)"
        class="d-flex align-items-center"
        :class="widget.title ? 'justify-content-between' : 'justify-content-end'"
        header-bg-variant="bright"
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

      <b-card-body class="text-center">
        <date-display
          :value="new Date().toISOString()"
          :date="widget.showDate"
          :time="widget.showTime"
        />
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import DateDisplay from '@/components/shared/DateDisplay'

export default {
  name: 'DateAndTimeDefault',
  components: {
    DateDisplay
  },
  props: {
    widget: { required: true }
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
