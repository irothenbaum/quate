<script setup lang="ts">
import type {TermStep} from '@/types/game.ts'

const props = withDefaults(
  defineProps<{
    term: TermStep
    isSelected?: boolean
  }>(),
  {
    isSelected: false,
  },
)

// Emits definition
const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <div :class="{term: true, selected: isSelected}">
    <div class="term-inner">
      <span class="operation">{{ term.operation }}</span>
      <span class="number">{{ term.number }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles';

$size: 4rem;

.term {
  border-radius: 50%;
  height: $size;
  width: $size;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: var(--color-dark-grey);
  border: 3px solid var(--color-dark-grey);

  &.selected {
    border-color: var(--color-power);
    box-shadow: 0 0 10px -5px var(--color-power-tint);
  }
}
</style>
