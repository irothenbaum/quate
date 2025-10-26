<script setup lang="ts">
import {onMounted, ref, computed, nextTick, watch} from 'vue'
import HudTop from '@/components/game/HudTop.vue'
import HudBottom from '@/components/game/HudBottom.vue'
import LevelResults from '@/components/game/LevelResults.vue'
import {useGameStore} from '@/composables/useGameStore.ts'
import EquationPath from '@/components/game/EquationPath.vue'
import {applyTermStep, generateLevel, gameActionToClass, applyTermSteps} from '@/utilities.ts'
import {GameAction} from '@/types/game.ts'
import Menu from '@/components/Menu.vue'
import Tutorial from '@/components/Tutorial.vue'
import {
  FAST_RESPONSE_TIME_S,
  MAX_STREAK,
  TRANSITION_STEP_MS,
  POINTS_PER_TERM,
  RIGHT_ANSWER_TIMEOUT,
  STREAK_BONUS_RATIO,
  WRONG_ANSWER_TIMEOUT,
  TRANSITION_RESULTS_MS,
} from '@/constants/environment.ts'
import GameResults from '@/components/GameResults.vue'
import {useTutorialStore} from '@/composables/useTutorialStore.ts'

// Emits definition
const emit = defineEmits<{
  (e: 'game-over', data: number | undefined): void
}>()

const pathRef = ref<HTMLDivElement | null>(null)
const hasFirstGuessBonus = ref<boolean>(true)
const {
  level_state,
  levels_completed,
  difficulty,
  increaseScore,
  startNextLevel,
  game_action,
  last_game_action,
  streak_count,
} = useGameStore()
const {force_close} = useTutorialStore()

const maxHeight = ref(0)

function updateHeight() {
  if (pathRef.value) {
    const currentHeight = pathRef.value.offsetHeight
    if (currentHeight > maxHeight.value) {
      maxHeight.value = currentHeight
    }
  }
}

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

onMounted(() => {
  nextTick(() => {
    updateHeight()
  })
})

function handleTutorialComplete() {
  game_action.value = GameAction.starting
  force_close.value = true
  setTimeout(() => {
    game_action.value = GameAction.menu
    setTimeout(() => {
      force_close.value = false
    }, TRANSITION_STEP_MS)
  }, TRANSITION_STEP_MS)
}

function handleStartTutorial() {
  updateHeight()
  game_action.value = GameAction.starting
  force_close.value = true
  setTimeout(() => {
    game_action.value = GameAction.tutorial
    setTimeout(() => {
      force_close.value = false
    }, TRANSITION_STEP_MS)
  }, TRANSITION_STEP_MS)
}

function handleStartGame() {
  updateHeight()
  game_action.value = GameAction.starting
  setTimeout(() => {
    startNextLevel(generateLevel(0, difficulty.value, 0))
  }, TRANSITION_STEP_MS)
}

function handleSubmitAnswer() {
  // check if the selected terms lead to the target
  const answerValue = applyTermSteps(
    level_state.value.start,
    level_state.value.selected.map((termIndex, stepIndex) => level_state.value.steps[stepIndex][termIndex]),
  )

  if (answerValue === level_state.value.target) {
    // correct!
    game_action.value = GameAction.submission_correct
    // mark it completed immediately
    level_state.value.completed_timestamp = Date.now()
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

  const nextLevel = generateLevel(levels_completed.value + 1, difficulty.value, level_state.value.target)

  startNextLevel(nextLevel)
  // reset our first guess bonus
  hasFirstGuessBonus.value = true
}

function handleTimeExpired() {
  game_action.value = GameAction.game_over
}
</script>

<template>
  <template v-if="game_action === GameAction.game_over">
    <GameResults />
  </template>
  <template v-else>
    <div
      id="quate-game"
      :class="[gameActionToClass[game_action], 'level-' + (levels_completed + 1), force_close ? 'closed' : '']"
    >
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
            <template v-if="game_action === GameAction.menu || last_game_action === GameAction.menu">
              <Menu @start-game="handleStartGame()" @start-tutorial="handleStartTutorial()" />
            </template>
            <template v-else-if="game_action === GameAction.tutorial || last_game_action === GameAction.tutorial">
              <Tutorial @tutorial-complete="handleTutorialComplete()" />
            </template>
            <template v-else>
              <EquationPath />
            </template>
          </div>
        </div>
        <HudBottom @timeout="handleTimeExpired()" />
        <LevelResults v-if="levels_completed > 0" />
      </div>
      <div class="world-spacer">
        <div class="path-clone"></div>
      </div>
    </div>
  </template>
</template>

<style lang="scss">
@use '../../styles';

#quate-game {
  height: 100%;
  width: 100%;
  @include styles.flex-row(0);

  #world,
  .world-spacer {
    transition:
      padding-top styles.$transitionStep,
      padding-bottom styles.$transitionStep,
      background-color styles.$transitionStep;
  }

  #path-inner {
    transition: top styles.$transitionStep;
  }

  .path-clone,
  #path-container {
    &:after {
      transition: opacity styles.$transitionStep;
    }
  }

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

  &.transitioning-level,
  &.starting {
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

  &.closed {
    // these need to match the end state of the animations
    #world,
    .world-spacer {
      padding-top: calc(50dvh - var(--hud-height));
      padding-bottom: calc(50dvh - var(--hud-height));
      background-color: #204435;

      #path-container {
        height: 0;

        #path-inner {
          top: calc(-50dvh + var(--hud-height));
          transition: top styles.$transitionStep;
        }
      }
    }
    .path-clone,
    #path-container {
      &:after {
        opacity: 1;
        transition: opacity styles.$transitionStep;
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
    padding-top: calc(50dvh - var(--hud-height)),
    padding-bottom: calc(50dvh - var(--hud-height)),
    background-color: #204435,
  )
);

@include styles.transition-animation(
  path-inner-cycle,
  (
    top: 0,
  ),
  (
    top: calc(-50dvh + var(--hud-height)),
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
