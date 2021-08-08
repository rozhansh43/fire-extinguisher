<template>
  <div>
    <title-display :title="$t('tickets.openTickets')" icon="headset"/>

    <b-card no-body footer-class="p-0">
      <div v-if="initializing" class="text-center p-4">
        <font-awesome-icon spin icon="circle-notch" class="text-moremuted display-3"/>
      </div>

      <template v-else>
        <b-list-group
          v-if="items && items.length"
          flush
          class="list-group-bright"
          style="height: 343px; overflow-y: auto;"
        >
          <b-list-group-item
            v-for="item in items"
            :key="item.id"
            class="pt-3 px-3 pb-0 inherited-link"
            :to="`/dash/tickets/${item.id}`"
          >
            <h5 class="text-truncate">
              {{ item.subject }}
            </h5>

            <div class="mb-3">
              <font-awesome-icon
                icon="calendar-check"
                class="align-middle text-moremuted"
                :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
              />

              <span class="text-muted">
                {{ $t('shared.created') }} :
              </span>

              <template v-if="item.created">
                <date-display :value="item.created" time class="text-dark"/>
              </template>
            </div>

            <div class="text-truncate mb-3">
              <font-awesome-icon
                icon="layer-group"
                class="align-middle text-moremuted"
                :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
              />

              <span class="text-muted">
                {{ $t('tickets.category') }} :
              </span>

              <span v-if="item.category" class="text-dark">
                {{ item.category.name }}
              </span>
            </div>

            <b-row>
              <b-col md="auto">
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
                    v-if="item.statusInfo"
                    class="rounded-pill px-2 py-1 mx-1 shadow-sm"
                    :class="`bg-${item.statusInfo.variant} text-${item.statusInfo.color}`"
                  >
                    {{ item.statusInfo.text }}
                  </small>
                </div>
              </b-col>

              <b-col md="auto">
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
                    v-if="item.priorityInfo"
                    class="rounded-pill px-2 py-1 mx-1 shadow-sm"
                    :class="`bg-${item.priorityInfo.variant} text-${item.priorityInfo.color}`"
                  >
                    {{ item.priorityInfo.text }}
                  </small>
                </div>
              </b-col>
            </b-row>
          </b-list-group-item>
        </b-list-group>

        <div v-else class="text-center p-4 py-xl-5 my-xl-5">
          <div class="py-xl-3 my-xl-1">
            <font-awesome-icon
              icon="times-circle"
              class="text-moremuted display-3"
            />

            <div class="text-muted mt-4 mb-3">
              {{ $t('tickets.noOpenTicketAtThisMoment') }}
            </div>

            <b-link to="/dash/tickets/new">
              <font-awesome-icon
                icon="plus"
                class="align-middle"
                :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
              />

              {{ $t('tickets.submitNewTicket') }}
            </b-link>
          </div>
        </div>
      </template>

      <template v-if="!initializing && items && items.length" v-slot:footer>
        <b-link
          class="inherited-link d-block py-2 px-3 text-center"
          to="/dash/tickets"
        >
          <div class="py-1">
            {{ $t('shared.viewAll') }}

            <font-awesome-icon
              :icon="$dir.ltr ? 'angle-right' : 'angle-left'"
              class="align-middle"
              :class="{ 'ml-1': $dir.ltr, 'mr-1': $dir.rtl }"
            />
          </div>
        </b-link>
      </template>
    </b-card>
  </div>
</template>

<script>
import DateDisplay from '@/components/shared/DateDisplay'
import TitleDisplay from '@/components/dash/shared/TitleDisplay'

export default {
  name: 'OpenTicketsWidget',
  components: {
    DateDisplay,
    TitleDisplay
  },
  data () {
    return {
      initializing: true,
      items: null,
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
  mounted () {
    this.getItems()
    .then(() => {
      this.initializing = false
    })
  },
  methods: {
    getItems () {
      return this.$api.tickets.getAll({
        include: 'Category',
        openTicketsOnly: true,
        sort: 'created'
      })
      .then(res => {
        this.items = res.map(item => {
          item.statusInfo = this.statusOptions.find(o => o.value === item.status)
          item.priorityInfo = this.priorityOptions.find(o => o.value === item.priority)
          return item
        })
        return this.items
      })
      .catch(err => {
        this.$showError(this.$getLocaleErrorMessage(err, 'tickets'))
        return false
      })
    }
  }  
}
</script>
