<template>
  <div>
    <b-alert :show="errors.any()" variant="danger" class="px-4">
      <ul class="m-0 px-1">
        <li v-for="err in errors.all()" :key="err">{{ err }}</li>
      </ul>
    </b-alert>

    <b-form-group>
      <label for="subject" class="text-muted">
        {{ $t('tickets.subject') }} :
        <required-symbol/>
      </label>

      <b-input-group size="lg">
        <b-form-input
          id="subject"
          dir="auto"
          :name="$t('tickets.subject')"
          v-validate="'required|max: 200'"
          v-model="model.subject"
        />
      </b-input-group>
    </b-form-group>

    <b-row>
      <b-col md="6">
        <b-form-group>
          <label for="priority">
            {{ $t('tickets.priority') }} :
            <required-symbol/>
          </label>

          <b-form-select
            id="priority"
            :options="priorityOptions"
            :name="$t('tickets.priority')"
            v-validate="'required'"
            v-model="model.priority"
          />
        </b-form-group>
      </b-col>

      <b-col md="6">
        <item-selector
          required
          :label="`${$t('tickets.category')} :`"
          label-class="text-muted"
          :select="categorySelect"
          :search="categorySearch"
          :name="$t('tickets.category')"
          v-validate="'required'"
          v-model="model.categoryId"
        />
      </b-col>
    </b-row>

    <tiny-mce
      :title="$t('tickets.message')"
      class="mb-3"
      mode="noMedia"
      v-model="model.message.body"
    />

    <uploader
      :label="$t('tickets.attachment')"
      accept="*"
      v-model="model.message.attachment"
    />
  </div>
</template>

<script>
import ItemSelector from '@/components/shared/item-selector'
import TinyMce from '@/components/shared/TinyMce'
import Uploader from '@/components/shared/Uploader'

export default {
  name: 'Fields',
  components: {
    ItemSelector,
    TinyMce,
    Uploader
  },
  props: {
    value: Object
  },
  data () {
    return {
      priorityOptions: [
        { value: 0, text: this.$t('tickets.priorities.low') },
        { value: 1, text: this.$t('tickets.priorities.medium') },
        { value: 2, text: this.$t('tickets.priorities.high') }
      ]
    }
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
    categorySearch (keyword) {
      return this.$api.ticketCategories.getInfos({
        name: keyword,
        active: true,
        sort: 'sortOrder-asc'
      })
      .then(items => items.map(item => {
        return Object.assign(item, {
          text: item.name,
          value: item.id
        })
      }))
    },
    categorySelect (value) {
      return this.$api.ticketCategories.getInfos({
        id: value
      })
      .then(items => {
        return {
          text: items[0].name,
          value: items[0].id
        }
      })
    },
    validateAll () {
      return this.$validator.validateAll()
    }
  }
}
</script>
