<template>
  <div
    class="p-6 bg-zinc-800 rounded-lg shadow-xl text-center text-white min-w-80 min-h-52 relative"
  >
    <Toast />
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
      <ConfirmPopup ref="confirmPopup"></ConfirmPopup>
      <Button
        @click="deleteTimer($event)"
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
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

const confirm = useConfirm();
const toast = useToast();

const props = defineProps({
  timer: {
    type: Object as PropType<Timer>,
    required: true,
  },
});

const emit = defineEmits(["timer-set", "delete-timer"]);

const isSet = computed(() => props.timer.isSet); // 타이머 설정 여부
const workHours = computed(() => props.timer.workHours); // 타이머 시간
const workMinutes = computed(() => props.timer.workMinutes); // 타이머 분

const totalSeconds = computed(
  () => workHours.value * 3600 + workMinutes.value * 60
); // 타이머 총 시간
const timeLeft = ref(totalSeconds.value); // 타이머 남은 시간

const isRunning = ref(false); // 타이머 실행 여부
const visible = ref(false); // 타이머 생성 다이얼로그 표시 여부
let timer: NodeJS.Timeout | null = null;

// 타이머 시간 계산
watch(totalSeconds, (newTotal) => {
  timeLeft.value = newTotal;
});

// 타이머 생성 다이얼로그 표시
const showCreateTimerDialog = () => {
  visible.value = true;
};

// 타이머 생성
const handleTimerSave = (payload: { hours: number; minutes: number }) => {
  emit("timer-set", payload);
  visible.value = false;
};

// 타이머 시간 계산
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

// 타이머 시작
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

// 타이머 일시정지
const pauseTimer = () => {
  isRunning.value = false;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

// 타이머 제거
const deleteTimer = (event: Event) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: "타이머를 제거하시겠습니까?",
    header: "Danger Zone",
    icon: "pi pi-info-circle",
    rejectLabel: "취소",
    rejectProps: {
      label: "취소",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "제거",
      severity: "danger",
    },
    accept: () => {
      toast.add({
        severity: "success",
        summary: "success",
        detail: "타이머가 제거되었습니다.",
        life: 3000,
      });
      emit("delete-timer", props.timer.id);
    },
  });
};

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>
