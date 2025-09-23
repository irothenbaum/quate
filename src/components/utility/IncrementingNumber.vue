<script setup lang="ts">
import {ref, watch} from 'vue'
import {TRANSITION_STEP_MS} from '@/constants/environment.ts'

const STEP_TIME = 50

// Props definition
const props = withDefaults(
  defineProps<{
    number?: number
    animationDuration?: number
  }>(),
  {
    number: 0,
    animationDuration: TRANSITION_STEP_MS,
  },
)
const displayNumber = ref(props.number)
watch(
  () => props.number,
  newNumber => {
    const startNumber = displayNumber.value
    const endNumber = newNumber || 0
    const duration = props.animationDuration || TRANSITION_STEP_MS
    const steps = Math.ceil(duration / STEP_TIME)
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      displayNumber.value = startNumber + ((endNumber - startNumber) * currentStep) / steps
      if (currentStep >= steps) {
        clearInterval(interval)
        displayNumber.value = endNumber
      }
    }, STEP_TIME)
  },
  {immediate: true},
)
</script>

<template>
  <span>{{ Math.round(displayNumber) }}</span>
</template>

<style lang="scss">
@use '../../styles';
</style>
