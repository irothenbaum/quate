<script setup lang="ts">
import {onMounted, ref, computed, nextTick, watch} from 'vue'
import HudTop from '@/components/game/HudTop.vue'
import HudBottom from '@/components/game/HudBottom.vue'
import {useGameStore} from '@/composables/useGameStore.ts'
import EquationPath from '@/components/game/EquationPath.vue'
import {applyTermStep, generateLevel, gameActionToClass} from '@/utilities.ts'
import {GameAction} from '@/types/game.ts'
import {
  FAST_RESPONSE_TIME_S,
  MAX_STREAK,
  NEW_ROUND_DELAY_MS,
  POINTS_PER_TERM,
  RIGHT_ANSWER_TIMEOUT,
  STREAK_BONUS_RATIO,
  WRONG_ANSWER_TIMEOUT,
} from '@/constants/environment.ts'

// Emits definition
const emit = defineEmits<{
  (e: 'game-over', data: number | undefined): void
}>()

const pathRef = ref<HTMLDivElement | null>(null)
const hasFirstGuessBonus = ref<boolean>(true)
const {level_state, difficulty, increaseScore, startNextLevel, game_action, streak_count} = useGameStore()
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
  // check if the selected terms lead to the target
  let currentValue = level_state.value.start
  for (let i = 0; i < level_state.value.selected.length; i++) {
    const termIndex = level_state.value.selected[i]
    const term = level_state.value.steps[i][termIndex]
    currentValue = applyTermStep(currentValue, term)
  }

  if (currentValue === level_state.value.target) {
    // correct!
    game_action.value = GameAction.submission_correct
    setTimeout(() => {
      streak_count.value = streak_count.value + 1
      handleLevelComplete()
    }, RIGHT_ANSWER_TIMEOUT)
  } else {
    // wrong!
    hasFirstGuessBonus.value = false
    streak_count.value = 0
    game_action.value = GameAction.submission_incorrect
    setTimeout(() => {
      level_state.value.selected = []
      game_action.value = GameAction.ready
    }, WRONG_ANSWER_TIMEOUT)
  }
}

function handleLevelComplete() {
  // calc points

  // 10 points per term on the board
  const unitPoints = POINTS_PER_TERM * totalTerms.value

  const secondsToComplete = Math.floor((Date.now() - (level_state.value.started_timestamp || 0)) / 1000)

  const timeBonusRatio = hasFirstGuessBonus.value
    ? Math.max(0, FAST_RESPONSE_TIME_S - secondsToComplete) / FAST_RESPONSE_TIME_S
    : 0

  // streak of 1 -> no bonus, streak of 2 -> 10%, streak of 3 -> 20%, ... streak of 6+ -> 50%
  const streakBonusRatio = Math.min(MAX_STREAK, streak_count.value - 1) * STREAK_BONUS_RATIO
  const bonusPoints = timeBonusRatio * unitPoints + streakBonusRatio * unitPoints

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
  console.log('Time expired - game over')
}

onMounted(() => {
  setTimeout(() => {
    console.log('STARTING')
    startNextLevel(generateLevel(levelNum.value, difficulty.value, 0))
  }, NEW_ROUND_DELAY_MS)
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
      margin: var(--hud-height) 0;
      background-color: var(--color-world-shade);
    }
  }

  .path-clone,
  #path-container {
    position: relative;

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--color-power-bright-tint);
      opacity: 0;
      pointer-events: none;
      z-index: 10;
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
      animation: world-cycle styles.$transitionTotalSpeed styles.$transitionStepEase;

      #path-container {
        height: 0;

        #path-inner {
          animation: path-inner-cycle styles.$transitionTotalSpeed styles.$transitionStepEase;
        }
      }
    }

    .path-clone,
    #path-container {
      &:after {
        animation: brighten-cycle styles.$transitionTotalSpeed styles.$transitionStepEase;
      }
    }
  }
}

@include styles.transition-animation(
  world-cycle,
  (
    padding-top: 0,
    padding-bottom: 0,
    background-color: var(--color-primary),
  ),
  (
    padding-top: calc(50vh - var(--hud-height)),
    padding-bottom: calc(50vh - var(--hud-height)),
    background-color: #204435,
  )
);

@include styles.transition-animation(
  path-inner-cycle,
  (
    top: 0,
  ),
  (
    top: calc(-50vh + var(--hud-height)),
  )
);

@include styles.transition-animation(
  brighten-cycle,
  (
    opacity: 0,
  ),
  (
    opacity: 1,
  )
);
</style>
