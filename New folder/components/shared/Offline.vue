<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <img class="d-block mx-auto mb-4" src="/img/no-internet.png"/>
          <div class="clearfix text-center">
            <h4 class="pt-3">{{ $t('shared.oopsWeHaveAProblem') }}</h4>

            <p class="text-muted">{{ $t('shared.youAreOffline') }}</p>

            <b-btn @click="refresh" size="sm" variant="silver">
              <font-awesome-icon icon="undo" class="align-middle mx-1" />

              {{ $t('shared.return') }}
            </b-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Offline',
  methods: {
    refresh () {
      location.reload()
    }
  }
}
</script>
