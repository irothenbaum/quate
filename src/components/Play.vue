<script setup lang="ts">
import {computed} from 'vue'
import {useRoute} from 'vue-router'
import Quate from '@/components/game/Quate.vue'

const route = useRoute()
const difficulty = computed<number>(() => parseInt(route.params.difficulty as string))
</script>

<template>
  <div class="play">
    <Quate :difficulty="difficulty" />
  </div>
</template>

<style scoped lang="scss">
@use '../styles';

.play {
  height: 100%;
  width: 100%;
}
</style>
