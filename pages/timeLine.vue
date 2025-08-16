<template>
  <div class="p-4 mx-auto w-2/3">
    <ClientOnly>
      <div
        v-if="hasRecords"
        class="grid grid-cols-1 sm:grid-cols-2 gap-40 mt-16"
      >
        <div class="card">
          <h2 class="text-xl font-semibold mb-2 text-white">주간 활동 기록</h2>
          <Chart
            type="bar"
            :data="dailyChartData"
            :options="barChartOptions"
            :height="300"
          />
        </div>

        <div class="card">
          <h2 class="text-xl font-semibold mb-2 text-white">누적 활동 시간</h2>
          <Chart
            type="pie"
            :data="categoryChartData"
            :options="pieChartOptions"
            :height="300"
          />
        </div>
      </div>

      <div
        v-else
        class="text-center mt-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <p class="text-white text-lg">😖아직 기록된 타이머가 없습니다.</p>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import Chart from "primevue/chart";
import { useHistoryStore } from "~/stores/history";
import { storeToRefs } from "pinia";
import { useChartData } from "~/composables/useChartData";

const historyStore = useHistoryStore();
const { records } = storeToRefs(historyStore);

const hasRecords = computed(() => records.value.length > 0);

const { dailyChartData, categoryChartData, barChartOptions, pieChartOptions } =
  useChartData(records);
</script>
