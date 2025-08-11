<template>
  <container
    class="p-6 bg-gray-800 rounded-lg shadow-xl text-center text-white"
  >
    <!-- 타이머 -->
    <div class="grid grid-flow-col gap-5 text-center auto-cols-max">
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
    <div class="flex justify-center space-x-5 mt-4">
      <button
        @click="toggleTimer"
        class="px-6 py-2 font-semibold rounded-md transition-colors"
        :class="{
          'bg-green-500 hover:bg-green-600': !isRunning,
          'bg-yellow-500 hover:bg-yellow-600': isRunning,
        }"
      >
        {{ isRunning ? "정지" : "시작" }}
      </button>
      <button
        @click="resetTimer"
        class="px-6 py-2 font-semibold bg-gray-600 hover:bg-gray-700 rounded-md transition-colors"
      >
        초기화
      </button>
    </div>
  </container>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    workMinutes?: number;
  }>(),
  {
    workMinutes: 0,
  }
);

const totalSeconds = ref(props.workMinutes * 60);
const timeLeft = ref(totalSeconds.value);
const isRunning = ref(false);
let timer: NodeJS.Timeout | null = null;

// 분과 초 계산
const minutes = computed(() =>
  Math.floor(timeLeft.value / 60)
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

// 타이머 시작
const startTimer = () => {
  isRunning.value = true;
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      switchMode();
    }
  }, 1000);
};

// 타이머 일시정지
const pauseTimer = () => {
  isRunning.value = false;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

// 타이머 시작/정지 전환
const toggleTimer = () => {
  if (isRunning.value) {
    pauseTimer();
  } else {
    startTimer();
  }
};

// 모드 전환
const switchMode = () => {
  pauseTimer();
  totalSeconds.value = props.workMinutes * 60;
  timeLeft.value = totalSeconds.value;
  // 다음 세션을 자동으로 시작하고 싶다면 아래 주석을 해제하세요.
  // startTimer()
};

const resetTimer = () => {
  pauseTimer();
  totalSeconds.value = props.workMinutes * 60;
  timeLeft.value = totalSeconds.value;
};

// 컴포넌트가 사라질 때 타이머 정리
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>
