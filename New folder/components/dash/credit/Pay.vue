<template>
  <div>
    <div class="border-top px-3 py-2">
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

      <div class="d-flex justify-content-between align-items-center">
        <div class="text-muted">
          <font-awesome-icon
            :icon="progressing ? 'cog' : 'plus'"
            :spin="progressing"
            class="align-middle text-success"
            :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
          />

          {{ $t('credit.increaseCredit') }} :
        </div>

        <div class="d-flex align-items-end">
          <b-form-group class="mb-0">
            <b-alert :show="errors.any()" variant="danger" class="px-4">
              <ul class="m-0 px-1">
                <li v-for="err in errors.all()" :key="err">{{err}}</li>
              </ul>
            </b-alert>

            <currency-editor
              required
              :prepend="$t('credit.amount')"
              input-class="text-center"
              :disabled="progressing"
              :name="$t('credit.amount')"
              v-validate="'required|min_value: 1000'"
              v-model="payable"
            />
          </b-form-group>

          <b-btn
            :disabled="progressing"
            variant="success"
            :class="{ 'ml-3': $dir.ltr, 'mr-3': $dir.rtl }"
            @click="toggleCollapsed"
          >
            {{ $t('payments.pay') }}

            <font-awesome-icon
              :icon="progressing ? 'cog' : (collapsed ? 'angle-up' : 'angle-down')"
              :spin="progressing"
              class="align-middle"
              :class="{ 'ml-1': $dir.ltr, 'mr-1': $dir.rtl }"
            />
          </b-btn>
        </div>
      </div>
    </div>

    <template v-if="collapsed">
      <pay-adapters
        :items="payAdapters"
        class="shadow-none mb-0 border-top rounded-0"
        header-class="rounded-0"
        v-model="selectedPayAdapter"
      />

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
import CurrencyEditor from '@/components/shared/CurrencyEditor'
import PayAdapters from '@/components/cart/payment/payAdapters'
import Qs from 'qs'

export default {
  name: 'Pay',
  components: {
    CurrencyEditor,
    PayAdapters
  },
  data () {
    return {
      collapsed: false,
      progressing: false,
      payAdapters: null,
      selectedPayAdapter: null,
      payProgressing: false,
      payFormData: null,
      payable: 1000,
      payableId: null,
      ipgError: null
    }
  },
  methods: {
    toggleCollapsed () {
      if (!this.collapsed) {
        this.progressing = true

        this.$api.credit.createInvoice({ payable: this.payable }, true)
        .then(payableId => {
          this.payableId = payableId
          this.$api.credit.getPayAdapters(payableId)
          .then(res => {
            this.payAdapters = res
  
            if (!this.selectedPayAdapter)
              this.selectedPayAdapter = this.payAdapters && this.payAdapters.length ? this.payAdapters[0] : null
  
            this.progressing = false
            
            this.collapsed = !this.collapsed
          })
        })
        .catch(err => {
          this.progressing = false
          this.$showError(this.$getLocaleErrorMessage(err, 'credit'))
        })
      } else {
        this.collapsed = !this.collapsed
      }
    },
    handlePay () {
      if (this.selectedPayAdapter) {
        if (this.selectedPayAdapter.payType === 300) this.handleIpg()
      }
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

      let callbackUrl = `${window.location.protocol}//${window.location.host}/paid?credit=true`

      // eslint-disable-next-line no-undef
      const protocol = (typeof Medium !== 'undefined') && Medium.getProtocol()
      if (protocol) callbackUrl += `&protocol=${protocol}`

      if (Object.keys(query).length)
        callbackUrl += `?${Qs.stringify(query)}`

      this.$api.credit.payViaIpg(this.payableId, {
        payAdapterId: this.selectedPayAdapter.id,
        callbackUrl
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
    resetIpgError () {
      this.ipgError = null
    }
  }
}
</script>
