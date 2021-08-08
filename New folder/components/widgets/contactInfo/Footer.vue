<template>
  <div v-if="hasAnyData">
    <h2 v-if="widget.title" class="widget-title h4 mb-4">
      {{ widget.title }}
    </h2>

    <p v-if="widget.subtitle" class="mb-4 text-muted">
      {{ widget.subtitle }}
    </p>

    <p v-if="data.phoneNumber">
      <span class="text-muted">
        {{ $t('widgets.contactInfo.phoneNumber') }} :
      </span>
      
      <bdi>{{ data.phoneNumber }}</bdi>
    </p>

    <p v-if="data.address">
      <span class="text-muted">
        {{ $t('widgets.contactInfo.address') }} :
      </span>
      
      <bdi class="text-pre">{{ data.address }}</bdi>
    </p>

    <b-row class="justify-content-center">
      <b-col v-if="data.whatsapp" cols="auto" class="mb-3">
        <b-link
          class="d-block"
          :href="data.whatsapp"
          target="_blank"
          :title="$t('widgets.contactInfo.whatsapp')"
          v-b-tooltip
          rel="nofollow"
        >
          <b-img
            width="50"
            height="50"
            src="/img/contact-icons/whatsapp.png"
            :alt="$t('widgets.contactInfo.whatsapp')"
            class="rounded-circle"
          />
        </b-link>
      </b-col>

      <b-col v-if="data.telegram" cols="auto" class="mb-3">
        <b-link
          class="d-block"
          :href="data.telegram"
          target="_blank"
          :title="$t('widgets.contactInfo.telegram')"
          v-b-tooltip
          rel="nofollow"
        >
          <b-img
            width="50"
            height="50"
            src="/img/contact-icons/telegram.png"
            :alt="$t('widgets.contactInfo.telegram')"
            class="rounded-circle"
          />
        </b-link>
      </b-col>

      <b-col v-if="data.instagram" cols="auto" class="mb-3">
        <b-link
          class="d-block"
          :href="data.instagram"
          target="_blank"
          :title="$t('widgets.contactInfo.instagram')"
          v-b-tooltip
          rel="nofollow"
        >
          <b-img
            width="50"
            height="50"
            src="/img/contact-icons/instagram.png"
            :alt="$t('widgets.contactInfo.instagram')"
            class="rounded-circle"
          />
        </b-link>
      </b-col>

      <b-col v-if="data.twitter" cols="auto" class="mb-3">
        <b-link
          class="d-block"
          :href="data.twitter"
          target="_blank"
          :title="$t('widgets.contactInfo.twitter')"
          v-b-tooltip
          rel="nofollow"
        >
          <b-img
            width="50"
            height="50"
            src="/img/contact-icons/twitter.png"
            :alt="$t('widgets.contactInfo.twitter')"
            class="rounded-circle"
          />
        </b-link>
      </b-col>

      <b-col v-if="data.youtube" cols="auto" class="mb-3">
        <b-link
          class="d-block"
          :href="data.youtube"
          target="_blank"
          :title="$t('widgets.contactInfo.youtube')"
          v-b-tooltip
          rel="nofollow"
        >
          <b-img
            width="50"
            height="50"
            src="/img/contact-icons/youtube.png"
            :alt="$t('widgets.contactInfo.youtube')"
            class="rounded-circle"
          />
        </b-link>
      </b-col>

      <b-col v-if="data.aparat" cols="auto" class="mb-3">
        <b-link
          class="d-block"
          :href="data.aparat"
          target="_blank"
          :title="$t('widgets.contactInfo.aparat')"
          v-b-tooltip
          rel="nofollow"
        >
          <b-img
            width="50"
            height="50"
            src="/img/contact-icons/aparat.png"
            :alt="$t('widgets.contactInfo.aparat')"
            class="rounded-circle"
          />
        </b-link>
      </b-col>

      <b-col v-if="data.facebook" cols="auto" class="mb-3">
        <b-link
          class="d-block"
          :href="data.facebook"
          target="_blank"
          :title="$t('widgets.contactInfo.facebook')"
          v-b-tooltip
          rel="nofollow"
        >
          <b-img
            width="50"
            height="50"
            src="/img/contact-icons/facebook.png"
            :alt="$t('widgets.contactInfo.facebook')"
            class="rounded-circle"
          />
        </b-link>
      </b-col>

      <b-col v-if="data.linkedin" cols="auto" class="mb-3">
        <b-link
          class="d-block"
          :href="data.linkedin"
          target="_blank"
          :title="$t('widgets.contactInfo.linkedin')"
          v-b-tooltip
          rel="nofollow"
        >
          <b-img
            width="50"
            height="50"
            src="/img/contact-icons/linkedin.png"
            :alt="$t('widgets.contactInfo.linkedin')"
            class="rounded-circle"
          />
        </b-link>
      </b-col>

      <b-col v-if="data.email" cols="auto" class="mb-3">
        <b-link
          class="d-block"
          :href="`mailto:${data.email}`"
          target="_blank"
          :title="$t('widgets.contactInfo.email')"
          v-b-tooltip
          rel="nofollow"
        >
          <b-img
            width="50"
            height="50"
            src="/img/contact-icons/email.png"
            :alt="$t('widgets.contactInfo.email')"
            class="rounded-circle"
          />
        </b-link>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'ContactInfoFooter',
  props: {
    widget: { required: true }
  },
  computed: {
    data () {
      return this.$store.state.$settings.branding.data
    },
    hasAnyData () {
      return !!(this.data && Object.keys(this.data) && Object.keys(this.data).length)
    }
  }
}
</script>
