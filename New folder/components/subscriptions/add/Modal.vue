<template>
  <b-modal
    ref="modal"
    centered
    body-class="pb-0"
    :title="$t('subscriptions.notifyMe')"
    footer-class="d-block"
    :hide-footer="initializing"
    @hidden="cleanup"
  >
    <div v-if="initializing" class="text-center mb-3">
      <font-awesome-icon spin icon="circle-notch" class="text-moremuted display-2"/>
    </div>

    <template v-else>
      <p class="mb-3 text-muted">
        {{ $t('subscriptions.notifyMeInTime') }} :
      </p>

      <template v-if="showAvailable">
        <b-form-checkbox
          id="promotion-checkbox"
          class="mb-3 cursor-pointer"
          size="lg"
          :value="true"
          :unchecked-value="false"
          v-model="model.promotion"
        >
          <span :class="{ 'ml-2': $dir.ltr, 'mr-2': $dir.rtl }">
            {{ $t('subscriptions.promotion') }}
          </span>
        </b-form-checkbox>

        <b-form-checkbox
          id="available-checkbox"
          class="mb-3 cursor-pointer"
          size="lg"
          :value="true"
          :unchecked-value="false"
          v-model="model.available"
        >
          <span :class="{ 'ml-2': $dir.ltr, 'mr-2': $dir.rtl }">
            {{ $t('subscriptions.available') }}
          </span>
        </b-form-checkbox>
      </template>

      <h5 v-else class="mb-3 font-weight-normal">
        {{ $t('subscriptions.promotion') }}
      </h5>

      <hr class="mt-0 mb-3">

      <p class="mb-3 text-muted">
        {{ $t('subscriptions.via') }} :
      </p>

      <b-form-checkbox
        v-if="email"
        id="sendEmail-checkbox"
        class="mb-3 cursor-pointer"
        size="lg"
        :value="true"
        :unchecked-value="false"
        v-model="model.sendEmail"
      >
        <span :class="{ 'ml-2': $dir.ltr, 'mr-2': $dir.rtl }">
          {{ $t('subscriptions.emailTo', { email }) }}
        </span>
      </b-form-checkbox>

      <b-form-checkbox
        v-if="phoneNumber"
        id="sendSms-checkbox"
        class="mb-3"
        size="lg"
        :value="true"
        :unchecked-value="false"
        v-model="model.sendSms"
      >
        <span :class="{ 'ml-2': $dir.ltr, 'mr-2': $dir.rtl }">
          {{ $t('subscriptions.smsTo', { phoneNumber }) }}
        </span>
      </b-form-checkbox>
    </template>

    <template v-slot:modal-footer>
      <b-btn
        :disabled="progressing || !submittable"
        class="m-0"
        block
        variant="success"
        @click="submit"
      >
        <font-awesome-icon
          :icon="progressing ? 'cog' : 'check'"
          :spin="progressing"
          class="align-middle"
          :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
        />

        {{ $t('shared.submit') }}
      </b-btn>
    </template>
  </b-modal>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    showAvailable: { type: Boolean, default: true }
  },
  data () {
    return {
      initializing: true,
      progressing: false,
      baseModel: {
        productId: null,
        userId: null,
        sendSms: false,
        sendEmail: true,
        available: false,
        promotion: true
      },
      model: null,
      id: null
    }
  },
  computed: {
    account () {
      return this.$store.state.$account
    },
    email () {
      return this.account && this.account.email
    },
    phoneNumber () {
      return this.account && this.account.phoneNumber ? `0${this.account.phoneNumber}` : null
    },
    submittable () {
      return (!this.showAvailable || (this.model.available || this.model.promotion)) && (this.model.sendSms || this.model.sendEmail)
    }
  },
  methods: {
    show (productId) {
      this.cleanup()
      this.model.productId = productId
      this.$refs.modal.show()

      this.getModel()
    },
    cleanup () {
      this.model = Object.assign({}, this.baseModel)
      if (this.showAvailable) this.model.available = true
      this.initializing = true
      this.progressing = false
      this.id = null
    },
    getModel () {
      this.initializing = true

      this.$api.productSubscriptions.getByProductId(this.model.productId, true)
      .catch(() => {})
      .then(res => {
        if (res) {
          this.id = res.id
          this.model.sendSms = res.sendSms
          this.model.sendEmail = res.sendEmail
          this.model.available = res.available
          this.model.promotion = res.promotion
        }
      })

      this.initializing = false
    },
    submit () {
      this.progressing = true

      const promise = this.id ? this.$api.productSubscriptions.update(this.id, this.model, true) : this.$api.productSubscriptions.create(this.model, true)
      
      promise
      .then(res => {
        this.$showSuccess(this.$t('subscriptions.notifySubmitted'))
        this.$refs.modal.hide()
      })
      .catch(err => {
        this.$showError(this.$getLocaleErrorMessage(err, 'subscriptions'))
        this.$refs.modal.hide()
      })
    }
  }
}
</script>
