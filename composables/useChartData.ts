import { _borderRadius } from "#tailwind-config/theme";
import type { Ref } from "vue";
import type { TimerRecord } from "~/types/Timer";

export function useChartData(records: Ref<TimerRecord[]>) {
  const documentStyle = ref<CSSStyleDeclaration | null>(null);

  // 중앙 카테고리 설정
  const categoryConfig = ref<{
    [key: string]: { code: string; color: string; borderColor: string };
  }>({});

  if (process.client) {
    const styles = getComputedStyle(document.documentElement);
    documentStyle.value = styles;
    categoryConfig.value = {
      "공부✏️": {
        code: "✏️",
        color: "rgba(255, 183, 77, 0.9)",
        borderColor: "rgba(255, 183, 77, 1)",
      },
      "독서📖": {
        code: "📖",
        color: "rgba(147, 197, 253, 0.9)",
        borderColor: "rgba(147, 197, 253, 1)",
      },
      "운동🏀": {
        code: "🏀",
        color: "rgba(134, 239, 172, 0.9)",
        borderColor: "rgba(134, 239, 172, 1)",
      },
      "요리🍳": {
        code: "🍳",
        color: "rgba(196, 181, 253, 0.9)",
        borderColor: "rgba(196, 181, 253, 1)",
      },
      "집중🔥": {
        code: "🔥",
        color: "rgba(252, 165, 165, 0.9)",
        borderColor: "rgba(252, 165, 165, 1)",
      },
    };
  }

  // 누적 막대 차트 옵션 수정
  const barChartOptions = computed(() => ({
    maintainAspectRatio: false,
    responsive: true,
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
      x: {
        stacked: true, // x축 누적 옵션 활성화
        ticks: { color: "#D1D5DB" },
        grid: { color: "#4B5563" },
      },
      y: {
        stacked: true, // y축 누적 옵션 활성화
        beginAtZero: true,
        ticks: {
          color: "#D1D5DB",
          stepSize: 5, // y축 단위를 1씩 증가
          callback: (value: any) =>
            Number.isInteger(value) ? `${value}개` : "", // 정수 눈금에만 '개' 표시
        },
        grid: { color: "#4B5563" },
      },
    },
  }));

  // 타이머 생성 비율(원형 차트) 옵션
  const pieChartOptions = computed(() => ({
    maintainAspectRatio: false,
    responsive: true,
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

  // 콤보 차트(누적 막대 + 선) 데이터 재구성
  const dailyChartData = computed(() => {
    if (
      !process.client ||
      !documentStyle.value ||
      Object.keys(categoryConfig.value).length === 0
    )
      return {};

    const categoryLabels = Object.keys(categoryConfig.value);
    const markCodeToLabelMap = Object.fromEntries(
      Object.entries(categoryConfig.value).map(([label, { code }]) => [
        code,
        label,
      ])
    );

    const dailyDataMap = new Map<string, Map<string, number>>();
    const today = new Date();
    const dateKeys: string[] = [];

    // 7일간의 날짜별, 카테고리별 데이터 구조 초기화
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateKey = date.toISOString().split("T")[0] as string;
      dateKeys.push(dateKey);

      const categoryMap = new Map<string, number>();
      categoryLabels.forEach((label) => categoryMap.set(label, 0));
      dailyDataMap.set(dateKey, categoryMap);
    }

    // 날짜별, 카테고리별 타이머 완료 "개수" 집계
    recentRecords.value.forEach((record) => {
      const recordDateKey = new Date(record.completedAt)
        .toISOString()
        .split("T")[0] as string;
      const label = markCodeToLabelMap[record.timerMark] || "집중🔥";

      const dayMap = dailyDataMap.get(recordDateKey);
      if (dayMap && dayMap.has(label)) {
        dayMap.set(label, (dayMap.get(label) || 0) + 1);
      }
    });

    // 누적 막대 차트 datasets
    const barDatasets = categoryLabels.map((label) => ({
      type: "bar",
      label: label,
      borderRadius: 7,
      backgroundColor: categoryConfig.value[label]!.color,
      borderColor: categoryConfig.value[label]!.borderColor,
      borderWidth: 1.5,
      data: dateKeys.map(
        (dateKey) => dailyDataMap.get(dateKey)?.get(label) || 0
      ),
    }));

    // 선 그래프를 위한 일일 총합 데이터 계산
    const totalData = dateKeys.map((dateKey) => {
      const dayMap = dailyDataMap.get(dateKey);
      if (!dayMap) return 0;
      return Array.from(dayMap.values()).reduce((sum, count) => sum + count, 0);
    });

    // 선 그래프 dataset
    const lineDataset = {
      type: "line",
      label: "누적 활동",
      borderWidth: 1.5,
      borderColor: documentStyle.value.getPropertyValue("--p-neutral-50"),
      backgroundColor: documentStyle.value.getPropertyValue("--p-neutral-50"),
      fill: false,
      tension: 0.3,
      data: totalData,
    };

    const labels = dateKeys.map((key) => {
      const date = new Date(key);
      const weekday = date.toLocaleDateString("ko-KR", { weekday: "short" });
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${weekday} (${month}.${day})`;
    });

    return {
      labels,
      datasets: [lineDataset, ...barDatasets], // 선 그래프를 먼저 렌더링하여 막대 위에 표시
    };
  });

  const categoryChartData = computed(() => {
    if (
      !process.client ||
      !documentStyle.value ||
      Object.keys(categoryConfig.value).length === 0
    )
      return {};

    const categoryLabels = Object.keys(categoryConfig.value);
    const markCodeToLabelMap = Object.fromEntries(
      Object.entries(categoryConfig.value).map(([label, { code }]) => [
        code,
        label,
      ])
    );

    const categoryDataMap = new Map<string, number>();
    categoryLabels.forEach((label) => categoryDataMap.set(label, 0));

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
          backgroundColor: categoryLabels.map(
            (label) => categoryConfig.value[label]!.color
          ),
          borderColor: categoryLabels.map(
            (label) => categoryConfig.value[label]!.borderColor
          ),
          borderWidth: 1.5,
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
