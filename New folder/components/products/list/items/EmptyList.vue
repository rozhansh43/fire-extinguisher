<template>
  <b-card body-class="p-4">
    <b-alert show variant="warning" class="mb-4">{{ $t('products.emptyList.alert') }}</b-alert>

    <div class="mb-2">{{ $t('products.emptyList.try') }} :</div>
    
    <ul class="mb-0" :class="{ 'pl-4': $dir.ltr, 'pr-4': $dir.rtl }">
      <li>
        {{ $t('products.emptyList.tryOption1') }}
      </li>

      <li>
        {{ $t('products.emptyList.tryOption2') }}
      </li>
    </ul>
  </b-card>
</template>

<script>
export default {
  name: 'ProductEmptyList'
}
</script>
