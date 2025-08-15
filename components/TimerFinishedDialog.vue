<template>
  <Dialog
    v-model:visible="dialogVisible"
    modal
    header="🎉타이머가 종료되었습니다."
    :style="{ width: '25rem' }"
  >
    <div class="text-center">
      <p class="text-lg my-4">
        <span class="font-bold">{{ timer?.timerMark }}</span>
        {{ timer?.content }}
      </p>
      <p class="text-lg">
        {{ timer?.workHours }}시간 {{ timer?.workMinutes }}분을 완료하였습니다.
      </p>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import type { Timer } from "~/types/Timer";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  timer: {
    type: Object as PropType<Timer>,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
