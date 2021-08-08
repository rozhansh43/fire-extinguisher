<template>
  <footer class="shadow-sm">
    <b-container v-if="widgets && widgets.length" class="py-5">
      <widgets :widgets="widgets" class="row"/>
    </b-container>

    <b-container>
      <div class="sigbar small pt-3">
        <b-row class="align-items-center">
          <b-col class="mb-3">
            {{ $t('layout.copyright', { siteName: $store.state.$settings.branding.name }) }}
          </b-col>
          
          <b-col md="auto" class="mb-3">
            <b-link
              href="https://persina.com/"
              target="_blank"
              class="inherited-link"
              :class="{ 'ml-auto': $dir.ltr, 'mr-auto': $dir.rtl }"
            >
              {{ $t('layout.signature') }}
            </b-link>
          </b-col>
        </b-row>
      </div>
    </b-container>
  </footer>
</template>

<script>
import Widgets from '@/components/widgets'

export default {
  name: 'AppFooter',
  components: {
    Widgets
  },
  computed: {
    widgets () {
      return this.$store.state.$footerWidgets
    }
  }
}
</script>
