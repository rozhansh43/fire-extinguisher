<template>
  <div class="animated fadeIn">
    <title-display :title="model.subject" icon="headset">
      <template v-slot:side>
        <span class="text-muted">
          {{ $t('shared.created') }} :
        </span>

        <date-display v-model="model.created" time/>
      </template>
    </title-display>

    <ticket-details :value="model"/>
  </div>
</template>

<script>
import DateDisplay from '@/components/shared/DateDisplay'
import TicketDetails from '@/components/dash/tickets/Details'
import progressEnd from '@/mixins/progress-end'
import TitleDisplay from '@/components/dash/shared/TitleDisplay'

export default {
  name: 'Details',
  components: {
    DateDisplay,
    TicketDetails,
    TitleDisplay
  },
  meta: {
    modules: [
      'tickets'
    ]
  },
  head () {
    return {
      title: this.model.subject
    }
  },
  mixins: [progressEnd],
  data () {
    return {
      model: null
    }
  },
  asyncData ({ app, error, params }) {
    return app.$api.tickets.getById(params.id, { include: ['Category', 'Messages'] }, true)
    .then(res => {
      const model = res

      return {
        model
      }
    })
    .catch(err => {
      error(err)
    })
  }
}
</script>
