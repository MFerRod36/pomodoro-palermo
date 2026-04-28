import type { TimerState, TimerConfig, PhaseChangeEvent } from './types'

type Unsubscribe = () => void

interface TimerAPI {
  onTick: (cb: (state: TimerState) => void) => Unsubscribe
  onPhaseChange: (cb: (event: PhaseChangeEvent) => void) => Unsubscribe
  onSessionComplete: (cb: () => void) => Unsubscribe
  start: () => Promise<void>
  pause: () => Promise<void>
  reset: () => Promise<void>
  saveSettings: (config: TimerConfig) => Promise<void>
  loadSettings: () => Promise<TimerConfig>
  openSettings: () => Promise<void>
  quit: () => Promise<void>
}

declare global {
  interface Window {
    timerAPI: TimerAPI
  }
}
