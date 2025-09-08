<script setup lang="ts">
import {computed, ref, onMounted} from 'vue'
import HudTop from '@/components/game/HudTop.vue'
import HudBottom from '@/components/game/HudBottom.vue'
import {useGameStore} from '@/composables/useGameStore.ts'
import EquationPath from '@/components/game/EquationPath.vue'
import {generateLevel} from '@/utilities.ts'

// Emits definition
const emit = defineEmits<{
  (e: 'game-over', data: number | undefined): void
}>()

const {level_state, difficulty, increaseScore, startNextLevel} = useGameStore()
const levelNum = ref<number>(16) // levelNum starts at 0 and increases with every completed round
// it basically matches levels_completed but needs to be separate so we can generate the next level before completing it
// could possible refactor...

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
  levelNum.value += 1

  const nextLevel = generateLevel(levelNum.value, difficulty.value, level_state.value.target)

  startNextLevel(nextLevel)
}

onMounted(() => {
  startNextLevel(generateLevel(levelNum.value, difficulty.value, 0))
})
</script>

<template>
  <div id="quate-game">
    <div class="world-spacer"></div>
    <div id="world">
      <HudTop />
      <div id="path-container">
        <EquationPath />
      </div>
      <HudBottom @submit="handleSubmitAnswer()" />
    </div>
    <div class="world-spacer"></div>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles';

#quate-game {
  height: 100%;
  width: 100%;
  @include styles.flex-row();
  gap: 0;

  .world-spacer {
    flex: 1;
    height: 100%;
    width: auto;
    max-width: calc((100% - var(--screen-medium-min)) / 2);
    background-color: var(--color-world-shade);
    position: relative;

    &:after,
    &:before {
      content: '';
      position: absolute;
      top: 0;
      width: 100%;
      height: var(--row-height);
      background-color: var(--color-primary);
    }

    &:before {
      top: auto;
      bottom: 0;
    }
  }

  #world {
    @include styles.flex-column();
    gap: 0;
    height: 100%;
    overflow: hidden;
    width: 100%;
    max-width: var(--screen-medium-min);

    #path-container {
      width: 100%;
      flex: 1;
      background-color: var(--color-world);
      box-shadow: inset 0 0 30px var(--color-world-shade);
    }
  }
}
</style>
