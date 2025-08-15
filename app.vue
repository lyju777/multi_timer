<template>
  <NuxtLayout>
    <MenuBar />
    <NuxtPage />
    <TimerFinishedDialog
      v-if="finishedTimer"
      v-model="isDialogVisible"
      :timer="finishedTimer"
    />
  </NuxtLayout>
</template>

<script setup lang="ts">
import MenuBar from "~/components/MenuBar.vue";
import { useTimersStore } from "~/stores/timers";
import TimerFinishedDialog from "~/components/TimerFinishedDialog.vue";

const timersStore = useTimersStore();
const { finishedTimerId, timers } = storeToRefs(timersStore);

const isDialogVisible = computed({
  get: () => finishedTimerId.value !== null,
  set: (value) => {
    if (!value) {
      timersStore.clearFinishedTimer();
    }
  },
});

const finishedTimer = computed(() => {
  if (finishedTimerId.value === null) return undefined;
  return timers.value.find((t) => t.id === finishedTimerId.value);
});

const { startAlarm, stopAlarm } = useTimerSound();

watch(finishedTimerId, (newId) => {
  if (newId !== null) {
    startAlarm();
  } else {
    stopAlarm();
  }
});
</script>

<style scoped></style>
