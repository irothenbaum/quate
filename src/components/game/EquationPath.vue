<script setup lang="ts">
import useGameStore from '@/stores/game.ts'
import {storeToRefs} from 'pinia'
import Term from '@/components/game/Term.vue'
import type {TermStep} from '@/types/game.ts'

// Emits definition
const emit = defineEmits<{
  (e: 'pause'): void
}>()

const gameStore = useGameStore()
const {level_state} = storeToRefs(gameStore)
const {handleClickTerm} = gameStore
</script>

<template>
  <div class="equation-path">
    <div v-for="(c, i) in level_state.steps" :key="i" class="equation-row">
      <Term :term="term" v-for="(term, j) in c" :key="j" @click="handleClickTerm(term, i, j)" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles';

.equation-path {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
  justify-content: space-evenly;
  align-items: center;

  .equation-row {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
}
</style>
