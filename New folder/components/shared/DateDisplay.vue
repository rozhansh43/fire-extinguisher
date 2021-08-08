<template>
  <span v-if="moment">
    <span v-if="value && countdown" :dir="countdownLabels ? ($dir.ltr ? 'ltr' : 'rtl') : 'ltr'">
      <font-awesome-icon
        v-if="iconClass"
        icon="calendar-alt"
        :size="iconSize"
        :class="[iconClass, { 'mr-1': $dir.ltr || !countdownLabels, 'ml-1': $dir.rtl && countdownLabels }]"
      />

      <template v-if="countdownTime.days">
        {{ countdownTime.days }}
        
        <template v-if="countdownLabels">
          {{ $t('shared.days') }}
          {{ $t('shared.and') }}
        </template>

        <template v-else>
          :
        </template>
      </template>

      <template v-if="countdownTime.hours">
        {{ countdownTime.hours }}

        <template v-if="countdownLabels">
          {{ $t('shared.hours') }}
          {{ $t('shared.and') }}
        </template>

        <template v-else>
          :
        </template>
      </template>

      <template v-if="countdownTime.minutes">
        {{ countdownTime.minutes }}

        <template v-if="countdownLabels">
          {{ $t('shared.minutes') }}
          {{ $t('shared.and') }}
        </template>

        <template v-else>
          :
        </template>
      </template>

      <template v-if="countdownTime.seconds">
        {{ countdownTime.seconds }}

        <template v-if="countdownLabels">
          {{ $t('shared.seconds') }}
        </template>
      </template>
    </span>
    
    <span v-else-if="value && relative">
      <font-awesome-icon
        v-if="iconClass"
        icon="calendar-alt"
        :size="iconSize"
        :class="[iconClass, {'mr-1': $dir.ltr, 'ml-1': $dir.rtl}]"
      />
    </span>
    
    <span v-else-if="value && humanize">
      <font-awesome-icon
        v-if="iconClass"
        icon="calendar-alt"
        :size="iconSize"
        :class="[iconClass, {'mr-1': $dir.ltr, 'ml-1': $dir.rtl}]"
      />
      
      <span>
        {{ humanizedTime }}
      </span>
    </span>
    
    <span v-else-if="value">
      <template v-if="date">
        <font-awesome-icon
          v-if="iconClass"
          icon="calendar-alt"
          :size="iconSize"
          :class="[iconClass, {'mr-1': $dir.ltr, 'ml-1': $dir.rtl}]"
        />
        
        <span>
          {{ dateV }}
        </span>
      </template>
      
      <span
        v-if="time"
        :class="{'ml-2': $dir.ltr && date, 'mr-2': $dir.rtl && date}"
      >
        <font-awesome-icon
          v-if="iconClass"
          icon="clock"
          :size="iconSize"
          :class="[iconClass, {'mr-1': $dir.ltr, 'ml-1': $dir.rtl}]"
        />
        
        <span>
          {{ timeV }}
        </span>
      </span>
    </span>
  </span>
</template>

<script>
import moment from 'moment-jalaali'
import setMomentLocale from '@/mixins/set-moment-locale'

export default {
  name: 'DateDisplay',
  mixins: [setMomentLocale],
  props: {
    value: String,
    relative: { type: Boolean, default: false },
    countdown: { type: Boolean, default: false },
    countdownLabels: { type: Boolean, default: false },
    humanize: { type: Boolean, default: false },
    date: { type: Boolean, default: true },
    time: { type: Boolean, default: false },
    dateFormat: { type: String, default: 'YYYY/M/D' },
    timeFormat: { type: String, default: 'HH:mm' },
    iconClass: { type: String, default: 'text-info' },
    iconSize: String
  },
  data () {
    return {
      moment: null,
      interval: null
    }
  },
  computed: {
    dateFormatV () {
      if (this.$config.locale === 'fa')
        return this.dateFormat.replace(/Y+|M+|D+/g, (m) => `j${m}`)
      else
        return this.dateFormat
    },
    dateV () {
      if (this.value)
        return this.moment.format(this.dateFormatV)
      else
        return null
    },
    timeV () {
      if (this.value)
        return this.moment.format(this.timeFormat)
      else
        return null
    },
    relativeTime () {
      return this.moment.fromNow()
    },
    countdownTime () {
      const days = this.moment.diff(new Date(), 'days')
      const hours = this.moment.diff(new Date(), 'hours')
      const minutes = this.moment.diff(new Date(), 'minutes')
      const seconds = this.moment.diff(new Date(), 'seconds')
      
      return {
        days,
        hours: hours - (days * 24),
        minutes: minutes - (hours * 60),
        seconds: seconds - (minutes * 60)
      }
    },
    humanizedTime () {
      if (this.time) {
        return this.moment.calendar()
      } else {
        return this.moment.calendar(null, {
          sameDay: `[${this.$t('forms.today')}]`,
          nextDay: `[${this.$t('forms.tomorrow')}]`,
          nextWeek: 'dddd',
          lastDay: `[${this.$t('forms.yesterday')}]`,
          lastWeek: this.$t('forms.lastWeekDay'),
          sameElse: this.dateFormatV
        })
      }
    }
  },
  watch: {
    value (val, oldVal) {
      if (val !== oldVal) this.init()
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.setMoment()
      if (this.countdown) this.interval = setInterval(() => this.setMoment(), 1000)
      else if (this.relative) this.interval = setInterval(() => this.setMoment(), 60000)
    },
    setMoment () {
      this.moment = this.value ? moment(this.value, 'YYYY-MM-DDTHH:mm:ss.SSSZ') : null
      
      if (this.moment.diff(new Date()) <= 0) {
        clearInterval(this.interval)
        this.$emit('over')
      }
    }
  }
}
</script>
