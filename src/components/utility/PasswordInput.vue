<script setup lang="ts">
import {ref} from 'vue'
import {v4 as uuid} from 'uuid'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'

const id = ref(uuid())

const props = withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    error?: boolean
  }>(),
  {
    modelValue: '',
    error: false,
  },
)

// Emits definition
const emit = defineEmits<{
  (e: 'update:modelValue', data: string | undefined): void
}>()
</script>

<template>
  <span class="text-input">
    <FloatLabel variant="on">
      <InputText
        :id="id"
        :model-value="modelValue"
        variant="filled"
        :invalid="error"
        @update:modelValue="(v: string | undefined) => emit('update:modelValue', v)"
        type="password"
      />
      <label :for="id">{{ label }}</label>
    </FloatLabel>
  </span>
</template>

<style scoped lang="scss">
@use '../../styles';

.text-input {
  overflow: visible;
}
</style>
