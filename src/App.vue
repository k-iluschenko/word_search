<template>
  <header>
    <title-component title="Поиск слов по буквам" />
  </header>
  <main>
    <the-welcome />
  </main>
</template>

<script setup lang="ts">
  import TheWelcome from '@/components/TheWelcome.vue'
  import TitleComponent from '@/components/TitleComponent.vue'
</script>

<style scoped>
  header {
    line-height: 1.5;
  }

  @media (min-width: 1024px) {
    header {
      //display: flex; place-items: center;
      padding-right: calc(var(--section-gap) / 2);
    }
  }
</style>
