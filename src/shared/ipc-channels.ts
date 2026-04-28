export const IPC = {
  TIMER_TICK: 'timer:tick',
  TIMER_PHASE_CHANGE: 'timer:phase-change',
  TIMER_SESSION_COMPLETE: 'timer:session-complete',
  TIMER_START: 'timer:start',
  TIMER_PAUSE: 'timer:pause',
  TIMER_RESET: 'timer:reset',
  SETTINGS_SAVE: 'settings:save',
  SETTINGS_LOADED: 'settings:loaded',
  SETTINGS_OPEN: 'settings:open',
  APP_QUIT: 'app:quit',
} as const

export type IpcChannel = (typeof IPC)[keyof typeof IPC]
