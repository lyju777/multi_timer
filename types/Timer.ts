export interface Timer {
  id: number;
  isSet: boolean;
  workHours: number;
  workMinutes: number;
  isRunning?: boolean;
  remainingTime?: number;
  endTime?: number;
}
