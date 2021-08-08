<template>
  <div>
    <widgets v-if="hasArea1" :widgets="area1"/>
  
    <b-container v-if="hasArea2 || hasArea3">
      <b-row>
        <b-col>
          <widgets v-if="hasArea3" :widgets="area3"/>
        </b-col>
        
        <b-col xl="4" lg="4" md="4">
          <widgets v-if="hasArea2" :widgets="area2"/>
        </b-col>
      </b-row>
    </b-container>

    <widgets v-if="hasArea4" :widgets="area4"/>
  </div>
</template>

<script>
import Widgets from '@/components/widgets'

export default {
  name: 'FourAreas',
  components: {
    Widgets
  },
  props: {
    area1: Array,
    area2: Array,
    area3: Array,
    area4: Array
  },
  computed: {
    hasArea1 () {
      return this.area1 && this.area1.length
    },
    hasArea2 () {
      return this.area2 && this.area2.length
    },
    hasArea3 () {
      return this.area3 && this.area3.length
    },
    hasArea4 () {
      return this.area4 && this.area4.length
    }
  }
}
</script>
