<template>
  <div class="d-flex">
    <b-pagination
      class="mx-auto shadow-sm"
      :total-rows="total"
      :per-page="size"
      v-model="model"
    />
  </div>
</template>

<script>
import { scroll } from '@/lib/scroll'

export default {
  name: 'Pagination',
  props: {
    total: Number
  },
  computed: {
    model: {
      get () {
        const args = this.getListRouteArgs()
        return args ? args.page : null
      },
      set (val) {
        this.submit(val)
      }
    },
    size () {
      const args = this.getListRouteArgs()
      return args ? args.size : null
    }
  },
  methods: {
    getListRouteArgs () {
      const route = this.$route

      try {
        return this.$api.products.getListRouteArgs({ params: route.params, query: route.query })
      } catch (err) {
        return null
      }
    },
    submit (val) {
      const query = Object.assign({}, this.$route.query)

      if (val > 1)
        query.p = val
      else
        delete query.p

      this.$router.push({ query })

      scroll(0)
    }
  }
}
</script>
