<script setup lang="ts">
import Button from './utility/Button.vue'
import {ROUTE_LANDING} from '@/constants/routes.ts'
import {OUTLINED_VARIANT} from '@/constants/variants.ts'
import {ref} from 'vue'
import {useRoute} from 'vue-router'
import NumberInput from '@/components/utility/NumberInput.vue'

const route = useRoute()
const counter = ref<number>(parseInt(route.params?.counter as string) || 0)
</script>

<template>
  <div class="landing-page">
    <NumberInput :model-value="counter" readonly />
    <RouterLink :to="{name: ROUTE_LANDING, params: {counter: counter + 1}}">
      <Button label="Plus +1" :variant="OUTLINED_VARIANT" />
    </RouterLink>
  </div>
</template>

<style scoped lang="scss">
@use '../styles';

.landing-page {
  @include styles.hero-center();
}
</style>
