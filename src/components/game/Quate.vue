<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import HudTop from '@/components/game/HudTop.vue'
import HudBottom from '@/components/game/HudBottom.vue'
import useGameStore from '@/stores/game.ts'
import EquationPath from '@/components/game/EquationPath.vue'
import {generateLevel} from '@/utilities.ts'
import {storeToRefs} from 'pinia'

// Emits definition
const emit = defineEmits<{
  (e: 'game-over', data: number | undefined): void
}>()

const gameStore = useGameStore()
const {level_state, difficulty} = storeToRefs(gameStore)
const {increaseScore, startNextLevel} = gameStore
const nextLevelNum = ref<number>(0)

const max = computed(() => difficulty.value + nextLevelNum.value * 10)
const stepCount = computed(() => Math.ceil((nextLevelNum.value + 1) / 2))
const totalTerms = computed(() => Math.max(stepCount.value, nextLevelNum.value))

function handleSubmitAnswer() {
  // TODO: this
}

function handleLevelComplete() {
  if (!level_state.value) {
    return
  }

  // TODO: calc points
  const unitPoints = 0
  const bonusPoints = 0
  increaseScore(unitPoints, bonusPoints)

  // inc this immediately
  nextLevelNum.value += 1

  const nextLevel = generateLevel(level_state.value.target, max.value, stepCount.value, totalTerms.value)

  startNextLevel(nextLevel)
}

watch(
  () => {},
  () => {
    startNextLevel(generateLevel(nextLevelNum.value, max.value, stepCount.value, totalTerms.value))
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div id="quate-game">
    <div id="world">
      <HudTop />
      <div id="path-container">
        <EquationPath />
      </div>
      <HudBottom @submit="handleSubmitAnswer()" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles';

#quate-game {
  height: 100%;
  width: 100%;
  @include styles.hero-center();

  #world {
    @include styles.flex-column();
    height: 80%;
    overflow: hidden;
    width: 50vw;
    box-shadow:
      0 0 20px rgba(0, 0, 0, 0.3),
      inset 0 0 15px rgba(0, 0, 0, 0.3),
      inset 0 0 5px rgba(0, 0, 0, 0.5);
    border-radius: 30px;

    #path-container {
      width: 100%;
      flex: 1;
      background-color: var(--color-world-bg);
      box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
