<template>
  <div class="p-4 mx-auto w-2/3">
    <ClientOnly>
      <div
        v-if="hasRecords"
        class="grid grid-cols-1 sm:grid-cols-2 gap-7 mt-16"
      >
        <div class="card">
          <h2 class="text-xl font-semibold mb-2 text-white">
            일일 사용 시간 (분)
          </h2>
          <Chart
            type="bar"
            :data="dailyChartData"
            :options="chartOptions"
            :height="300"
          />
        </div>

        <div class="card">
          <h2 class="text-xl font-semibold mb-2 text-white">
            타이머 생성 비율
          </h2>
          <Chart
            type="pie"
            :data="categoryChartData"
            :options="chartOptions"
            :height="300"
          />
        </div>
      </div>

      <div v-else class="text-center mt-10">
        <p class="text-white">아직 기록된 타이머가 없습니다.</p>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import Chart from "primevue/chart";
import { useHistoryStore } from "~/stores/history";
import { storeToRefs } from "pinia";
import { ref, onMounted } from "vue";

const historyStore = useHistoryStore();
const { records } = storeToRefs(historyStore);

const hasRecords = computed(() => records.value.length > 0);

const dailyChartData = ref({});
const categoryChartData = ref({});
const chartOptions = ref({
  plugins: {
    legend: {
      labels: {
        color: "#E5E7EB", // text-gray-200
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: "#D1D5DB", // text-gray-300
      },
      grid: {
        color: "#4B5563", // gray-700
      },
    },
    x: {
      ticks: {
        color: "#D1D5DB",
      },
      grid: {
        color: "#4B5563",
      },
    },
  },
});

const processChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  // 일일 통계 데이터 가공
  const dailyData: { [key: string]: number } = {};
  records.value.forEach((record) => {
    const date = new Date(record.completedAt).toLocaleDateString("ko-KR");
    dailyData[date] = (dailyData[date] || 0) + record.durationMinutes;
  });

  dailyChartData.value = {
    labels: Object.keys(dailyData),
    datasets: [
      {
        label: "총 사용 시간(분)",
        backgroundColor: documentStyle.getPropertyValue("--p-cyan-500"),
        borderColor: documentStyle.getPropertyValue("--p-cyan-500"),
        data: Object.values(dailyData),
      },
    ],
  };

  // 카테고리별 데이터 가공
  const categoryData: { [key: string]: number } = {};
  records.value.forEach((record) => {
    categoryData[record.timerMark] =
      (categoryData[record.timerMark] || 0) + record.durationMinutes;
  });

  categoryChartData.value = {
    labels: ["공부✏️", "독서📖", "운동🏀", "요리🍳", "기타🔥"],
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          documentStyle.getPropertyValue("--p-rose-400"),
          documentStyle.getPropertyValue("--p-yellow-300"),
          documentStyle.getPropertyValue("--p-lime-300"),
          documentStyle.getPropertyValue("--p-teal-300"),
          documentStyle.getPropertyValue("--p-indigo-400"),
        ],
      },
    ],
  };
};

onMounted(() => {
  processChartData();
});

watch(
  records,
  () => {
    processChartData();
  },
  { deep: true }
);
</script>
