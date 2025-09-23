<script setup lang="ts">
import Button from './utility/Button.vue'
import {ROUTE_PLAY_QUATE} from '@/constants/routes.ts'
import {OUTLINED_VARIANT} from '@/constants/variants.ts'
import NumberInput from '@/components/utility/NumberInput.vue'
import {useGameStore} from '@/composables/useGameStore.ts'

const {difficulty} = useGameStore()

// TODO: Implement Level Results functionality
// Should appear during the transition between levels
// Display score earned, time taken, accuracy, etc.
// animate score/timer/streak changes accordingly
</script>

<template>
  <div class="level-results"></div>
</template>

<style scoped lang="scss">
@use '../../styles';

.level-results {
}
</style>
