<template>
  <b-card
    body-class="p-0 position-relative cntr"
    class="mb-0 overflow-hidden"
    :header-bg-variant="hasError ? 'danger' : null"
    :border-variant="hasError ? 'danger' : null"
    :style="{ height: height + 'px' }"
  >
    <template v-if="label" v-slot:header>
      {{ label }}

      <required-symbol v-if="required"/>
    </template>

    <div
      v-if="initializing"
      class="bg-light d-flex align-items-center justify-content-center"
      :style="{ height: height + 'px' }"
    >
      <font-awesome-icon spin icon="circle-notch" class="text-moremuted display-2"/>
    </div>

    <template v-else>
      <client-only>
        <l-map :zoom.sync="zoom" :center="showingPoint" @click="click">
          <l-tile-layer
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
            attribution="<a href='https://persina.com' target='_blank'>Persina</a>"
          />
          <l-marker :lat-lng="showingPoint" />
        </l-map>
      </client-only>

      <b-btn
        v-if="autoDetect"
        size="sm"
        variant="white"
        class="btn-coordinates box-shadow-sm p-2 rounded"
        @click="getCoordinates"
      >
        <font-awesome-icon
          fixed-width
          :icon="icon"
          :spin="progressing"
          class="align-middle"
          :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
        />

        {{ $t('search.autoLocation') }}
      </b-btn>

      <b-btn
        v-if="directionUrl"
        size="sm"
        variant="white"
        class="btn-directions box-shadow-sm p-2 rounded"
        target="_blank"
        rel="nofollow"
        :href="directionUrl"
      >
        <font-awesome-icon
          fixed-width
          :icon="icon"
          :spin="progressing"
          class="align-middle"
          :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
        />
        
        {{ $t('shared.getDirections') }}
      </b-btn>
    </template>
  </b-card>
</template>

<script>
export default {
  name: 'GeopointEditor',
  props: {
    value: { type: Object },
    label: { type: String },
    required: { type: Boolean, default: false },
    hasError: { type: Boolean, default: false },
    format: { type: String, default: 'latlon' }, // latlon | latlng
    autoDetect: { type: Boolean, default: false },
    directionUrl: { type: String },
    height: { type: Number, default: 200 },
    delay: { type: Number, default: 0 }
  },
  data() {
    return {
      progressing: false,
      initializing: true
    }
  },
  computed: {
    icon() {
      if (this.progressing) return 'compass'
      else return 'map-marker-alt'
    },
    point: {
      get () {
        if (!this.value || !this.value.lat) return null
        let result
        switch (this.format) {
          case 'latlon':
            result = [this.value.lat, this.value.lon]
            break
          case 'latlng':
          default:
            result = [this.value.lat, this.value.lng]
        }
        return result
      },
      set (val) {
        this.emitPoint(val && val[0], val && val[1])
      }
    },
    zoom: {
      get () {
        return (this.value && this.value.zoom) || this.$config.map.defaultZoom
      },
      set (val) {
        if (this.value && this.value.zoom !== val)
          this.emitZoom(val)

        this.point = this.showingPoint
      }
    },
    showingPoint() {
      return (
        this.point || [this.$config.map.defaultLat, this.$config.map.defaultLng]
      )
    }
  },
  mounted () {
    setTimeout(() => {
      this.initializing = false
    }, this.delay)
  },
  methods: {
    emitPoint (lat, lon) {
      const result = { zoom: this.zoom, lat }

      switch (this.format) {
        case 'latlon':
          result.lon = lon
          break
        case 'latlng':
        default:
          result.lng = lon
      }

      this.emitInput(result)
    },
    emitZoom (zoom) {
      const result = { zoom, lat: this.value && this.value.lat }

      switch (this.format) {
        case 'latlon':
          result.lon = this.value.lon
          break
        case 'latlng':
        default:
          result.lng = this.value.lng
      }

      if (result.lat)
        this.emitInput(result)
    },
    emitInput (val) {
      if (!val || !val.lat)
        return this.$emit('input', null)

      this.$emit('input', val)
    },
    click(e) {
      this.point = [e.latlng.lat, e.latlng.lng]
    },
    getCoordinates() {
      this.progressing = true
      navigator.geolocation.getCurrentPosition(pos => {
        this.progressing = false
        this.point = [pos.coords.latitude, pos.coords.longitude]
      })
    }
  }
}
</script>

<style scoped>
.cntr {
  height: 200px;
}

.btn-coordinates {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 400;
  border: 2px solid rgba(0, 0, 0, 0.2);
}

.btn-directions {
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 400;
  border: 2px solid rgba(0, 0, 0, 0.2);
}
</style>
