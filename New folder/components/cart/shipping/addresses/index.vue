<template>
  <b-card header-class="py-3 d-flex align-items-center justify-content-between" body-class="pb-0">
    <template v-slot:header>
      <h5 class="mb-0">
        <font-awesome-icon
          icon="map-marked-alt"
          class="align-middle text-info"
          :class="{ 'mr-2': $dir.ltr, 'ml-2': $dir.rtl }"
        />
        
        {{ $t('addresses.orderDeliveryAddress') }}
      </h5>
      
      <b-btn
        v-if="editing"
        variant="link"
        class="inherited-link p-0"
        @click="toggleEditing"
      >
        <font-awesome-icon
          icon="times"
          class="align-middle"
        />
      </b-btn>
    </template>

    <div v-if="progressing" class="text-center p-3">
      <font-awesome-icon spin icon="circle-notch" class="text-moremuted display-2 mb-3"/>
    </div>

    <template v-else>
      <template v-if="items && items.length">
        <template v-if="editing">
          <b-row>
            <b-col v-for="item in items" :key="item.id" xl="4" lg="6" class="mb-3">
              <b-card
                bg-variant="bright"
                class="border shadow-none h-100 mb-0"
                :class="{ 'border-success': isSelected(item.id) }"
                body-class="d-flex flex-column pb-0 p-0"
              >
                <div class="cursor-pointer" @click="select(item)">
                  <div class="p-3 rounded-top" :class="{ 'bg-success-light': isSelected(item.id) }">
                    <font-awesome-icon
                      :icon="isSelected(item.id) ? 'check-circle' : 'circle'"
                      class="align-middle"
                      size="lg"
                      :class="[
                        isSelected(item.id) ? 'text-success' : 'text-silver',
                        { 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }
                      ]"
                    />

                    <template v-if="isSelected(item.id)">
                      {{ $t('addresses.willBeSentToThisAddress') }}
                    </template>

                    <template v-else>
                      {{ $t('addresses.sendToThisAddress') }}
                    </template>
                  </div>

                  <hr class="my-0" :class="{ 'border-success': isSelected(item.id) }"/>

                  <vertical-item class="pt-3 px-3" :value="item"/>
                </div>

                <div class="mt-auto mx-3">
                  <b-row>
                    <b-col md="6">
                      <b-btn
                        block
                        variant="outline-silver"
                        class="text-dark mb-2"
                        @click="openEditor(item)"
                      >
                        <font-awesome-icon
                          icon="pencil-alt"
                          class="align-middle text-info"
                          :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
                        />
                        
                        {{ $t('shared.edit') }}
                      </b-btn>
                    </b-col>
                    
                    <b-col md="6">
                      <b-btn
                        block
                        variant="outline-silver"
                        class="text-dark mb-3"
                        @click="emitRemove(item.id)"
                      >
                        <font-awesome-icon
                          icon="trash-alt"
                          class="align-middle text-danger"
                          :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
                        />
                        
                        {{ $t('shared.remove') }}
                      </b-btn>
                    </b-col>
                  </b-row>
                </div>
              </b-card>
            </b-col>

            <b-col xl="4" lg="6" class="mb-3">
              <b-btn
                block
                class="inherited-link h-100 p-3 border-silver"
                variant="link"
                style="border: 3px dashed"
                @click="openEditor(null)"
              >
                <font-awesome-icon
                  icon="plus"
                  size="lg"
                  class="align-middle mb-3"
                  :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
                />

                <div>
                  {{ $t('addresses.submitNewAddress') }}
                </div>
              </b-btn>
            </b-col>
          </b-row>
        </template>
        
        <template v-else>
          <horizontal-item :value="model"/>
          
          <b-btn
            class="mb-3 p-0"
            variant="link"
            @click="toggleEditing"
          >
            {{ $t('addresses.editOrChangeAddress') }}

            <font-awesome-icon
              :icon="$dir.ltr ? 'angle-right' : 'angle-left'"
              class="align-middle"
              :class="{ 'ml-1': $dir.ltr, 'mr-1': $dir.rtl }"
            />
          </b-btn>
        </template>
      </template>

      <div v-else class="text-center mb-3">
        <p>
          {{ $t('addresses.submitYourDeliveryAddress') }}.
        </p>
        
        <b-btn class="p-0" variant="link" @click="openEditor(null)">
          <font-awesome-icon
            icon="plus"
            class="align-middle"
            :class="{ 'mr-1': $dir.ltr, 'ml-1': $dir.rtl }"
          />

          {{ $t('addresses.submitNewAddress') }}
        </b-btn>
      </div>
    </template>

    <editor ref="editor"/>
  </b-card>
</template>

<script>
import HorizontalItem from './item/Horizontal'
import VerticalItem from './item/Vertical'
import Editor from './Editor'

export default {
  name: 'Addresses',
  components: {
    VerticalItem,
    HorizontalItem,
    Editor
  },
  props: {
    value: Object,
    items: { type: Array, default: () => [] },
    progressing: Boolean
  },
  data () {
    return {
      editing: false
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
    toggleEditing () {
      this.editing = !this.editing
    },
    closeEditing () {
      this.editing = false
    },
    isSelected (itemId) {
      return this.model && this.model.id === itemId
    },
    select (item) {
      this.model = item
      this.editing = false
    },
    openEditor (item) {
      this.$refs.editor.show(item)
    },
    emitRemove (itemId) {
      this.$emit('remove', itemId)
    }
  }
}
</script>
