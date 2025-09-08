<script setup lang="ts">
import {computed} from 'vue'
import type {LineCoords} from '@/types/game.ts'

export interface LineSettings {
  thickness?: number
  color?: string
  border?: string
  zIndex?: number
  withCaps?: boolean
}

export interface LineProps extends LineSettings {
  coords: LineCoords
}

const props = withDefaults(defineProps<LineProps>(), {
  thickness: 3,
  color: 'var(--color-world-tint)',
  border: 'transparent',
  zIndex: 1,
  withCaps: false,
})

const length = computed(() => {
  const deltaX = props.coords.x1 - props.coords.x0
  const deltaY = props.coords.y1 - props.coords.y0
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
})

const rotation = computed(() => {
  const deltaX = props.coords.x1 - props.coords.x0
  const deltaY = props.coords.y1 - props.coords.y0
  // Add 90 degrees to rotate the div so its height traces the line
  return (Math.atan2(deltaY, deltaX) * 180) / Math.PI + 90
})

const position = computed(() => {
  const midX = (props.coords.x0 + props.coords.x1) / 2
  const midY = (props.coords.y0 + props.coords.y1) / 2

  return {
    left: `${midX}px`,
    top: `${midY}px`,
    transform: `translate(-50%, -50%) rotate(${rotation.value}deg)`,
    width: `${props.thickness}px`,
    height: `${length.value}px`,
    backgroundColor: props.color,
    border: `1px solid ${props.border}`,
    zIndex: props.zIndex,
  }
})
</script>

<template>
  <div
    :class="{pathway: true, 'with-caps': props.withCaps}"
    :style="{
      ...position,
    }"
  />
</template>

<style scoped lang="scss">
@use '../../styles';

.pathway {
  position: absolute;
  height: 3px;
  width: 0;
  transition: all 0.2s ease-out;

  &.with-caps {
    &:before,
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      padding-top: 100%;
      border-radius: 50%;
      background: inherit;
      border: inherit;
      transform: translateY(-50%);
    }

    &:after {
      top: auto;
      bottom: 0;
      transform: translateY(50%);
    }
  }
}
</style>
