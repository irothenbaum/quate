<script setup lang="ts">
import Term from '@/components/game/Term.vue'
import {useGameStore} from '@/composables/useGameStore.ts'
import {computed, ref, watch} from 'vue'
import type {PathwayProps} from '@/components/game/Pathway.vue'
import Pathway from '@/components/game/Pathway.vue'
import {GameAction, type LineCoords} from '@/types/game.ts'

const {level_state, handleClickTerm, game_action} = useGameStore()

const parent = ref<HTMLDivElement | null>(null)
const startMarker = ref<HTMLDivElement | null>(null)
const targetMarker = ref<HTMLDivElement | null>(null)
const termNodes = ref<HTMLDivElement[][]>([[]])

const termHeight = computed<number>(() => (termNodes.value ? termNodes.value[0][0].clientHeight : 0))
const tailLength = computed<number>(() => {
  if (!parent.value || !level_state.value || !termNodes.value) {
    return 100
  }

  const rowCount = termNodes.value.length

  const termSpace = termHeight.value * rowCount
  const emptySpace = parent.value.clientHeight - termSpace
  const spaceBetweenTerms = emptySpace / (rowCount + 1)

  return Math.min(100, spaceBetweenTerms / 3 + termHeight.value * 0.4)
})

const startPathways = computed<PathwayProps[]>(() => {
  if (!parent.value || !startMarker.value || game_action.value === GameAction.transitioning_level) {
    return []
  }

  const rowIndex = 0
  return termNodes.value[0]
    .map((node: HTMLDivElement, index) => {
      const pathway: PathwayProps = {
        coords: getCoordsBetweenNodes(startMarker.value as HTMLDivElement, node, parent.value as HTMLDivElement),
      }

      if (level_state.value) {
        if (level_state.value.selected[rowIndex] === index) {
          pathway.isSelected = true
          pathway.isCorrect = game_action.value === GameAction.submission_correct
          pathway.isIncorrect = game_action.value === GameAction.submission_incorrect
        }
      }

      return pathway
    })
    .filter((p): p is PathwayProps => p !== null)
})

const targetPathways = computed<PathwayProps[]>(() => {
  if (!parent.value || !targetMarker.value || game_action.value === GameAction.transitioning_level) {
    return []
  }

  const rowIndex = termNodes.value.length - 1
  return termNodes.value[rowIndex]
    .map((node: HTMLDivElement, index) => {
      const pathway: PathwayProps = {
        coords: getCoordsBetweenNodes(node, targetMarker.value as HTMLDivElement, parent.value as HTMLDivElement),
      }

      if (level_state.value) {
        if (level_state.value.selected[rowIndex] === index) {
          pathway.isSelected = true
          pathway.isCorrect = game_action.value === GameAction.submission_correct
          pathway.isIncorrect = game_action.value === GameAction.submission_incorrect
        }
      }

      return pathway
    })
    .filter((p): p is PathwayProps => p !== null)
})

const pathwayPositions = computed<PathwayProps[][][]>(() => {
  const retVal: PathwayProps[][][] = [[[]]]

  if (!parent.value || game_action.value === GameAction.transitioning_level) {
    return retVal
  }

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

        const thisProps: PathwayProps = {
          coords: getCoordsBetweenNodes(termA, termB, parent.value),
        }

        if (level_state.value) {
          if (level_state.value.selected[i] === j && level_state.value.selected[i + 1] === k) {
            thisProps.isSelected = true
            thisProps.isCorrect = game_action.value === GameAction.submission_correct
            thisProps.isIncorrect = game_action.value === GameAction.submission_incorrect
          }
        }

        retVal[i][j][k] = thisProps
      }
    }
  }

  return retVal
})

watch(
  () => level_state.value.steps,
  async () => {
    // when steps change, reset termNodes array
    termNodes.value = [[]]
  },
)

function setTermNode(e: any, col: number, row: number) {
  if (!e || !e.root) {
    return
  }

  if (!termNodes.value[col]) {
    termNodes.value[col] = []
  }

  termNodes.value[col][row] = e.root as HTMLDivElement
}

function getCoordsBetweenNodes(node1: HTMLDivElement, node2: HTMLDivElement, parent: HTMLDivElement): LineCoords {
  const rect1 = node1.getBoundingClientRect()
  const rect2 = node2.getBoundingClientRect()
  const parentRect = parent.getBoundingClientRect()

  return {
    x0: rect1.left + rect1.width / 2 - parentRect.left,
    y0: rect1.top + rect1.height / 2 - parentRect.top,
    x1: rect2.left + rect2.width / 2 - parentRect.left,
    y1: rect2.top + rect2.height / 2 - parentRect.top,
  }
}
</script>

<template>
  <div class="equation-path" ref="parent">
    <div class="start-path-marker" ref="startMarker" />
    <div class="target-path-marker" ref="targetMarker" />
    <div :class="{pathways: true, hidden: game_action === GameAction.transitioning_level}">
      <Pathway
        v-for="(settings, k) in startPathways"
        :key="k"
        :coords="settings.coords"
        :is-selected="settings.isSelected"
        :is-correct="settings.isCorrect"
        :is-incorrect="settings.isIncorrect"
        :bottom-tail-length="tailLength - termHeight / 3"
        :tail-length="tailLength"
      />

      <Pathway
        v-for="(settings, k) in targetPathways"
        :key="k"
        :coords="settings.coords"
        :is-selected="settings.isSelected"
        :is-correct="settings.isCorrect"
        :is-incorrect="settings.isIncorrect"
        :tail-length="tailLength"
        :top-tail-length="tailLength - termHeight / 3"
      />

      <template v-for="(row, i) in pathwayPositions" :key="i">
        <template v-for="(term, j) in row" :key="j">
          <Pathway
            v-for="(settings, k) in term"
            :key="k"
            :coords="settings.coords"
            :is-selected="settings.isSelected"
            :is-correct="settings.isCorrect"
            :is-incorrect="settings.isIncorrect"
            :tail-length="tailLength"
          />
        </template>
      </template>
    </div>

    <div v-if="level_state" class="equation-path-inner">
      <div v-for="(row, i) in level_state.steps" :key="i" class="equation-row">
        <template v-for="(term, j) in row" :key="j">
          <Term
            :term="term"
            :is-selected="level_state.selected[i] === j"
            :is-correct="level_state.selected[i] === j && game_action === GameAction.submission_correct"
            :is-incorrect="level_state.selected[i] === j && game_action === GameAction.submission_incorrect"
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

  .target-path-marker,
  .start-path-marker {
    position: absolute;
    top: 0;
    left: 50%;
    height: 0;
    width: 0;
    opacity: 0;
  }

  .start-path-marker {
    top: auto;
    bottom: 0;
  }

  .pathways {
    opacity: 1;
    transition: all 0.2s ease-out;

    &.hidden {
      opacity: 0;
    }
  }
}
</style>
