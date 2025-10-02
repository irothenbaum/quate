<script setup lang="ts">
import TermButton from '@/components/game/TermButton.vue'
import {ref} from 'vue'
import MenuScreen from '@/components/MenuScreen.vue'

const emits = defineEmits<{
  (e: 'start-game'): void
}>()

const playSelected = ref<boolean>(false)

function handleClick() {
  playSelected.value = true
  setTimeout(() => {
    emits('start-game')
  }, 1000)
}
</script>

<template>
  <MenuScreen>
    <div id="menu">
      <h1>Quate</h1>
      <TermButton :selected="playSelected" @click="handleClick"> Play </TermButton>
    </div>
  </MenuScreen>
</template>

<style scoped lang="scss">
@use '../styles';

#menu {
  @include styles.flex-column(0);

  h1 {
    color: var(--color-text);
    font-size: 6rem;
    margin-bottom: var(--space-xxl);
  }
}
</style>
