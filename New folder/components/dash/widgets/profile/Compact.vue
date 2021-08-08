<template>
  <div class="bg-bright pt-3 px-3 pb-2">
    <div v-if="initializing" class="text-center mb-2">
      <font-awesome-icon spin icon="circle-notch" class="text-moremuted display-4"/>
    </div>

    <template v-else>
      <b-link to="/dash/account/profile" class="inherited-link">
        <b-row class="align-items-center justify-content-center">
          <b-col cols="auto" class="mb-3">
            <thumbnail
              v-if="$account.image"
              :path="$account.image"
              :link="false"
              :width="70"
              :height="70"
              class="rounded-circle"
            />

            <font-awesome-icon
              v-else
              icon="user-circle"
              class="text-moremuted display-3"
            />
          </b-col>

          <b-col>
            <h5 class="mb-2">
              <template v-if="value.firstName || value.lastName">
                {{ value.firstName }} {{ value.lastName }}
              </template>

              <template v-else>
                {{ $t('shared.dashboard') }}
              </template>
            </h5>
            

            <p v-if="value.phoneNumber" dir="ltr" class="text-muted mb-2">
              {{ $config.country.phoneCode }}{{ value.phoneNumber }}
            </p>

            <p v-if="value.email" dir="ltr" class="text-truncate text-muted mb-2">
              {{ value.email }}
            </p>
          </b-col>
        </b-row>
      </b-link>
    </template>
  </div>
</template>

<script>
import Thumbnail from '@/components/shared/Thumbnail'
import { mapState } from 'vuex'

export default {
  name: 'ProfileCompactWidget',
  components: {
    Thumbnail
  },
  data () {
    return {
      initializing: true,
      value: null
    }
  },
  computed: {
    ...mapState(['$account'])
  },
  mounted () {
    this.getProfile()
    .then(() => {
      this.initializing = false
    })
  },
  methods: {
    getProfile () {
      return this.$api.account.getProfile()
      .then(res => {
        this.value = res
        return this.value
      })
      .catch(err => {
        this.$showError(this.$getLocaleErrorMessage(err, 'account'))
        return false
      })
    }
  }  
}
</script>
