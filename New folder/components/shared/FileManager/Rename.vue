<template>
  <b-modal
      size="sm"
      centered
      no-fade
      no-close-on-backdrop
      :title="$t('fileManager.createFolder')"
      :cancel-title="$t('shared.cancel')"
      :ok-title="$t('shared.confirm')"
      visible
      lazy
      @hide="emitCancel"
      @ok="emitConfirm"
      :ok-disabled="okDisabled"
      ok-variant="success"
    >
      <b-input-group :prepend="$t('fileManager.newName')">
        <b-input v-model="name" dir="auto" />
      </b-input-group>
    </b-modal>
</template>

<script>
export default {
  name: 'FRename',
  props: {
    oldName: {type: String, required: true}
  },
  data() {
    return {
      name: this.oldName
    }
  },
  computed: {
    okDisabled () {
      const name = this.name || ''
      return !!(name.trim().length)
    }
  },
  methods: {
    emitConfirm () {
      this.$emit('confirm', this.name)
    },
    emitCancel () {
      this.$emit('cancel')
    }
  }
}
</script>
