<script setup lang="ts">
import {computed} from 'vue'
import type {LineCoords} from '@/types/game.ts'
import type {LineSettings} from './LineRender.vue'
import LineRender from '@/components/game/LineRender.vue'

const DefaultTailLength = 100

// --------------------------------------

export interface PathwayProps {
  coords: LineCoords
  isSelected?: boolean
  isCorrect?: boolean
  isIncorrect?: boolean
  tailLength?: number
  topTailLength?: number
  bottomTailLength?: number
  isStartTail?: boolean
}

const defaultLineSettings: LineSettings = {
  thickness: 3,
  color: 'var(--color-pathway-default)',
}

const selectedLineSettings: LineSettings = {
  thickness: 12,
  color: 'var(--color-pathway-selected)',
  zIndex: 6,
}

const correctLineSettings: LineSettings = {
  thickness: 12,
  color: 'var(--color-pathway-correct)',
  zIndex: 6,
}

const incorrectLineSettings: LineSettings = {
  thickness: 12,
  color: 'var(--color-pathway-incorrect)',
  zIndex: 6,
}

// --------------------------------------

const props = withDefaults(defineProps<PathwayProps>(), {
  isStartTail: false,
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
    y1: props.coords.y0 - (props.bottomTailLength ?? props.tailLength ?? DefaultTailLength),
  }
  const endTail = {
    x0: props.coords.x1,
    y0: props.coords.y1 + (props.topTailLength ?? props.tailLength ?? DefaultTailLength),
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
  <line-render
    v-for="(c, i) in finalCoords"
    :key="i"
    :coords="c"
    v-bind="lineSettings"
    :with-caps="i === 1"
    :fade-start-color="i === 0 && props.isStartTail ? 'var(--color-pathway-correct)' : undefined"
  >
    <slot />
  </line-render>
</template>

<style scoped lang="scss">
@use '../../styles';
</style>
