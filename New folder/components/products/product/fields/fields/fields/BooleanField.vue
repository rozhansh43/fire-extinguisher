<template>
  <div v-if="valueOnly" class="py-2 px-3 text-center" :class="reverseVariant ? 'bg-white' : 'bg-bright'">
    <font-awesome-icon
      :icon="value ? 'check' : 'times'"
      class="align-middle"
      :class="[value ? 'text-success' : 'text-muted', { 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }]"
    />
    
    {{ valueLabel }}
  </div>

  <div v-else-if="stacked" class="mb-2">
    <font-awesome-icon icon="circle" class="align-middle text-moremuted font-size-50" :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"/>
    {{ field.displayName }} :
    
    <font-awesome-icon
      :icon="value ? 'check' : 'times'"
      class="align-middle"
      :class="[value ? 'text-success' : 'text-muted', { 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }]"
    />
    
    {{ valueLabel }}
  </div>

  <div v-else-if="inline">
    <span class="text-muted">
      {{ field.displayName }} : 
    </span>
    
    <font-awesome-icon
      :icon="value ? 'check' : 'times'"
      class="align-middle"
      :class="[value ? 'text-success' : 'text-muted', { 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }]"
    />
    
    {{ valueLabel }}
  </div>

  <div v-else-if="inlineStacked" class="mb-3">
    <span class="text-muted">
      {{ field.displayName }} :
    </span>
    
    <font-awesome-icon
      :icon="value ? 'check' : 'times'"
      class="align-middle"
      :class="[value ? 'text-success' : 'text-muted', { 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }]"
    />
    
    {{ valueLabel }}
  </div>

  <span v-else-if="simpleInline">
    <span v-if="separator" class="text-muted">
      {{ separator }}
    </span>
    
    {{ field.displayName }} : {{ valueLabel }}
  </span>

  <b-row v-else class="mb-3">
    <b-col md="3" class="mb-1 mb-md-0">
      <div class="py-2 px-3 rounded h-100" :class="reverseVariant ? 'bg-white' : 'bg-bright'">
        {{ field.displayName }}
      </div>
    </b-col>

    <b-col md="9">
      <div class="py-2 px-3 rounded h-100" :class="reverseVariant ? 'bg-white' : 'bg-bright'">
        <font-awesome-icon
          :icon="value ? 'check' : 'times'"
          class="align-middle"
          :class="[value ? 'text-success' : 'text-muted', { 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }]"
        />
        
        {{ valueLabel }}
      </div>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'BooleanField',
  props: {
    field: { type: Object, required: true },
    value: Boolean,
    reverseVariant: { type: Boolean, default: false },
    inline: { type: Boolean, default: false },
    stacked: { type: Boolean, default: false },
    valueOnly: { type: Boolean, default: false },
    inlineStacked: { type: Boolean, default: false },
    simpleInline: { type: Boolean, default: false },
    separator: String
  },
  computed: {
    valueLabel () {
      return this.value ? this.field.trueLabel : this.field.falseLabel
    }
  }
}
</script>
