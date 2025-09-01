<script setup lang="ts">
import Button from './utility/Button.vue'
import {ROUTE_PLAY_QUATE} from '@/constants/routes.ts'
import {OUTLINED_VARIANT} from '@/constants/variants.ts'
import NumberInput from '@/components/utility/NumberInput.vue'
import {useGameStore} from '@/composables/useGameStore.ts'

const {difficulty} = useGameStore()
</script>

<template>
  <div class="landing-page">
    <NumberInput v-model="difficulty" />
    <RouterLink :to="{name: ROUTE_PLAY_QUATE}">
      <Button label="Play" :variant="OUTLINED_VARIANT" />
    </RouterLink>
  </div>
</template>

<style scoped lang="scss">
@use '../styles';

.landing-page {
  @include styles.hero-center();
}
</style>
