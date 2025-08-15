export interface Timer {
  id: number;
  isSet: boolean;
  workHours: number;
  workMinutes: number;
  timerMark: string;
  content: string;
  isRunning?: boolean;
  remainingTime?: number;
  endTime?: number;
}

export interface TimerSetPayload {
  hours: number;
  minutes: number;
  timerMark: string;
  content: string;
}
