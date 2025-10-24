<script setup lang="ts">
import {useGameStore} from '@/composables/useGameStore.ts'
import RenderTermField from '@/components/game/RenderTermField.vue'

const {level_state, handleClickTerm, game_action} = useGameStore()
</script>

<template>
  <RenderTermField :level_state="level_state" :handleClickTerm="handleClickTerm" :game_action="game_action" />
</template>

<style scoped lang="scss"></style>
