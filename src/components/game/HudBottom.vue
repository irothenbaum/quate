<script setup lang="ts">
// Emits definition
const emit = defineEmits<{
  (e: 'submit'): void
}>()
</script>

<template>
  <div class="hud-bottom">{{}}</div>
</template>

<style scoped lang="scss">
@use '../../styles';

.hud-bottom {
  height: var(--row-height);
  width: 100%;
  @include styles.flex-row();
}
</style>
