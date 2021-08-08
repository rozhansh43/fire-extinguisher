<template>
  <div>
    <h2 v-if="widget.title && !titleInHeader" class="widget-title h4 text-center mb-5">
      {{ widget.title }}
    </h2>
<h1>
      notificationSubscription
    </h1>
    <p v-if="widget.subtitle && !titleInHeader" class="widget-subtitle text-center mb-5 text-muted">
      {{ widget.subtitle }}
    </p>
    
    <b-card no-body>
      <b-card-header
        v-if="titleInHeader && (widget.title || widget.url)"
        class="d-flex align-items-center"
        :class="widget.title ? 'justify-content-between' : 'justify-content-end'"
        header-bg-variant="bright"
      >
        <div v-if="widget.title || widget.subtitle">
          <div v-if="widget.title">
            {{ widget.title }}
          </div>

          <small v-if="widget.subtitle" class="text-muted">
            {{ widget.subtitle }}
          </small>
        </div>

        <b-link
          v-if="widget.url"
          :to="widget.url"
          class="inherited-link"
        >
          <font-awesome-icon
            icon="plus"
            size="sm"
            class="align-middle"
            :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
          />

          {{ $t('shared.more') }}
        </b-link>
      </b-card-header>

      <b-card-body v-if="widget.emailEnabled || widget.phoneNumberEnabled" class="pb-0">
        <b-alert :show="errors.any()" variant="danger" class="px-4">
          <ul class="m-0 px-1">
            <li v-for="err in errors.all()" :key="err">{{err}}</li>
          </ul>
        </b-alert>

        <b-row>
          <b-col v-if="widget.emailEnabled" :lg="widget.phoneNumberEnabled ? 6 : 12">
            <b-form-group>
              <label :for="`email-${widget.id}`" class="text-muted">
                {{ $t('shared.email') }} :
                <required-symbol/>
              </label>

              <b-form-input
                :id="`email-${widget.id}`"
                dir="ltr"
                placeholder="example@mail.com"
                :name="$t('shared.email')"
                v-validate="'required|email|max:254'"
                v-model="model.email"
              />
            </b-form-group>
          </b-col>

          <b-col v-if="widget.phoneNumberEnabled" :lg="widget.emailEnabled ? 6 : 12">
            <b-form-group>
              <label :for="`phoneNumber-${widget.id}`" class="text-muted">
                {{ $t('shared.mobile') }} :
                <required-symbol/>
              </label>

              <b-input-group>
                <b-input-group-prepend v-if="$dir.ltr" is-text>
                  {{ $config.country.phoneCode }}
                </b-input-group-prepend>

                <b-form-input
                  :id="`phoneNumber-${widget.id}`"
                  autocomplete="off"
                  dir="ltr"
                  placeholder="912xxxxxxx"
                  :name="$t('shared.mobile')"
                  v-validate="'required|digits:10'"
                  v-model="model.phoneNumber"
                />

                <b-input-group-append v-if="$dir.rtl" is-text dir="ltr">
                  {{ $config.country.phoneCode }}
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
      </b-card-body>

      <template v-slot:footer>
        <b-btn :disabled="progressing" variant="success" @click.prevent="submit">
          <font-awesome-icon
            :icon="progressing ? 'cog' : 'check'"
            :spin="progressing"
            class="align-middle"
            :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
          />

          {{ widget.buttonLabel }}
        </b-btn>
      </template>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'NotificationSubscriptionDefault',
  props: {
    widget: { required: true }
  },
  data () {
    return {
      progressing: false,
      model: {
        email: null,
        phoneNumber: null,
        tag: null,
        sendSmsEnabled: false,
        sendEmailEnabled: false
      }
    }
  },
  computed: {
    titleInHeader () {
      return this.hasClass('title-in-header')
    }
  },
  methods: {
    hasClass (key) {
      return this.widget.viewData && this.widget.viewData.includes(key)
    },
    submit () {
      this.$validator.validateAll()
      .then(isValid => {
        if (isValid) {
          this.progressing = true

          if (this.model.email === '') this.model.email = null
          if (this.model.phoneNumber === '') this.model.phoneNumber = null

          this.model.tag = this.widget.tag
          this.model.sendEmailEnabled = !!this.model.email
          this.model.sendSmsEnabled = !!this.model.phoneNumber

          this.$api.notificationSubscription.subscribe(this.model, true)
          .then(() => {
            this.model.email = null
            this.model.phoneNumber = null

            this.$validator.reset()

            this.$showSuccess(this.$t('shared.yourRequestSent'))
            this.progressing = false
          })
          .catch(err => {
            this.$showError(this.$getLocaleErrorMessage(err, 'shared'))
            this.progressing = false
          })
        }
      })
    }
  }
}
</script>
