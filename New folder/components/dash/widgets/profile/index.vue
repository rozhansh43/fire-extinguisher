<template>
  <div>
    <title-display :title="$t('account.profile')" icon="id-card"/>

    <b-card no-body footer-class="p-0">
      <div v-if="initializing" class="text-center p-4">
        <font-awesome-icon spin icon="circle-notch" class="text-moremuted display-3"/>
      </div>

      <template v-else>
        <b-row no-gutters>
          <b-col md="6" class="border-bottom">
            <div class="pt-4 px-4 pb-2">
              <div class="text-muted mb-3">
                {{ $t('account.firstName') }} :
              </div>

              <h5>
                <template v-if="value.firstName">
                  {{ value.firstName }}
                </template>

                <template v-else>
                  &nbsp;
                </template>
              </h5>
            </div>
          </b-col>
          
          <b-col md="6" :class="{ 'border-md-left': $dir.ltr, 'border-md-right': $dir.rtl }" class="border-bottom">
            <div class="pt-4 px-4 pb-2">
              <div class="text-muted mb-3">
                {{ $t('account.lastName') }} :
              </div>

              <h5>
                <template v-if="value.lastName">
                  {{ value.lastName }}
                </template>

                <template v-else>
                  &nbsp;
                </template>
              </h5>
            </div>
          </b-col>

          <b-col md="6" class="border-bottom">
            <div class="pt-4 px-4 pb-2">
              <div class="d-flex align-items-center mb-3">
                <span class="text-muted">
                  {{ $t('account.email') }} :
                </span>

                <small
                  v-if="value.email"
                  class="rounded-pill px-2 py-1 mx-2 shadow-sm"
                  :class="userStatus.emailConfirmed ? 'bg-success' : 'bg-warning'"
                >
                  <template v-if="userStatus.emailConfirmed">
                    {{ $t('account.approved') }}
                  </template>

                  <template v-else>
                    {{ $t('account.disapproved') }}
                  </template>
                </small>
              </div>

              <h5 dir="ltr" class="text-truncate">
                <template v-if="value.email">
                  {{ value.email }}
                </template>

                <template v-else>
                  &nbsp;
                </template>
              </h5>
            </div>
          </b-col>

          <b-col md="6" :class="{ 'border-md-left': $dir.ltr, 'border-md-right': $dir.rtl }" class="border-bottom">
            <div class="pt-4 px-4 pb-2">
              <div class="d-flex align-items-center mb-3">
                <span class="text-muted">
                  {{ $t('account.phoneNumber') }} :
                </span>

                <small
                  v-if="value.phoneNumber"
                  class="rounded-pill px-2 py-1 mx-2 shadow-sm"
                  :class="userStatus.phoneNumberConfirmed ? 'bg-success' : 'bg-warning'"
                >
                  <template v-if="userStatus.phoneNumberConfirmed">
                    {{ $t('account.approved') }}
                  </template>

                  <template v-else>
                    {{ $t('account.disapproved') }}
                  </template>
                </small>
              </div>

              <h5 dir="ltr">
                <template v-if="value.phoneNumber">
                  {{ $config.country.phoneCode }}{{ value.phoneNumber }}
                </template>

                <template v-else>
                  &nbsp;
                </template>
              </h5>
            </div>
          </b-col>

          <b-col :md="showCompanyName ? 6 : 12">
            <div class="pt-4 px-4 pb-2">
              <div class="text-muted mb-3" style="margin-top: .2rem">
                {{ $t('account.person') }} :
              </div>

              <h5 style="padding-bottom: .2rem">
                <template v-if="value.legality">
                  {{ $t('account.legal') }}
                </template>

                <template v-else>
                  {{ $t('account.individual') }}
                </template>
              </h5>
            </div>
          </b-col>

          <b-col
            v-if="showCompanyName"
            md="6"
            :class="{ 'border-md-left': $dir.ltr, 'border-md-right': $dir.rtl }"
          >
            <div class="pt-4 px-4 pb-2">
              <div class="text-muted mb-3" style="margin-top: .2rem">
                {{ $t('account.companyName') }} :
              </div>

              <h5 style="padding-bottom: .2rem">
                {{ value.companyName }}
              </h5>
            </div>
          </b-col>
        </b-row>
      </template>

      <template v-if="!initializing" v-slot:footer>
        <b-link
          class="inherited-link d-block py-2 px-3 text-center"
          to="/dash/account/profile"
        >
          <div class="py-1">
            {{ $t('account.editProfile') }}

            <font-awesome-icon
              :icon="$dir.ltr ? 'angle-right' : 'angle-left'"
              class="align-middle"
              :class="{ 'ml-1': $dir.ltr, 'mr-1': $dir.rtl }"
            />
          </div>
        </b-link>
      </template>
    </b-card>
  </div>
</template>

<script>
import TitleDisplay from '@/components/dash/shared/TitleDisplay'

export default {
  name: 'ProfileWidget',
  components: {
    TitleDisplay
  },
  data () {
    return {
      initializing: true,
      value: null
    }
  },
  computed: {
    showCompanyName () {
      return this.value.legality && this.value.companyName
    },
    userStatus () {
      return this.$store.state.$userStatus
    }
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
