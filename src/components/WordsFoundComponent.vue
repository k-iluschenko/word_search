<template>
  <h2 v-if="!wordsList.length">Слова не найдены.</h2>
  <h2 v-else>Найдено слов: {{ wordsList.length }}</h2>
  <p v-if="wordsList.length">{{ wordsList }}</p>
</template>
<script setup lang="ts">
  defineProps<{
    wordsList: string[]
  }>()
</script>
