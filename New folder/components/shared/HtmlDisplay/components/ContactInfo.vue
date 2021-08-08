<template>
  <contact-info-footer :widget="{ title: null, subtitle: null }"/>
</template>

<script>
import ContactInfoFooter from '@/components/widgets/contactInfo/Footer'

export default {
  name: 'ContactForm',
  components: {
    ContactInfoFooter
  },
  mounted () {
    this.$emit('loaded')
  }
}
</script>
