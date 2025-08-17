import type { Ref } from "vue";
import type { TimerRecord } from "~/types/Timer";

export function useChartData(records: Ref<TimerRecord[]>) {
  const documentStyle = ref<CSSStyleDeclaration | null>(null);

  onMounted(() => {
    if (process.client) {
      documentStyle.value = getComputedStyle(document.documentElement);
    }
  });

  // 주간 활동 기록(막대 차트) 옵션
  const barChartOptions = computed(() => ({
    plugins: {
      legend: {
        labels: { color: "#E5E7EB" },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += `${context.parsed.y}개`;
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#D1D5DB",
          stepSize: 5,
          callback: (value: any) => `${value}개`,
        },
        grid: { color: "#4B5563" },
      },
      x: {
        ticks: { color: "#D1D5DB" },
        grid: { color: "#4B5563" },
      },
    },
  }));

  // 타이머 생성 비율(원형 차트) 옵션
  const pieChartOptions = computed(() => ({
    plugins: {
      legend: {
        labels: { color: "#E5E7EB" },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed !== null) {
              label += `${context.parsed}분`;
            }
            return label;
          },
        },
      },
    },
  }));

  // 최근 7일간의 기록을 필터링
  const recentRecords = computed(() => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    return records.value.filter(
      (record) => new Date(record.completedAt) >= sevenDaysAgo
    );
  });

  // 주간 활동 기록(막대 차트) 데이터
  const dailyChartData = computed(() => {
    if (!process.client || !documentStyle.value) return {};

    const dailyDataMap = new Map<string, number>();
    const today = new Date();

    // 최근 7일 날짜를 0으로 초기화
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateKey = date.toISOString().split("T")[0] as string;
      dailyDataMap.set(dateKey, 0);
    }

    // 날짜별 타이머 완료 "개수" 집계
    recentRecords.value.forEach((record) => {
      const recordDateKey = new Date(record.completedAt)
        .toISOString()
        .split("T")[0] as string;
      if (dailyDataMap.has(recordDateKey)) {
        dailyDataMap.set(
          recordDateKey,
          (dailyDataMap.get(recordDateKey) || 0) + 1
        );
      }
    });

    // 날짜 순으로 정렬
    const sortedDailyData = Array.from(dailyDataMap.entries()).sort(
      (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
    );

    // 날짜 형식 변경
    const labels = sortedDailyData.map(([key]) => {
      const date = new Date(key);
      const weekday = date.toLocaleDateString("ko-KR", { weekday: "short" });
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${weekday} (${month}.${day})`;
    });
    const data = sortedDailyData.map(([, value]) => value);

    return {
      labels,
      datasets: [
        {
          label: "완료한 타이머",
          backgroundColor: documentStyle.value.getPropertyValue("--p-sky-500"),
          borderColor: documentStyle.value.getPropertyValue("--p-white-500"),
          data,
        },
      ],
    };
  });

  // 타이머 생성 비율(원형 차트) 데이터
  const categoryChartData = computed(() => {
    if (!process.client || !documentStyle.value) return {};

    const categoryLabels = ["공부✏️", "독서📖", "운동🏀", "요리🍳", "집중🔥"];
    const markCodeToLabelMap: { [key: string]: string } = {
      "✏️": "공부✏️",
      "📖": "독서📖",
      "🏀": "운동🏀",
      "🍳": "요리🍳",
      "🔥": "집중🔥",
    };

    const categoryDataMap = new Map<string, number>();
    categoryLabels.forEach((label) => categoryDataMap.set(label, 0));

    // 카테고리별 "사용 시간(분)" 집계
    records.value.forEach((record) => {
      const label = markCodeToLabelMap[record.timerMark] || "집중🔥";
      if (categoryDataMap.has(label)) {
        categoryDataMap.set(
          label,
          (categoryDataMap.get(label) || 0) + record.durationMinutes
        );
      }
    });

    const data = categoryLabels.map((label) => categoryDataMap.get(label) || 0);

    return {
      labels: categoryLabels,
      datasets: [
        {
          data,
          backgroundColor: [
            documentStyle.value.getPropertyValue("--p-rose-400"),
            documentStyle.value.getPropertyValue("--p-yellow-400"),
            documentStyle.value.getPropertyValue("--p-emerald-400"),
            documentStyle.value.getPropertyValue("--p-violet-400"),
            documentStyle.value.getPropertyValue("--p-slate-400"),
          ],
        },
      ],
    };
  });

  return {
    dailyChartData,
    categoryChartData,
    barChartOptions,
    pieChartOptions,
  };
}
