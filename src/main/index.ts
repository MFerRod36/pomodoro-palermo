import { app, ipcMain } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { TimerEngine } from './timer-engine'
import { SettingsService } from './settings'
import { WindowManager } from './window-manager'
import { IPC } from '../shared/ipc-channels'
import { PHASE } from '../shared/types'
import type { TimerConfig } from '../shared/types'

const settings = new SettingsService()
const windowManager = new WindowManager()
let engine: TimerEngine

function broadcast(channel: string, payload?: unknown): void {
  windowManager.allWindows.forEach((win) => {
    if (!win.isDestroyed()) win.webContents.send(channel, payload)
  })
}

function initEngine(config: TimerConfig): void {
  engine = new TimerEngine(config)

  engine.on('tick', (state) => broadcast(IPC.TIMER_TICK, state))

  engine.on('phase-change', (event) => {
    windowManager.onPhaseChange(event.to)
    broadcast(IPC.TIMER_PHASE_CHANGE, event)
  })

  engine.on('session-complete', () => {
    broadcast(IPC.TIMER_SESSION_COMPLETE)
  })
}

function registerIpcHandlers(): void {
  ipcMain.handle(IPC.TIMER_START, () => engine.start())
  ipcMain.handle(IPC.TIMER_PAUSE, () => engine.pause())
  ipcMain.handle(IPC.TIMER_RESET, () => {
    const config = settings.load()
    engine.reset(config)
  })

  ipcMain.handle(IPC.SETTINGS_LOADED, () => settings.load())
  ipcMain.handle(IPC.SETTINGS_SAVE, (_, config: TimerConfig) => {
    settings.save(config)
    engine.reset(config)
    windowManager.onPhaseChange(PHASE.WORK)
    windowManager.closeSettingsWindow()
  })
  ipcMain.handle(IPC.SETTINGS_OPEN, () => windowManager.openSettingsWindow())

  ipcMain.handle(IPC.APP_QUIT, () => app.quit())
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.cat-pomodoro')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const config = settings.load()
  initEngine(config)
  registerIpcHandlers()

  windowManager.createTimerWindow()
  windowManager.createOverlayWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
