<script setup lang="ts">
import {useGameStore} from '@/composables/useGameStore.ts'

// Emits definition
const emit = defineEmits<{
  (e: 'pause'): void
}>()

const {levels_completed, score, level_state} = useGameStore()
</script>

<template>
  <div class="hud-top">
    <div class="level">Level: {{ levels_completed + 1 }}</div>
    <div v-if="level_state" class="target">
      <div class="target-inner">
        {{ level_state.target }}
      </div>
    </div>
    <div class="score">Score: {{ score }}</div>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles';

.hud-top {
  height: var(--row-height);
  width: 100%;
  @include styles.flex-row();
  justify-content: space-evenly;

  .target {
    @include styles.flex-row();
    height: 60%;
    width: 30%;
    border-radius: var(--border-radius-md);
    background-color: var(--color-world-shade);
    position: relative;

    font-size: var(--font-size-xxl);

    &:before {
      content: '';
      position: absolute;
      left: 35%;
      width: 30%;
      height: 50%;
      bottom: -33%;
      background-color: var(--color-world-shade);
    }

    .target-inner {
    }
  }
}
</style>
