<template>
  <div>
    <b-form v-if="noCard" @submit.prevent="submit">
      <b-input-group>
        <template v-slot:prepend>
          <b-btn class="bg-bright border-input text-muted shadow-none" type="submit">
            <font-awesome-icon
              icon="search"
              class="align-middle"
            />
          </b-btn>
        </template>
        
        <b-form-input
          class="bg-bright"
          :placeholder="`${$t('search.keywordSearch')}...`"
          v-model="model"
        />
      </b-input-group>
    </b-form>

    <b-card v-else :header-class="collapsed ? 'p-0' : 'rounded-bottom p-0 bg-white'" no-body>
      <collapse-button slot="header" :title="$t('search.searchInResults')" :collapsed="collapsed" @toggle="toggleCollapse"/>

      <b-card-body v-show="collapsed">
        <b-form @submit.prevent="submit">
          <b-form-input :placeholder="`${$t('search.keywordSearch')}...`" v-model="model"/>
        </b-form>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import CollapseButton from '../shared/CollapseButton'

export default {
  name: 'Keyword',
  components: {
    CollapseButton
  },
  props: {
    noCard: Boolean
  },
  data () {
    return {
      collapsed: true,
      model: null
    }
  },
  computed: {
    value () {
      const args = this.getListRouteArgs()
      return args ? args.keyword : null
    }
  },
  watch: {
    value (val) {
      this.model = this.value
    }
  },
  created () {
    if (this.value)
      this.model = this.value

    if (this.model)
      this.collapsed = true
  },
  methods: {
    toggleCollapse () {
      this.collapsed = !this.collapsed
    },
    getListRouteArgs () {
      const route = this.$route
      
      try {
        return this.$api.products.getListRouteArgs({ params: route.params, query: route.query })
      } catch (err) {
        return null
      }
    },
    submit () {
      const needRedirect = this.$route.name !== 'products' && this.$route.name !== 'products-all'
      const query = Object.assign({}, this.$route.query)

      if (this.model && this.model.length)
        query.q = this.model
      else
        delete query.q

      this.$router.push({ name: needRedirect && 'products', query })
    }
  }
}
</script>
