<script setup lang="ts">
import Toast from 'primevue/toast'
</script>

<template>
  <Toast />
  <router-view :key="$route.fullPath" />
</template>

<style scoped lang="scss">
@use './styles';
</style>
