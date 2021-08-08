<template>
  <div class="pdatepicker d-flex" :class="{ 'inline': inlineMode }">
    <b-input-group :size="size" class="flex-grow-1">
      <b-input-group-prepend v-if="label" is-text>
        {{ label }}
        <required-symbol v-if="required"/>
      </b-input-group-prepend>

      <b-input
        :id="id"
        :value="formatedChosenDate"
        :class="[inputClass, warnClass]"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        class="rounded"
        @click.native="inputClicked"
      />

      <a
        v-if="!noEmpty && formatedChosenDate"
        href="#"
        :class="{ 'empty': true, 'small': (size === 'sm') }"
        @click.prevent="empty"
      >
        <font-awesome-icon class="text-muted" icon="times-circle"/>
      </a>
    </b-input-group>

    <b-input-group
      v-if="time"
      class="time-picker"
      :class="{ 'mr-1': $dir.rtl, 'ml-1': $dir.ltr }"
    >
      <b-select
        :options="hours"
        :size="size"
        :class="[inputClass, warnClass]"
        v-model="chosenHour"
      />

      <b-input-group-append is-text>
        :
      </b-input-group-append>

      <b-select
        :size="size"
        :class="[inputClass, warnClass]"
        v-model="chosenMinute" :options="minutes"
      />
    </b-input-group>

    <transition :name="openTransitionAnimation">
      <div
        v-if="isDialogOpen"
        class="dialog"
        :class="{'dropup': dialogDropup, 'reverse': dialogReverse}"
        @click.stop
      >
        <transition name="fade">
          <b-card
            v-if="isDayView"
            body-class="p-0"
            header-class="p-0"
            class="day-view m-0"
          >
            <div class="dialog-month" slot="header">
              <div v-if="toggleEnabled" class="cal-toggle d-flex p-1">
                <div class="flex-grow-1 py-0 px-1 text-muted" :class="{ 'text-right': $dir.rtl, 'text-left': $dir.ltr }">
                  <small>
                    {{ $t(`forms.${cal}Cal`) }}
                  </small>
                </div>

                <b-btn size="sm" variant="outline-silver" @click.prevent="toggleCalendar">
                  <font-awesome-icon icon="exchange-alt" class="text-dark"/>
                </b-btn>
              </div>

              <div class="preMonth" @click="preMonthClicked">
                <font-awesome-icon :icon="$dir.ltr ? 'chevron-left' : 'chevron-right'"/>
              </div>

              <div class="monthName" @click="goToMonthSelect">
                {{ displayingMonth }} {{ numToStr(displayingYear) }}
              </div>

              <div class="nextMonth" @click="nextMonthClicked">
                <font-awesome-icon :icon="$dir.ltr ? 'chevron-right' : 'chevron-left'"/>
              </div>
            </div>

            <div class="dialog-days">
              <div v-for="dayName in dayNames" :key="dayName" class="day-box day-name bg-light">
                <span>
                  {{ dayName }}
                </span>
              </div>

              <div v-for="n in firstDayOfMonth" :key="'f' + n" class="day-box empty-box"></div>

              <div v-for="n in daysInMonth" :key="n"
                class="day-box"
                :class="{ 'disabled-day': !isDateInRange(n) , 'chosen-day': ifDayBoxIsChosenDay(n) }"
                @click="dayClicked(n)"
              >
                <span
                  class="hover-effect"
                  :class="{ 'bg-primary': ifDayBoxIsChosenDay(n), 'bg-light': !ifDayBoxIsChosenDay(n) }"
                ></span>

                <span class="num" :class="{ 'text-white': ifDayBoxIsChosenDay(n) }">
                  {{ numToStr(n) }}
                </span>
              </div>
            </div>
          </b-card>
        </transition>

        <transition name="fade">
          <b-card
            v-if="isMonthView"
            body-class="p-0"
            header-class="p-0"
            class="month-view m-0"
          >
            <div class="dialog-year" slot="header">
              <div v-if="toggleEnabled" class="cal-toggle d-flex p-1">
                <div class="flex-grow-1 py-0 px-1 text-muted" :class="{ 'text-right': $dir.rtl, 'text-left': $dir.ltr }">
                  <small>
                    {{ $t(`forms.${cal}Cal`) }}
                  </small>
                </div>

                <b-btn size="sm" variant="outline-silver" @click.prevent="toggleCalendar">
                  <font-awesome-icon icon="exchange-alt" class="text-dark"/>
                </b-btn>
              </div>

              <div class="preYear" @click="preYearClicked">
                <font-awesome-icon :icon="$dir.ltr ? 'chevron-left' : 'chevron-right'"/>
              </div>

              <div class="cyear" @click="goToYearSelect">
                {{ numToStr(displayingYear) }}
              </div>

              <div class="nextYear" @click="nextYearClicked">
                <font-awesome-icon :icon="$dir.ltr ? 'chevron-right' : 'chevron-left'"/>
              </div>
            </div>

            <div class="dialog-months">
              <div
                v-for="(n, i) in monthNames" :key="i"
                class="month-box"
                :class="{ 'chosen-month': ifMonthBoxChosenMonth(i) }"
                @click="monthClicked(i)"
              >
                <span
                  class="hover-effect"
                  :class="{'bg-primary': ifMonthBoxChosenMonth(i), 'bg-light': !ifMonthBoxChosenMonth(i)}"
                ></span>

                <span class="num" :class="{ 'text-white': ifMonthBoxChosenMonth(i) }">
                  {{ n }}
                </span>
              </div>
            </div>
          </b-card>
        </transition>

        <transition name="fade">
          <b-card
            v-if="isYearView"
            body-class="p-0"
            header-class="p-0"
            class="year-view m-0"
          >
            <div class="dialog-year" slot="header">
              <div v-if="toggleEnabled" class="cal-toggle d-flex p-1">
                <div class="flex-grow-1 py-0 px-1 text-muted" :class="{ 'text-right': $dir.rtl, 'text-left': $dir.ltr }">
                  <small>
                    {{ $t(`forms.${cal}Cal`) }}
                  </small>
                </div>

                <b-btn size="sm" variant="outline-silver" @click.prevent="toggleCalendar">
                  <font-awesome-icon icon="exchange-alt" class="text-dark"/>
                </b-btn>
              </div>
            </div>

            <div class="year-box"
              v-for="n in (cMaximumYear - cMinimumYear + 1)"
              :key="n"
              :id="'year-' + (n + cMinimumYear - 1)"
              :class="{ 'chosen-year': ifYearBoxChosenYear(n + cMinimumYear - 1) }"
              @click="yearClicked(n + cMinimumYear - 1)"
            >
              <span
                class="hover-effect"
                :class="{ 'bg-primary': ifYearBoxChosenYear(n + cMinimumYear - 1), 'bg-light': !ifYearBoxChosenYear(n + cMinimumYear - 1) }"
              >
              </span>

              <span class="num" :class="{ 'text-white': ifYearBoxChosenYear(n + cMinimumYear - 1) }">
                {{ numToStr(n + cMinimumYear - 1) }}
              </span>
            </div>
          </b-card>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import moment from 'moment-jalaali'
import setMomentLocale from '@/mixins/set-moment-locale'

export default {
  name: 'DatePicker',
  mixins: [setMomentLocale],
  props: {
    required: {type: Boolean, default: false},
    noEmpty: { type: Boolean, default: false },
    humanize: { type: Boolean, default: false },
    warn: { type: Boolean, default: false },
    dialogDropup: { default: false, type: Boolean },
    dialogReverse: { default: false, type: Boolean },
    time: { default: false, type: Boolean },
    inputClass: { default: null },
    label: { type: String },
    size: { type: String },
    placeholder: { type: String },
    minimumYear: { default: 1922, type: Number },
    maximumYear: { default: 2099, type: Number },
    disableDatesBeforeToday: { default: false, type: Boolean },
    disableDatesAfterToday: { default: false, type: Boolean },
    availableDateStart: { type: String },
    availableDateEnd: { type: String },
    value: { default: '' },
    name: { default: '', type: String },
    id: { default: '', type: String },
    initialView: {
      default: 'day',
      type: String,
      validator (value) {
        return value === 'day' || value === 'month'
      }
    },
    inlineMode: { default: false, type: Boolean },
    disabled: { type: Boolean, default: false},
    formatDate: {
      default: 'YYYY/MM/DD',
      type: String,
      validator (value) {
        const elements = value.split('/')
        if (elements.length !== 3) return false
        if (elements[0] !== 'YYYY' && elements[0] !== 'YY') return false
        if (elements[1] !== 'M' && elements[1] !== 'MM' && elements[1] !== 'MMM') return false
        if (elements[2] !== 'D' && elements[2] !== 'DD') return false
        return true
      }
    },
    openTransitionAnimation: { default: 'slide-fade', type: String }
  },
  data () {
    return {
      cal: null,
      availableDates: false,
      isDialogOpen: false,
      isDayView: true,
      isMonthView: false,
      isYearView: false,
      dayNames: [],
      monthNames: [],
      dayInThisMonth: 1,
      firstDayOfMonth: 0,
      daysInMonth: 30,
      displayingMonthNum: 1,
      displayingMonth: '',
      displayingYear: 2018,
      dayOfWeek: 0,
      formatedChosenDate: '',
      chosenMinute: null,
      chosenHour: null,
      chosenDay: 1,
      chosenMonth: 0,
      chosenYear: 2018,
      startAvailableDateV: moment([1922]),
      endAvailableDateV: moment([2099]).endOf('year'),
      hours: [],
      minutes: []
    }
  },
  computed: {
    warnClass () {
      let value = null
      const m = (this.value) ? moment(this.value, 'YYYY-MM-DDTHH:mm:ss.SSSZ') : null

      if (m && this.warn) {
        const today = moment().startOf('day')

        if (m.isBefore(today.subtract(1, 'days'))) value = 'dp-danger blink'
        else if (m.isSameOrBefore(today)) value = 'dp-danger'
        else if (m.isSameOrBefore(today.add(1, 'day'))) value = 'dp-warning'
      }
      return value
    },
    toggleEnabled () {
      return this.$config.calendars.length > 1
    },
    chosenDayDynamicStyle () {
      return {
        background: this.chosenDayColor
      }
    },
    isJ () {
      return (this.cal === 'jalali')
    },
    cMinimumYear () {
      const m = moment([this.minimumYear])
      const y = (this.isJ) ? m.jYear() : m.year()
      const a = (this.isJ) ? this.startAvailableDateV.jYear() : this.startAvailableDateV.year()
      return (a > y) ? a : y
    },
    cMaximumYear () {
      const m = moment([this.maximumYear])
      const y = (this.isJ) ? m.jYear() : m.year()
      const a = (this.isJ) ? this.endAvailableDateV.jYear() : this.endAvailableDateV.year()
      return (a < y) ? a : y
    }
  },
  watch: {
    value (value, oldValue) {
      if (value !== oldValue) {
        this.inputChanged(value, true)
      }
    },
    chosenHour () {
      if (this.inputCheck(this.value)) {
        this.dayClicked(this.chosenDay)
      }
    },
    chosenMinute () {
      if (this.inputCheck(this.value)) {
        this.dayClicked(this.chosenDay)
      }
    },
    availableDateStart () {
      this.checkAvailableDates()
    },
    availableDateEnd () {
      this.checkAvailableDates()
    }
  },
  mounted () {
    for (let i = 0; i < 24; i++) {
      this.hours.push(i)
    }
    for (let i = 0; i < 60; i++) {
      this.minutes.push(i)
    }

    this.checkAvailableDates()

    if (this.disableDatesBeforeToday) {
      this.availableDates = true

      const today = moment().startOf('day')

      if (this.startAvailableDateV.isBefore(today)) {
        this.startAvailableDateV = today
      }
    }

    if (this.disableDatesAfterToday) {
      this.availableDates = true

      const yesterday = moment().startOf('day').subtract(1, 'd')

      if (this.endAvailableDateV.isSameOrAfter(yesterday)) {
        this.endAvailableDateV = yesterday
      }
    }

    this.cal = this.$config.defaultCalendar
    this.init()

    if (this.inlineMode) {
      this.openDialog()
    }

    if (!this.inlineMode) {
      document.documentElement.addEventListener('click', this.onExit, false)
    }
  },
  beforeDestroy: function () {
    if (!this.inlineMode) {
      document.documentElement.removeEventListener('click', this.onExit, false)
    }
  },
  methods: {
    checkAvailableDates () {
      if (this.availableDateStart || this.availableDateEnd) {
        const availableDateStart = this.availableDateStart || new Date(1922, 0, 1).toISOString()
        const availableDateEnd = this.availableDateEnd || new Date(2100, 11, 31).toISOString()
        this.availableDates = true

        this.startAvailableDateV = moment(availableDateStart, 'YYYY-MM-DDTHH:mm:ss.SSSZ')

        this.endAvailableDateV = moment(availableDateEnd, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
      }
    },
    toggleCalendar () {
      if (this.cal === 'jalali') this.cal = 'gregorian'
      else this.cal = 'jalali'

      this.openDialog()
      this.init(true)
    },
    init (dontUpdateInput) {
      const locale = this.isJ ? 'fa' : 'en'
      moment.locale(locale)

      this.dayNames = moment.weekdaysMin()
      if (this.isJ) {
        this.dayNames.splice(0, 0, this.dayNames[6])
        this.dayNames.splice(7, 1)
      }

      this.monthNames = this.isJ ? moment.localeData()._jMonths : moment.months()

      if (this.inputCheck(this.value)) {
        this.inputChanged(this.value, dontUpdateInput)
      } else if (this.isTodayInRange()) {
        this.goToToday()
      } else {
        // const m = this.startAvailableDateV
        // const year = (this.isJ) ? m.jYear() : m.year()
        // const month = (this.isJ) ? m.jMonth() : m.month()
        if (this.disableDatesAfterToday) this.goToYesterday()
        else this.goToToday()
      }
    },
    empty () {
      this.emitInput(null)
      this.formatedChosenDate = ''
      this.chosenYear = 0
      this.chosenMonth = 0
      this.chosenDay = 0
      this.chosenMinute = null
      this.chosenHour = null
      if (this.isTodayInRange()) {
        this.goToToday()
      } else {
        const m = this.startAvailableDateV
        const year = (this.isJ) ? m.jYear() : m.year()
        const month = (this.isJ) ? m.jMonth() : m.month()
        this.goToMonth(year, month)
      }
    },
    inputClicked () {
      if (!this.isDialogOpen) {
        this.openDialog()
      } else {
        this.closeDialog()
      }
    },
    openDialog () {
      if (this.isDialogOpen) return
      this.isDialogOpen = true
      if (this.initialView === 'day') {
        this.isDayView = true
        this.isMonthView = false
        this.isYearView = false
      } else if (this.initialView === 'month') {
        this.isDayView = false
        this.isMonthView = true
        this.isYearView = false
      } else {
        this.isDayView = false
        this.isMonthView = false
        this.isYearView = true
      }
      this.$emit('opened', this.value)
    },
    closeDialog () {
      if (!this.inlineMode) {
        this.isDialogOpen = false
        this.isDayView = false
        this.isMonthView = false
        this.isYearView = false
        this.$emit('closed', this.value)
      }
    },
    isDateInRange (day) {
      if (!this.availableDates) return true

      const format = this.isJ ? 'jYYYY/jM/jD' : 'YYYY/M/D'
      const m = moment(`${this.displayingYear}/${this.displayingMonthNum + 1}/${day}`, format)
      return m.isBetween(this.startAvailableDateV, this.endAvailableDateV, null, '[]')
    },
    isTodayInRange () {
      if (!this.availableDates) return true
      const m = moment()
      return m.isBetween(this.startAvailableDateV, this.endAvailableDateV, null, '[]')
    },
    inputCheck (value) {
      if (!value || !value.length) return false
      const m = moment(value, 'YYYY-MM-DDTHH:mm:ss.SSSZ')

      if (m.isValid()) {
        const year = (this.isJ) ? m.jYear() : m.year()
        if (year < this.cMinimumYear || year > this.cMaximumYear) return false
        return true
      }
      return false
    },
    inputChanged (value, dontUpdateInput) {
      if (this.inputCheck(value)) {
        const m = moment(value, 'YYYY-MM-DDTHH:mm:ss.SSSZ')

        this.chosenHour = m.hour()
        this.chosenMinute = m.minute()

        const year = (this.isJ) ? m.jYear() : m.year()
        const month = (this.isJ) ? m.jMonth() : m.month()
        const date = (this.isJ) ? m.jDate() : m.date()

        this.goToMonth(year, month)
        this.dayClicked(date, dontUpdateInput)
      } else {
        this.empty()
      }
    },
    ifDayBoxIsChosenDay (day) {
      return this.chosenYear === this.displayingYear &&
        this.chosenMonth === this.displayingMonthNum &&
        this.chosenDay === day
    },
    ifMonthBoxChosenMonth (month) {
      return this.chosenYear === this.displayingYear &&
        this.chosenMonth === month
    },
    ifYearBoxChosenYear (year) {
      return this.chosenYear === year
    },
    goToToday () {
      const m = moment()
      this.goToDate(m)
    },
    goToYesterday () {
      const m = moment().subtract(1, 'd')
      this.goToDate(m)
    },
    goToDate (m) {
      const year = (this.isJ) ? m.jYear() : m.year()
      const month = (this.isJ) ? m.jMonth() : m.month()
      const date = (this.isJ) ? m.jDate() : m.date()

      this.chosenYear = year
      this.chosenMonth = month
      this.chosenDay = date
      this.chosenHour = null
      this.chosenMinute = null

      this.goToMonth(this.chosenYear, this.chosenMonth)
    },
    goToMonth (year, month) {
      const format = this.isJ ? 'jYYYY/jM/jD' : 'YYYY/M/D'
      const m = moment(`${year}/${month + 1}/1`, format)
      const daysInMonth = (this.isJ) ? moment.jDaysInMonth(year, month) : m.daysInMonth()


      let d = m.day()
      if (this.isJ) {
        d = (d + 1) % 7
      }

      this.firstDayOfMonth = d
      this.daysInMonth = daysInMonth
      this.displayingMonthNum = month

      const yearch = this.displayingYear !== year
      const monthch = this.displayingMonth !== this.monthNames[month]

      this.displayingYear = year
      this.displayingMonth = this.monthNames[month]

      if (monthch) this.$emit('monthChanged', this.value)
      if (yearch) this.$emit('yearChanged', this.value)
    },
    preMonthClicked () {
      let newMonth = this.displayingMonthNum - 1
      let newYear = this.displayingYear
      if (newMonth < 0) {
        if (newYear - 1 >= this.cMinimumYear) {
          newMonth = 11
          newYear--
        } else {
          newMonth = 0
        }
      }
      this.goToMonth(newYear, newMonth)
    },
    nextMonthClicked () {
      let newMonth = this.displayingMonthNum + 1
      let newYear = this.displayingYear
      if (newMonth > 11) {
        if (newYear + 1 <= this.cMaximumYear) {
          newMonth = 0
          newYear++
        } else {
          newMonth = 11
        }
      }
      this.goToMonth(newYear, newMonth)
    },
    dayClicked (day, dontUpdateInput) {
      if (this.availableDates && !this.isDateInRange(day)) {
        return
      }

      this.chosenDay = day
      this.chosenMonth = this.displayingMonthNum
      this.chosenYear = this.displayingYear

      if (!dontUpdateInput) {
        this.updateInput()
        this.closeDialog()
      } else if (this.humanize) {
          const format = this.isJ ? 'jYYYY/jM/jD' : 'YYYY/M/D'
          const m = moment(`${this.chosenYear}/${this.chosenMonth + 1}/${this.chosenDay}`, format)
          this.formatedChosenDate = this.getHumanizedFormat(m, format)
        } else {
          this.formatedChosenDate = this.toFormatDate(this.chosenYear, (this.chosenMonth + 1), this.chosenDay)
        }
    },
    getHumanizedFormat (m, format) {
      return m.calendar(null, {
        sameDay: `[${this.$t('forms.today')}]`,
        nextDay: `[${this.$t('forms.tomorrow')}]`,
        nextWeek: 'dddd',
        lastDay: `[${this.$t('forms.yesterday')}]`,
        lastWeek: this.$t('forms.lastWeekDay'),
        sameElse: format
      })
    },
    monthClicked (month) {
      this.displayingMonthNum = month
      this.isMonthView = false
      this.isYearView = false
      this.isDayView = true
      this.goToMonth(this.displayingYear, this.displayingMonthNum)
    },
    yearClicked (year) {
      this.displayingYear = year
      this.isMonthView = true
      this.isYearView = false
      this.isDayView = false
      this.goToMonthSelect()
    },
    goToYearSelect () {
      this.isMonthView = false
      this.isDayView = false
      this.isYearView = true
      this.$nextTick(function () {
        const target = this.$el.querySelector('#year-' + this.displayingYear)
        target.parentNode.scrollTop = target.offsetTop - target.parentNode.offsetTop
      })
    },
    updateInput () {
      const format = this.isJ ? 'jYYYY/jM/jD' : 'YYYY/M/D'
      const m = moment(`${this.chosenYear}/${this.chosenMonth + 1}/${this.chosenDay}`, format)

      if (this.humanize) {
        this.formatedChosenDate = this.getHumanizedFormat(m, format)
      } else {
        const formated = this.toFormatDate(this.chosenYear, (this.chosenMonth + 1), this.chosenDay)
        this.formatedChosenDate = formated
      }

      m.hour(this.time ? this.chosenHour : 0)
      m.minute(this.time ? this.chosenMinute : 0)

      m.second(0)
      m.millisecond(0)

      this.emitInput(m)
    },
    numToStr (num) {
      return '' + num
    },
    nextYearClicked () {
      if (this.displayingYear + 1 <= this.cMaximumYear) {
        this.displayingYear++
        this.$emit('yearChanged', this.value)
      }
    },
    preYearClicked () {
      if (this.displayingYear - 1 >= this.cMinimumYear) {
        this.displayingYear--
        this.$emit('yearChanged', this.value)
      }
    },
    goToMonthSelect () {
      this.isDayView = false
      this.isMonthView = true
      this.chosenMonth = this.displayingMonthNum
      this.$emit('monthChanged', this.value)
    },
    toFormatDate (year, month, day) {
      const elements = this.formatDate.split('/')
      const outYear = '' + elements[0] === 'YYYY' ? year : year - 1300
      let outMonth = ''
      if (elements[1] === 'M') outMonth = month
      else if (elements[1] === 'MM') {
        if (month < 10) outMonth = '0' + month
        else outMonth = month
      } else if (elements[1] === 'MMM') outMonth = this.monthNames[month - 1]
      const outDay = elements[2] === 'DD' && day < 10 ? '0' + day : day
      return outYear + '/' + outMonth + '/' + outDay
    },
    onExit (ev) {
      if (!this.$el.contains(ev.target)) this.closeDialog()
    },
    replaceAllArray (str, find, replace) {
      let replacedStr = str
      for (let i = 0; i < find.length; i++) {
        replacedStr = replacedStr.split(find[i]).join(replace[i])
      }
      return replacedStr
    },
    emitInput (m) {
      const val = m && m.milliseconds(0).toISOString().replace('.000Z', 'Z')
      if (val !== this.value) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
$dialog-width: 270px;
$box-width : $dialog-width / 7;
$month_box_width : $dialog-width / 3;
$font-size: 14px;

.pdatepicker {
  position: relative;

  .time-picker {
    max-width:180px;
    direction: ltr;

    .input-group-text {
      border-width: 1px 0;
    }

    .form-control {
      border-radius: 0 !important
    }
  }

  .empty {
    position: absolute;
    z-index: 3;
    cursor: pointer;
    display: block;
    top: 9px;
    right: 9px;

    *[dir="rtl"] & {
      right: auto;
      left: 9px;
    }

    &.small {
      top: 7px;
    }
  }

  input {
    background: #fff;
  }

  .dialog {
    position: absolute;
    top:100%;
    z-index: 1010;
    width: $dialog-width + 4;

    &.dropup {
      top: auto;
      bottom: 100%;
    }

    &.reverse {
      right: 0;

      *[dir="rtl"] & {
        left: 0;
        right: auto;
      }
    }

    span {
      font-size: $font-size;
    }

    .endofweek, .endofseason {
      padding: 0px;
      margin: 0px;
      width: 0px;
      height: 0px;
    }

    .day-view {
      text-align: left;

      *[dir="rtl"] & {
        text-align: right;
      }

      .dialog-month {
        width: 100%;

        div {
          display: inline-block;
          text-align: center;
          padding: 10px 0;
          cursor: pointer;
          font-size: $font-size;
        }

        .nextMonth {
          float: left;
          width: 10%;

          *[dir="rtl"] & {
            float: right;
          }

          &:hover {
            background-color: rgba(200, 200, 200, 0.6)
          }
        }

        .preMonth {
          float: left;
          width: 10%;

          *[dir="rtl"] & {
            float: right;
          }

          &:hover {
            background-color: rgba(200, 200, 200, 0.6)
          }
        }

        .monthName {
          float: left;
          width: 80%;

          *[dir="rtl"] & {
            float: right;
          }

          &:hover{
            background-color: rgba(200, 200, 200, 0.6)
          }
        }
      }

      .dialog-week {
        width: 100%;
      }

      .day-box{
              width: $box-width;
              height: $box-width;
              line-height: $box-width;
              display: inline-block;
              text-align: center;
              padding:0;
              cursor: pointer;
              vertical-align: middle;
              position: relative;
              .hover-effect{
                  position: absolute;
                  top: 0px;
                  right: 0px;
                  width: 100%;
                  height: 100%;
                  transition: transform 150ms ease-out;
                  z-index: 1;
                  transform: scale(0)
            }
              .num{
                  z-index: 2;
                  position: relative;
            }
              &:hover{
                  .hover-effect{
                      transform: scale(1)
                }
            }
              &.disabled-day{
                  background-color: #e3e3e3;
                  cursor: default;
                  .hover-effect{
                      display: none !important;
                }
            }
              &.chosen-day{
                  .hover-effect{
                      transform: scale(1) !important;
                }
            }
      }

      .day-name{
        &:hover{
          cursor: default;
        }
      }

      .empty-box{
        cursor: default;
      }
    }

    .month-view {
          text-align: center;
          .dialog-year{
              width: 100%;
              div{
                  display: inline-block;
                  text-align: center;
                  padding: 10px 0;
                  cursor: pointer;
                  font-size: $font-size;
            }
              .nextYear{
                  float: right;
                  width: 10%;
            }
              .preYear{
                  float: right;
                  width: 10%;
            }
              .cyear{
                  float: right;
                  width: 80%;
            }
        }
          .month-box{
              width: $month_box_width;
              line-height: $box-width;
              display: inline-block;
              text-align: center;
              padding: 0 5px;
              cursor: pointer;
              font-size: $font-size;
              position: relative;
              .hover-effect{
                  position: absolute;
                  top: 0px;
                  right: 0px;
                  width: 100%;
                  height: 100%;
                  transition: transform 150ms ease-out;
                  z-index: 1;
                  transform: scale(0);
                  z-index: 1;
            }
              .num{
                  position: relative;
                  z-index: 2;
            }
              &:hover{
                  .hover-effect{
                      transform: scale(1)
                }
            }
              &.chosen-month{
                  .hover-effect{
                      transform: scale(1) !important;
                }
            }
        }
    }

    .year-view {
      width: 100%;
      height: 250px;
      overflow: scroll;
      overflow-x: hidden;

      .year-box {
        display: inline-block;
        text-align: center;
        padding: 10px 0;
        cursor: pointer;
        font-size: $font-size;
        width: 25%;
        position: relative;

        .hover-effect {
          position: absolute;
          top: 0px;
          right: 0px;
          width: 100%;
          height: 100%;
          transition: transform 150ms ease-out;
          z-index: 1;
          transform: scale(0);
          z-index: 1;
        }

        .num {
          position: relative;
          z-index: 2;
        }

        &:hover {
          .hover-effect {
            transform: scale(1)
          }
        }

        &.chosen-year {
          .hover-effect {
            transform: scale(1) !important;
          }
        }
      }
    }
  }

  &.inline {
    display: inline-block;

    .dialog {
      position: static;
    }
  }
}

/*** Animations ***/
/** Scale Fade **/
.fade-enter-active {
  transition: all 300ms ease-out;
}

.fade-leave-active {
  transition: all 300ms ease-out;
}

.fade-leave-to, .fade-enter {
  opacity: 0;
  position: absolute;
  top: 0px;
}

.fade-enter-to, .fade-leave{
  opacity: 1;
}

/** Slide Fade **/
.slide-fade-enter-active {
  transition: all 300ms ease-out;
}

.slide-fade-leave-active {
  transition: all 300ms ease-out;
}

.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-enter-to, .slide-fade-leave{
  transform: translateY(0px);
  opacity: 1;
}

//-------------------------------
.dp-danger {
  background: #ffe2e2 !important;
  color: #5b0000 !important;
  border-color: #d89797
}

.dp-warning {
  background: #fffad8 !important;
  color: #895f0d !important;
  border-color: #d8be8c
}
</style>
