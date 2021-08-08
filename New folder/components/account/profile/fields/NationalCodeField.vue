<template>
  <div>
    <b-alert :show="errors.any()" variant="danger" class="px-4">
      <ul class="m-0 px-1">
        <li v-for="err in errors.all()" :key="err">
          {{ err }}
        </li>
      </ul>
    </b-alert>

    <b-form-group>
      <label :for="`nationalCode${type.id}`" class="text-muted">
        {{ $t('account.nationalCode') }}:
        <required-symbol v-if="type.required"/>
      </label>

      <b-input
        :id="`nationalCode${type.id}`"
        :name="$t('account.nationalCode')"
        v-validate="`${type.required ? 'required|' : null}digits:10`"
        v-model="model.value"
      />
    </b-form-group>
  </div>
</template>

<script>
export default {
  name: 'NationalCodeField',
  props: {
    value: { type: Object, required: true },
    type: { type: Object, required: true }
  },
  computed: {
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
    validateAll() {
      return this.$validator.validateAll()
    }
  }
}
</script>
