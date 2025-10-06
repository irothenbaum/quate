<script setup lang="ts">
import MenuScreen from '@/components/MenuScreen.vue'
</script>

<template>
  <MenuScreen>
    <div id="game-results">
      <h1>Game Over</h1>

      <h3>Results</h3>
    </div>
  </MenuScreen>
</template>

<style scoped lang="scss">
@use '../styles';

#game-results {
  @include styles.flex-column(0);

  h1 {
    color: var(--color-text);
    font-size: 4rem;
    margin-bottom: var(--space-xxl);
  }

  h3 {
    color: var(--color-text);
    font-size: 2rem;
    margin-bottom: var(--space-xxl);
  }
}
</style>
