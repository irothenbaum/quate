<script setup lang="ts">
import Button from '@/components/utility/Button.vue'

// Props definition
const props = withDefaults(
  defineProps<{
    loading?: boolean
    label?: string
    icon?: string
  }>(),
  {
    loading: false,
    label: 'Continue',
  },
)

// Emits definition
const emit = defineEmits<{
  (e: 'submit'): void
}>()
</script>

<template>
  <form class="form-container" @submit.prevent="emit('submit')">
    <div class="form-inputs">
      <slot name="inputs"></slot>
    </div>
    <div class="form-error">
      <slot name="errors"></slot>
    </div>
    <div class="form-controls">
      <slot name="controls">
        <Button label="Save" @click="emit('submit')" />
      </slot>
    </div>
  </form>
</template>

<style lang="scss">
@use '../../styles';

form.form-container {
  .form-inputs {
    padding-top: var(--space-sm);

    & > div {
      margin-bottom: var(--space-md);
    }
  }

  .form-controls {
    margin-top: var(--space-lg);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--space-md);
  }
}
</style>
