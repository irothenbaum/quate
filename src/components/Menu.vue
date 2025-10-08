<script setup lang="ts">
import TermButton from '@/components/game/TermButton.vue'
import {ref} from 'vue'
import {HIGH_SCORE_CACHE_KEY, TRANSITION_STEP_MS} from '@/constants/environment.ts'
import IncrementingNumber from '@/components/utility/IncrementingNumber.vue'

const emits = defineEmits<{
  (e: 'start-game'): void
}>()

const playSelected = ref<boolean>(false)

const highScore = ref<number>(parseInt(localStorage[HIGH_SCORE_CACHE_KEY]) || 0) // Placeholder for high score

function handleClick() {
  playSelected.value = true
  setTimeout(() => {
    emits('start-game')
  }, TRANSITION_STEP_MS)
}
</script>

<template>
  <div id="menu-content">
    <div style="overflow: hidden">
      <h1>Quate</h1>
      <TermButton :is-correct="playSelected" @click="handleClick"> Play </TermButton>

      <h3>High score:</h3>
      <IncrementingNumber :number="highScore" :animation-duration="1000" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../styles';

#menu-content {
  & > div {
    height: 100%;
    width: 100%;
    @include styles.flex-column(0);
    justify-content: center;
  }

  h1 {
    color: var(--color-text);
    font-size: 6rem;
    line-height: 1em;
    margin-bottom: var(--space-xxl);
  }

  h3 {
    font-size: var(--font-size-md);
    color: var(--color-text);
    margin-top: var(--space-xxl);
    margin-bottom: var(--space-md);
  }

  span {
    font-size: var(--font-size-xxl);
  }
}
</style>
