<template>
  <div v-if="initializing" class="text-center mb-3">
    <font-awesome-icon spin icon="circle-notch" class="text-moremuted display-2"/>
  </div>

  <div v-else>
    <editor
      v-if="showEditor"
      :item-id="item.id"
      :rate-enabled="rateEnabled"
      :comment-enabled="commentEnabled"
      :rates="rateItems"
      @return="toggleEditor"
      @submitted="addSubmitted"
    />

    <div v-else>
      <b-row v-if="(rates && rates.total) && rateEnabled" class="mb-4 align-items-center">
        <b-col md="auto">
          <h4 class="mb-2 mb-md-0">
            {{ $t(`productComments.usersRateTo`, { item: item.title }) }}
          </h4>
        </b-col>

        <b-col md="auto">
          <small class="text-muted">
            ( {{ $tc(`productComments.peopleSubmittedRate`, rates.total.toLocaleString()) }} )
          </small>
        </b-col>
      </b-row>

      <b-row v-if="rateEnabled || commentEnabled">
        <b-col v-if="rateEnabled" md="6">
          <b-row v-for="(rate, index) in rateItems" :key="index" class="d-flex align-items-center mb-3">
            <b-col md="3" class="mb-2 mb-md-0">
              {{ rate.title }} :
            </b-col>

            <b-col md="6" class="mb-2 mb-md-0">
              <b-progress class="flex-grow-1" height="5px">
                <b-progress-bar :min="0" :max="10" variant="info" :value="rates[`r${index + 1}`]"/>
              </b-progress>
            </b-col>

            <b-col md="auto">
              <div class="text-muted">
                {{ getRateValue(rates[`r${index + 1}`]) }}
              </div>
            </b-col>
          </b-row>
        </b-col>

        <b-col v-if="commentEnabled || rateEnabled" md="6" class="mb-3">
          <h5 :class="account ? 'mb-4' : 'mb-3'">
            <template v-if="commentEnabled">
              {{ $t('productComments.youCanSubmitComment') }}
            </template>

            <template v-else-if="rateEnabled">
              {{ $t('productComments.youCanSubmitRate') }}
            </template>
          </h5>

          <div v-if="!account" class="mb-4">
            {{ $t('productComments.needToLoginFirst') }}.
          </div>

          <b-btn variant="outline-info" class="px-3 py-2" @click="submitNew">
            <font-awesome-icon
              v-if="commentEnabled"
              icon="comment-dots"
              class="align-middle"
              :class="{'mr-1': $dir.ltr, 'ml-1': $dir.rtl}"
            />

            <font-awesome-icon
              v-else-if="rateEnabled"
              icon="sliders-h"
              class="align-middle"
              :class="{'mr-1': $dir.ltr, 'ml-1': $dir.rtl}"
            />

            <template v-if="commentEnabled">
              {{ $t('productComments.submitNewComment') }}
            </template>

            <template v-else-if="rateEnabled">
              {{ $t('productComments.submitNewRate') }}
            </template>
          </b-btn>
        </b-col>
      </b-row>
    </div>

    <template v-if="(submitted && submitted.length) || (comments && comments.length)">
      <b-row class="align-items-center mt-2 mt-md-0">
        <b-col class="mb-3 mb-md-0">
          <h5 class="mb-0">{{ $t('productComments.userComments') }}</h5>
        </b-col>

        <b-col md="auto">
          <sort v-model="commentsSort" @change="refresh"/>
        </b-col>
      </b-row>

      <hr>

      <display just-submitted :value="submitted"/>

      <display :value="comments" :authorization="allowUnauthorizedComments"/>

      <div v-if="total > comments.length" class="d-flex">
        <b-pagination
          class="mx-auto pagination-light"
          :total-rows="total"
          :per-page="$config.defaultPageSize"
          v-model="page"
        />
      </div>
    </template>

    <b-modal
      ref="login"
      centered
      hide-header
      hide-footer
      :size="registerViaPasswordEnabled ? 'lg' : 'md'"
      body-class="p-0"
    >
      <login no-redirect in-component event-append="Comments"/>
    </b-modal>
  </div>
</template>

<script>
import vm from '@/lib/vm'
import Settings from '@/mixins/settings'
import Login from '@/components/account/login'
import Display from './Display'
import Editor from './Editor'
import Sort from './Sort'

export default {
  name: 'Comments',
  components: {
    Display,
    Editor,
    Login,
    Sort
  },
  mixins: [Settings],
  props: {
    item: Object,
    rateItems: Array,
    commentEnabled: { type: Boolean, default: false },
    rateEnabled: { type: Boolean, default: false },
    total: Number,
    comments: Array,
    rates: Object
  },
  data () {
    return {
      initializing: false,
      showEditor: false,
      submitted: [],
      commentsSort: 'created',
      page: 1
    }
  },
  computed: {
    account () {
      return this.$store.state.$account
    },
    allowUnauthorizedComments () {
      return this.$store.state.$settings.products.allowUnauthorizedComments
    }
  },
  watch: {
    'page' () {
      this.refresh()
    }
  },
  mounted () {
    vm.$on('showLoginModal', () => {
      if (this.$refs.login) this.$refs.login.show()
    })

    vm.$on('loggedInComments', () => {
      if (this.$refs.login) {
        this.$refs.login.hide()
        this.toggleEditor()
      }
    })
  },
  beforeDestroy () {
    vm.$off('showLoginModal')
    vm.$off('loggedIn')
  },
  methods: {
    toggleEditor () {
      this.showEditor = !this.showEditor
    },
    submitNew () {
      if (this.allowUnauthorizedComments || this.account)
        this.toggleEditor()

      else {
        this.$refs.login.show()
      }
    },
    getRateValue (item) {
      let rate = null

      if (item === 0)
        rate = this.$t('shared.veryBad')

      else if (item > 0 && item <= 2.5)
        rate = this.$t('shared.bad')

      else if (item > 2.5 && item <= 5)
        rate = this.$t('shared.normal')

      else if (item > 5 && item <= 7.5)
        rate = this.$t('shared.good')

      else if (item > 7.5 && item <= 10)
        rate = this.$t('shared.excellent')

      return rate
    },
    addSubmitted (val) {
      if (val)
        this.submitted.push(val)

      this.toggleEditor()
      this.refresh()
    },
    refresh () {
      this.initializing = true

      const promises = []

      promises.push(this.commentEnabled ? this.getCommentsCount() : NaN)
      promises.push(this.commentEnabled ? this.getComments() : null)
      promises.push(this.rateEnabled ? this.getRates() : null)

      Promise.all(promises)
      .then(all => {
        vm.$emit('setComments', { total: all[0], comments: all[1], rates: all[2] })
        vm.$emit('resetRateItems')
        this.initializing = false
      })
      .catch(err => {
        this.$showError(this.$getLocaleErrorMessage(err, 'productComments'))
      })
    },
    filter (isCount) {
      const filter = {}

      if (!isCount) {
        filter.skip = ((this.page - 1) * this.$config.defaultPageSize)
        filter.limit = this.$config.defaultPageSize
      }

      filter.status = 1
      filter.sort = this.commentsSort
      filter.include = 'User'
      filter.productId = this.item.id

      return filter
    },
    getCommentsCount () {
      return this.$api.productComments.count(this.filter(true), true)
    },
    getComments () {
      return this.$api.productComments.getAll(this.filter(false), true)
    },
    getRates () {
      return this.$api.productRates.getAll(this.item.id, null, true)
    }
  }
}
</script>
