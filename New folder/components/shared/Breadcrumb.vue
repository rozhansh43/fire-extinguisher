<template>
  <b-card body-class="p-0">
    <b-breadcrumb class="bg-transparent mb-0" itemscope itemtype="http://schema.org/BreadcrumbList">
      <li class="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
        <b-link itemprop="item" to="/" class="inherited-link">
          <font-awesome-icon icon="home" class="align-middle" />
        </b-link>

        <meta itemprop="name" :content="$settings.branding.name" />

        <meta itemprop="position" content="1" />
      </li>

      <template v-if="items && items.length">
        <li
          v-for="(item, index) in items"
          :key="index"
          class="breadcrumb-item"
          :class="{'active': isLast(index)}"
          itemprop="itemListElement"
          itemscope
          itemtype="http://schema.org/ListItem"
        >
          <b-link v-if="!isLast(index)" itemprop="item" :to="item.path" class="inherited-link">
            <span itemprop="name">{{ item.text }}</span>
          </b-link>

          <span v-else itemprop="name">{{ item.text }}</span>
          
          <meta itemprop="position" :content="index + 2" />
        </li>
      </template>
    </b-breadcrumb>
  </b-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Breadcrumb',
  props: {
    items: { type: Array, default: () => [] }
  },
  computed: {
    ...mapState(['$settings'])
  },
  methods: {
    isLast(index) {
      return index === this.items.length - 1
    }
  }
}
</script>
