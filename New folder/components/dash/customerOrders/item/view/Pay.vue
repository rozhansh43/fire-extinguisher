<template>
  <div>
    <div class="bg-bright px-3 py-2">
      <b-alert v-if="ipgError" show variant="danger" class="mb-2">
        <div class="d-flex align-items-cneter justify-content-between mb-3">
          <h6 class="mb-0">
            {{ $t('payments.ipgError') }}
          </h6>

          <button type="button" class="close" @click="resetIpgError">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <ul class="mb-0" :class="{ 'pl-3': $dir.ltr, 'pr-3': $dir.rtl }">
          <li>
            {{ $t('payments.error') }} : {{ ipgError.error }}
          </li>

          <li>
            {{ $t('payments.code') }} : {{ ipgError.code }}
          </li>
        </ul>
      </b-alert>

      <div class="d-flex justify-content-end">
        <b-btn :disabled="progressing" variant="success" @click="toggleCollapsed">
          <font-awesome-icon
            :icon="progressing ? 'cog' : 'credit-card'"
            :spin="progressing"
            class="align-middle"
            :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
          />
          
          {{ $t('payments.pay') }}

          <font-awesome-icon
            :icon="collapsed ? 'angle-up' : 'angle-down'"
            class="align-middle"
            :class="{ 'ml-1': $dir.ltr, 'mr-1': $dir.rtl }"
          />
        </b-btn>
      </div>
    </div>

    <template v-if="collapsed">
      <pay-adapters
        :items="payAdapters"
        class="shadow-none mb-0 border-top rounded-0"
        header-class="rounded-0"
        v-model="selectedPayAdapter"
      />

      <div class="border-top p-3">
        <b-alert :show="errors.any()" variant="danger" class="px-4">
          <ul class="m-0 px-1">
            <li v-for="err in errors.all()" :key="err">
              {{ err }}
            </li>
          </ul>
        </b-alert>

        <b-textarea
          :rows="3"
          :placeholder="`${$t('shared.description')}...`"
          :name="$t('shared.description')"
          v-validate="'max: 1000'"
          v-model="description"
        />
      </div>

      <div class="bg-bright p-3">
        <b-btn
          block
          size="lg"
          :disabled="payProgressing"
          variant="success"
          @click="handlePay"
        >
          <font-awesome-icon
            :icon="payProgressing ? 'cog' : 'credit-card'"
            :spin="payProgressing"
            class="align-middle"
            :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
          />

          {{ $t('payments.pay') }}
        </b-btn>
      </div>

      <bank-receipt
        ref="bankReceipt"
        :pay-adapter-id="selectedPayAdapter && selectedPayAdapter.id"
        :payable-amount="order.payable"
        :order-id="order.id"
      />

      <form
        v-if="payFormData"
        ref="payForm"
        :action="payFormData.url"
        :method="payFormData.method ? 'POST' : 'GET'"
      >
        <template v-if="payFormData.params">
          <input
            v-for="key in Object.keys(payFormData.params)"
            :key="key"
            :name="key"
            type="hidden"
            :value="payFormData.params[key]"
          >
        </template>
      </form>
    </template>
  </div>
</template>

<script>
import BankReceipt from '@/components/cart/payment/BankReceipt'
import PayAdapters from '@/components/cart/payment/payAdapters'
import Qs from 'qs'

export default {
  name: 'Pay',
  components: {
    BankReceipt,
    PayAdapters
  },
  props: {
    order: { type: Object, required: true }
  },
  data () {
    return {
      collapsed: false,
      description: null,
      ipgError: null,
      payAdapters: null,
      payFormData: null,
      payProgressing: false,
      progressing: false,
      selectedPayAdapter: null
    }
  },
  mounted () {
    this.description = this.order && this.order.description
  },
  methods: {
    toggleCollapsed () {
      if (!this.collapsed) {
        this.progressing = true

        this.$api.customerOrders.getPayConfig(this.order.id)
        .then(res => {
          this.payAdapters = res && res.availableAdapters
          // const payOnDeliveryAllowed = res && res.payOnDeliveryAllowed

          // if (payOnDeliveryAllowed) {
          //   if (!this.payAdapters || !this.payAdapters.length) this.payAdapters = []

          //   this.payAdapters.push({
          //     id: -1,
          //     payType: 400,
          //     payAdapterType: 410
          //   })
          // }

          if (!this.selectedPayAdapter)
            this.selectedPayAdapter = this.payAdapters && this.payAdapters.length ? this.payAdapters[0] : null

          this.progressing = false
          
          this.collapsed = !this.collapsed
        })
        .catch(err => {
          this.progressing = false
          this.$showError(this.$getLocaleErrorMessage(err, 'account'))
        })
      } else {
        this.collapsed = !this.collapsed
      }
    },
    handlePay () {
      this.$validator.validateAll()
      .then(isValid => {
        if (isValid && this.selectedPayAdapter) {
          if (this.selectedPayAdapter.payType === 100) this.handleCredit()
          else if (this.selectedPayAdapter.payType === 200) this.handleBankReceipt()
          else if (this.selectedPayAdapter.payType === 300) this.handleIpg()
          // else if (this.selectedPayAdapter.payType === 400) this.handleOnDelivery()
        }
      })
    },
    handleCredit () {
      this.payProgressing = true

      this.$api.customerOrders.payViaCredit(this.order.id, { description: this.description })
      .then(() => {
        this.$router.push(`/paid?pid=${this.order.id}&credit=true`)
      })
      .catch(err => {
        this.payProgressing = false
        this.$showError(this.$getLocaleErrorMessage(err, 'payments'))
      })
    },
    handleBankReceipt () {
      this.$refs.bankReceipt.show({ description: this.description })
    },
    handleIpg () {
      this.payProgressing = true

      const query = Object.assign({}, this.$route.query)
      delete query.ref
      delete query.rec
      delete query.rev
      delete query.err
      delete query.errMsg
      delete query.errCode

      let callbackUrl = `${window.location.protocol}//${window.location.host}/paid?pid={orderId}`

      // eslint-disable-next-line no-undef
      const protocol = (typeof Medium !== 'undefined') && Medium.getProtocol()
      if (protocol) callbackUrl += `&protocol=${protocol}`

      if (Object.keys(query).length)
        callbackUrl += `?${Qs.stringify(query)}`

      this.$api.customerOrders.payViaIpg(this.order.id, {
        ipgPay: {
          payAdapterId: this.selectedPayAdapter.id,
          callbackUrl
        },
        description: this.description
      })
      .then(res => {
        if (res.ipgError) {
          this.ipgError = { code: res.ipgCode, error: res.ipgError }
        } else {
          if (res.method === 0) {
            const qs = Qs.stringify(res.params)
            const url = res.url.includes('?') ? `${res.url}&${qs}` : `${res.url}?${qs}`
            window.location.href = url
          } else if (res.method === 1) {
            this.payFormData = res
            
            this.$nextTick(() => {
              this.$refs.payForm.submit()
            })
          }
        }
        
        this.payProgressing = false
      })
      .catch(err => {
        this.payProgressing = false
        this.$showError(this.$getLocaleErrorMessage(err, 'payments'))
      })
    },
    // handleOnDelivery () {
    //   this.payProgressing = true

    //   this.$api.customerOrders.payOnDelivery(this.order.id, { description: this.description })
    //   .then(() => {
    //     this.$router.push(`/paid?pid=${this.order.id}&payOnDelivery=true`)
    //   })
    //   .catch(err => {
    //     this.payProgressing = false
    //     this.$showError(this.$getLocaleErrorMessage(err, 'payments'))
    //   })
    // },
    resetIpgError () {
      this.ipgError = null
    }
  }
}
</script>
