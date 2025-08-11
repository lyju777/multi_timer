<template>
  <div
    class="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4"
  >
    <PomodoroTimer :work-minutes="workMinutes" />
  </div>
</template>

<script setup lang="ts">
const workMinutes = ref(5);
</script>

<style scoped></style>
