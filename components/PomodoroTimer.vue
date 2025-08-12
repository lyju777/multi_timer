<template>
  <div
    class="p-6 bg-gray-800 rounded-lg shadow-xl text-center text-white min-w-80 min-h-52 relative"
  >
    <CreateTimerDialog v-model="visible" @save="handleTimerSave" />
    <!-- 타이머 생성 버튼 -->
    <div
      v-if="!isTimerSet"
      class="flex justify-center items-center m-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <Button
        @click="showCreateTimerDialog"
        raised
        rounded
        icon="pi pi-plus"
        severity="success"
        outlined
      />
    </div>
    <!-- 타이머 디스플레이 -->
    <div v-else class="grid grid-flow-col gap-5 text-center auto-cols-max">
      <div
        class="flex flex-col p-4 max-w-20 bg-[#0b0809] rounded-lg text-neutral-content"
      >
        <span class="countdown font-mono text-5xl">
          <span :style="{ '--value': hours }">{{ hours }}</span>
        </span>
        hours
      </div>
      <div
        class="flex flex-col p-4 max-w-20 bg-[#0b0809] rounded-lg text-neutral-content"
      >
        <span class="countdown font-mono text-5xl">
          <span :style="{ '--value': minutes }">{{ minutes }}</span>
        </span>
        min
      </div>
      <div
        class="flex flex-col p-4 max-w-20 bg-[#0b0809] rounded-lg text-neutral-content"
      >
        <span class="countdown font-mono text-5xl">
          <span :style="{ '--value': seconds }">{{ seconds }}</span>
        </span>
        sec
      </div>
    </div>

    <!-- 타이머 조작 버튼 -->
    <div v-if="isTimerSet" class="flex justify-center space-x-5 mt-4">
      <Button @click="startTimer" raised rounded icon="pi pi-play" outlined />
      <Button @click="pauseTimer" rounded raised icon="pi pi-pause" outlined />
      <Button
        @click="resetTimer"
        raised
        rounded
        icon="pi pi-refresh"
        outlined
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThrottleFn } from "@vueuse/core";

const props = defineProps({
  initialHours: { type: Number, default: 0 },
  initialMinutes: { type: Number, default: 0 },
  isSet: { type: Boolean, default: false },
});

const { initialHours, initialMinutes, isSet } = toRefs(props);

const emit = defineEmits(["timer-set"]);

const workHours = ref(initialHours.value);
const workMinutes = ref(initialMinutes.value);

const totalSeconds = ref(workHours.value * 3600 + workMinutes.value * 60);
const timeLeft = ref(totalSeconds.value);
const isRunning = ref(false);
const isTimerSet = ref(isSet.value);
const visible = ref(false);
let newTotalSeconds = 0;
let timer: NodeJS.Timeout | null = null;

const showCreateTimerDialog = () => {
  visible.value = true;
};

const handleTimerSave = ({
  hours,
  minutes,
}: {
  hours: number;
  minutes: number;
}) => {
  workHours.value = hours;
  workMinutes.value = minutes;
  newTotalSeconds = hours * 3600 + minutes * 60;
  totalSeconds.value = newTotalSeconds;
  timeLeft.value = newTotalSeconds;
  isTimerSet.value = true;
  emit("timer-set");
};

const minutes = computed(() =>
  Math.floor((timeLeft.value / 60) % 60)
    .toString()
    .padStart(2, "0")
);
const seconds = computed(() =>
  (timeLeft.value % 60).toString().padStart(2, "0")
);
const hours = computed(() =>
  Math.floor(timeLeft.value / 3600)
    .toString()
    .padStart(2, "0")
);

const startTimer = useThrottleFn(() => {
  if (isRunning.value || timeLeft.value <= 0) return;
  isRunning.value = true;
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      pauseTimer();
    }
  }, 1000);
}, 1000);

const pauseTimer = () => {
  isRunning.value = false;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

const resetTimer = () => {
  pauseTimer();
  timeLeft.value = totalSeconds.value;
};

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>
