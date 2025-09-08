<script setup lang="ts">
import {computed} from 'vue'
import type {LineCoords} from '@/types/game.ts'
import type {LineSettings} from './LineRender.vue'
import LineRender from '@/components/game/LineRender.vue'

const DefaultTailLength = 100

export interface PathwayProps {
  coords: LineCoords
  isSelected?: boolean
  isCorrect?: boolean
  isIncorrect?: boolean
  tailLength?: number
}

const defaultLineSettings: LineSettings = {
  thickness: 3,
  color: 'var(--color-world-tint)',
  border: 'var(--color-world-tint)',
}

const selectedLineSettings: LineSettings = {
  thickness: 12,
  color: 'var(--color-secondary)',
  border: 'var(--color-secondary-dark)',
  zIndex: 6,
}

const correctLineSettings: LineSettings = {
  thickness: 12,
  color: 'var(--color-power)',
  border: 'var(--color-power-dark)',
  zIndex: 6,
}

const incorrectLineSettings: LineSettings = {
  thickness: 12,
  color: 'var(--color-tertiary)',
  border: 'var(--color-tertiary-dark)',
  zIndex: 6,
}

const props = withDefaults(defineProps<PathwayProps>(), {
  isSelected: false,
  isCorrect: false,
  isIncorrect: false,
  tailLength: DefaultTailLength,
})

const lineSettings = computed<LineSettings>(() => {
  if (props.isCorrect) {
    return correctLineSettings
  } else if (props.isIncorrect) {
    return incorrectLineSettings
  } else if (props.isSelected) {
    return selectedLineSettings
  } else {
    return defaultLineSettings
  }
})

// instead of drawing a single line, the PathWay draws a leading and trail tail in from the source and destination
const finalCoords = computed(() => {
  const startTail = {
    x0: props.coords.x0,
    y0: props.coords.y0,
    x1: props.coords.x0,
    y1: props.coords.y0 - (props.tailLength ?? DefaultTailLength),
  }
  const endTail = {
    x0: props.coords.x1,
    y0: props.coords.y1 + (props.tailLength ?? DefaultTailLength),
    x1: props.coords.x1,
    y1: props.coords.y1,
  }
  const middleLine = {
    x0: startTail.x1,
    y0: startTail.y1,
    x1: endTail.x0,
    y1: endTail.y0,
  }

  return [startTail, middleLine, endTail]
})
</script>

<template>
  <line-render v-for="(c, i) in finalCoords" :key="i" :coords="c" v-bind="lineSettings" :with-caps="i === 1" />
</template>

<style scoped lang="scss">
@use '../../styles';

.pathway {
  position: absolute;
  height: 3px;
  width: 0;
  transition: all 0.2s ease-out;
}
</style>
