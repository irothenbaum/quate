<script setup lang="ts">
import useGameStore from '@/stores/game.ts'
import {storeToRefs} from 'pinia'
// Emits definition
const emit = defineEmits<{
  (e: 'pause'): void
}>()

const gameStore = useGameStore()

const {level_number, score} = storeToRefs(gameStore)
</script>

<template>
  <div class="hud-top">
    <div class="level">
      {{ level_number }}
    </div>
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
