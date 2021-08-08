<template>
  <b-card body-class="pb-0">
    <b-row class="align-items-center">
      <b-col>
        <div class="mb-3">
          <font-awesome-icon
            icon="calendar-check"
            class="align-middle text-moremuted"
            :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
          />

          <span class="text-muted">
            {{ $t('shared.created') }} :
          </span>

          <template v-if="value.created">
            <date-display :value="value.created" time/>
          </template>
        </div>

        <div class="mb-3">
          <font-awesome-icon
            icon="info-circle"
            class="align-middle text-moremuted"
            :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
          />

          <span class="text-muted">
            {{ $t('tickets.subject') }} :
          </span>

          {{ value.subject }}
        </div>

        <div class="mb-3">
          <font-awesome-icon
            icon="layer-group"
            class="align-middle text-moremuted"
            :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
          />

          <span class="text-muted">
            {{ $t('tickets.category') }} :
          </span>

          <template v-if="value.category">
            {{ value.category.name }}
          </template>
        </div>

        <div class="d-flex align-items-center mb-3">
          <font-awesome-icon
            icon="question-circle"
            class="align-middle text-moremuted"
            :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
          />

          <span class="text-muted">
            {{ $t('shared.status') }} :
          </span>

          <small
            v-if="status"
            class="rounded-pill px-2 py-1 mx-1 shadow-sm"
            :class="`bg-${status.variant} text-${status.color}`"
          >
            {{ status.text }}
          </small>
        </div>

        <div class="d-flex align-items-center mb-3">
          <font-awesome-icon
            icon="sliders-h"
            class="align-middle text-moremuted"
            :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
          />

          <span class="text-muted">
            {{ $t('tickets.priority') }} :
          </span>

          <small
            v-if="priority"
            class="rounded-pill px-2 py-1 mx-1 shadow-sm"
            :class="`bg-${priority.variant} text-${priority.color}`"
          >
            {{ priority.text }}
          </small>
        </div>
      </b-col>

      <b-col lg="auto">
        <b-btn block variant="outline-light" class="text-dark mb-2" :to="`/dash/tickets/${value.id}`">
          <font-awesome-icon
            icon="eye"
            class="align-middle text-info"
            :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
          />

          {{ $t('shared.view') }}
        </b-btn>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import DateDisplay from '@/components/shared/DateDisplay'

export default {
  name: 'TicketItem',
  components: {
    DateDisplay
  },
  props: {
    value: { type: Object, required: true }
  },
  data () {
    return {
      progressing: false,
      priorityOptions: [
        { value: 0, text: this.$t('tickets.priorities.low'), variant: 'white', color: 'dark' },
        { value: 1, text: this.$t('tickets.priorities.medium'), variant: 'info', color: 'white' },
        { value: 2, text: this.$t('tickets.priorities.high'), variant: 'warning', color: 'dark' }
      ],
      statusOptions: [
        { value: 0, text: this.$t('tickets.statuses.pending'), variant: 'warning', color: 'dark' },
        { value: 1, text: this.$t('tickets.statuses.processing'), variant: 'info', color: 'white' },
        { value: 2, text: this.$t('tickets.statuses.processed'), variant: 'success', color: 'white' },
        { value: 3, text: this.$t('tickets.statuses.closed'), variant: 'white', color: 'dark' }
      ]
    }
  },
  computed: {
    status () {
      return this.statusOptions.find(o => o.value === this.value.status)
    },
    priority () {
      return this.priorityOptions.find(o => o.value === this.value.priority)
    }
  }
}
</script>
