import type { Timer } from "~/types/Timer";

export const useTimersStore = defineStore("timers", () => {
  const timers = ref<Timer[]>([{ id: 1, isSet: false }]);
  const nextTimerId = ref(2);

  const handleNewTimerSet = (id: number) => {
    const timer = timers.value.find((t) => t.id === id);
    if (timer && !timer.isSet) {
      timer.isSet = true;
      timers.value.push({ id: nextTimerId.value++, isSet: false });
    }
  };

  const handleDeleteTimer = (id: number) => {
    timers.value = timers.value.filter((t) => t.id !== id);
    nextTimerId.value--;

    if (nextTimerId.value === 2 && timers.value[0]) {
      timers.value[0].id = 1;
      timers.value[0].isSet = false;
    }

    if (timers.value.length === 0) {
      timers.value.push({ id: 1, isSet: false });
      nextTimerId.value = 2;
    }
  };

  return {
    timers,
    nextTimerId,
    handleNewTimerSet,
    handleDeleteTimer,
  };
});
