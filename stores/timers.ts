import type { Timer, TimerSetPayload } from "~/types/Timer";

export const useTimersStore = defineStore(
  "timers",
  () => {
    const timers = ref<Timer[]>([]);
    const nextTimerId = ref(1);
    const finishedTimerId = ref<number | null>(null);

    const timerIntervals: Record<number, NodeJS.Timeout> = {};

    function _runTimer(timer: Timer) {
      if (timerIntervals[timer.id]) {
        clearInterval(timerIntervals[timer.id]);
      }

      timerIntervals[timer.id] = setInterval(() => {
        const now = Date.now();
        const endTime = timer.endTime;

        if (endTime && now < endTime) {
          timer.remainingTime = Math.round((endTime - now) / 1000);
        } else {
          timer.remainingTime = 0;
          timer.isRunning = false;
          clearInterval(timerIntervals[timer.id]);
          delete timerIntervals[timer.id];
          localStorage.removeItem(`timer-endTime-${timer.id}`);
          finishedTimerId.value = timer.id;
        }
      }, 1000);
    }

    const startTimer = (id: number) => {
      const timer = timers.value.find((t) => t.id === id);
      if (!timer || !timer.isSet || timer.isRunning) return;

      timer.isRunning = true;
      const newEndTime = Date.now() + (timer.remainingTime ?? 0) * 1000;
      timer.endTime = newEndTime;
      localStorage.setItem(`timer-endTime-${timer.id}`, newEndTime.toString());

      _runTimer(timer);
    };

    const pauseTimer = (id: number) => {
      const timer = timers.value.find((t) => t.id === id);
      if (timer && timer.isRunning) {
        timer.isRunning = false;
        clearInterval(timerIntervals[id]);
        delete timerIntervals[id];
        localStorage.removeItem(`timer-endTime-${timer.id}`);
      }
    };

    const resetTimer = (id: number) => {
      const timer = timers.value.find((t) => t.id === id);
      if (timer) {
        timer.isRunning = false;
        timer.remainingTime = timer.workHours * 3600 + timer.workMinutes * 60;
        clearInterval(timerIntervals[id]);
        delete timerIntervals[id];
        localStorage.removeItem(`timer-endTime-${timer.id}`);
      }
    };

    const initializeTimers = () => {
      if (timers.value.length === 0) {
        timers.value.push({
          id: nextTimerId.value++,
          isSet: false,
          workHours: 0,
          workMinutes: 0,
          isRunning: false,
          remainingTime: 0,
          timerMark: "",
          content: "",
        });
      }

      timers.value.forEach((timer) => {
        const storedEndTime = localStorage.getItem(`timer-endTime-${timer.id}`);
        if (storedEndTime) {
          const endTime = parseInt(storedEndTime, 10);
          const now = Date.now();

          if (now < endTime) {
            timer.isRunning = true;
            timer.endTime = endTime;
            timer.remainingTime = Math.round((endTime - now) / 1000);
            _runTimer(timer);
          } else {
            timer.remainingTime = 0;
            timer.isRunning = false;
            localStorage.removeItem(`timer-endTime-${timer.id}`);
          }
        } else {
          timer.isRunning = false;
        }
      });
    };

    onMounted(() => {
      nextTick(() => {
        initializeTimers();
      });
    });

    const handleNewTimerSet = (id: number, payload: TimerSetPayload) => {
      const timer = timers.value.find((t) => t.id === id);
      if (timer && !timer.isSet) {
        timer.isSet = true;
        timer.workHours = payload.hours;
        timer.workMinutes = payload.minutes;
        timer.remainingTime = payload.hours * 3600 + payload.minutes * 60;
        timer.timerMark = payload.timerMark;
        timer.content = payload.content;

        timers.value.push({
          id: nextTimerId.value++,
          isSet: false,
          workHours: 0,
          workMinutes: 0,
          isRunning: false,
          remainingTime: 0,
          timerMark: "",
          content: "",
        });
      }
    };

    const handleDeleteTimer = (id: number) => {
      const index = timers.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        clearInterval(timerIntervals[id]);
        delete timerIntervals[id];
        localStorage.removeItem(`timer-endTime-${id}`);
        timers.value.splice(index, 1);
      }

      if (timers.value.length === 0) {
        timers.value.push({
          id: nextTimerId.value++,
          isSet: false,
          workHours: 0,
          workMinutes: 0,
          isRunning: false,
          remainingTime: 0,
          timerMark: "",
          content: "",
        });
      }
    };

    const clearFinishedTimer = () => {
      finishedTimerId.value = null;
    };

    return {
      timers,
      nextTimerId,
      handleNewTimerSet,
      handleDeleteTimer,
      startTimer,
      pauseTimer,
      resetTimer,
      finishedTimerId,
      clearFinishedTimer,
    };
  },
  {
    persist: true,
  }
);
