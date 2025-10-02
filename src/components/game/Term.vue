<script setup lang="ts">
import type {TermStep} from '@/types/game.ts'
import {operationToLabel} from '@/utilities.ts'
import {onMounted, ref} from 'vue'
import TermButton from '@/components/game/TermButton.vue'

const props = withDefaults(
  defineProps<{
    term: TermStep
    isSelected?: boolean
    isCorrect?: boolean
    isIncorrect?: boolean
  }>(),
  {
    isSelected: false,
    isCorrect: false,
    isIncorrect: false,
  },
)

const emits = defineEmits<{
  (e: 'click'): void
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
</script>

<template>
  <TermButton
    ref="childRef"
    @click="() => $emit('click')"
    :isSelected="isSelected"
    :isCorrect="isCorrect"
    :isIncorrect="isIncorrect"
  >
    <span class="operation">{{ operationToLabel[term.operation] }}</span>
    <span class="number">{{ term.number }}</span>
  </TermButton>
</template>

<style scoped lang="scss"></style>
