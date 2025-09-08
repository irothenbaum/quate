<script setup lang="ts">
import Term from '@/components/game/Term.vue'
import {useGameStore} from '@/composables/useGameStore.ts'
import {ref, computed, type Ref} from 'vue'
import Pathway from '@/components/game/Pathway.vue'
import type {PathwayProps} from '@/components/game/Pathway.vue'

const {level_state, handleClickTerm} = useGameStore()

const parent = ref<HTMLDivElement | null>(null)
const termNodes = ref<HTMLDivElement[][]>([[]])

const pathwayPositions = computed<PathwayProps[][][]>(() => {
  const retVal: PathwayProps[][][] = [[[]]]

  if (!parent.value) {
    return retVal
  }

  const parentRect = parent.value.getBoundingClientRect()

  for (let i = 0; i < termNodes.value.length - 1; i++) {
    const row = termNodes.value[i]
    const nextRow = termNodes.value[i + 1]
    for (let j = 0; j < row.length; j++) {
      for (let k = 0; k < nextRow.length; k++) {
        const termA = row[j]
        const termB = nextRow[k]

        if (!termA || !termB) {
          continue
        }

        if (!retVal[i]) {
          retVal[i] = []
        }

        if (!retVal[i][j]) {
          retVal[i][j] = []
        }

        const rectA = termA.getBoundingClientRect()
        const rectB = termB.getBoundingClientRect()

        retVal[i][j][k] = {
          coords: {
            x0: rectA.left + rectA.width / 2 - parentRect.left,
            y0: rectA.top + rectA.height / 2 - parentRect.top,
            x1: rectB.left + rectB.width / 2 - parentRect.left,
            y1: rectB.top + rectB.height / 2 - parentRect.top,
          },
        }

        if (level_state.value) {
          if (level_state.value.selected[i] === j && level_state.value.selected[i + 1] === k) {
            retVal[i][j][k].isSelected = true
            // TODO: if correct and transitioning, set accordingly
          }
        }
      }
    }
  }

  return retVal
})

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
    <template v-for="(col, i) in pathwayPositions" :key="i">
      <template v-for="(row, j) in col" :key="j">
        <Pathway
          v-for="(settings, k) in row"
          :key="k"
          :coords="settings.coords"
          :is-selected="settings.isSelected"
          :is-correct="settings.isCorrect"
          :is-incorrect="settings.isIncorrect"
        />
      </template>
    </template>

    <div v-if="level_state" class="equation-path-inner">
      <div v-for="(row, i) in level_state.steps" :key="i" class="equation-row">
        <template v-for="(term, j) in row" :key="j">
          <Term
            :term="term"
            :isSelected="level_state.selected[i] === j"
            @click="handleClickTerm(term, i, j)"
            :ref="(el: any) => setTermNode(el, i, j)"
          />
        </template>
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
  position: relative;

  .equation-path-inner {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column-reverse; // reverse because we want the first row at the bottom
    gap: 0;
    justify-content: space-evenly;
    align-items: center;
    position: relative;
    z-index: 10;
  }

  .equation-row {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
}
</style>
