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
      <div class="target-spacer"></div>
      <div class="target-inner">
        {{ level_state.target }}
      </div>
      <div class="target-tail"></div>
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
    @include styles.flex-column();
    gap: 0;
    height: 100%;
    width: 30%;
    font-size: var(--font-size-xxl);

    .target-spacer {
      flex: 1;
    }

    .target-inner {
      @include styles.flex-row();
      height: 60%;
      width: 100%;
      border-radius: var(--border-radius-md);
      background-color: var(--color-world-shade);
      // border: 1px solid var(--color-primary-shade);
    }

    .target-tail {
      width: 30%;
      flex: 1;
      background-color: var(--color-world-shade);
    }
  }
}
</style>
