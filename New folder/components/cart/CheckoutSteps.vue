<template>
  <b-card class="checkout-steps">
    <b-container>
      <div class="wrapper mx-auto position-relative">
        <b-row class="align-items-stretch text-center">
          <b-col
            cols="4"
            class="d-flex align-items-center justify-content-center position-relative"
            :class="currentStep >= 1 ? 'text-info' : 'text-silver'"
          >
            <b-link
              v-if="currentStep > 1"
              to="/cart/shipping"
              class="d-block"
            >
              <div class="text-info">
                {{ $t('cart.steps.postInformation') }}
              </div>
              
              <font-awesome-icon
                icon="circle"
                size="lg"
                class="align-middle step-icon text-info"
              />
            </b-link>

            <template v-else>
              <div :class="currentStep >= 1 ? 'text-info' : 'text-muted'">
                {{ $t('cart.steps.postInformation') }}
              </div>
              
              <font-awesome-icon
                icon="circle"
                size="lg"
                class="align-middle step-icon"
              />
            </template>
          </b-col>

          <b-col
            cols="4"
            class="d-flex align-items-center justify-content-center position-relative"
            :class="currentStep >= 2 ? 'text-info' : 'text-silver'"
          >
            <b-link
              v-if="currentStep > 2"
              to="/cart/payment"
              class="d-block"
            >
              <div class="text-info">
                {{ $t('cart.steps.payment') }}
              </div>
              
              <font-awesome-icon
                icon="circle"
                size="lg"
                class="align-middle step-icon text-info"
              />
            </b-link>

            <template v-else>
              <div :class="currentStep >= 2 ? 'text-info' : 'text-muted'">
                {{ $t('cart.steps.payment') }}
              </div>
              
              <font-awesome-icon
                icon="circle"
                size="lg"
                class="align-middle step-icon"
              />
            </template>
          </b-col>

          <b-col
            cols="4"
            class="d-flex align-items-center justify-content-center position-relative"
            :class="currentStep >= 3 ? 'text-info' : 'text-silver'"
          >
            <b-link
              v-if="currentStep > 3"
              to="/cart/payment"
              class="d-block"
            >
              <div class="text-info">
                {{ $t('cart.steps.checkPurchaseAndShipping') }}
              </div>
              
              <font-awesome-icon
                icon="circle"
                size="lg"
                class="align-middle step-icon text-info"
              />
            </b-link>

            <template v-else>
              <div :class="currentStep >= 3 ? 'text-info' : 'text-muted'">
                {{ $t('cart.steps.checkPurchaseAndShipping') }}
              </div>
              
              <font-awesome-icon
                icon="circle"
                size="lg"
                class="align-middle step-icon"
              />
            </template>
          </b-col>
        </b-row>

        <div class="d-flex steps-borders mx-auto">
          <hr class="w-50 m-0" :class="currentStep >= 2 ? 'border-info' : 'border-silver'">
          <hr class="w-50 m-0" :class="currentStep >= 3 ? 'border-info' : 'border-silver'">
        </div>
      </div>
    </b-container>
  </b-card>
</template>

<script>
export default {
  name: 'CheckoutSteps',
  props: {
    currentStep: Number
  }
}
</script>

