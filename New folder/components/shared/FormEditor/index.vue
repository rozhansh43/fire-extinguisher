<template>
  <div v-if="value">
    <h4 v-if="value.title" class="mb-4">
      {{ value.title }}
    </h4>

    <template v-if="showSuccess">
      <b-card body-class="text-center p-5">
        <font-awesome-icon
          icon="check-circle"
          class="align-middle display-2 text-success mb-4"
        />

        <h5 class="mb-0">
          {{ value.message }}
        </h5>

        <div v-if="referenceNumber" class="mt-3">
          <span class="text-muted"> {{ $t('forms.referenceNumber') }} : </span> {{ referenceNumber }}
        </div>
      </b-card>
      
      <div class="text-center">
        <b-btn variant="link" class="p-0" @click="hideSuccess">
          {{ $t('shared.return') }}
        </b-btn>
      </div>
    </template>
    
    <template v-else-if="value.data && value.data.steps && value.data.steps.length">
      <b-nav v-if="value.data.steps.length > 1" class="bg-bright rounded mb-4 px-3">
        <b-nav-item
          v-for="(step, index) in value.data.steps"
          :key="step.id"
          :active="index === activeStepIndex"
          :link-classes="`p-3 ${index > activeStepIndex ? 'text-muted' : 'text-dark'}`"
          :disabled="index > activeStepIndex"
          @click="setActiveStepIndex(index)"
        >
          <h5 class="mb-0">
            <font-awesome-icon
              :icon="$dir.ltr ? 'caret-right' : 'caret-left'"
              :class="[
                index === activeStepIndex ? 'text-primary' : (index < activeStepIndex ? 'text-dark' : 'text-moremuted'),
                { 'mr-2': $dir.ltr, 'ml-2': $dir.rtl }
              ]"
              class="align-middle"
            />
            
            <template v-if="step.name">
              {{ step.name }}
            </template>

            <template v-else>
              {{ $t('forms.stepNumber', { number: index + 1 }) }}
            </template>
          </h5>
        </b-nav-item>
      </b-nav>
      
      <form-steps
        ref="formSteps"
        :items="value.data.steps"
        :value="model.data.fields"
        :active-step-index="activeStepIndex"
      />

      <b-btn
        v-if="value.data.steps.length > 1 && activeStepIndex < value.data.steps.length - 1"
        block
        size="lg"
        variant="success"
        @click="goNextStep"
      >
        {{ $t('forms.nextStep') }}

        <font-awesome-icon
          :icon="$dir.ltr ? 'angle-right' : 'angle-left'"
          class="align-middle"
          :class="{ 'ml-2': $dir.ltr, 'mr-2': $dir.rtl }"
        />
      </b-btn>

      <b-btn
        v-else
        :disabled="progressing"
        block
        size="lg"
        variant="success"
        @click="submit"
      >
        <font-awesome-icon
          :icon="progressing ? 'cog' : 'check'"
          :spin="progressing"
          class="align-middle"
          :class="{ 'mr-2': $dir.ltr, 'ml-2': $dir.rtl }"
        />
        
        {{ value.buttonLabel }}
      </b-btn>
    </template>
  </div>
</template>

<script>
import FormSteps from './formSteps'

export default {
  name: 'FormEditor',
  components: {
    FormSteps
  },
  props: {
    value: { type: Object, required: true }
  },
  data () {
    return {
      activeStepIndex: 0,
      progressing: false,
      showSuccess: false,
      referenceNumber: null,
      model: {
        formId: this.value.id,
        data: {
          fields: []
        }
      }
    }
  },
  methods: {
    validateAll () {
      return this.$refs.formSteps.validateAll()
    },
    resetValidator () {
      this.$refs.formSteps.resetValidator()
    },
    goNextStep () {
      this.validateAll()
      .then(isValid => {
        if (isValid)
          this.activeStepIndex += 1
      })
    },
    setActiveStepIndex (index) {
      this.activeStepIndex = index
    },
    submit () {
      this.validateAll()
      .then(isValid => {
        if (isValid) {
          this.progressing = true
          this.$api.submittedForms.submit(this.model, true)
          .then(res => {
            this.progressing = false
            
            this.setActiveStepIndex(0)
            
            if (this.model.data && this.model.data.fields && this.model.data.fields.length) {
              this.model.data.fields.forEach(o => {
                o.value = null
              })
            }

            this.resetValidator()
            if (this.value.showReferenceNumber) this.referenceNumber = res.id

            this.showSuccess = true
          })
          .catch(err => {
            this.progressing = false
            this.$showError(this.$getLocaleErrorMessage(err, 'forms'))
          })
        }
      })
    },
    hideSuccess () {
      this.showSuccess = false
      this.referenceNumber = null
    }
  }
}
</script>
