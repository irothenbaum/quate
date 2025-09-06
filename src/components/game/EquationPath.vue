<script setup lang="ts">
import Term from '@/components/game/Term.vue'
import {useGameStore} from '@/composables/useGameStore.ts'
import {ref} from 'vue'

const {level_state, handleClickTerm} = useGameStore()

const parent = ref<HTMLDivElement | null>(null)
const termNodes = ref<HTMLDivElement[][]>([[]])

function setTermNode(e: any, col: number, row: number) {
  if (!e || !e.root) {
    return
  }

  if (!termNodes.value[col]) {
    termNodes.value[col] = []
  }

  termNodes.value[col][row] = e.root as HTMLDivElement
}
</script>

<template>
  <div class="equation-path" ref="parent">
    <div v-if="level_state" class="equation-path-inner">
      <div v-for="(col, i) in level_state.steps" :key="i" class="equation-row">
        <Term
          :term="term"
          :key="j"
          :isSelected="level_state.selected[i] === j"
          @click="handleClickTerm(term, i, j)"
          v-for="(term, j) in col"
          :ref="(el: any) => setTermNode(el, i, j)"
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
    flex-direction: column-reverse; // reverse because we want the first row at the bottom
    gap: 0;
    justify-content: space-evenly;
    align-items: center;
  }

  .equation-row {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
}
</style>
