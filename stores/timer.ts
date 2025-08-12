export const useTimerStore = defineStore("timer", () => {
  const workMinutes = ref(0);
  const workHours = ref(0);
  return { workMinutes, workHours };
});
