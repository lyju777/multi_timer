<template>
  <div
    class="p-6 bg-gray-800 rounded-lg shadow-xl text-center text-white min-w-80 min-h-52 relative"
  >
    <CreateTimerDialog v-model="visible" @save="handleTimerSave" />
    <!-- 타이머 생성 버튼 -->
    <div
      v-if="!isSet"
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
    <div v-if="isSet" class="flex justify-center space-x-5 mt-4">
      <Button @click="startTimer" raised rounded icon="pi pi-play" outlined />
      <Button @click="pauseTimer" rounded raised icon="pi pi-pause" outlined />
      <Button
        @click="emit('delete-timer')"
        raised
        rounded
        icon="pi pi-eraser"
        outlined
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThrottleFn } from "@vueuse/core";
import type { Timer } from "~/types/Timer";
import type { PropType } from "vue";

const props = defineProps({
  timer: {
    type: Object as PropType<Timer>,
    required: true,
  },
});

const emit = defineEmits(["timer-set", "delete-timer"]);

// toRefs 대신 computed로 안전하게 props에 접근합니다.
const isSet = computed(() => props.timer.isSet);
const workHours = computed(() => props.timer.workHours);
const workMinutes = computed(() => props.timer.workMinutes);

// 종속된 값들도 모두 computed로 변경하여 반응성을 유지합니다.
const totalSeconds = computed(
  () => workHours.value * 3600 + workMinutes.value * 60
);
const timeLeft = ref(totalSeconds.value); // timeLeft는 직접 변경되므로 ref를 유지합니다.

const isRunning = ref(false);
const visible = ref(false);
let timer: NodeJS.Timeout | null = null;

// totalSeconds가 바뀔 때 timeLeft를 업데이트합니다.
watch(totalSeconds, (newTotal) => {
  timeLeft.value = newTotal;
});

const showCreateTimerDialog = () => {
  visible.value = true;
};

const handleTimerSave = (payload: { hours: number; minutes: number }) => {
  emit("timer-set", payload);
  visible.value = false;
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

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>
