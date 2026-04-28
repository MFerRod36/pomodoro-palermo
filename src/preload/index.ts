import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '../shared/ipc-channels'
import type { TimerState, TimerConfig, PhaseChangeEvent } from '../shared/types'

contextBridge.exposeInMainWorld('timerAPI', {
  onTick: (cb: (state: TimerState) => void) => {
    const handler = (_: Electron.IpcRendererEvent, state: TimerState): void => cb(state)
    ipcRenderer.on(IPC.TIMER_TICK, handler)
    return () => ipcRenderer.removeListener(IPC.TIMER_TICK, handler)
  },

  onPhaseChange: (cb: (event: PhaseChangeEvent) => void) => {
    const handler = (_: Electron.IpcRendererEvent, event: PhaseChangeEvent): void => cb(event)
    ipcRenderer.on(IPC.TIMER_PHASE_CHANGE, handler)
    return () => ipcRenderer.removeListener(IPC.TIMER_PHASE_CHANGE, handler)
  },

  onSessionComplete: (cb: () => void) => {
    const handler = (): void => cb()
    ipcRenderer.on(IPC.TIMER_SESSION_COMPLETE, handler)
    return () => ipcRenderer.removeListener(IPC.TIMER_SESSION_COMPLETE, handler)
  },

  start: () => ipcRenderer.invoke(IPC.TIMER_START),
  pause: () => ipcRenderer.invoke(IPC.TIMER_PAUSE),
  reset: () => ipcRenderer.invoke(IPC.TIMER_RESET),

  saveSettings: (config: TimerConfig) => ipcRenderer.invoke(IPC.SETTINGS_SAVE, config),
  loadSettings: (): Promise<TimerConfig> => ipcRenderer.invoke(IPC.SETTINGS_LOADED),
  openSettings: () => ipcRenderer.invoke(IPC.SETTINGS_OPEN),

  quit: () => ipcRenderer.invoke(IPC.APP_QUIT),
})
