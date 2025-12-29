<script setup lang="ts">
import {ref, watch} from 'vue'
import {TRANSITION_STEP_MS} from '@/constants/environment.ts'
import {formatNumber} from '@/utilities'

const STEP_TIME = 50

// Props definition
const props = withDefaults(
  defineProps<{
    number?: number
    animationDuration?: number
    animationDelay?: number
  }>(),
  {
    number: 0,
    animationDuration: TRANSITION_STEP_MS,
    animationDelay: 0,
  },
)

const emit = defineEmits<{
  (e: 'update', value: number): void
}>()

const displayNumber = ref(props.number || 0)
const intervalId = ref<number | null>(null)
const timeoutId = ref<number | null>(null)
watch(
  () => props.number,
  newNumber => {
    if (timeoutId.value) {
      clearTimeout(timeoutId.value as number)
      clearInterval(intervalId.value as number)
      timeoutId.value = null
    }
    timeoutId.value = setTimeout(() => {
      const startNumber = displayNumber.value
      const endNumber = newNumber || 0
      const duration = props.animationDuration || TRANSITION_STEP_MS
      const steps = Math.ceil(duration / STEP_TIME)
      let currentStep = 0

      intervalId.value = setInterval(() => {
        currentStep++
        displayNumber.value = startNumber + ((endNumber - startNumber) * currentStep) / steps
        if (currentStep >= steps) {
          clearInterval(intervalId.value as number)
          intervalId.value = null
          displayNumber.value = endNumber
        }

        displayNumber.value = Math.round(displayNumber.value)

        emit('update', displayNumber.value)
      }, STEP_TIME)
    }, props.animationDelay)
  },
  {immediate: true},
)
</script>

<template>
  <span :class="{animating: !!intervalId}">{{ formatNumber(displayNumber) }}</span>
</template>

<style lang="scss">
@use '../../styles';
</style>
