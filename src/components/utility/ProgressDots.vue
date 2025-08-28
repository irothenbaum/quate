<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    current: number // current step (1-indexed)
    total: number // total steps
  }>(),
  {
    current: 0,
    length: 0,
  },
)

const emit = defineEmits<{
  (e: 'update:current', value: number): void
}>()
</script>

<template>
  <div class="progress-dots">
    <span :class="['dot', n === current ? 'selected' : '']" v-for="n in total" :key="n" />
  </div>
</template>

<style scoped lang="scss">
@use '../../styles';

$dotSize: var(--space-md);

.progress-dots {
  @include styles.flex-row();
  justify-content: center;
  height: 100%;
  width: 100%;

  .dot {
    height: $dotSize;
    width: $dotSize;
    border-radius: calc($dotSize / 2);
    background-color: var(--color-card-bg);
    transition: all 0.2s ease;
    opacity: 0.8;

    &.selected {
      opacity: 1;
      width: calc($dotSize * 3);
    }
  }
}
</style>
