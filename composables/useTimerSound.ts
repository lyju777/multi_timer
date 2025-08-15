export const useTimerSound = () => {
  const audio = ref<HTMLAudioElement | null>(null);
  let playCount = 0;
  const maxPlays = 3;
  let playTimeoutId: NodeJS.Timeout | null = null;

  const stopAudio = () => {
    // 예약된 재생이 있다면 취소
    if (playTimeoutId) {
      clearTimeout(playTimeoutId);
      playTimeoutId = null;
    }
    if (audio.value) {
      audio.value.pause();
      audio.value.currentTime = 0;
      audio.value.removeEventListener("ended", delayedPlayNext);
      audio.value = null;
    }
  };

  const playNext = () => {
    if (playCount < maxPlays && audio.value) {
      playCount++;
      audio.value.currentTime = 0;
      audio.value.play().catch((e) => console.error("오디오 재생 실패:", e));
    } else {
      stopAudio(); // 3번 재생 후 정지
    }
  };

  // 300ms 딜레이 후 재생을 실행하는 함수
  const delayedPlayNext = () => {
    if (playTimeoutId) clearTimeout(playTimeoutId);
    playTimeoutId = setTimeout(() => {
      playNext();
    }, 300);
  };

  const startAlarm = () => {
    stopAudio(); // 이전에 재생중인 오디오가 있다면 정지
    playCount = 0;
    audio.value = new Audio("/audio/timer_sound.mp3");
    // 재생이 끝나면 300ms 후 다음 재생 예약
    audio.value.addEventListener("ended", delayedPlayNext);
    // 첫 재생도 300ms 후 시작
    delayedPlayNext();
  };

  const stopAlarm = () => {
    stopAudio();
  };

  return {
    startAlarm,
    stopAlarm,
  };
};
