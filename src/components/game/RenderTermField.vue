<script setup lang="ts">
import Term from '@/components/game/Term.vue'
import {computed, ref, watch, toRefs} from 'vue'
import type {PathwayProps} from '@/components/game/Pathway.vue'
import Pathway from '@/components/game/Pathway.vue'
import {GameAction, type GameLevel, type TermStep} from '@/types/game.ts'
import {getCoordsBetweenNodes, isTransitioningLevel} from '@/utilities.ts'

const props = withDefaults(
  defineProps<{
    level_state: GameLevel
    handleClickTerm?: (term: TermStep, column: number, row: number) => void
    game_action?: GameAction
  }>(),
  {
    game_action: GameAction.ready,
    handleClickTerm: () => {},
  },
)

const {level_state, handleClickTerm, game_action} = toRefs(props)

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

const hidePathsOverride = computed<boolean>(() => false)

const startPathways = computed<PathwayProps[]>(() => {
  if (!parent.value || !startMarker.value || hidePathsOverride.value) {
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
          pathway.isCorrect =
            game_action.value === GameAction.submission_correct || isTransitioningLevel(game_action.value)
          pathway.isIncorrect = game_action.value === GameAction.submission_incorrect
        }
      }

      return pathway
    })
    .filter((p): p is PathwayProps => p !== null)
})

const targetPathways = computed<PathwayProps[]>(() => {
  if (!parent.value || !targetMarker.value || hidePathsOverride.value) {
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
          pathway.isCorrect =
            game_action.value === GameAction.submission_correct || isTransitioningLevel(game_action.value)
          pathway.isIncorrect = game_action.value === GameAction.submission_incorrect
        }
      }

      return pathway
    })
    .filter((p): p is PathwayProps => p !== null)
})

const pathwayPositions = computed<PathwayProps[][][]>(() => {
  const retVal: PathwayProps[][][] = [[[]]]

  if (!parent.value || hidePathsOverride.value) {
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
            thisProps.isCorrect =
              game_action.value === GameAction.submission_correct || isTransitioningLevel(game_action.value)
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
</script>

<template>
  <div class="term-field" ref="parent">
    <div class="start-path-marker" ref="startMarker" />
    <div class="target-path-marker" ref="targetMarker" />
    <div class="pathways">
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

    <div v-if="level_state" class="term-field-inner">
      <div v-for="(row, i) in level_state.steps" :key="i" class="equation-row">
        <template v-for="(term, j) in row" :key="j">
          <Term
            :term="term"
            :is-selected="level_state.selected[i] === j"
            :is-correct="
              level_state.selected[i] === j &&
              [
                GameAction.submission_correct,
                GameAction.transition_level_start,
                GameAction.transition_level_results,
              ].includes(game_action)
            "
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

.term-field {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;

  .term-field-inner {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column; // we want first row at the top
    gap: 0;
    justify-content: space-evenly;
    align-items: center;
    position: relative;
    z-index: 10;
  }

  .equation-row {
    height: var(--row-height);
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }

  .target-path-marker,
  .start-path-marker {
    position: absolute;
    bottom: 0;
    top: auto;
    left: 50%;
    height: 0;
    width: 0;
    opacity: 0;
  }

  .start-path-marker {
    bottom: auto;
    top: 0;
  }

  .pathways {
    opacity: 1;
    transition: opacity 0.2s ease-out styles.$transitionStepSpeed;
  }
}

.transition-level-results,
.transition-level-end {
  .pathways {
    opacity: 0;
  }
}
</style>
