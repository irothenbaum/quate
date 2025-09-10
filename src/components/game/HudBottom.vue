<script setup lang="ts">
// Emits definition
import {useGameStore} from '@/composables/useGameStore.ts'
import {computed, watch, ref} from 'vue'
import {formatTime} from '@/utilities.ts'
import {TIMER} from '@/constants/icons.ts'
import {GameAction} from '@/types/game.ts'

const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'timeout'): void
}>()
const {level_state, game_action} = useGameStore()

const clockTimeMs = ref<number>(0)
const canSubmit = computed<boolean>(() => {
  return level_state.value.selected.length !== level_state.value.steps.length
})
const timer = ref<number>(0) // setInerval ID
const timeParts = computed<string[]>(() => {
  if (clockTimeMs.value === null) {
    return ['--', '--']
  }
  return formatTime(clockTimeMs.value)
})

watch(
  () => game_action.value,
  () => {
    if (game_action.value === GameAction.ready) {
      // reset clock
      clockTimeMs.value = Math.max(0, (level_state.value.expiration_timestamp || 0) - Date.now())

      if (timer.value) {
        clearInterval(timer.value)
      }
      timer.value = setInterval(() => {
        if (game_action.value === GameAction.ready && clockTimeMs.value !== null) {
          clockTimeMs.value = Math.max(0, (level_state.value.expiration_timestamp || 0) - Date.now())
          if (clockTimeMs.value <= 0) {
            // time's up
            emit('timeout')
            clearInterval(timer.value)
          }
        }
      }, 200)
    }
  },
  {immediate: true},
)

function handleClickSubmit() {
  if (!canSubmit.value) {
    return
  }

  emit('submit')
}
</script>

<template>
  <div class="hud-bottom">
    <div :class="{'timer-container': true, low: clockTimeMs !== null && clockTimeMs <= 10000}">
      <i :class="TIMER" />
      <div class="timer-inner">
        <span class="time-part" v-for="(p, i) in timeParts" :key="i">{{ p }}</span>
      </div>
    </div>
    <div v-if="level_state" :class="{'start-container': true, active: level_state.selected.length > 0}">
      <div class="start-tail"></div>
      <div class="start">
        {{ level_state.start }}
      </div>
      <div class="start-spacer"></div>
    </div>
    <div class="submit-container">
      <div class="submit-button-inner" @click="handleClickSubmit()">SUBMIT</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles';

$defaultWidth: 1rem;
$selectedWidth: 2rem;

.hud-bottom {
  z-index: 10;
  height: var(--row-height);
  width: 100%;
  @include styles.flex-row();
  justify-content: space-evenly;

  .timer-container,
  .submit-container,
  .start-container {
    height: 100%;
    width: 30%;
  }

  .timer-container {
    @include styles.flex-column();
    @include styles.small-and-below() {
      gap: var(--space-sm);
    }
    justify-content: center;
    color: var(--color-text-inverse);

    i {
      margin-right: var(--space-md);
      font-size: var(--font-size-md);
    }

    span {
      font-size: var(--font-size-xxl);
      @include styles.small-and-below() {
        font-size: var(--font-size-xl);
      }

      &:after {
        content: ':';
        margin: 0 var(--space-sm);
      }

      &:last-child:after {
        content: '';
        margin: 0;
      }
    }
  }

  .start-container {
    @include styles.flex-column(0);
    font-size: 3rem;

    .start-spacer {
      flex: 1;
    }

    .start {
      @include styles.flex-row();
      height: 60%;
      width: 100%;
      border-radius: var(--border-radius-md);
      background-color: var(--color-world-shade);
      // border: 1px solid var(--color-primary-shade);
    }

    .start-tail {
      width: 30%;
      flex: 1;
      background-color: var(--color-world-shade);
      position: relative;

      &:after {
        content: '';
        position: absolute;
        top: -25%;
        width: $defaultWidth;
        left: calc(50% - $defaultWidth / 2);
        background-color: var(--color-pathway-default);
        transition: all 0.2s ease-out;
        height: 150%;
        border-radius: var(--border-radius-xs);
      }
    }

    &.active {
      .start-tail:after {
        width: $selectedWidth;
        left: calc(50% - $selectedWidth / 2);
        background-color: var(--color-pathway-selected);
      }
    }
  }
}
</style>
