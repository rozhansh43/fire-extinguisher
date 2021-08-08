<template>
  <div v-if="moment && value" :dir="letters ? ($dir.ltr ? 'ltr' : 'rtl') : 'ltr'">
    <font-awesome-icon
      v-if="iconClass"
      icon="clock"
      class="align-middle"
      :class="[iconClass, { 'ml-1': $dir.ltr, 'mr-1': $dir.rtl }]"
    />

    <template v-if="time.days">
      {{ time.days }}

      <template v-if="letters">
        {{ $t('shared.days') }}
        {{ $t('shared.and') }}
      </template>

      <template v-else>
        :
      </template>
    </template>

    <template v-if="(time.hours !== null && !letters) || time.hours">
      {{ time.hours }}

      <template v-if="letters">
        {{ $t('shared.hours') }}
        {{ $t('shared.and') }}
      </template>

      <template v-else>
        :
      </template>
    </template>

    <template v-if="(time.minutes !== null && !letters) || time.minutes">
      {{ time.minutes }}

      <template v-if="letters">
        {{ $t('shared.minutes') }}
        {{ $t('shared.and') }}
      </template>

      <template v-else>
        :
      </template>
    </template>

    <template v-if="(time.seconds !== null && !letters) || time.seconds">
      {{ time.seconds }}

      <template v-if="letters">
        {{ $t('shared.seconds') }}
      </template>
    </template>
  </div>
</template>

<script>
import moment from 'moment-jalaali'
import setMomentLocale from '@/mixins/set-moment-locale'

export default {
  name: 'Countdown',
  mixins: [setMomentLocale],
  props: {
    value: String,
    letters: { type: Boolean, default: false },
    iconClass: { type: String, default: 'text-info' }
  },
  data () {
    return {
      moment: null,
      interval: null
    }
  },
  computed: {
    time () {
      const days = this.moment.diff(new Date(), 'days')
      const hours = this.moment.diff(new Date(), 'hours')
      const minutes = this.moment.diff(new Date(), 'minutes')
      const seconds = this.moment.diff(new Date(), 'seconds')

      return {
        days,
        hours: this.normalizedNumber(hours - (days * 24)),
        minutes: this.normalizedNumber(minutes - (hours * 60)),
        seconds: this.normalizedNumber(seconds - (minutes * 60))
      }
    }
  },
  created () {
    this.setMoment()
    this.interval = setInterval(() => this.setMoment(), 1000)
  },
  methods: {
    setMoment () {
      this.moment = this.value ? moment(this.value, 'YYYY-MM-DDTHH:mm:ss.SSSZ') : null

      if (this.moment.diff(new Date()) <= 0) {
        clearInterval(this.interval)
        this.$emit('over')
      }
    },
    normalizedNumber (number) {
      return (number).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping:false })
    }
  }
}
</script>
