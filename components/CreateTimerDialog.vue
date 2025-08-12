<template>
  <div>
    <Dialog
      v-model:visible="dialogVisible"
      header="🕒타이머를 생성하세요."
      :style="{ width: '25rem', height: '14rem' }"
      class="cursor-pointer"
      @hide="handleHide"
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
          @click="closeDialog"
        ></Button>
        <Button
          type="button"
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
});

const closeDialog = () => {
  dialogVisible.value = false;
};

const saveTimer = () => {
  const hours = setTimer.value.getHours();
  const minutes = setTimer.value.getMinutes();
  emit("save", { hours, minutes });
  closeDialog();
};

const handleHide = () => {
  setTimer.value = new Date(0, 0, 0, 0, 0, 0);
};

const isDisabled = computed(() => {
  return setTimer.value.getHours() === 0 && setTimer.value.getMinutes() === 0;
});
</script>

<style scoped></style>
