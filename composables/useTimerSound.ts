import { onUnmounted } from "vue";

let audioContext: AudioContext | null = null;
let audioBuffer: AudioBuffer | null = null;
let sourceNode: AudioBufferSourceNode | null = null;
let playCount = 0;
const maxPlays = 3;
let playTimeoutId: ReturnType<typeof setTimeout> | null = null;
let isInitialized = false; // 초기화 여부 플래그
let activeComponentCount = 0; // 이 composable을 사용하는 컴포넌트 수

// 오디오 파일을 미리 로드
const loadAudioFile = async () => {
  if (!audioContext || audioBuffer) return;
  try {
    const response = await fetch("/audio/timer_sound.mp3");
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  } catch (e) {
    console.error("오디오 파일 로딩 또는 디코딩 실패:", e);
    audioContext?.close();
    audioContext = null;
  }
};

// 실제 사운드 재생
const playSound = () => {
  if (!audioContext || !audioBuffer || playCount >= maxPlays) {
    stopAlarm();
    return;
  }

  if (sourceNode) {
    sourceNode.stop();
    sourceNode.disconnect();
  }

  playCount++;
  sourceNode = audioContext.createBufferSource();
  sourceNode.buffer = audioBuffer;
  sourceNode.connect(audioContext.destination);

  sourceNode.onended = () => {
    if (playCount < maxPlays) {
      if (playTimeoutId) clearTimeout(playTimeoutId);
      playTimeoutId = setTimeout(playSound, 300);
    } else {
      stopAlarm();
    }
  };
  sourceNode.start(0);
};

// 외부로 노출될 알람 정지 함수
const stopAlarm = () => {
  if (playTimeoutId) {
    clearTimeout(playTimeoutId);
    playTimeoutId = null;
  }
  if (sourceNode) {
    sourceNode.onended = null;
    try {
      sourceNode.stop();
    } catch (e) {}
    sourceNode.disconnect();
    sourceNode = null;
  }
};

export const useTimerSound = () => {
  // 오디오 초기화
  const initAudioContext = () => {
    if (process.server || isInitialized) return;
    try {
      audioContext = new AudioContext();
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }
      loadAudioFile();
      isInitialized = true; // 한 번만 초기화
    } catch (e) {
      console.error("AudioContext 생성 실패:", e);
    }
  };

  const startAlarm = () => {
    if (!audioContext || !audioBuffer) {
      console.warn(
        "오디오가 초기화되지 않았거나 로딩에 실패하여 알람을 재생할 수 없습니다."
      );

      if (!isInitialized) {
        initAudioContext();
      }
      return;
    }
    audioContext.resume();
    stopAlarm();
    playCount = 0;
    playSound();
  };

  // 컴포넌트가 마운트될 때 카운트 증가
  activeComponentCount++;

  onUnmounted(() => {
    // 컴포넌트가 언마운트될 때 카운트 감소
    activeComponentCount--;
    // 이 composable을 사용하는 컴포넌트가 하나도 없으면 모든 오디오 리소스 정리
    if (activeComponentCount === 0) {
      stopAlarm();
      if (audioContext) {
        audioContext.close();
        audioContext = null;
      }
      audioBuffer = null;
      isInitialized = false;
    }
  });

  return {
    initAudioContext,
    startAlarm,
    stopAlarm,
  };
};
