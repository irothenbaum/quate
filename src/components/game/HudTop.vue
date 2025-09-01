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
    <div v-if="level_state">{{ level_state.target }}</div>
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
}
</style>
