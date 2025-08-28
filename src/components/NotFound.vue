<script setup lang="ts">
import Button from './utility/Button.vue'
import {ROUTE_LANDING} from '@/constants/routes.ts'
</script>

<template>
  <div>Page Not Found</div>
  <RouterLink :to="ROUTE_LANDING">
    <Button label="Return home" icon="pi pi-check" />
  </RouterLink>
</template>

<style scoped lang="scss">
@use '../styles';
</style>
