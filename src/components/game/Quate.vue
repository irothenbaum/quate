<script setup lang="ts">
import {onMounted, ref, computed, nextTick, watch} from 'vue'
import HudTop from '@/components/game/HudTop.vue'
import HudBottom from '@/components/game/HudBottom.vue'
import {useGameStore} from '@/composables/useGameStore.ts'
import EquationPath from '@/components/game/EquationPath.vue'
import {applyTermStep, generateLevel, gameActionToClass} from '@/utilities.ts'
import {GameAction} from '@/types/game.ts'

// Emits definition
const emit = defineEmits<{
  (e: 'game-over', data: number | undefined): void
}>()

const pathRef = ref<HTMLDivElement | null>(null)
const hasFirstGuessBonus = ref<boolean>(true)
const {level_state, difficulty, increaseScore, startNextLevel, game_action} = useGameStore()
const levelNum = ref<number>(0) // levelNum starts at 0 and increases with every completed round
// it basically matches levels_completed but needs to be separate so we can generate the next level before completing it
// could possibly refactor...

const maxHeight = ref(0)

function updateHeight() {
  console.log('Update Height called')
  if (pathRef.value) {
    const currentHeight = pathRef.value.offsetHeight
    if (currentHeight > maxHeight.value) {
      maxHeight.value = currentHeight
      console.log('Updated maxHeight to', maxHeight.value)
    }
  }
}

onMounted(() => {
  // Initial measure after DOM renders
  nextTick(updateHeight)
})

const totalTerms = computed(() => {
  return level_state.value.steps.reduce((acc, step) => acc + step.length, 0)
})

watch(
  () => level_state.value.selected.length,
  () => {
    if (level_state.value.selected.length === level_state.value.steps.length) {
      handleSubmitAnswer()
    }
  },
)

function handleSubmitAnswer() {
  game_action.value = GameAction.handling_submission

  // check if the selected terms lead to the target
  let currentValue = level_state.value.start
  for (let i = 0; i < level_state.value.selected.length; i++) {
    const termIndex = level_state.value.selected[i]
    const term = level_state.value.steps[i][termIndex]
    currentValue = applyTermStep(currentValue, term)
  }

  setTimeout(() => {
    if (currentValue === level_state.value.target) {
      // correct!
      game_action.value = GameAction.submission_correct
      setTimeout(() => {
        handleLevelComplete()
      }, 1000)
    } else {
      // wrong!
      hasFirstGuessBonus.value = false
      game_action.value = GameAction.submission_incorrect
      setTimeout(() => {
        level_state.value.selected = []
        game_action.value = GameAction.ready
      }, 1000)
    }
  }, 500)
}

function handleLevelComplete() {
  // calc points

  // 10 points per term on the board
  const unitPoints = 10 * totalTerms.value

  const secondsToComplete = Math.floor((Date.now() - (level_state.value.started_timestamp || 0)) / 1000)
  const fastCompletionBonus = Math.max(0, 5 - secondsToComplete)
  const firstGuessBonus = hasFirstGuessBonus.value ? 5 : 0

  // total bonus is time bonus + first guess bonus
  const bonusPoints = fastCompletionBonus + firstGuessBonus

  increaseScore(unitPoints, bonusPoints)

  // inc this immediately
  levelNum.value += 1

  const nextLevel = generateLevel(levelNum.value, difficulty.value, level_state.value.target)

  startNextLevel(nextLevel)
  // reset our first guess bonus
  hasFirstGuessBonus.value = true
}

function handleTimeExpired() {
  // TODO: How to handle game over
}

onMounted(() => {
  setTimeout(() => {
    console.log('STARTING')
    startNextLevel(generateLevel(levelNum.value, difficulty.value, 0))
  }, 1000)
})
</script>

<template>
  <div id="quate-game" :class="gameActionToClass[game_action]">
    <div class="world-spacer">
      <div class="path-clone"></div>
    </div>
    <div id="world">
      <HudTop />
      <div
        id="path-container"
        ref="pathRef"
        :style="game_action === GameAction.ready ? undefined : {height: maxHeight + 'px'}"
      >
        <div id="path-inner" :style="{height: maxHeight + 'px'}">
          <EquationPath />
        </div>
      </div>
      <HudBottom @submit="handleSubmitAnswer()" @timeout="handleTimeExpired()" />
    </div>
    <div class="world-spacer">
      <div class="path-clone"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles';

#quate-game {
  height: 100%;
  width: 100%;
  @include styles.flex-row(0);

  .world-spacer {
    flex: 1;
    height: 100%;
    width: auto;
    max-width: calc((100% - var(--screen-medium-min)) / 2);
    background-color: var(--color-primary);
    position: relative;
    @include styles.flex-column(0);

    .path-clone {
      height: 100%;
      width: 100%;
      margin: var(--row-height) 0;
      background-color: var(--color-world-shade);
    }
  }

  #world {
    @include styles.flex-column(0);
    height: 100%;
    overflow: hidden;
    width: 100%;
    max-width: var(--screen-medium-min);

    #path-container {
      width: 100%;
      height: 100%;
      flex: 1;
      overflow: hidden;
      background-color: var(--color-world);
      box-shadow: inset 0 0 30px var(--color-world-shade);
      transition: height styles.$transitionStep;

      #path-inner {
        width: 100%;
        height: 100%;
        top: 0;
        position: relative;
      }
    }
  }

  &.transitioning-level {
    #world,
    .world-spacer {
      animation: world-cycle calc(3 * #{styles.$transitionStepSpeed}) styles.$transitionStepEase;

      #path-container {
        height: 0;

        #path-inner {
          animation: path-inner-cycle calc(3 * #{styles.$transitionStepSpeed}) styles.$transitionStepEase;
        }
      }
    }
  }
}

@keyframes world-cycle {
  0% {
    padding-top: 0;
    padding-bottom: 0;
  }
  33% {
    padding-top: calc(50vh - var(--row-height));
    padding-bottom: calc(50vh - var(--row-height));
  }
  66% {
    padding-top: calc(50vh - var(--row-height));
    padding-bottom: calc(50vh - var(--row-height));
  }
  100% {
    padding-top: 0;
    padding-bottom: 0;
  }
}

@keyframes path-inner-cycle {
  0% {
    top: 0;
  }
  33% {
    top: calc(-50vh + var(--row-height));
  }
  66% {
    top: calc(-50vh + var(--row-height));
  }
  100% {
    top: 0;
  }
}
</style>
