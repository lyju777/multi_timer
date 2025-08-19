<template>
  <div class="p-4 sm:p-6 md:p-8 min-h-[calc(100vh-4.5rem)]">
    <ClientOnly>
      <!-- 로그인하지 않은 사용자를 위한 UI -->
      <div
        v-if="!user"
        class="flex flex-col items-center justify-center h-[calc(100vh-8rem)]"
      >
        <div class="text-center p-8 bg-zinc-950/60 rounded-2xl shadow-xl">
          <p class="text-5xl mb-4">🔒</p>
          <p class="text-white text-xl font-medium">로그인이 필요합니다.</p>
          <p class="text-gray-400 mt-2">
            타이머 기록을 확인하려면 로그인해주세요!
          </p>
          <Button
            class="mt-4"
            severity="contrast"
            raised
            label="Google 로그인"
            icon="pi pi-google"
            @click="signInWithGoogle"
          />
        </div>
      </div>

      <!-- 로그인한 사용자를 위한 기존 UI -->
      <div v-else>
        <div
          v-if="hasRecords"
          class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto shadow-lg xl:mt-5 2xl:mt-10"
        >
          <div class="bg-zinc-950/60 rounded-xl p-8 flex flex-col gap-4">
            <h2 class="text-xl font-semibold text-gray-100">
              🗓️주간 활동 기록
            </h2>
            <Chart
              type="bar"
              :data="dailyChartData"
              :options="barChartOptions"
              class="xl:h-[33rem] lg:h-[24rem] sm:h-[18rem] h-[16rem] w-full"
            />
          </div>

          <div class="bg-zinc-950/60 rounded-xl p-8 flex flex-col gap-4">
            <h2 class="text-xl font-semibold text-gray-100">
              🏆누적 활동 시간
            </h2>
            <Chart
              type="pie"
              :data="categoryChartData"
              :options="pieChartOptions"
              class="xl:h-[33rem] lg:h-[24rem] sm:h-[18rem] h-[16rem] w-full"
            />
          </div>
        </div>

        <div
          v-else
          class="flex flex-col items-center justify-center h-[calc(100vh-8rem)]"
        >
          <div class="text-center p-8 bg-zinc-950/60 rounded-2xl shadow-xl">
            <p class="text-5xl mb-4">😖</p>
            <p class="text-white text-xl font-medium">
              아직 기록된 타이머가 없습니다.
            </p>
            <p class="text-gray-400 mt-2">
              타이머를 완료하고 활동 기록을 확인해보세요!
            </p>
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import Chart from "primevue/chart";
import { useHistoryStore } from "~/stores/history";
import { storeToRefs } from "pinia";
import { useChartData } from "~/composables/useChartData";
import { GoogleLogin } from "~/composables/GoogleLogin";

const { user, signInWithGoogle } = GoogleLogin();

const historyStore = useHistoryStore();
const { records } = storeToRefs(historyStore);

const hasRecords = computed(() => records.value.length > 0);

const { dailyChartData, categoryChartData, barChartOptions, pieChartOptions } =
  useChartData(records);
</script>
