import type { TimerRecord } from "~/types/Timer";

export const useHistoryStore = defineStore(
  "history",
  () => {
    const records = ref<TimerRecord[]>([]);

    const addRecord = (record: Omit<TimerRecord, "id" | "completedAt">) => {
      records.value.push({
        ...record,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        completedAt: new Date().toISOString(),
      });
    };

    return { records, addRecord };
  },
  {
    persist: true,
  }
);
