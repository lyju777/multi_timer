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

export interface TimerRecord {
  id: string;
  completedAt: string;
  durationMinutes: number;
  timerMark: string;
  content: string;
}

export interface supabaseRecord {
  id: string;
  completed_at: string;
  duration_minutes: number;
  timer_mark: string;
  content: string;
}
