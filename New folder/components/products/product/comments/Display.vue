<template>
  <div>
    <b-card v-for="item in value" :key="item.id" bg-variant="bright" class="mb-3 shadow-none" body-class="px-4 pt-4 pb-0">
      <b-alert :show="justSubmitted" variant="warning">
        {{ $t('productComments.commentSubmitted') }}.
      </b-alert>

      <b-row class="align-items-center">
        <b-col md="3" class="mb-4">
          <h6>{{ item.name }}</h6>

          <date-display :value="item.created" time class="small text-muted" icon-class="text-muted"/>
        </b-col>

        <b-col>
          <p class="text-pre-line text-justify mb-4">
            {{ item.body }}
          </p>

          <b-row v-if="item.pros && item.pros.length" class="text-info mb-4">
            <b-col md="auto" class="mb-2 mb-md-0" :class="{'mr-2': $dir.ltr, 'ml-2': $dir.rtl}">
              {{ $t('productComments.strengthPoints') }}
            </b-col>

            <b-col>
              <ul class="mb-0">
                <li v-for="(pros, index) in item.pros" :key="index">
                  <span class="text-dark">
                    {{ pros }}
                  </span>
                </li>
              </ul>
            </b-col>
          </b-row>

          <b-row v-if="item.cons && item.cons.length" class="text-danger mb-4">
            <b-col md="auto" class="mb-2 mb-md-0">
              {{ $t('productComments.weaknessPoints') }}
            </b-col>

            <b-col>
              <ul class="mb-0">
                <li v-for="(cons, index) in item.cons" :key="index">
                  <span class="text-dark">
                    {{ cons }}
                  </span>
                </li>
              </ul>
            </b-col>
          </b-row>

          <b-card
            v-if="item.response"
            :header="$t('productComments.response')"
            header-bg-variant="light"
            header-class="border-bottom"
            bg-variant="light"
            class="mb-4 shadow-none"
          >
            <p class="text-pre-line text-justify mb-0">
              {{ item.response }}
            </p>
          </b-card>

          <fav-buttons v-if="!justSubmitted" :item="item" :authorization="authorization" class="mb-4"/>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import DateDisplay from '@/components/shared/DateDisplay'
import FavButtons from './FavButtons'

export default {
  name: 'Display',
  components: {
    DateDisplay,
    FavButtons
  },
  props: {
    value: Array,
    justSubmitted: { type: Boolean, default: false },
    authorization: { type: Boolean, default: false }
  }
}
</script>
