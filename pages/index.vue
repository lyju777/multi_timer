<template>
  <div
    :class="[
      'flex flex-col items-center justify-center transition-all duration-300 py-6 lg:px-3',
      timers.length > 9 ? 'min-h-screen' : 'min-h-[calc(100vh-4.5rem)]',
    ]"
  >
    <div
      :class="[
        'gap-6',
        timers.length > 1
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 '
          : '',
      ]"
    >
      <PomodoroTimer
        v-for="timer in timers"
        :key="timer.id"
        :timer="timer"
        @timer-set="(payload) => handleNewTimerSet(timer.id, payload)"
        @delete-timer="handleDeleteTimer(timer.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PomodoroTimer from "~/components/PomodoroTimer.vue";
import { useTimersStore } from "~/stores/timers";

const timersStore = useTimersStore();
const { timers } = storeToRefs(timersStore);
const { handleNewTimerSet, handleDeleteTimer } = timersStore;
</script>

<style scoped></style>
