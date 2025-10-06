<script setup lang="ts">
import {ref} from 'vue'

const root = ref<HTMLDivElement | null>(null)

// expose the DOM element to the parent
defineExpose({root})
</script>

<template>
  <div class="hud-clone"></div>
  <div class="menu-inner" ref="root">
    <slot />
  </div>
  <div class="hud-clone"></div>
</template>

<style lang="scss">
@use '../styles';

.hud-clone {
  // these styles match hud-top and hud-bottom styles in HudTop.vue and HudBottom.vue
  z-index: 11;
  height: var(--hud-height);
  width: 100%;
  @include styles.flex-row(0);
  padding: var(--space-md);

  @include styles.small-and-below() {
    padding: var(--space-sm);
  }

  &:after {
    content: '';
    height: 100%;
    width: 100%;
    border-radius: var(--border-radius-md);
    background-color: var(--color-world-shade);
  }
}
</style>
