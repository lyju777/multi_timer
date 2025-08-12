<template>
  <div>
    <Dialog
      v-model:visible="dialogVisible"
      header="🕒타이머를 생성하세요."
      :style="{ width: '25rem', height: '14rem' }"
      class="cursor-pointer"
    >
      <DatePicker
        v-model="setTimer"
        showIcon
        fluid
        iconDisplay="input"
        timeOnly
        class="mb-8"
      />
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="취소"
          severity="secondary"
          @click="dialogVisible = false"
        ></Button>
        <Button type="button" label="저장" @click="saveTimer"></Button>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import Dialog from "primevue/dialog";
import DatePicker from "primevue/datepicker";
import Button from "primevue/button";
import { useTimerStore } from "~/stores/timer";

const setTimer = ref(new Date());
const timerStore = useTimerStore();

const { workHours, workMinutes } = storeToRefs(timerStore);

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const saveTimer = () => {
  const hours = setTimer.value.getHours();
  const minutes = setTimer.value.getMinutes();

  // store에 타이머 설정 저장
  workHours.value = hours;
  workMinutes.value = minutes;

  dialogVisible.value = false;
};
</script>

<style scoped></style>
