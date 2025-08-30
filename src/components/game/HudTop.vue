<script setup lang="ts">
import useGameStore from '@/stores/game.ts'
import {storeToRefs} from 'pinia'
// Emits definition
const emit = defineEmits<{
  (e: 'pause'): void
}>()

const gameStore = useGameStore()

const {levels_completed, score} = storeToRefs(gameStore)
</script>

<template>
  <div class="hud-top">
    <div class="level">{{ levels_completed }} + 1</div>
    <div class="score">
      {{ score }}
    </div>
    <div>&nbsp;</div>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles';

.hud-top {
  height: var(--row-height);
  width: 100%;
  @include styles.flex-row();
  justify-content: space-evenly;
}
</style>
