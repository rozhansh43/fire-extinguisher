<template>
  <b-modal
    ref="modal"
    centered
    :title="$t('payments.bankReceipt')"
    :hide-footer="initializing"
    footer-class="d-block p-3"
    @hidden="cleanup"
  >
    <div v-if="initializing" class="text-center">
      <font-awesome-icon spin icon="circle-notch" class="text-moremuted display-2"/>
    </div>

    <template v-else>
      <b-card bg-variant="bright" class="shadow-none" body-class="d-flex align-items-center justify-content-between">
        {{ $t('payments.payableAmount') }} :

        <currency-display
          :value="payableAmount"
          amount-class="text-success h5 mb-0"
        />
      </b-card>

      <label>
        {{ $t('payments.destinationBankAccount') }} :
        <required-symbol/>
      </label>

      <b-card no-body bg-variant="bright" class="shadow-none">
        <b-list-group v-if="bankAccounts && bankAccounts.length" flush>
          <b-list-group-item
            v-for="item in bankAccounts"
            :key="item.id"
            class="pb-0 pt-2 bg-bright cursor-pointer"
            style="font-size: 90%"
            :class="{
              'bg-success-light': model.bankAccountId === item.id,
              'border-bottom': !bankAccounts[bankAccounts.length - 1]
            }"
            @click="model.bankAccountId = item.id"
          >
            <b-row class="align-items-center">
              <b-col cols="auto">
                <b-btn variant="link" class="p-0 selected">
                  <font-awesome-icon
                    v-if="model.bankAccountId === item.id"
                    icon="check-circle"
                    class="align-middle text-success"
                    style="font-size: 10px"
                  />

                  <div v-else class="transparent-circle"></div>
                </b-btn>
              </b-col>

              <b-col>
                <div v-if="item.name" class="mb-2">
                  <label class="text-muted mb-0">
                    {{ $t('bankAccounts.accountTitle') }} :
                  </label>

                  {{ item.name }}
                </div>

                <div v-if="item.bank && item.bank.name" class="mb-2">
                  <label class="text-muted mb-0">
                    {{ $t('bankAccounts.bankName') }} :
                  </label>

                  {{ item.bank.name }}
                </div>

                <div v-if="item.branchName" class="mb-2">
                  <label class="text-muted mb-0">
                    {{ $t('bankAccounts.branchName') }} :
                  </label>

                  {{ item.branchName }}
                </div>

                <div v-if="item.owner" class="mb-2">
                  <label class="text-muted mb-0">
                    {{ $t('bankAccounts.accountOwnerName') }} :
                  </label>

                  {{ item.owner }}
                </div>

                <div v-if="item.accountNo" class="mb-2">
                  <label class="text-muted mb-0">
                    {{ $t('bankAccounts.accountNumber') }} :
                  </label>

                  {{ item.accountNo }}
                </div>

                <div v-if="item.cardNo" class="mb-2">
                  <label class="text-muted mb-0">
                    {{ $t('bankAccounts.cardNo') }} :
                  </label>

                  {{ item.cardNo }}
                </div>

                <div v-if="item.sheba" class="mb-2">
                  <label class="text-muted mb-0">
                    {{ $t('bankAccounts.shebaNumber') }} :
                  </label>

                  {{ item.sheba }}
                </div>
              </b-col>
            </b-row>
          </b-list-group-item>
        </b-list-group>

        <template v-else>
          <div
            class="d-flex align-items-center justify-content-center p-3 text-muted"
            style="font-size: 90%"
          >
            {{ $t('payments.thereIsNotAnyBankAccounts') }}
          </div>
        </template>

        <input
          type="hidden"
          :name="$t('payments.destinationBankAccount')"
          v-validate="'required'"
          v-model="model.bankAccountId"
        >
      </b-card>

      <b-form-group>
        <label for="payerName">
          {{ $t('payments.payerName') }} :
          <required-symbol/>
        </label>

        <b-input-group>
          <b-form-input
            id="payerName"
            :name="$t('payments.payerName')"
            v-validate="'required'"
            v-model="model.payerName"
          />
        </b-input-group>
      </b-form-group>

      <b-form-group>
        <label for="payDate">
          {{ $t('payments.payDate') }} :
          <required-symbol/>
        </label>

        <date-picker
          id="payDate"
          required
          :name="$t('payments.payDate')"
          v-validate="'required'"
          v-model="model.payDate"
        />
      </b-form-group>

      <b-form-group>
        <label for="receiptNo">
          {{ $t('payments.receiptNo') }} :
          <required-symbol/>
        </label>

        <b-input-group>
          <b-form-input
            id="receiptNo"
            dir="ltr"
            :name="$t('payments.receiptNo')"
            v-validate="'required'"
            v-model="model.receiptNo"
          />
        </b-input-group>
      </b-form-group>

      <uploader
        :label="$t('payments.receiptImage')"
        :name="$t('payments.receiptImage')"
        v-validate="'required'"
        required
        v-model="model.receiptImage"
      />
    </template>

    <template v-slot:modal-footer>
      <b-alert :show="errors.any()" variant="danger" class="mt-0 mx-0 mb-3 px-4">
        <ul class="m-0 px-1">
          <li v-for="err in errors.all()" :key="err">{{ err }}</li>
        </ul>
      </b-alert>

      <b-btn block variant="success" class="m-0" :disabled="progressing" @click="submit">
        <font-awesome-icon
          :icon="progressing ? 'cog': 'check'"
          :spin="progressing"
          class="align-middle"
          :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
        />

        {{ $t('shared.save') }}
      </b-btn>
    </template>
  </b-modal>
</template>

<script>
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'
import DatePicker from '@/components/shared/DatePicker'
import Uploader from '@/components/shared/Uploader'

export default {
  name: 'BankReceipt',
  components: {
    CurrencyDisplay,
    DatePicker,
    Uploader
  },
  props: {
    payAdapterId: Number,
    payableAmount: Number,
    orderId: Number
  },
  data () {
    return {
      progressing: false,
      initializing: true,
      bankAccounts: null,
      description: null,
      baseModel: {
        payAdapterId: null,
        bankAccountId: null,
        receiptNo: null,
        receiptImage: null,
        payerName: null,
        payDate: null
      },
      model: null
    }
  },
  methods: {
    show ({ description }) {
      this.cleanup()

      this.initializing = true

      this.$refs.modal.show()

      this.model.payAdapterId = this.payAdapterId
      this.model.payDate = new Date().toISOString()
      this.description = description

      const account = this.$store.state.$account
      if (account) {
        this.model.payerName = this.$api.account.getUserDisplayName(account)
      }

      this.getBankAccounts()
    },
    cleanup () {
      this.model = Object.assign({}, this.baseModel)
    },
    getBankAccounts () {
      this.$api.customerOrders.getBankReceiptById(this.model.payAdapterId)
      .then(res => {
        this.bankAccounts = res.bankAccounts

        this.model.bankAccountId = this.bankAccounts && this.bankAccounts.length ? this.bankAccounts[0].id : null

        this.initializing = false
      })
      .catch(err => {
        this.$showError(this.$getLocaleErrorMessage(err, 'payments'))
        this.initializing = false
      })
    },
    preSubmit () {
      return this.$validator.validateAll()
      .then(isValid => {
        this.progressing = isValid
        return isValid
      })
    },
    fail (err) {
      this.$showError(this.$getLocaleErrorMessage(err, 'payments'))
      this.progressing = false
      return false
    },
    success (successMessage, path) {
      this.$showSuccess(this.$t(successMessage))
      this.progressing = false
    },
    submit () {
      this.preSubmit()
      .then(proceed => {
        if (proceed) {
          if (this.orderId) {
             this.$api.customerOrders.payViaBankReceipt(this.orderId, { bankReceiptPay: this.model, description: this.description })
            .then(() => {
              this.$refs.modal.hide()
              this.$router.push(`/paid?pid=${this.orderId}&receipt=true`)
            })
            .catch(this.fail)
          } else {
            this.$api.cartPayment.payViaBankReceipt({ bankReceiptPay: this.model, description: this.description })
            .then(res => {
              this.$refs.modal.hide()
              this.$router.push(`/paid?pid=${res}&receipt=true`)
            })
            .catch(this.fail)
          }
        }
      })
    }
  }
}
</script>
