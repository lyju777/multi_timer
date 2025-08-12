<template>
  <div
    class="p-6 bg-gray-800 rounded-lg shadow-xl text-center text-white min-w-80 min-h-52 relative"
  >
    <CreateTimerDialog v-model="visible" />
    <!-- 타이머 -->
    <div
      v-if="!isTimerSetting"
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

    <!-- 타이머 버튼 -->
    <div v-if="isTimerSetting" class="flex justify-center space-x-5 mt-4">
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
import Button from "primevue/button";
import { useThrottleFn } from "@vueuse/core";
import { useTimerStore } from "~/stores/timer";
import { storeToRefs } from "pinia";

const timerStore = useTimerStore();
const { workHours, workMinutes } = storeToRefs(timerStore);

const totalSeconds = ref(0);
const timeLeft = ref(0);
const isRunning = ref(false); // 타이머 실행 여부
const isTimerSetting = ref(false); // 타이머 설정 여부
const visible = ref(false); // 타이머생성 모달 노출 여부
let timer: NodeJS.Timeout | null = null;

watch(
  [workHours, workMinutes],
  ([newHours, newMinutes]) => {
    const newTotalSeconds = newHours * 3600 + newMinutes * 60;
    totalSeconds.value = newTotalSeconds;
    timeLeft.value = newTotalSeconds;

    if (newTotalSeconds > 0) {
      isTimerSetting.value = true;
    } else {
      isTimerSetting.value = false;
    }
  },
  { immediate: true }
);

// 타이머 설정 모달 노출
const showCreateTimerDialog = () => {
  visible.value = true;
};

// 분과 초 계산
const minutes = computed(() =>
  (Math.floor(timeLeft.value / 60) % 60).toString().padStart(2, "0")
);
const seconds = computed(() =>
  (timeLeft.value % 60).toString().padStart(2, "0")
);
const hours = computed(() =>
  (Math.floor(timeLeft.value / 3600) % 24).toString().padStart(2, "0")
);

// 타이머 시작
const startTimer = useThrottleFn(() => {
  if (isRunning.value) return;
  isRunning.value = true;
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      switchMode();
    }
  }, 1000);
}, 1000);

// 타이머 일시정지
const pauseTimer = () => {
  isRunning.value = false;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

// 모드 전환
const switchMode = () => {
  pauseTimer();
  totalSeconds.value = workHours.value * 3600 + workMinutes.value * 60;
  timeLeft.value = totalSeconds.value;
};

const resetTimer = () => {
  pauseTimer();
  totalSeconds.value = workHours.value * 3600 + workMinutes.value * 60;
  timeLeft.value = totalSeconds.value;
};

// 컴포넌트가 사라질 때 타이머 정리
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>
