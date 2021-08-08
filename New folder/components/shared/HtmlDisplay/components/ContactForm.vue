<template>
  <contact-form-fields/>
</template>

<script>
import ContactFormFields from '@/components/shared/ContactForm'

export default {
  name: 'ContactForm',
  components: {
    ContactFormFields
  },
  mounted () {
    this.$emit('loaded')
  }
}
</script>
