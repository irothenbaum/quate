<script setup lang="ts">
// Emits definition
import {useGameStore} from '@/composables/useGameStore.ts'

const emit = defineEmits<{
  (e: 'submit'): void
}>()

const {level_state} = useGameStore()
</script>

<template>
  <div class="hud-bottom">
    <div v-if="level_state" class="start">
      <div class="start-inner">
        {{ level_state.start }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles';

.hud-bottom {
  height: var(--row-height);
  width: 100%;
  @include styles.flex-row();
  justify-content: space-evenly;

  .start {
    @include styles.flex-row();
    height: 60%;
    width: 30%;
    border-radius: var(--border-radius-md);
    background-color: var(--color-world-shade);
    position: relative;

    font-size: var(--font-size-xxl);

    &:before {
      content: '';
      position: absolute;
      left: 35%;
      width: 30%;
      height: 50%;
      top: -33%;
      background-color: var(--color-world-shade);
    }

    .start-inner {
    }
  }
}
</style>
