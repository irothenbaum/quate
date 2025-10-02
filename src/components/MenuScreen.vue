<script setup lang="ts"></script>

<template>
  <div id="menu-screen">
    <div class="hud-clone"></div>
    <div class="menu-inner">
      <slot />
    </div>
    <div class="hud-clone"></div>
  </div>
</template>

<style scoped lang="scss">
@use '../styles';

#menu-screen {
  width: 100%;
  height: 100%;
  @include styles.flex-column(0);

  .menu-inner {
    text-align: center;
    @include styles.flex-column();
    justify-content: center;
    flex: 1;
    height: 100%;
    width: 100%;

    // these styles match path-container styles in Quate.vue
    background-color: var(--color-world);
    box-shadow: inset 0 0 30px var(--color-world-shade);
  }

  .hud-clone {
    // these styles match hud-top and hud-bottom styles in HudTop.vue and HudBottom.vue
    position: relative;
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
}
</style>
