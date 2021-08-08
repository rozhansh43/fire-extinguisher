<template>
  <div v-if="widget.data">
    <h2 v-if="widget.title" class="widget-title h4 text-center mb-5">
      {{ widget.title }}
    </h2>
    
    <p v-if="widget.subtitle" class="widget-subtitle text-center mb-5 text-muted">
      {{ widget.subtitle }}
    </p>

    <form-editor :value="widget.data"/>
  </div>
</template>

<script>
import FormEditor from '@/components/shared/FormEditor/index'

export default {
  name: 'FormDefault',
  components: {
    FormEditor
  },
  props: {
    widget: { required: true }
  }
}
</script>
