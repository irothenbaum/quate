<script setup lang="ts">
import useGameStore from '@/stores/game.ts'
// Emits definition
const emit = defineEmits<{
  (e: 'pause'): void
}>()

const gameStore = useGameStore()

const {score} = gameStore.state
</script>

<template>
  <div class="hud-top">{{ score }}</div>
</template>

<style scoped lang="scss">
@use '../../styles';

.hud-top {
  height: var(--row-height);
  width: 100%;
  @include styles.flex-row();
}
</style>
