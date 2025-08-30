<script setup lang="ts">
import {computed, ref} from 'vue'
import HudTop from '@/components/game/HudTop.vue'
import HudBottom from '@/components/game/HudBottom.vue'
import useGameStore from '@/stores/game.ts'
import EquationPath from '@/components/game/EquationPath.vue'

const props = withDefaults(
  defineProps<{
    difficulty: number
    color?: string
  }>(),
  {
    color: 'green',
  },
)

// Emits definition
const emit = defineEmits<{
  (e: 'game-over', data: number | undefined): void
}>()

const gameStore = useGameStore()
</script>

<template>
  <div id="quate-game">
    <div id="world">
      <HudTop />
      <div id="path-container">
        <EquationPath />
      </div>
      <HudBottom />
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
