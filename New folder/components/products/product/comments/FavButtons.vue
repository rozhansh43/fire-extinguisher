<template>
  <div class="text-muted">
    <div class="mb-3">
      {{ $t('productComments.wasThisHelpful') }}
    </div>

    <b-btn
      variant="outline-silver"
      class="px-3 py-0 inherited-link fav-btns"
      :class="{'mr-3': $dir.ltr, 'ml-3': $dir.rtl}"
      :disabled="likeProgressing"
      @click="like(item.id)"
    >
      <small>
        <font-awesome-icon
          v-if="likeProgressing"
          icon="cog"
          size="xs"
          spin
          class="align-middle"
        />

        <template v-else>
          {{ item.likesCount }}
        </template>

        {{ $t('productComments.yes') }}
      </small>
    </b-btn>

    <b-btn
      variant="outline-silver"
      class="px-3 py-0 inherited-link fav-btns"
      :disabled="dislikeProgressing"
      @click="dislike(item.id)"
    >
      <small>
        <font-awesome-icon
          v-if="dislikeProgressing"
          icon="cog"
          size="xs"
          spin
          class="align-middle"
        />

        <template v-else>
          {{ item.dislikesCount }}
        </template>

        {{ $t('productComments.no') }}
      </small>
    </b-btn>
  </div>
</template>

<script>
import vm from '@/lib/vm'

export default {
  name: 'FavButtons',
  props: {
    item: { type: Object, required: true },
    authorization: { type: Boolean, required: false }
  },
  data () {
    return {
      likeProgressing: false,
      dislikeProgressing: false
    }
  },
  computed: {
    account () {
      return this.$store.state.$account
    }
  },
  methods: {
    like (itemId) {
      if (this.authorization || this.account) {
        this.likeProgressing = true

        this.$api.productComments.like(itemId, true)
        .then(res => {
          this.item.likesCount = res.likesCount
          this.item.dislikesCount = res.dislikesCount

          this.likeProgressing = false
        })
        .catch(err => {
          this.likeProgressing = false
          this.$showError(this.$getLocaleErrorMessage(err, 'productComments'))
        })
      } else vm.$emit('showLoginModal')
    },
    dislike (itemId) {
      if (this.authorization || this.account) {
        this.dislikeProgressing = true

        this.$api.productComments.dislike(itemId, true)
        .then(res => {
          this.item.likesCount = res.likesCount
          this.item.dislikesCount = res.dislikesCount

          this.dislikeProgressing = false
        })
        .catch(err => {
          this.dislikeProgressing = false
          this.$showError(this.$getLocaleErrorMessage(err, 'productComments'))
        })
      } else vm.$emit('showLoginModal')
    }
  }
}
</script>
