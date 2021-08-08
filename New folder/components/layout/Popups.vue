<template>
  <b-modal
    ref="modal"
    centered
    hide-footer
    hide-header
    scrollable
    size="lg"
    body-class="pb-0"
    :body-bg-variant="bgVariant"
    @hidden="showNextItem"
  >
    <html-display v-if="current && current.body" :value="current.body" class="article-body"/>
  </b-modal>
</template>

<script>
import HtmlDisplay from '@/components/shared/HtmlDisplay'
import * as types from '@/store/types'

export default {
  name: 'Popups',
  components: {
    HtmlDisplay
  },
  data () {
    return {
      items: [],
      current: null
    }
  },
  computed: {
    bgVariant () {
      return this.current && this.current.viewData
    }
  },
  mounted () {
    this.getItems()
    .then(this.showNextItem)
  },
  methods: {
    getShownItems() {
      return this.$cookies.get(types.POPUP_COOKIE) || []
    },
    addToCookie (item) {
      const items = this.getShownItems()
        .filter(o => o.id !== item.id)

      items.push({
        id: item.id,
        sid: this.$store.state.$sessionId
      })

      this.$cookies.set(types.POPUP_COOKIE, items, { maxAge: 60 * 60 * 24 * 30, sameSite: 'Lax', path: '/' })
    },
    showNextItem () {
      if (!this.items || !this.items.length)
        return

      const shownItems = this.getShownItems()

      while (this.items.length && !this.itemMustShow(this.items[0], shownItems))
        this.items.shift()

      this.current = this.items[0]

      if (this.current) {
        this.$refs.modal.show()
        this.addToCookie(this.items[0])
      }
    },
    itemMustShow (item, shownItems) {
      return (item.viewType === 0 && !shownItems.find(o => o.id === item.id && o.sid === this.$store.state.$sessionId)) ||
          (item.viewType === 1 && !shownItems.find(o => o.id === item.id))
    },
    getItems () {
      return this.$api.popups.getAll()
      .then(res => {
        this.items = res
      })
    }
  }
}
</script>
