<template>
  <b-modal
    ref="modal"
    centered
    hide-footer
    size="xl"
    :title="$t('compare.compare')"
    header-border-variant="light"
    body-class="pb-0"
    @hidden="cleanup"
  >
    <template v-for="type in types">
      <b-card
        v-if="getFilteredItems(type.id) && getFilteredItems(type.id).length"
        :key="type.id"
        header-bg-variant="light"
        bg-variant="bright"
        class="compare-wrap shadow-none"
      >
        <template v-slot:header>
          <b-row class="align-items-center">
            <b-col>
              <h5 class="mb-3 mb-lg-0">
                <font-awesome-icon
                  :icon="$dir.ltr ? 'caret-right' : 'caret-left'"
                  :class="{'mr-2': $dir.ltr, 'ml-2': $dir.rtl}"
                  class="align-middle text-primary"
                />

                {{ $t('compare.compareList', { type: type.title }) }}
              </h5>
            </b-col>

            <b-col lg="auto">
              <b-btn
                :to="getComparePath(type.id)"
                variant="info"
                size="sm"
                class="d-block d-lg-inline-block"
              >
                <font-awesome-icon icon="sliders-h" class="align-middle" :class="{'mr-1': $dir.ltr, 'ml-1': $dir.rtl}"/>
                {{ $t('compare.goToCompare') }}
              </b-btn>
            </b-col>
          </b-row>
        </template>

        <template v-if="showCarousel">
          <carousel
            :rtl="$dir.rtl"
            :per-page="1"
            :per-page-custom="[[600, 1], [768, 3], [1200, 4]]"
            loop
            :pagination-enabled="false"
            autoplay-hover-pause
            :scroll-per-page="false"
          >
            <slide v-for="item in getFilteredItems(type.id)" :key="item.id" class="compare-item px-2">
              <b-card class="shadow-none mb-0 h-100" no-body>
                <b-link :to="getPath(item)" class="inherited-link">
                  <thumbnail
                    :link="false"
                    fluid-grow
                    :width="720"
                    :height="720"
                    :path="item.img"
                    :alt="item.ttl"
                    show-no-image
                    class="card-img-top"
                  />

                  <b-card-body>
                    <h4 class="h5 mb-0 font-weight-normal">
                      {{ item.ttl }}
                    </h4>
                  </b-card-body>
                </b-link>

                <div class="d-none d-md-block">
                  <b-btn
                    size="sm"
                    variant="link"
                    class="remove-btn"
                    v-b-tooltip.hover
                    :title="$t('compare.removeFromCompare')"
                    @click="remove(item.id)"
                  >
                    <font-awesome-icon icon="times" class="align-middle text-dark"/>
                  </b-btn>
                </div>

                <div class="d-md-none p-1 text-center mt-2">
                  <b-btn size="sm" variant="outline-danger" @click="remove(item.id)">
                    <font-awesome-icon icon="times" class="align-middle m-1"/>
                  </b-btn>
                </div>
              </b-card>
            </slide>
          </carousel>
        </template>
      </b-card>
    </template>
  </b-modal>
</template>

<script>
export default {
  name: 'CompareList',
  components: {
    Thumbnail: () => import('@/components/shared/Thumbnail')
  },
  data () {
    return {
      types: [],
      endpoint: null,
      showCarousel: false
    }
  },
  computed: {
    items () {
      return this.$api.compare.getAll(this.endpoint)
    }
  },
  mounted () {
    this.showCarousel = true
  },
  methods: {
    show (endpoint) {
      this.cleanup()
      this.endpoint = endpoint
      this.getTypes()
      this.$refs.modal.show()
    },
    cleanup () {
      this.types = []
      this.endpoint = null
    },
    getPath (item) {
      return this.$api[this.endpoint].getProductPath(item)
    },
    getTypes () {
      const ids = this.items.map(o => o.tid)
      const uniqueIds = [...new Set(ids)]
      return this.$api.productTypes.getByIds(uniqueIds)
      .then(res => {
        this.types = res
        return this.types
      })
    },
    getFilteredItems (typeId) {
      return this.items.filter(o => o.tid === typeId)
    },
    getComparePath (typeId) {
      return this.$api.compare.getPath(this.getFilteredItems(typeId).map(o => o.id))
    },
    remove (itemId) {
      return this.$api.compare.remove(this.endpoint, itemId)
    }
  }
}
</script>
