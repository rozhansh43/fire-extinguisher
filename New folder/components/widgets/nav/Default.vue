<template>
   <div v-if="widget.items && widget.items.length">
         <h1>
      nav nav
    </h1>
    <h2 v-if="widget.title" class="widget-title h4 text-center mb-5">
      {{ widget.title }}
    </h2>
    
    <p v-if="widget.subtitle" class="widget-subtitle text-center mb-5 text-muted">
      {{ widget.subtitle }}
    </p>

    <menu-bar :items="widget.items" :id="widget.id" class="nav-default bg-primary" :toggleable="'lg'" align="center"/>
   </div>
</template>

<script>
import MenuBar from '@/components/menu-bar'

export default {
  name: 'NavDefault',
  components: {
    MenuBar
  },
  props: {
    widget: { required: true }
  }
}
</script>
