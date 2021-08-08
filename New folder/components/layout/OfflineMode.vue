<template>
  <div class="app flex-row align-items-center text-center ">
    <div class="container">
      <b-card body-class="py-5 px-3 px-lg-5">
        <b-link to="/" class="d-block">
          <thumbnail
            :path="$settings.branding.logo"
            :alt="$settings.branding.name"
            fit-in
            :width="208"
            :height="40"
            :link="false"
            :quality="90"
          />
          
          <h1 v-show="false">
            {{ $settings.branding.name }}
          </h1>
        </b-link>
        <h4 v-if="$offlineMode.title" class="mt-5">{{$offlineMode.title}}</h4>
        <p v-if="$offlineMode.message" class="mt-5 mb-0">{{$offlineMode.message}}</p>
      </b-card>
    </div>
  </div>
</template>

<script>
import Thumbnail from '@/components/shared/Thumbnail'
import { mapState } from 'vuex'

export default {
  name: 'OfflineMode',
  components: {
    Thumbnail
  },
  computed: {
    ...mapState(['$settings', '$offlineMode'])
  },
  head () {
    return {
      title: this.$settings.branding.name,
      titleTemplate: '%s',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$offlineMode.title
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.$settings.branding.name
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.$offlineMode.title
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.$settings.branding.name
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.$offlineMode.title
        }
      ]
    }
  }
}
</script>
