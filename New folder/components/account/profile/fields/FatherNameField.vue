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
      <label :for="`fatherName${type.id}`" class="text-muted">
        {{ $t('account.fatherName') }}:
        <required-symbol v-if="type.required"/>
      </label>
      
      <b-input
        :id="`fatherName${type.id}`"
        :name="$t('account.fatherName')"
        v-validate="type.required ? 'required' : null"
        v-model="model.value"
      />
    </b-form-group>
  </div>
</template>

<script>
export default {
  name: 'FatherNameField',
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
