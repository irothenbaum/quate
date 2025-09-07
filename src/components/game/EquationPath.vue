<script setup lang="ts">
import Term from '@/components/game/Term.vue'
import {useGameStore} from '@/composables/useGameStore.ts'
import {ref, computed, type Ref} from 'vue'
import Pathway from '@/components/game/Pathway.vue'
import type {LineCoords} from '@/types/game.ts'

interface PathwaySettings {
  thickness?: number
  color?: string
  border?: string
  zIndex?: number
}

const defaultPathwaySettings: PathwaySettings = {
  thickness: 3,
  color: 'var(--color-world-tint)',
  border: 'var(--color-world-tint)',
}

const selectedPathwaySettings: PathwaySettings = {
  thickness: 12,
  color: 'var(--color-secondary)',
  border: 'var(--color-secondary-dark)',
  zIndex: 6,
}

const correctPathwaySettings: PathwaySettings = {
  thickness: 12,
  color: 'var(--color-power)',
  border: 'var(--color-power-dark)',
  zIndex: 6,
}

const incorrectPathwaySettings: PathwaySettings = {
  thickness: 12,
  color: 'var(--color-tertiary)',
  border: 'var(--color-tertiary-dark)',
  zIndex: 6,
}

const {level_state, handleClickTerm} = useGameStore()

const parent = ref<HTMLDivElement | null>(null)
const termNodes = ref<HTMLDivElement[][]>([[]])

const pathwayPositions = computed<LineCoords[][][]>(() => {
  const retVal: LineCoords[][][] = [[[]]]

  for (let i = 0; i < termNodes.value.length - 1; i++) {
    const row = termNodes.value[i]
    const nextRow = termNodes.value[i + 1]
    for (let j = 0; j < row.length; j++) {
      for (let k = 0; k < nextRow.length; k++) {
        const termA = row[j]
        const termB = nextRow[k]
        const parentNode = parent.value

        if (!termA || !termB || !parentNode) {
          continue
        }
        const rectA = termA.getBoundingClientRect()
        const rectB = termB.getBoundingClientRect()
        const parentRect = parentNode.getBoundingClientRect()

        const coords: LineCoords = {
          x0: rectA.left + rectA.width / 2 - parentRect.left,
          y0: rectA.top + rectA.height / 2 - parentRect.top,
          x1: rectB.left + rectB.width / 2 - parentRect.left,
          y1: rectB.top + rectB.height / 2 - parentRect.top,
        }

        if (!retVal[i]) {
          retVal[i] = []
        }

        if (!retVal[i][j]) {
          retVal[i][j] = []
        }

        retVal[i][j][k] = coords
      }
    }
  }

  return retVal
})

const pathwaySettings = computed<PathwaySettings[][][]>(() => {
  const retVal: PathwaySettings[][][] = [[[]]]

  for (let i = 0; i < termNodes.value.length - 1; i++) {
    const row = termNodes.value[i]
    const nextRow = termNodes.value[i + 1]
    for (let j = 0; j < row.length; j++) {
      for (let k = 0; k < nextRow.length; k++) {
        if (!retVal[i]) {
          retVal[i] = []
        }
        if (!retVal[i][j]) {
          retVal[i][j] = []
        }
        retVal[i][j][k] = {...defaultPathwaySettings}
        if (level_state.value) {
          if (level_state.value.selected[i] === j && level_state.value.selected[i + 1] === k) {
            retVal[i][j][k] = {...selectedPathwaySettings}
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
          v-for="(coords, k) in row"
          :key="k"
          :coords="coords"
          :color="pathwaySettings[i][j][k].color"
          :thickness="pathwaySettings[i][j][k].thickness"
          :border="pathwaySettings[i][j][k].border"
          :z-index="pathwaySettings[i][j][k].zIndex"
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
