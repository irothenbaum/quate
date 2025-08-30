<script setup lang="ts">
import useGameStore from '@/stores/game.ts'
import {storeToRefs} from 'pinia'
import Term from '@/components/game/Term.vue'

const gameStore = useGameStore()
const {level_state} = storeToRefs(gameStore)
const {handleClickTerm} = gameStore
</script>

<template>
  <div class="equation-path">
    <div v-if="level_state" class="equation-path-inner">
      <div v-for="(col, i) in level_state.steps" :key="i" class="equation-row">
        <Term
          :term="term"
          v-for="(term, j) in col"
          :key="j"
          :isSelected="level_state.selected[i] === j"
          @click="handleClickTerm(term, i, j)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles';

.equation-path {
  height: 100%;
  width: 100%;
  overflow: hidden;

  .equation-path-inner {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0;
    justify-content: space-evenly;
    align-items: center;
  }

  .equation-row {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
}
</style>
