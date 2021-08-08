<template>
  <div>
    <b-card no-body>
      <div class="pt-3 px-3">
        <b-row class="align-items-center">
          <b-col md="4" class="mb-3">
            <span class="text-muted">
              {{ $t('tickets.category') }} :
            </span>

            <template v-if="value.category">
              {{ value.category.name }}
            </template>
          </b-col>

          <b-col md="4" class="d-flex align-items-center mb-3">
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
          </b-col>
          
          <b-col md="4" class="d-flex align-items-center mb-3">
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
          </b-col>
        </b-row>
      </div>

      <div class="bg-bright py-2 px-3">
        <h5 class="my-1">
          <font-awesome-icon
            icon="comments"
            class="align-middle text-muted"
            :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
          />

          {{ $t('tickets.messages') }} :
        </h5>
      </div>

      <div class="pt-3 px-3">
        <b-row
          v-for="message in value.messages"
          :key="message.id"
          :class="{ 'justify-content-end': isOtherSide(message.userInfo) }"
        >
          <b-col cols="10">
            <b-card
              body-class="pb-0"
              class="shadow-none"
              :bg-variant="isOtherSide(message.userInfo) ? 'light' : 'bright'"
              header-class="bg-transparent border-bottom"
            >
              <template v-slot:header>
                <b-row>
                  <b-col class="mb-2 mb-md-0">
                    <span class="text-muted">
                      {{ $t('tickets.sender') }} :
                    </span>

                    <template v-if="message.userInfo">
                      {{ getUserDisplayName(message.userInfo) }}
                    </template>

                    <template v-else>
                      {{ $t('tickets.unknownUser') }}
                    </template>
                  </b-col>

                  <b-col md="auto">
                    <span class="text-muted">
                      {{ $t('tickets.sentDate') }} :
                    </span>

                    <date-display v-model="message.created" time/>
                  </b-col>
                </b-row>
              </template>
              
              <div v-if="message.body" v-html="message.body"></div>

              <template v-if="message.attachment">
                <h6 class="text-muted">
                  <font-awesome-icon
                    icon="paperclip"
                    class="align-middle"
                    :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
                  />

                  {{ $t('tickets.attachment') }} :
                </h6>

                <files-display
                  disabled
                  class="mb-3"
                  :value="[message.attachment]"
                />
              </template>
            </b-card>
          </b-col>
        </b-row>
      </div>

      <div class="bg-success py-2 px-3">
        <h5 class="my-1">
          <font-awesome-icon
            icon="comment-medical"
            class="align-middle"
            :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
          />

          {{ $t('tickets.submitNewMessage') }} :
        </h5>
      </div>

      <div class="pt-3 px-3">
        <tiny-mce
          :title="$t('tickets.message')"
          class="mb-3"
          mode="noMedia"
          v-model="message.body"
        />

        <uploader
          class="mb-3"
          :label="$t('tickets.attachment')"
          accept="*"
          v-model="message.attachment"
        />
      </div>

      <template v-slot:footer>
        <b-btn :disabled="progressing || (!message.body && !message.attachment)" variant="success" @click.prevent="submit">
          <font-awesome-icon
            :icon="progressing ? 'cog' : 'paper-plane'"
            :spin="progressing"
            class="align-middle"
            :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
          />

          {{ $t('tickets.send') }}
        </b-btn>
      </template>
    </b-card>
  </div>
</template>

<script>
import DateDisplay from '@/components/shared/DateDisplay'
import FilesDisplay from '@/components/shared/FilesDisplay'
import TinyMce from '@/components/shared/TinyMce'
import Uploader from '@/components/shared/Uploader'

export default {
  name: 'TicketDetails',
  components: {
    DateDisplay,
    FilesDisplay,
    TinyMce,
    Uploader
  },
  props: {
    value: { type: Object, required: true }
  },
  data () {
    return {
      progressing: false,
      message: {
        body: null,
        attachment: null
      },
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
  },
  methods: {
    getUserDisplayName (user) {
      return this.$api.account.getUserDisplayName(user)
    },
    isOtherSide (user) {
      return user && user.userType !== 2
    },
    _submit () {
      this.progressing = true
      this.$api.tickets.sendMessage(this.value.id, this.message, true)
      .then(res => {
        if (this.value.status === 3)
          this.value.status = 1

        this.message.body = null
        this.message.attachment = null
        this.value.messages.push(res)

        this.progressing = false
        this.$showSuccess(this.$t('tickets.newMessageSent'))
      })
      .catch(err => {
        this.$showError(this.$getLocaleErrorMessage(err, 'tickets'))
        this.progressing = false
      })
    },
    submit () {
      if (this.value.status === 3) {
        if (confirm(this.$t('tickets.statusWillChangeToProcessing'))) {
          this._submit()
        }
      } else this._submit()
    }
  }
}
</script>
