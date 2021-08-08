<template>
  <b-card v-if="items && items.length" no-body class="overflow-hidden">
    <profile-compact/>
    
    <b-list-group flush class="dash-nav">
      <item v-for="(item, index) in items" :key="index" :item="item"/>
    </b-list-group>
  </b-card>
</template>

<script>
import Item from './Item'
import ProfileCompact from '@/components/dash/widgets/profile/Compact'

export default {
  name: 'DashNav',
  components: {
    Item,
    ProfileCompact
  },
  props: {
    items: Array
  },
  methods: {
    getUserDisplayName (user) {
      return this.$api.account.getUserDisplayName(user)
    }
  }
}
</script>
