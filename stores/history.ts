import type { TimerRecord, supabaseRecord } from "~/types/Timer";

export const useHistoryStore = defineStore("history", () => {
  const records = ref<TimerRecord[]>([]);

  const fetchRecords = async () => {
    try {
      const { data, error } = await useFetch<supabaseRecord[]>("/api/records");
      if (error.value) throw error.value;
      if (data.value) {
        records.value = data.value.map((record) => ({
          id: record.id,
          completedAt: record.completed_at,
          durationMinutes: record.duration_minutes,
          timerMark: record.timer_mark,
          content: record.content,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch records:", err);
    }
  };

  const addRecord = async (record: Omit<TimerRecord, "id" | "completedAt">) => {
    try {
      const { data, error } = await useFetch<supabaseRecord[]>("/api/records", {
        method: "POST",
        body: record,
      });

      if (error.value) throw error.value;

      if (data.value && data.value.length > 0) {
        const newRecord = data.value[0] as supabaseRecord;
        records.value.unshift({
          id: newRecord.id,
          completedAt: newRecord.completed_at,
          durationMinutes: newRecord.duration_minutes,
          timerMark: newRecord.timer_mark,
          content: newRecord.content,
        });
      }
    } catch (err) {
      console.error("Failed to add record:", err);
    }
  };

  return { records, addRecord, fetchRecords };
});
