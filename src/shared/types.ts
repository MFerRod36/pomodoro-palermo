export const PHASE = {
  WORK: 'work',
  BREAK: 'break',
} as const

export type Phase = (typeof PHASE)[keyof typeof PHASE]

export interface TimerState {
  phase: Phase
  remaining: number
  total: number
  isRunning: boolean
  currentCycle: number
  totalCycles: number
}

export interface TimerConfig {
  workDuration: number
  breakDuration: number
  cycles: number
}

export interface PhaseChangeEvent {
  from: Phase
  to: Phase
}
