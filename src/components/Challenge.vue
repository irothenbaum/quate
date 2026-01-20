<script setup lang="ts">
import TermButton from '@/components/game/TermButton.vue'
import {PLAY, BACK, REFRESH, CLOSE} from '@/constants/icons.ts'
import {ref, computed} from 'vue'
import {COMPETE_CODE_CACHE_KEY, TRANSITION_STEP_MS} from '@/constants/environment.ts'
import TextInput from '@/components/utility/TextInput.vue'

const MAX_CODE_LENGTH = 6

const emits = defineEmits<{
  (e: 'start-game'): void
  (e: 'go-back'): void
}>()

const code = ref<string>(localStorage.getItem(COMPETE_CODE_CACHE_KEY) || generateNewCode())
const selectedButton = ref<number | null>(null)
const BUTTON_PLAY = 0
const BUTTON_BACK = 1

const showPlayError = ref(false)

function handleClickPlay() {
  if (code.value.length !== MAX_CODE_LENGTH) {
    showPlayError.value = true
    setTimeout(() => {
      showPlayError.value = false
    }, 2000)
    return
  }

  localStorage.setItem(COMPETE_CODE_CACHE_KEY, code.value.toUpperCase())
  selectedButton.value = BUTTON_PLAY
  setTimeout(() => {
    emits('start-game')
  }, TRANSITION_STEP_MS)
}

function handleClickTutorial() {
  selectedButton.value = BUTTON_BACK
  setTimeout(() => {
    emits('go-back')
  }, TRANSITION_STEP_MS)
}

function generateNewCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < MAX_CODE_LENGTH; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

function sanitizeCode(val: string | undefined): string {
  return (val || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, MAX_CODE_LENGTH)
}
</script>

<template>
  <div id="challenge-content">
    <h1>Compete</h1>
    <p>
      Generate a <strong>compete</strong> code or enter one shared with you. Anyone playing with the same code will have
      the exact same terms to solve.
    </p>

    <div class="code-input-container">
      <i :class="CLOSE" @click="code = ''" />
      <TextInput
        :model-value="code"
        :maxlength="MAX_CODE_LENGTH"
        @update:model-value="val => (code = sanitizeCode(val))"
        :error="showPlayError"
      />
      <i :class="REFRESH" @click="code = generateNewCode()" />
    </div>

    <p v-if="showPlayError" class="code-error-message">Compete codes must be {{ MAX_CODE_LENGTH }} characters</p>
    <p v-else>Time to see who's really the best.</p>
    <div class="buttons-container">
      <TermButton
        :is-selected="selectedButton === BUTTON_BACK"
        :is-correct="selectedButton === BUTTON_BACK"
        @click="handleClickTutorial()"
      >
        <div class="menu-button">
          <i :class="BACK" />
          <span>back</span>
        </div>
      </TermButton>
      <TermButton
        :is-selected="selectedButton === BUTTON_PLAY"
        :is-correct="selectedButton === BUTTON_PLAY && !showPlayError"
        :is-incorrect="showPlayError"
        @click="handleClickPlay()"
      >
        <div class="menu-button">
          <i :class="PLAY" />
          <span>play</span>
        </div>
      </TermButton>
    </div>
  </div>
</template>

<style lang="scss">
@use '../styles';

#challenge-content {
  height: 100%;
  width: 100%;
  @include styles.flex-column();
  justify-content: center;

  p {
    padding: var(--space-lg);
    font-size: var(--font-size-md);
    color: var(--color-text);
    max-width: 600px;
    text-align: center;

    &.code-error-message {
      color: var(--color-tertiary-tint);
    }
  }

  h1 {
    color: var(--color-text);
    font-size: 4rem;
    line-height: 1em;
    margin-bottom: var(--space-lg);
  }

  .code-input-container {
    @include styles.flex-row();

    i {
      font-size: var(--font-size-xl);
      color: var(--color-text-secondary);
      margin: 0 var(--space-md);
    }

    input.p-inputtext {
      font-size: var(--font-size-xl);
      text-align: center;
      max-width: 16rem; // based off the code length
      letter-spacing: 0.2em;
    }
  }

  .buttons-container {
    @include styles.flex-row();

    .menu-button {
      @include styles.menu-button();
    }
  }
}
</style>
