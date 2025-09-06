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
const levelNum = ref<number>(8) // levelNum starts at 0 and increases with every completed round
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
    gap: 0;
    height: 100%;
    overflow: hidden;
    width: 50vw;

    #path-container {
      width: 100%;
      flex: 1;
      background-color: var(--color-world);
      box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.5);

      &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
      }

      &:before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
      }
    }
  }
}
</style>
