<template>
  <div v-if="value.availabilityStatus === 1">
    <b-card
      v-if="view === 'list'"
      :bg-variant="selectedArticle && selectedArticle.id === value.id ? 'info-light' : 'bright'"
      class="shadow-none" body-class="pb-0 px-md-4"
    >
      <b-row class="align-items-center">
        <b-col v-if="sellersEnabled && value.seller" lg="3">
          <div class="mb-3">
            <span class="text-muted">
              <font-awesome-icon
                icon="store"
                size="lg"
                class="align-middle text-info"
                :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
              />

              {{ $t('products.seller') }} :
            </span>

            {{ getUserDisplayName(value.seller) }}
          </div>
        </b-col>

        <!-- <b-col v-if="inventoriesEnabled && hasInventory" lg="2">
          <div class="mb-3">
            <span class="text-muted">
              <font-awesome-icon
                icon="warehouse"
                size="lg"
                class="align-middle text-moremuted"
                :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
              />

              {{ $t('products.inventory') }} :
            </span>

            {{ value.inventory.name }}
          </div>
        </b-col> -->

        <b-col v-if="hasPackage" lg="4">
          <b-row class="align-items-center">
            <b-col>
              <quantity
                v-if="selectedPackage"
                class="mb-3"
                :min="selectedPackage.minOq"
                :max="selectedPackage.maxOq"
                :precision="type && type.unit ? type.unit.precision : 0"
                v-model="quantity"
              />
            </b-col>

            <b-col>
              <template v-if="packagesEnabled">
                <b-form-select v-if="packages.length > 1" class="mb-3" :options="packages" v-model="selectedPackageId"/>

                <div v-else class="mb-3">
                  {{ packages[0].text }}
                </div>
              </template>

              <div v-else-if="type && type.unit" class="mb-3">
                {{ type.unit.name }}
              </div>

              <div v-else class="mb-3">
                {{ $t('products.units') }}
              </div>
            </b-col>
          </b-row>
        </b-col>

        <b-col lg="3">
          <div class="text-lg-left mb-3">
            <b-row v-if="selectedSalePlan" class="align-items-center">
              <b-col class="mb-2 mb-sm-0">
                <span v-if="packagesEnabled && selectedPackage && selectedPackage.name">
                  {{ $t('products.eachPackagePrice', { name: selectedPackage.name }) }}
                </span>

                <template v-else-if="type && type.unit">
                  {{ $t('products.eachPackagePrice', { name: type.unit.name }) }}
                </template>

                <template v-else>
                  {{ $t('products.eachPackagePrice', { name: this.$t('products.units') }) }}
                </template>

                <b-btn
                  v-if="selectedPackage.salePlans && selectedPackage.salePlans.length > 1"
                  class="p-0"
                  variant="link"
                  :class="{ 'ml-1': $dir.ltr, 'mr-1': $dir.rtl }"
                  :title="$t('products.priceTable')"
                  v-b-tooltip.hover
                  @click="emitShowSalePlans"
                >
                  <font-awesome-icon icon="info-circle" size="lg" class="align-middle text-info"/>
                </b-btn>
              </b-col>

              <b-col sm="auto" :class="{ 'text-right': $dir.ltr, 'text-left': $dir.rtl }">
                <div v-if="$hasModule('products_discounts', 'deals') && (selectedSalePlan.discount || selectedSalePlan.discountPercent)" class="mb-2">
                  <currency-display
                    :value="selectedSalePlan.priceBeforeDiscount"
                    class="h5 mb-0 font-weight-normal text-muted text-line-through"
                    :show-currency="false"
                  />

                  <b-badge
                    v-if="Math.round(selectedSalePlan.discountPercent)"
                    variant="danger"
                    pill
                    style="font-size: 120%"
                    :class="{ 'ml-1': $dir.ltr, 'mr-1': $dir.rtl }"
                  >
                    {{ Math.round(selectedSalePlan.discountPercent) }}%
                  </b-badge>
                </div>

                <currency-display
                  v-if="selectedSalePlan.priceAfterDiscount"
                  :value="selectedSalePlan.priceAfterDiscount"
                  amount-class="h3"
                  currency-class="font-weight-normal"
                  class="h5 mb-3"
                />

                <span v-else class="mb-3 text-success">
                  {{ $t('products.free') }}
                </span>
              </b-col>
            </b-row>

            <template v-else>
              {{ $t('products.salePlanNotFound') }}
            </template>
          </div>
        </b-col>

        <b-col lg="auto" :class="{ 'ml-auto': $dir.ltr, 'mr-auto': $dir.rtl }">
          <add-to-cart-button
            v-if="selectedSalePlan"
            variant="outline-success"
            :article-id="value.id"
            :selected-package="selectedPackage"
            :selected-sale-plan="selectedSalePlan"
            :unit="type && type.unit ? type.unit : { name: this.$t('products.units') }"
            :need-login="addToCartNeedLogin"
            v-model="quantity"
          />
        </b-col>
      </b-row>
    </b-card>

    <b-card v-else-if="view === 'grid'" bg-variant="bright" class="shadow-none" body-class="pt-4 pb-2 px-md-4">
      <template v-if="sellersEnabled && hasSeller">
        <div class="mb-3">
          <span class="text-muted">
            <font-awesome-icon
              icon="store"
              size="lg"
              class="align-middle text-info"
              :class="{ 'mr-2': $dir.ltr, 'ml-2': $dir.rtl }"
            />

            {{ $t('products.seller') }} :
          </span>

          {{ getUserDisplayName(value.seller) }}
        </div>

        <hr class="mt-0 mb-3"/>
      </template>

      <!-- <template v-if="inventoriesEnabled && hasInventory">
        <div class="mb-3">
          <span class="text-muted">
            <font-awesome-icon
              icon="warehouse"
              size="lg"
              class="align-middle text-moremuted"
              :class="{ 'mr-2': $dir.ltr, 'ml-2': $dir.rtl }"
            />

            {{ $t('products.inventory') }} :
          </span>

          {{ value.inventory.name }}
        </div>

        <hr class="mt-0 mb-3"/>
      </template> -->

      <template v-if="hasPackage">
        <b-row class="align-items-center">
          <b-col>
            <quantity
              v-if="selectedPackage"
              class="mb-3"
              :min="selectedPackage.minOq"
              :max="selectedPackage.maxOq"
              :precision="type && type.unit ? type.unit.precision : 0"
              v-model="quantity"
            />
          </b-col>

          <b-col>
            <template v-if="packagesEnabled">
              <b-form-select v-if="packages.length > 1" class="mb-3" :options="packages" v-model="selectedPackageId"/>

              <div v-else class="mb-3">
                {{ packages[0].text }}
              </div>
            </template>

            <div v-else-if="type && type.unit" class="mb-3">
              {{ type.unit.name }}
            </div>

            <div v-else class="mb-3">
              {{ this.$t('products.units') }}
            </div>
          </b-col>
        </b-row>

        <hr class="mt-0 mb-3"/>
      </template>

      <div class="mb-3">
        <b-row v-if="selectedSalePlan">
          <b-col class="mb-2">
            <span v-if="packagesEnabled && selectedPackage && selectedPackage.name">
              {{ $t('products.eachPackagePrice', { name: selectedPackage.name }) }}
            </span>

            <template v-else-if="type && type.unit">
              {{ $t('products.eachPackagePrice', { name: type.unit.name }) }}
            </template>

            <template v-else>
              {{ $t('products.eachPackagePrice', { name: this.$t('products.units') }) }}
            </template>

            <b-btn
              v-if="selectedPackage.salePlans && selectedPackage.salePlans.length > 1"
              class="p-0"
              variant="link"
              :class="{ 'ml-1': $dir.ltr, 'mr-1': $dir.rtl }"
              :title="$t('products.priceTable')"
              v-b-tooltip.hover
              @click="emitShowSalePlans"
            >
              <font-awesome-icon icon="info-circle" size="lg" class="align-middle text-info"/>
            </b-btn>
          </b-col>

          <b-col sm="auto" :class="{ 'text-right': $dir.ltr, 'text-left': $dir.rtl }">
            <div v-if="$hasModule('products_discounts', 'deals') && (selectedSalePlan.discount || selectedSalePlan.discountPercent)" class="mb-2">
              <currency-display
                :value="selectedSalePlan.priceBeforeDiscount"
                class="h5 mb-0 font-weight-normal text-muted text-line-through"
                :show-currency="false"
              />

              <b-badge
                v-if="Math.round(selectedSalePlan.discountPercent)"
                variant="danger"
                pill
                style="font-size: 120%"
                :class="{ 'ml-1': $dir.ltr, 'mr-1': $dir.rtl }"
              >
                {{ Math.round(selectedSalePlan.discountPercent) }}%
              </b-badge>

              <meta name="product_old_price" :content="getDisplayAmount(selectedSalePlan.priceBeforeDiscount)"/>
            </div>

            <currency-display
              v-if="selectedSalePlan.priceAfterDiscount"
              :value="selectedSalePlan.priceAfterDiscount"
              amount-class="h3"
              currency-class="font-weight-normal"
              class="h5 text-success mb-3"
            />

            <span v-else class="h5 mb-3 text-success">
              {{ $t('products.free') }}
            </span>

            <meta name="product_price" :content="getDisplayAmount(selectedSalePlan.priceAfterDiscount)"/>
          </b-col>
        </b-row>

        <template v-else>
          {{ $t('products.salePlanNotFound') }}
        </template>
      </div>

      <add-to-cart-button
        v-if="selectedSalePlan"
        size="lg"
        :article-id="value.id"
        :selected-package="selectedPackage"
        :selected-sale-plan="selectedSalePlan"
        :unit="type && type.unit ? type.unit : { name: this.$t('products.units') }"
        :need-login="addToCartNeedLogin"
        v-model="quantity"
      />
    </b-card>
  </div>
</template>

<script>
import AddToCartButton from '@/components/products/product/addToCart/Button'
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'
import Quantity from '../Quantity'
import vm from '@/lib/vm'

export default {
  name: 'Article',
  components: {
    AddToCartButton,
    CurrencyDisplay,
    Quantity
  },
  props: {
    value: { type: Object, required: true },
    modelId: { type: Number, required: true },
    type: Object,
    view: { type: String, default: 'list' },
    selectedModel: Object,
    selectedArticle: Object,
    product: { type: Object, required: true }
  },
  data () {
    return {
      selectedPackageId: null,
      quantity: 1
    }
  },
  computed: {
    hasPackage () {
      return this.value && this.value.packages && this.value.packages.length
    },
    hasSeller () {
      return this.value.seller
    },
    // hasInventory () {
    //   return this.value.inventory && this.value.inventory.name
    // },
    packages () {
      if (this.hasPackage) {
        return this.value.packages.map(o => {
          let text = null

          if (o.unitsQuantity === 1) {
            text = o.name || this.$t('products.units')
          } else {
            text = this.$t('products.packageTitle', {
              name: o.name || this.$t('products.units'),
              count: o.unitsQuantity * this.quantity,
              unit: this.type && this.type.unit ? this.type.unit.name : this.$t('products.units')
            })
          }

          if (o.name === (this.type && this.type.unit ? this.type.unit.name : this.$t('products.units')) && o.unitsQuantity === 1)
            text = o.name

          return {
            value: o.id,
            text
          }
        })
      } else {
        return []
      }
    },
    firstPackage () {
      return this.hasPackage && this.value.packages[0]
    },
    selectedPackage () {
      return this.selectedPackageId ? this.value.packages.find(o => o.id === this.selectedPackageId) : null
    },
    selectedSalePlan () {
      if (this.selectedPackage && this.selectedPackage.salePlans && this.selectedPackage.salePlans.length) {
        const salePlan = this.selectedPackage.salePlans.find(o => this.quantity >= o.minOq && this.quantity <= o.maxOq)
        return salePlan || null
      } else
        return null
    },
    sellersEnabled () {
      return this.$hasModule('sellers')
    },
    packagesEnabled () {
      return this.$hasModule('products_packages')
    },
    // inventoriesEnabled () {
    //   return this.$hasModule('inventories')
    // }
    addToCartNeedLogin () {
      const account = this.$store.state.$account
      const userGroups = this.product.userGroupIds
      return !!(this.$hasModule('userGroups') && userGroups && userGroups.length && !account)
    }
  },
  watch: {
    modelId () {
      this.setSelectedPackageId()
    },
    selectedSalePlan (val, oldVal) {
      if (!val || val !== oldVal) this.emitSelectedSalePlan(val)
    }
  },
  created () {
    this.setSelectedPackageId()
  },
  methods: {
    setSelectedPackageId () {
      this.selectedPackageId = this.firstPackage && this.firstPackage.id
      this.quantity = 1
    },
    getUserDisplayName (user) {
      return this.$api.account.getUserDisplayName(user)
    },
    emitShowSalePlans () {
      vm.$emit('showSalePlans', this.selectedPackage, this.selectedSalePlan.id)
    },
    emitSelectedSalePlan (value) {
      vm.$emit('setSelectedSalePlan', value)
    },
    getDisplayAmount (value) {
      return this.$api.settings.currencySettings.getDisplayAmount(value)
    }
  }
}
</script>
