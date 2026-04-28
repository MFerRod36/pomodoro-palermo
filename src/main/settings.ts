import { app } from 'electron'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import type { TimerConfig } from '../shared/types'

const MIN_DURATION = 1
const MAX_DURATION = 120
const MIN_CYCLES = 1
const MAX_CYCLES = 20

const DEFAULTS: TimerConfig = {
  workDuration: 30,
  breakDuration: 5,
  cycles: 4,
}

export class SettingsService {
  private readonly _path: string

  constructor() {
    this._path = join(app.getPath('userData'), 'settings.json')
  }

  load(): TimerConfig {
    try {
      if (!existsSync(this._path)) return { ...DEFAULTS }
      const raw = readFileSync(this._path, 'utf-8')
      const parsed = JSON.parse(raw) as Partial<TimerConfig>
      return {
        workDuration: this._clampDuration(parsed.workDuration ?? DEFAULTS.workDuration),
        breakDuration: this._clampDuration(parsed.breakDuration ?? DEFAULTS.breakDuration),
        cycles: this._clampCycles(parsed.cycles ?? DEFAULTS.cycles),
      }
    } catch {
      return { ...DEFAULTS }
    }
  }

  save(config: TimerConfig): void {
    if (!this._isDurationValid(config.workDuration) || !this._isDurationValid(config.breakDuration)) {
      throw new Error(`Duration must be between ${MIN_DURATION} and ${MAX_DURATION} minutes`)
    }
    if (!this._isCyclesValid(config.cycles)) {
      throw new Error(`Cycles must be between ${MIN_CYCLES} and ${MAX_CYCLES}`)
    }
    writeFileSync(this._path, JSON.stringify(config, null, 2))
  }

  private _isDurationValid(value: number): boolean {
    return Number.isInteger(value) && value >= MIN_DURATION && value <= MAX_DURATION
  }

  private _isCyclesValid(value: number): boolean {
    return Number.isInteger(value) && value >= MIN_CYCLES && value <= MAX_CYCLES
  }

  private _clampDuration(value: number): number {
    return Math.max(MIN_DURATION, Math.min(MAX_DURATION, Math.round(value)))
  }

  private _clampCycles(value: number): number {
    return Math.max(MIN_CYCLES, Math.min(MAX_CYCLES, Math.round(value)))
  }
}
