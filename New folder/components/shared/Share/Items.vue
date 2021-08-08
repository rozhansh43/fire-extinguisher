<template>
  <span>
    <div v-if="emailMode">
      <b-alert :show="errors.any()" variant="danger" class="px-4">
        <ul class="m-0 px-1">
          <li v-for="err in errors.all()" :key="err">
            {{ err }}
          </li>
        </ul>
      </b-alert>

      <div v-if="progressing" class="text-center">
        <font-awesome-icon
          spin
          icon="circle-notch"
          class="text-moremuted display-2"
        />
      </div>

      <div v-else>
        <b-form-group>
          <b-input-group>
            <b-input-group-prepend is-text>
              {{ $t('shared.yourName') }}
              <required-symbol/>
            </b-input-group-prepend>

            <b-form-input
              :name="$t('shared.yourName')"
              v-validate="'required'"
              v-model="model.name"
            />
          </b-input-group>
        </b-form-group>

        <b-form-group>
          <b-input-group>
            <b-input-group-prepend is-text>
              {{ $t('shared.yourFriendsEmail') }}
              <required-symbol/>
            </b-input-group-prepend>

            <b-form-input
              dir="ltr"
              :name="$t('shared.yourFriendsEmail')"
              v-validate="'required|email'"
              v-model="model.email"
            />
          </b-input-group>
        </b-form-group>

        <div class="d-flex justify-content-end">
          <b-btn :class="{'mr-1': $dir.ltr, 'ml-1': $dir.rtl}" @click="reset">
            {{ $t('shared.return') }}
          </b-btn>

          <b-btn variant="success" :disabled="progressing" @click="submit">
            {{ $t('shared.send') }}
          </b-btn>
        </div>
      </div>
    </div>

    <b-row v-else class="text-center" :class="{'compact': compact}">
      <b-col>
        <b-link
          target="_blank"
          rel="nofollow"
          class="text-muted d-block sci-link"
          :class="{ 'sci-telegram': !grayScale }"
          v-b-tooltip.hover="tooltip && $t('shared.social.telegram')"
          :href="`https://telegram.me/share/url?url=${url}?ref=telegram`"
        >
          <font-awesome-icon
            :icon="telegram"
            class="d-block mx-auto rounded-circle text-white sc-icon"
            :class="{'mb-2': compact, 'mb-3': !compact, 'text-dark bg-silver': grayScale}"
          />
          <small v-if="!tooltip" :class="{'h6 mb-0': !compact}">
            {{ $t('shared.social.telegram') }}
          </small>
        </b-link>
      </b-col>

      <b-col>
        <b-link
          target="_blank"
          rel="nofollow"
          class="text-muted d-block sci-link"
          :class="{ 'sci-facebook': !grayScale }"
          v-b-tooltip.hover="tooltip && $t('shared.social.facebook')"
          :href="`https://www.facebook.com/sharer/sharer.php?u=${url}`"
        >
          <font-awesome-icon
            :icon="facebook"
            class="d-block mx-auto rounded-circle text-white sc-icon"
            :class="{'mb-2': compact, 'mb-3': !compact, 'text-dark bg-silver': grayScale}"
          />
          <small v-if="!tooltip" :class="{'h6 mb-0': !compact}">
            {{ $t('shared.social.facebook') }}
          </small>
        </b-link>
      </b-col>

      <b-col>
        <b-link
          target="_blank"
          rel="nofollow"
          class="text-muted d-block sci-link"
          :class="{ 'sci-email': !grayScale }"
          v-b-tooltip.hover="tooltip && $t('shared.social.email')"
          @click="activateEmailMode"
        >
          <font-awesome-icon
            icon="envelope"
            class="d-block mx-auto rounded-circle text-white sc-icon"
            :class="{'mb-2': compact, 'mb-3': !compact, 'text-dark bg-silver': grayScale}"
          />
          <small v-if="!tooltip" :class="{'h6 mb-0': !compact}">
            {{ $t('shared.social.email') }}
          </small>
        </b-link>
      </b-col>

      <b-col>
        <b-link
          target="_blank"
          rel="nofollow"
          class="text-muted d-block sci-link"
          :class="{ 'sci-linkedin': !grayScale }"
          v-b-tooltip.hover="tooltip && $t('shared.social.linkedin')"
          :href="`https://www.linkedin.com/shareArticle?mini=true&url=${url}?ref=linkedin`"
        >
          <font-awesome-icon
            :icon="linkedin"
            class="d-block mx-auto rounded-circle text-white sc-icon"
            :class="{'mb-2': compact, 'mb-3': !compact, 'text-dark bg-silver': grayScale}"
          />
          <small v-if="!tooltip" :class="{'h6 mb-0': !compact}">
            {{ $t('shared.social.linkedin') }}
          </small>
        </b-link>
      </b-col>

      <b-col>
        <b-link
          target="_blank"
          rel="nofollow"
          class="text-muted d-block sci-link"
          :class="{ 'sci-twitter': !grayScale }"
          v-b-tooltip.hover="tooltip && $t('shared.social.twitter')"
          :href="`https://twitter.com/share?url=${url}?ref=twitter`"
        >
          <font-awesome-icon
            :icon="twitter"
            class="d-block mx-auto rounded-circle text-white sc-icon"
            :class="{'mb-2': compact, 'mb-3': !compact, 'text-dark bg-silver': grayScale}"
          />
          <small v-if="!tooltip" :class="{'h6 mb-0': !compact}">
            {{ $t('shared.social.twitter') }}
          </small>
        </b-link>
      </b-col>
    </b-row>
  </span>
</template>

<script>
import {
  faTelegramPlane,
  faLinkedinIn,
  faTwitter,
  faFacebookF
} from '@fortawesome/free-brands-svg-icons'

export default {
  name: 'ShareItems',
  props: {
    url: { type: String, required: true },
    title: { type: String, required: true },
    compact: { type: Boolean, default: false },
    grayScale: { type: Boolean, default: false },
    tooltip: { type: Boolean, default: false }
  },
  data() {
    return {
      telegram: faTelegramPlane,
      facebook: faFacebookF,
      linkedin: faLinkedinIn,
      twitter: faTwitter,
      emailMode: false,
      progressing: false,
      model: {
        name: null,
        email: null
      }
    }
  },
  methods: {
    activateEmailMode () {
      this.emailMode = true
    },
    reset () {
      this.emailMode = false
      this.model.name = null
      this.model.email = null
    },
    submit () {
      this.$validator.validateAll()
      .then(isValid => {
        if (isValid) {
          this.progressing = true
          this.$api.share.email(this.model.email, this.model.name, this.url, this.title)
          .then(() => {
            this.progressing = false
            this.$refs.modal.hide()
            this.reset()
            this.$showSuccess(this.$t('shared.yourMessageSent'))
          })
          .catch(() => {
            this.progressing = false
            this.$refs.modal.hide()
            this.reset()
          })
        }
      })
    }
  }
}
</script>
