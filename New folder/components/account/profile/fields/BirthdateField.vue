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
      <label :for="`birthdate${type.id}`" class="text-muted">
        {{ $t('account.birthdate') }}:
        <required-symbol v-if="type.required"/>
      </label>
      
      <date-picker
        :id="`birthdate${type.id}`"
        :required="type.required"
        disable-dates-after-today
        :name="$t('account.birthdate')"
        v-validate="type.required ? 'required' : null"
        v-model="model.value"
      />
    </b-form-group>
  </div>
</template>

<script>
import DatePicker from '@/components/shared/DatePicker'

export default {
  name: 'BirthdateField',
  components: {
    DatePicker
  },
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
