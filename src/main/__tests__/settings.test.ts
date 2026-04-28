import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { existsSync, unlinkSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

const SETTINGS_PATH = join(tmpdir(), 'settings.json')

vi.mock('electron', () => ({
  app: {
    getPath: vi.fn(() => tmpdir()),
  },
}))

import { SettingsService } from '../settings'

describe('SettingsService', () => {
  let service: SettingsService

  beforeEach(() => {
    if (existsSync(SETTINGS_PATH)) unlinkSync(SETTINGS_PATH)
    service = new SettingsService()
  })

  afterEach(() => {
    if (existsSync(SETTINGS_PATH)) unlinkSync(SETTINGS_PATH)
  })

  // 5.3 — defaults
  it('returns defaults when no settings file exists', () => {
    const config = service.load()
    expect(config.workDuration).toBe(30)
    expect(config.breakDuration).toBe(5)
    expect(config.cycles).toBe(4)
  })

  // 5.3 — validaciones
  it('throws when workDuration is out of range', () => {
    expect(() => service.save({ workDuration: 0, breakDuration: 5, cycles: 4 })).toThrow()
    expect(() => service.save({ workDuration: 121, breakDuration: 5, cycles: 4 })).toThrow()
  })

  it('throws when breakDuration is out of range', () => {
    expect(() => service.save({ workDuration: 30, breakDuration: 0, cycles: 4 })).toThrow()
    expect(() => service.save({ workDuration: 30, breakDuration: 121, cycles: 4 })).toThrow()
  })

  it('throws when cycles is out of range', () => {
    expect(() => service.save({ workDuration: 30, breakDuration: 5, cycles: 0 })).toThrow()
    expect(() => service.save({ workDuration: 30, breakDuration: 5, cycles: 21 })).toThrow()
  })
})
