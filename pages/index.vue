<template>
  <div
    class="min-h-screen bg-gray-900 flex flex-col items-center justify-center pt-5 pb-5"
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
        :is-set="timer.isSet"
        @timer-set="handleNewTimerSet(timer.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PomodoroTimer from "~/components/PomodoroTimer.vue";

interface Timer {
  id: number;
  isSet: boolean;
}

const timers = ref<Timer[]>([{ id: 1, isSet: false }]);
let nextTimerId = 2;

const handleNewTimerSet = (id: number) => {
  const timer = timers.value.find((t) => t.id === id);
  if (timer && !timer.isSet) {
    timer.isSet = true;
    timers.value.push({ id: nextTimerId++, isSet: false });
  }
};
</script>

<style scoped></style>
