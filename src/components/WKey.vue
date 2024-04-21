<script setup lang="ts">
  const props = defineProps({
    letter: {
      type: String
    },

    isPress: {
      type: Boolean,
      default: false
    }
  })

  const emits = defineEmits(['press'])
</script>

<template>
  <button :class="isPress && 'press'" @click="emits('press', letter)">
    {{ props.letter }}
  </button>
</template>

<style scoped lang="scss">
  button {
    width: 40px;
    margin-top: 10px;
    height: 40px;
    place-items: center;
    background-color: #7ee0ac;
    border: 1px solid #4a8365;
    border-radius: 5px;
    margin-left: 10px;

    &:first-child {
      margin-left: 0;
    }

    &.press {
      background-color: #e07e7e;
      border: 1px solid #834a4a;
    }
  }
</style>
