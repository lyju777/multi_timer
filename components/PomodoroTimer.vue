<template>
  <div
    class="p-6 bg-zinc-950/60 rounded-lg shadow-xl text-center text-white min-w-80 min-h-56 relative"
  >
    <Toast />
    <CreateTimerDialog v-model="visible" @save="handleTimerSave" />
    <span class="text-lg font-bold text-left absolute top-5 left-6">
      {{ timerMark }}
      {{ content }}
    </span>

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
        outlined
      />
    </div>
    <!-- 타이머 디스플레이 -->
    <div
      v-else
      class="grid grid-flow-col gap-5 text-center auto-cols-max mt-10 justify-center"
    >
      <div
        class="flex flex-col p-4 max-w-20 bg-[#0b0809] rounded-lg text-neutral-content"
      >
        <span class="countdown font-mono text-4xl sm:text-5xl">
          <span :style="{ '--value': hours }">{{ hours }}</span>
        </span>
        hours
      </div>
      <div
        class="flex flex-col p-4 max-w-20 bg-[#0b0809] rounded-lg text-neutral-content"
      >
        <span class="countdown font-mono text-4xl sm:text-5xl">
          <span :style="{ '--value': minutes }">{{ minutes }}</span>
        </span>
        min
      </div>
      <div
        class="flex flex-col p-4 max-w-20 bg-[#0b0809] rounded-lg text-neutral-content"
      >
        <span class="countdown font-mono text-4xl sm:text-5xl">
          <span :style="{ '--value': seconds }">{{ seconds }}</span>
        </span>
        sec
      </div>
    </div>

    <!-- 타이머 조작 버튼 -->
    <div v-if="isSet" class="flex justify-center space-x-5 mt-4">
      <Button
        @click="startTimer"
        :disabled="isRunning || remainingTime === 0"
        raised
        rounded
        icon="pi pi-play"
        outlined
      />
      <Button
        @click="pauseTimer"
        :disabled="!isRunning || remainingTime === 0"
        rounded
        raised
        icon="pi pi-pause"
        outlined
      />
      <Button @click="resetTimer" raised rounded icon="pi pi-replay" outlined />
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
import type { Timer, TimerSetPayload } from "~/types/Timer";
import type { PropType } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useTimersStore } from "~/stores/timers";

const confirm = useConfirm();
const toast = useToast();
const timersStore = useTimersStore();

const props = defineProps({
  timer: {
    type: Object as PropType<Timer>,
    required: true,
  },
});

const emit = defineEmits(["timer-set", "delete-timer"]);

const timerData = computed(() =>
  timersStore.timers.find((t) => t.id === props.timer.id)
);

const isSet = computed(() => timerData.value?.isSet ?? false);
const isRunning = computed(() => timerData.value?.isRunning ?? false);
const remainingTime = computed(() => timerData.value?.remainingTime ?? 0);

const timerMark = computed(() => timerData.value?.timerMark ?? "");
const content = computed(() => timerData.value?.content ?? "");

const visible = ref(false);

const showCreateTimerDialog = () => {
  visible.value = true;
};

const handleTimerSave = (payload: TimerSetPayload) => {
  emit("timer-set", payload);
  visible.value = false;
};

const minutes = computed(() =>
  Math.floor((remainingTime.value / 60) % 60)
    .toString()
    .padStart(2, "0")
);
const seconds = computed(() =>
  (remainingTime.value % 60).toString().padStart(2, "0")
);
const hours = computed(() =>
  Math.floor(remainingTime.value / 3600)
    .toString()
    .padStart(2, "0")
);

const startTimer = () => {
  if (timerData.value) {
    timersStore.startTimer(timerData.value.id);
  }
};

const pauseTimer = () => {
  if (timerData.value) {
    timersStore.pauseTimer(timerData.value.id);
  }
};

const resetTimer = () => {
  if (timerData.value) {
    timersStore.resetTimer(timerData.value.id);
  }
};

const deleteTimer = (event: Event) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: "타이머를 제거하시겠습니까?",
    header: "Danger Zone",
    icon: "pi pi-info-circle",
    rejectLabel: "취소",
    rejectProps: {
      icon: "pi pi-times",
      label: "취소",
      severity: "contrast",
      outlined: true,
    },
    acceptProps: {
      icon: "pi pi-check",
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
</script>
