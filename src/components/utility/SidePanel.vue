<script setup lang="ts">
import Drawer from 'primevue/drawer'
import {ref, watch} from 'vue'

// Props definition
const props = withDefaults(
  defineProps<{
    title?: string
    open?: boolean
  }>(),
  {
    open: false,
  },
)

// Emits definition
const emit = defineEmits<{
  (e: 'toggle', value: boolean): void
}>()

const openControl = ref(props.open)

watch(
  () => props.open,
  nowOpen => {
    openControl.value = nowOpen
  },
  {immediate: true},
)
watch(openControl, nowOpen => {
  emit('toggle', nowOpen)
})
</script>

<template>
  <Drawer v-model:visible="openControl" :header="title" position="right" class="side-panel-wrapper">
    <div class="side-panel-content">
      <slot />
    </div>
  </Drawer>
</template>

<style lang="scss">
@use '../../styles';

.side-panel-wrapper {
  @include styles.medium-and-up {
    max-width: 50% !important;
    width: 600px !important;
  }
  @include styles.small-and-below {
    width: 100% !important;
  }
}
.side-panel-content {
}
</style>
