<template>
  <div class="animated fadeIn">
    <title-display :title="$t('tickets.submitNewTicket')" icon="headset"/>

    <b-card>
      <fields ref="fields" v-model="model"/>

      <template v-slot:footer>
        <b-btn :disabled="progressing" variant="success" @click.prevent="submit">
          <font-awesome-icon
            :icon="progressing ? 'cog' : 'plus'"
            :spin="progressing"
            class="align-middle"
            :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
          />

          {{ $t('shared.add') }}
        </b-btn>
      </template>
    </b-card>
  </div>
</template>

<script>
import progressEnd from '@/mixins/progress-end'
import TitleDisplay from '@/components/dash/shared/TitleDisplay'
import Fields from '@/components/dash/tickets/Fields'

export default {
  name: 'New',
  components: {
    TitleDisplay,
    Fields
  },
  meta: {
    modules: [
      'tickets'
    ]
  },
  head () {
    return {
      title: this.$t('tickets.submitNewTicket')
    }
  },
  mixins: [progressEnd],
  data () {
    return {
      progressing: false,
      model: {
        subject: null,
        priority: 1,
        categoryId: null,
        message: {
          attachment: null,
          body: null
        }
      }
    }
  },
  methods: {
    preSubmit () {
      return this.$refs.fields.validateAll()
      .then(isValid => {
        this.progressing = isValid
        return isValid
      })
    },
    submit () {
      this.preSubmit()
      .then(proceed => {
        if (proceed) {
          this.$api.tickets.create(this.model, true)
          .then(() => {
            this.progressing = false
            this.$router.push('/dash/tickets')
            this.$showSuccess(this.$t('tickets.newTicketAdded'))
          })
          .catch(err => {
            this.$showError(this.$getLocaleErrorMessage(err, 'tickets'))
            this.progressing = false
          })
        }
      })
    }
  }
}
</script>
