<script setup lang="ts">
import type {TermStep} from '@/types/game.ts'

const props = defineProps<{
  term: TermStep
}>()

// Emits definition
const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <div class="term">
    <div class="term-inner">{{}}</div>
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
}
</style>
