<template>
  <div v-if="value && value.length" class="pt-3 px-3">
    <b-row>
      <b-col v-for="item in value" :key="item.id" xl="6" md="12" class="mb-3">
        <b-card class="shadow-none mb-0 h-100" body-class="pb-0">
          <b-row class="align-items-center h-100">
            <b-col cols="auto">
              <b-link :to="getProductPath(item.product)" target="_blank" class="d-block mb-3">
                <thumbnail
                  :link="false"
                  :width="65"
                  :height="65"
                  :path="item.product.image"
                  :alt="item.product.title"
                  show-no-image
                  class="rounded"
                />
              </b-link>
            </b-col>

            <b-col>
              <b-link :to="getProductPath(item.product)" class="inherited-link d-block mb-3" target="_blank">
                {{ item.product.title }}
              </b-link>

              <div v-if="item.promotion" class="text-muted mb-3 small">
                <font-awesome-icon
                  icon="bell"
                  class="align-middle text-moremuted"
                  :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
                />
                
                {{ $t('subscriptions.promotion') }}
              </div>

              <div v-if="item.available" class="text-muted mb-3 small">
                <font-awesome-icon
                  icon="bell"
                  class="align-middle text-moremuted"
                  :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
                />
                
                {{ $t('subscriptions.available') }}
              </div>
            </b-col>

            <b-col cols="auto">
              <b-dropdown
                :dropleft="$dir.ltr"
                :dropright="$dir.rtl"
                no-caret
                size="sm"
                variant="link"
                toggle-class="inherited-link p-0 mb-3"
                menu-class="active-dropdown-item"
              >
                <template v-slot:button-content>
                  <font-awesome-icon icon="ellipsis-v" class="align-middle"/>
                </template>

                <b-dropdown-item-button @click="emitRemove(item.id)">
                  <font-awesome-icon
                    icon="trash-alt"
                    size="sm"
                    class="align-middle text-danger"
                    :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
                  />

                  {{ $t('shared.remove') }}
                </b-dropdown-item-button>
              </b-dropdown>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </div>

  <div v-else class="h-100 d-flex align-items-center justify-content-center">
    <div class="p-4">
      <font-awesome-icon icon="times-circle" class="display-4 d-block mb-4 mx-auto text-moremuted"/>

      <h5 class="text-muted font-weight-normal text-center mb-0">
        {{ $t('shared.thereAreNoResults') }}
      </h5>
    </div>
  </div>
</template>

<script>
import Thumbnail from '@/components/shared/Thumbnail'

export default {
  name: 'Wishes',
  components: {
    Thumbnail
  },
  props: {
    value: Array
  },
  methods: {
    getProductPath (item) {
      return this.$api.products.getProductPath(item)
    },
    emitRemove (itemId) {
      this.$emit('remove', itemId)
    }
  }
}
</script>
