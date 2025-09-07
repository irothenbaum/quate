<script setup lang="ts">
import {computed, ref} from 'vue'
import type {LineCoords} from '@/types/game.ts'

const props = withDefaults(
  defineProps<{
    coords: LineCoords
    thickness?: number
    color?: string
    border?: string
    zIndex?: number
  }>(),
  {
    thickness: 3,
    color: 'var(--color-secondary)',
    border: 'var(--color-secondary-dark)',
    zIndex: 1,
  },
)

const rotation = computed(() => {
  const deltaX = props.coords.x1 - props.coords.x0
  const deltaY = props.coords.y1 - props.coords.y0
  return (Math.atan2(deltaY, deltaX) * 180) / Math.PI
})

const length = computed(() => {
  const deltaX = props.coords.x1 - props.coords.x0
  const deltaY = props.coords.y1 - props.coords.y0
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
})

const position = computed(() => {
  const midX = (props.coords.x0 + props.coords.x1) / 2
  const midY = (props.coords.y0 + props.coords.y1) / 2
  return {
    left: `${midX}px`,
    top: `${midY}px`,
    transform: `translate(-50%, -50%) rotate(${rotation.value}deg)`,
    width: `${length.value}px`,
    height: `${props.thickness}px`,
    backgroundColor: props.color,
    border: `1px solid ${props.border}`,
    zIndex: props.zIndex,
  }
})
</script>

<template>
  <div
    class="pathway"
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
}
</style>
