<template>
  <b-list-group-item
    class="py-0 px-3 inherited-link"
    :class="[selected ? 'bg-bright text-primary' : 'bg-white', { 'cursor-pointer': !editModel }]"
  >
    <b-row class="align-items-center">
      <b-col>
        <b-form v-if="editModel" @submit.prevent="editItem">
          <b-input ref="input" v-model="editModel.name" class="my-2" size="sm"/>
        </b-form>

        <template v-else>
          <b-btn block variant="link" class="d-flex py-2 px-0 inherited-link" @click="emitClicked">
            <font-awesome-icon
              v-if="showBullet"
              :icon="selected ? 'check-circle' : 'circle'"
              size="lg"
              class="align-middle"
              :class="[
                selected ? 'text-success' : 'text-silver',
                { 'mr-2': $dir.ltr, 'ml-2': $dir.rtl }
              ]"
            />

            {{ model.name }}
          </b-btn>
        </template>
      </b-col>

      <template v-if="!isDefaultItem && editable">
        <b-col cols="auto">
          <b-btn
            variant="link"
            class="p-0"
            :title="editModel ? $t('shared.save') : $t('shared.edit')"
            v-b-tooltip
            :disabled="editProgressing"
            @click="editItem"
          >
            <font-awesome-icon
              :icon="editProgressing ? 'cog' : (editModel ? 'check' : 'pencil-alt')"
              :spin="editProgressing"
              class="text-info"
            />
          </b-btn>
        </b-col>

        <b-col cols="auto">
          <b-btn
            variant="link"
            class="p-0"
            :title="$t('shared.remove')"
            :disabled="deleteProgressing"
            v-b-tooltip
            @click="deleteItem"
          >
            <font-awesome-icon
              :icon="deleteProgressing ? 'cog' : 'trash-alt'"
              :spin="deleteProgressing"
              class="text-danger"
            />
          </b-btn>
        </b-col>
      </template>
    </b-row>
  </b-list-group-item>
</template>

<script>
export default {
  name: 'Item',
  props: {
    value: { type: Object, required: true },
    selectedId: Number,
    editable: { type: Boolean, default: false },
    showBullet: { type: Boolean, default: false }
  },
  data () {
    return {
      editModel: null,
      editProgressing: false,
      deleteProgressing: false
    }
  },
  computed: {
    isDefaultItem () {
      return this.model.id === -1
    },
    selected () {
      return this.selectedId === this.model.id
    },
    model: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    emitClicked () {
      if (this.model.id !== this.selectedId)
        this.$emit('clicked', this.model)
    },
    editItem () {
      if (this.editModel) {
        this.editProgressing = true

        this.$api.wishLists.update(this.model.id, this.editModel, true)
        .then(res => {
          this.model.name = res.name
          this.editProgressing = false
          this.editModel = null
          this.$showSuccess(this.$t('wishes.listUpdated'))
        })
        .catch(err => {
          this.editProgressing = false
          this.editModel = null
          this.$showError(this.$getLocaleErrorMessage(err, 'wishes'))
        })
      } else {
        this.editModel = Object.assign({}, this.model)
        this.$nextTick(() => {
          this.$refs.input.focus()
        })
      }
    },
    deleteItem () {
      if (confirm(this.$t('shared.areYouSureToRemoveThisItem'))) {
        this.deleteProgressing = true

        this.$api.wishLists.delete(this.model.id, true)
        .then(res => {
          this.deleteProgressing = false
          this.$showSuccess(this.$t('wishes.listRemoved'))
          this.$emit('removed', this.model.id)
        })
        .catch(err => {
          this.deleteProgressing = false
          this.$showError(this.$getLocaleErrorMessage(err, 'wishes'))
        })
      }
    }
  }
}
</script>
