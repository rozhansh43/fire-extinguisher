<template>
  <table class="table table-bordered mb-3">
    <tr class="text-center font-weight-bold bg-bright">
      <td colspan="10">
        {{ $t('customerOrders.productsOrServicesDetails') }}
      </td>
    </tr>

    <tr class="text-center font-weight-bold bg-bright">
      <td>
        {{ $t('customerOrders.row') }}
      </td>

      <td>
        {{ $t('customerOrders.productId') }}
      </td>

      <td>
        {{ $t('customerOrders.description') }}
      </td>

      <td>
        {{ $t('customerOrders.amount') }}
      </td>

      <td>
        {{ $t('customerOrders.unit') }}
      </td>

      <td>
        {{ $t('customerOrders.unitPrice') }}

        <br>

        ( {{ currencyBaseName }} )
      </td>

      <td>
        {{ $t('customerOrders.total') }}

        <br>

        ( {{ currencyBaseName }} )
      </td>

      <td class="text-nowrap">
        {{ $t('customerOrders.discount') }}

        <br>

        ( {{ currencyBaseName }} )
      </td>

      <td>
        {{ $t('customerOrders.taxAndToll') }}

        <br>

        ( {{ currencyBaseName }} )
      </td>

      <td>
        {{ $t('customerOrders.payable') }}

        <br>

        ( {{ currencyBaseName }} )
      </td>
    </tr>

    <tr v-for="(item, index) in value" :key="index" class="text-center">
      <td>
        {{ index + 1 }}
      </td>

      <td>
        {{ item.product.id }}
      </td>

      <td>
        <b-link class="inherited-link" target="_blank" :href="getProductPath(item.product)">
          {{ item.product.title }}
        </b-link>

        <template v-if="item.product.model">
          <template v-if="item.product.model.color">
            <span class="text-muted">
              |
            </span>

            {{ $t('customerOrders.color') }} : {{ item.product.model.color.name }}
          </template>

          <template v-if="item.product.model.size">
            <span class="text-muted">
              |
            </span>

            {{ $t('customerOrders.size') }} : {{ item.product.model.size.name }}
          </template>

          <template v-if="item.product.model.guarantee">
            <span class="text-muted">
              |
            </span>

            {{ $t('customerOrders.guarantee') }} : {{ item.product.model.guarantee.name }}
          </template>

          <fields-display
            v-if="hasField(item.product)"
            :value="item.product.model.fieldGroups"
            :type="getProductType(item.product)"
            simple-inline
            separator="|"
            hide-group-name
          />

          <template v-if="item.product.model.description">
            <span class="text-muted">
              |
            </span>

            {{ item.product.model.description }}
          </template>

          <template v-if="$hasModule('sellers') && item.product.model.article.seller">
            <span class="text-muted">
              |
            </span>

            {{ $t('customerOrders.seller') }} :

            {{ getUserDisplayName(item.product.model.article.seller) }}
          </template>

          <template v-if="$hasModule('inventories') && item.product.model.article.inventory">
            <span class="text-muted">
              |
            </span>

            {{ $t('customerOrders.inventory') }} :

            {{ item.product.model.article.inventory.name }}
          </template>
        </template>
      </td>

      <td>
        {{ item.quantity }}
      </td>

      <td>
        <template v-if="getArticlePackage(item.product)">
          {{ getArticlePackage(item.product).name }}

          <div
            v-if="
              getProductType(item.product).unit &&
              getProductType(item.product).unit.name !== getArticlePackage(item.product).name &&
              getArticlePackage(item.product).unitsQuantity !== 1"
              class="text-muted mt-1 small"
            >
            ( {{ $t('products.equivalentTo') }} {{ (item.quantity * getArticlePackage(item.product).unitsQuantity).toLocaleString() }} {{ getProductType(item.product).unit.name }} )
          </div>
        </template>
        
        <template v-else-if="$hasModule('units') && getProductType(item.product).unit">
          {{ getProductType(item.product).unit.name }}
        </template>

        <template v-else>
          {{ $t('customerOrders.number') }}
        </template>
      </td>

      <td>
        <currency-display
          :value="item.unitPrice"
          no-conversion
          :show-currency="false"
        />
      </td>

      <td>
        <currency-display
          :value="item.itemTotal"
          no-conversion
          :show-currency="false"
        />
      </td>

      <td>
        <currency-display
          :value="item.itemTotalSaleDiscount + item.itemTotalCouponDiscount"
          no-conversion
          :show-currency="false"
        />
      </td>

      <td>
        <currency-display
          :value="item.itemTotalTax + item.itemTotalToll"
          no-conversion
          :show-currency="false"
        />
      </td>

      <td>
        <currency-display
          :value="item.itemTotalPayable"
          no-conversion
          :show-currency="false"
        />
      </td>
    </tr>

    <tr v-if="order.deliveryMethod && !order.deliveryMethod.hideFee" class="text-center">
      <td>
        {{ value.length + 1 }}
      </td>

      <td>
        {{ order.deliveryMethod.id }}
      </td>

      <td>
        {{ $t('deliveryMethods.shippingCost') }}
      </td>

      <td>
        1
      </td>

      <td>
        {{ $t('customerOrders.number') }}
      </td>

      <td>
        <currency-display
          :value="order.delivery"
          no-conversion
          :show-currency="false"
        />
      </td>

      <td>
        <currency-display
          :value="order.delivery"
          no-conversion
          :show-currency="false"
        />
      </td>

      <td>
        <currency-display
          :value="order.deliveryCouponDiscount"
          no-conversion
          :show-currency="false"
        />
      </td>

      <td>
        <currency-display
          :value="order.deliveryTax + order.deliveryToll"
          no-conversion
          :show-currency="false"
        />
      </td>

      <td>
        <currency-display
          :value="order.deliveryPayable"
          no-conversion
          :show-currency="false"
        />
      </td>
    </tr>

    <tr class="text-center bg-bright">
      <td rowspan="4" colspan="2" class="border-0"></td>

      <td
        rowspan="4"
        colspan="6"
        class="bg-bright border-0"
        :class="{ 'text-left': $dir.ltr, 'text-right': $dir.rtl }"
        style="vertical-align: unset"
      >
        <ul v-if="order.deliveryMethod || order.description" class="px-4 py-3">
          <li v-if="order.deliveryMethod" class="mb-3">
            <span class="text-muted">
              {{ $t('deliveryMethods.deliveryMethod') }} :
            </span>

            {{ order.deliveryMethod.name }}
          </li>
          
          <li v-if="order.description" class="text-justify mb-3">
            <span class="text-muted">
              {{ $t('shared.description') }} :
            </span>

            {{ order.description }}
          </li>
        </ul>
      </td>

      <td class="font-weight-bold">
        {{ $t('customerOrders.total') }}
      </td>

      <td class="bg-white">
        <currency-display
          :value="order.total"
          no-conversion
          :show-currency="false"
        />
      </td>
    </tr>

    <tr class="text-center bg-bright">
      <td class="font-weight-bold">
        {{ $t('customerOrders.discount') }}
      </td>

      <td class="bg-white">
        <currency-display
          :value="order.totalDiscount"
          no-conversion
          :show-currency="false"
        />
      </td>
    </tr>

    <tr class="text-center bg-bright">
      <td class="font-weight-bold">
        {{ $t('customerOrders.taxAndToll') }}
      </td>

      <td class="bg-white">
        <currency-display
          :value="order.totalTax + order.totalToll"
          no-conversion
          :show-currency="false"
        />
      </td>
    </tr>

    <tr class="text-center bg-bright">
      <td class="font-weight-bold">
        {{ $t('customerOrders.payable') }}
      </td>

      <td class="bg-white">
        <currency-display
          :value="order.payable"
          no-conversion
          :show-currency="false"
        />
      </td>
    </tr>
  </table>
</template>

<script>
import CurrencyDisplay from '@/components/shared/CurrencyDisplay'
import FieldsDisplay from '@/components/products/product/fields'

export default {
  name: 'OrderItems',
  components: {
    CurrencyDisplay,
    FieldsDisplay
  },
  props: {
    value: { type: Array, required: true },
    productTypes: { type: Array, required: true },
    order: { type: Object, required: true }
  },
  computed: {
    currencyBaseName () {
      const currency = this.$api.settings.currencySettings.get()
      return currency && currency.baseName
    }
  },
  methods: {
    getUserDisplayName (user) {
      return this.$api.account.getUserDisplayName(user)
    },
    getProductPath (product) {
      return `/product/${product.id}/${product.slug}`
    },
    getProductType (product) {
      return this.productTypes.find(o => o.id === product.typeId)
    },
    getArticlePackage (product) {
      return product && product.model && product.model.article && product.model.article.package
    },
    hasField (product) {
      const val = product.model && product.model.fieldGroups
      const type = this.getProductType(product)
      return type && val && val.length && val.find(o => o.fields && o.fields.length && o.fields.find(x => x.value))
    }
  }
}
</script>
