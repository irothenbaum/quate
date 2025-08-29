<script setup lang="ts">
import {computed, ref} from 'vue'
import HudTop from '@/components/game/HudTop.vue'
import HudBottom from '@/components/game/HudBottom.vue'

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
</script>

<template>
  <div class="quate-game">
    <div class="world">
      <HudTop />
      <div class="path-container"></div>
      <HudBottom />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles';

.quate-game {
  height: 100%;
  width: 100%;
  background-color: var(--color-page-bg);
}
</style>
