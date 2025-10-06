<script setup lang="ts">
import TermButton from '@/components/game/TermButton.vue'
import {onMounted, ref} from 'vue'
import MenuScreen from '@/components/MenuScreen.vue'

const emits = defineEmits<{
  (e: 'start-game'): void
}>()

const childRef = ref<InstanceType<typeof Child> | null>(null)
const root = ref<HTMLDivElement | null>(null)

onMounted(() => {
  // forward the child's exposed root into our own
  if (childRef.value) {
    root.value = childRef.value.root
  }
})

// expose again so *this* component’s parent can also use it
defineExpose({root})

const playSelected = ref<boolean>(false)

function handleClick() {
  playSelected.value = true
  emits('start-game')
}
</script>

<template>
  <MenuScreen ref="childRef">
    <div id="menu">
      <div id="menu-content">
        <h1>Quate</h1>
        <TermButton :is-correct="playSelected" @click="handleClick"> Play </TermButton>
      </div>
    </div>
  </MenuScreen>
</template>

<style scoped lang="scss">
@use '../styles';

#menu-content {
  height: 100%;
  width: 100%;
  @include styles.flex-column(0);
  justify-content: center;

  h1 {
    color: var(--color-text);
    font-size: 6rem;
    line-height: 1em;
    margin-bottom: var(--space-xxl);
  }
}
</style>
