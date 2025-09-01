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
    <div v-if="level_state">
      {{ level_state.start }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles';

.hud-bottom {
  height: var(--row-height);
  width: 100%;
  @include styles.flex-row();
}
</style>
