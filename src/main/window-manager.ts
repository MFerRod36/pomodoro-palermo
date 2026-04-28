import { BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import type { Phase } from '../shared/types'
import { PHASE } from '../shared/types'

export class WindowManager {
  private _timerWindow: BrowserWindow | null = null
  private _overlayWindow: BrowserWindow | null = null
  private _settingsWindow: BrowserWindow | null = null
  private _breakActive = false

  createTimerWindow(): BrowserWindow {
    this._timerWindow = new BrowserWindow({
      width: 300,
      height: 52,
      frame: false,
      resizable: false,
      alwaysOnTop: true,
      skipTaskbar: true,
      backgroundColor: '#172554',
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        contextIsolation: true,
        nodeIntegration: false,
      },
    })

    this._timerWindow.setAlwaysOnTop(true, 'floating')

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this._timerWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/timer/index.html`)
    } else {
      this._timerWindow.loadFile(join(__dirname, '../renderer/timer/index.html'))
    }

    this._timerWindow.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url)
      return { action: 'deny' }
    })

    return this._timerWindow
  }

  createOverlayWindow(): BrowserWindow {
    this._overlayWindow = new BrowserWindow({
      fullscreen: true,
      frame: false,
      resizable: false,
      closable: false,
      skipTaskbar: true,
      show: false,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        contextIsolation: true,
        nodeIntegration: false,
      },
    })

    this._overlayWindow.setAlwaysOnTop(true, 'screen-saver')

    this._overlayWindow.on('close', (e) => {
      if (this._breakActive) e.preventDefault()
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this._overlayWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/overlay/index.html`)
    } else {
      this._overlayWindow.loadFile(join(__dirname, '../renderer/overlay/index.html'))
    }

    return this._overlayWindow
  }

  openSettingsWindow(): void {
    if (this._settingsWindow && !this._settingsWindow.isDestroyed()) {
      this._settingsWindow.focus()
      return
    }

    this._settingsWindow = new BrowserWindow({
      width: 240,
      height: 280,
      frame: false,
      resizable: false,
      alwaysOnTop: true,
      skipTaskbar: true,
      backgroundColor: '#172554',
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        contextIsolation: true,
        nodeIntegration: false,
      },
    })

    this._settingsWindow.on('closed', () => {
      this._settingsWindow = null
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this._settingsWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/settings/index.html`)
    } else {
      this._settingsWindow.loadFile(join(__dirname, '../renderer/settings/index.html'))
    }
  }

  closeSettingsWindow(): void {
    if (this._settingsWindow && !this._settingsWindow.isDestroyed()) {
      this._settingsWindow.close()
    }
  }

  onPhaseChange(phase: Phase): void {
    if (phase === PHASE.BREAK) {
      this._breakActive = true
      this._timerWindow?.hide()
      this._overlayWindow?.show()
    } else {
      this._breakActive = false
      this._overlayWindow?.hide()
      this._timerWindow?.show()
    }
  }

  get timerWindow(): BrowserWindow | null {
    return this._timerWindow
  }

  get overlayWindow(): BrowserWindow | null {
    return this._overlayWindow
  }

  get allWindows(): BrowserWindow[] {
    return [this._timerWindow, this._overlayWindow].filter(Boolean) as BrowserWindow[]
  }
}
