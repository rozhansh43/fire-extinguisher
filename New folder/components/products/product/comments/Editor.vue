<template>
  <div>
    <rating v-if="rateEnabled" v-model="rates" class="mb-4"/>

    <b-row>
      <b-col lg="6" :class="commentEnabled ? 'mb-4' : 'mb-3'">
        <template v-if="commentEnabled">
          <b-alert :show="errors.any()" variant="danger" class="px-4">
            <ul class="m-0 px-1">
              <li v-for="err in errors.all()" :key="err">{{err}}</li>
            </ul>
          </b-alert>

          <b-form-group>
            <label for="yourName">
              {{ $t('productComments.yourName') }} :
              <required-symbol/>
            </label>

            <b-input-group>
              <b-form-input
                id="yourName"
                :name="$t('productComments.yourName')"
                v-validate="'required|max:150'"
                v-model="model.name"
              >
              </b-form-input>
            </b-input-group>
          </b-form-group>

          <b-form-group>
            <label for="pros">
              <font-awesome-icon
                icon="circle"
                size="xs"
                class="text-info align-middle"
                :class="{'mr-1': $dir.ltr, 'ml-1': $dir.rtl}"
              />

              {{ $t('productComments.strengthPoints') }} :
            </label>

            <b-input-group>
              <b-form-tags
                input-id="pros"
                :placeholder="`${$t('shared.add')}...`"
                :add-button-text="$t('shared.add')"
                add-button-variant="light"
                tag-variant="info"
                tag-pills
                :tag-remove-label="$t('shared.remove')"
                :duplicate-tag-text="$t('shared.duplicateItem', { title: this.$t('shared.tag') })"
                :invalid-tag-text="$t('shared.invalidItem', { title: this.$t('shared.tag') })"
                separator=",،"
                remove-on-delete
                v-model="model.pros"
              />
            </b-input-group>
          </b-form-group>

          <b-form-group>
            <label for="cons">
              <font-awesome-icon
                icon="circle"
                size="xs"
                class="text-danger align-middle"
                :class="{'mr-1': $dir.ltr, 'ml-1': $dir.rtl}"
              />

              {{ $t('productComments.weaknessPoints') }} :
            </label>

            <b-input-group>
              <b-form-tags
                input-id="cons"
                :placeholder="`${$t('shared.add')}...`"
                :add-button-text="$t('shared.add')"
                add-button-variant="light"
                tag-variant="danger"
                tag-pills
                :tag-remove-label="$t('shared.remove')"
                :duplicate-tag-text="$t('shared.duplicateItem', { title: this.$t('shared.tag') })"
                :invalid-tag-text="$t('shared.invalidItem', { title: this.$t('shared.tag') })"
                separator=",،"
                remove-on-delete
                v-model="model.cons"
              />
            </b-input-group>
          </b-form-group>

          <b-form-group>
            <label for="body">
              {{ $t('productComments.body') }} :
              <required-symbol/>
            </label>

            <b-input-group>
              <b-textarea
                id="body"
                :rows="6"
                :name="$t('productComments.body')"
                v-validate="'required|max:5000'"
                v-model="model.body"
              />
            </b-input-group>
          </b-form-group>
        </template>

        <b-row>
          <b-col md="6" class="mb-2 mb-md-0">
            <b-btn block :disabled="progressing" variant="success" @click="submit">
              <font-awesome-icon
                :icon="progressing ? 'cog' : 'plus'"
                :spin="progressing"
                class="align-middle"
                :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
              />
              <template v-if="commentEnabled">
                {{ $t('productComments.submit') }}
              </template>

              <template v-else-if="rateEnabled">
                {{ $t('productComments.submitRate') }}
              </template>
            </b-btn>
          </b-col>

          <b-col md="6">
            <b-btn block variant="outline-silver" class="text-dark" @click="emitReturn">
              {{ $t('shared.return') }}

              <font-awesome-icon
                icon="arrow-left"
                class="align-middle"
                :class="{'ml-1': $dir.ltr, 'mr-1': $dir.rtl}"
              />
            </b-btn>
          </b-col>
        </b-row>
      </b-col>

      <b-col v-if="commentEnabled" lg="6" class="mb-4">
        <div class="h4 font-weight-normal">
          {{ $t('productComments.guideOthers') }}
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Rating from '@/components/shared/Rating'

export default {
  name: 'Editor',
  components: {
    Rating
  },
  props: {
    itemId: Number,
    rates: Array,
    commentEnabled: { type: Boolean, default: false },
    rateEnabled: { type: Boolean, default: false }
  },
  data () {
    return {
      progressing: false,
      model: {
        name: null,
        pros: [],
        cons: [],
        body: null
      }
    }
  },
  mounted () {
    if (this.commentEnabled)
      this.setName()
  },
  methods: {
    setName () {
      const account = this.$store.state.$account
      this.model.name = this.$api.account.getUserDisplayName(account)
    },
    emitReturn () {
      this.$emit('return')
    },
    submit () {
      this.$validator.validateAll()
      .then(isValid => {
        if (isValid) {
          this.progressing = true

          const promises = []

          promises.push(this.commentEnabled ? this.$api.productComments.submit(this.itemId, this.model, true) : null)

          if (this.rateEnabled) {
            const rates = {}

            for (let i = 1; i < 7; i++) {
              const item = this.rates.find(o => o.id === `r${i}`)
              rates[`r${i}`] = item ? item.rate.value : null
            }

            promises.push(this.$api.productRates.submit(this.itemId, rates, true))
          } else promises.push(null)

          Promise.all(promises)
          .then(all => {
            if (this.commentEnabled) {
              this.model.pros = []
              this.model.cons = []
              this.model.body = null
              this.$validator.reset()
            }

            this.$emit('submitted', all && all[0])
            this.progressing = false
            this.commentEnabled ? this.$showSuccess(this.$t('productComments.commentSubmitted')) : this.$showSuccess(this.$t('productComments.rateSubmitted'))
          })
          .catch(err => {
            this.progressing = false
            this.$showError(this.$getLocaleErrorMessage(err, 'productComments'))
          })
        }
      })
    }
  }
}
</script>
