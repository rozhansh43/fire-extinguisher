<template>
  <b-card no-body>
    <b-card-header class="p-0" :class="{ 'rounded-bottom bg-white': !collapsed }">
      <b-btn
        block
        class="p-3 inherited-link d-flex align-items-center justify-content-between"
        variant="link"
        @click="toggleCollapsed"
      >
        <h5 class="mb-0">
          <font-awesome-icon
            icon="ticket-alt"
            class="align-middle text-info"
            :class="{ 'mr-2': $dir.ltr, 'ml-2': $dir.rtl }"
          />
          
          {{ $t('coupons.doYouHaveADiscountCode') }}
        
          <small class="text-muted" :class="{ 'mrl-2': $dir.ltr, 'mr-2': $dir.rtl }">
            ( {{ $t('shared.clickHere') }} )
          </small>
        </h5>

        <font-awesome-icon
          :icon="collapsed ? 'angle-up' : 'angle-down'"
          class="align-middle"
        />
      </b-btn>
    </b-card-header>

    <b-card-body v-if="collapsed" class="pb-0">
      <b-row>
        <b-col lg="6">
          <b-form @submit.prevent="submit">
            <b-form-group>
              <label for="pin" class="mb-2 text-muted">
                {{ $t('coupons.discountCode') }} :
              </label>

              <b-input-group>
                <b-input
                  id="pin"
                  dir="ltr"
                  class="text-center"
                  :placeholder="$t('shared.enterHere')"
                  v-model.trim="pin"
                />

                <b-input-group-append>
                  <b-btn variant="success" :disabled="!pin || progressing" type="submit">
                    <font-awesome-icon
                      :icon="progressing ? 'cog' : 'check'"
                      :spin="progressing"
                      class="align-middle"
                      :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
                    />
                    
                    {{ $t('shared.submit') }}
                  </b-btn>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-form>
        </b-col>
      </b-row>

      <b-alert v-if="value && (value.discount || value.deliveryDiscount)" show variant="warning">
        <ul class="mb-0 px-3">
          <li v-if="value.discount">
            {{ $t('coupons.discountAppliedOnYourCart', { amount: getAmount(value.discount), unit: currencyDisplay }) }}.
          </li>

          <li v-if="value.deliveryDiscount">
            {{ $t('coupons.discountAppliedOnDeliveryCostOfYourCart', { amount: getAmount(value.deliveryDiscount), unit: currencyDisplay }) }}.
          </li>
        </ul>
      </b-alert>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  name: 'Coupon',
  props: {
    value: Object
  },
  data () {
    return {
      collapsed: false,
      pin: null,
      progressing: false
    }
  },
  computed: {
    currencyDisplay () {
      return this.$api.settings.currencySettings.getDisplayName()
    }
  },
  methods: {
    toggleCollapsed () {
      this.collapsed = !this.collapsed
    },
    getAmount (value) {
      return this.$api.settings.currencySettings.getDisplayAmount(value).toLocaleString()
    },
    submit () {
      this.progressing = true

      this.$api.cartPayment.redeemCupon(this.pin, true)
      .then(res => {
        this.progressing = false
        this.$emit('refreshCart')
      })
      .catch(err => {
        this.progressing = false
        this.$showError(this.$getLocaleErrorMessage(err, 'coupons'))
      })
    }
  }
}
</script>
