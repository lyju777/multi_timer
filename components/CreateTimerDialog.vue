<template>
  <div>
    <Dialog
      v-model:visible="dialogVisible"
      modal
      header="타이머를 생성해주세요."
      :style="{ width: '25rem', height: '22rem' }"
      class="cursor-pointer bg-zinc-900"
      @hide="handleHide"
    >
      <IconField class="mb-5">
        <InputIcon class="pi pi-pencil" />
        <InputText
          fluid
          placeholder="메모"
          v-model="timerContent"
          maxlength="15"
        />
      </IconField>

      <DatePicker
        v-model="setTimer"
        showIcon
        fluid
        iconDisplay="input"
        icon="pi pi-clock"
        timeOnly
        class="mb-5"
      />

      <Select
        v-model="timerMark"
        :options="timerMarks"
        checkmark
        :highlightOnSelect="false"
        optionLabel="name"
        placeholder="콘텐츠 선택"
        fluid
      />

      <div class="flex justify-end gap-2 mt-10">
        <Button
          type="button"
          variant="outlined"
          icon="pi pi-times"
          label="취소"
          severity="secondary"
          @click="closeDialog"
        ></Button>
        <Button
          type="button"
          icon="pi pi-check"
          label="저장"
          :disabled="isDisabled"
          @click="saveTimer"
        ></Button>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
const setTimer = ref(new Date(0, 0, 0, 0, 0, 0));

const timerContent = ref("");

const timerMark = ref();
const timerMarks = ref([
  { name: "✏️공부", code: "✏️" },
  { name: "📖독서", code: "📖" },
  { name: "🏀운동", code: "🏀" },
  { name: "🍳요리", code: "🍳" },
  { name: "🔥집중", code: "🔥" },
]);

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const { modelValue } = toRefs(props);

const emit = defineEmits(["update:modelValue", "save"]);

const dialogVisible = computed({
  get: () => modelValue.value,
  set: (value) => emit("update:modelValue", value),
}); // 타이머 생성 다이어로그 양방향 바인딩

const closeDialog = () => {
  dialogVisible.value = false;
}; // 타이머 생성 다이어로그 닫기

const saveTimer = () => {
  const hours = setTimer.value.getHours();
  const minutes = setTimer.value.getMinutes();
  emit("save", {
    hours,
    minutes,
    timerMark: timerMark.value.code,
    content: timerContent.value,
  });
  closeDialog();
}; // 타이머 시간 저장

const handleHide = () => {
  setTimer.value = new Date(0, 0, 0, 0, 0, 0);
}; // 타이머 시간 초기화

const isDisabled = computed(() => {
  return (
    (setTimer.value.getHours() === 0 && setTimer.value.getMinutes() === 0) ||
    timerMark.value === undefined ||
    timerContent.value === ""
  );
}); // 타이머 시간 비어있는지 확인
</script>

<style scoped></style>
