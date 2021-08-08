<template>
  <div>
    <title-display :title="$t('customerOrders.orders')" icon="clipboard-list"/>

    <b-nav v-if="sections && sections.length" pills class="mb-3">
      <b-nav-item
        v-for="section in sections"
        :key="section.key"
        :to="section.path"
        :active="isActive(section)"
        class="btn rounded-pill overflow-hidden p-0"
        :link-classes="'inherited-link d-flex align-items-center justify-content-center'"
      >
        <font-awesome-icon
          :icon="section.icon"
          class="align-middle"
          :class="{ 'mr-2': $dir.ltr, 'ml-2': $dir.rtl, 'text-muted': !isActive(section) }"
        />

        {{ $t(section.text) }}

        <b-badge
          pill
          :variant="isActive(section) ? 'light' : 'silver'"
          class="mb-0"
          :class="{'ml-2': $dir.ltr, 'mr-2': $dir.rtl}"
        >
          {{ section.count }}
        </b-badge>
      </b-nav-item>
    </b-nav>

    <template v-if="value && value.length">
      <item
        v-for="item in value"
        :key="item.id"
        :value="item"
      />
    </template>

    <empty-list v-else :message="$t('customerOrders.notFound')"/>
  </div>
</template>

<script>
import EmptyList from '@/components/shared/EmptyList'
import TitleDisplay from '@/components/dash/shared/TitleDisplay'
import Item from './Item'

export default {
  name: 'Orders',
  components: {
    EmptyList,
    Item,
    TitleDisplay
  },
  props: {
    value: { type: Array, required: true },
    sections: Array
  },
  methods: {
    isActive (section) {
      return this.$route.query.status === section.key
    }
  }
}
</script>
