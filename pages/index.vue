<template>
  <div
    class="min-h-screen bg-zinc-900 flex flex-col items-center justify-center pt-5 pb-5"
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
