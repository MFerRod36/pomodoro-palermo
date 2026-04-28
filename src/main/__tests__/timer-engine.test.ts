import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { TimerEngine } from '../timer-engine'
import { PHASE } from '../../shared/types'
import type { TimerConfig, PhaseChangeEvent } from '../../shared/types'

const CONFIG: TimerConfig = {
  workDuration: 1,
  breakDuration: 1,
  cycles: 2,
}

describe('TimerEngine', () => {
  let engine: TimerEngine

  beforeEach(() => {
    vi.useFakeTimers()
    engine = new TimerEngine(CONFIG)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // 5.2 — estado inicial
  it('starts in paused state in WORK phase', () => {
    expect(engine.state.isRunning).toBe(false)
    expect(engine.state.phase).toBe(PHASE.WORK)
  })

  // 5.2 — tick behavior
  it('emits tick immediately on start', () => {
    const ticks: number[] = []
    engine.on('tick', (s) => ticks.push(s.remaining))
    engine.start()
    expect(ticks).toHaveLength(1)
    expect(ticks[0]).toBe(60)
  })

  it('emits tick every second while running', () => {
    const ticks: number[] = []
    engine.on('tick', (s) => ticks.push(s.remaining))
    engine.start()
    vi.advanceTimersByTime(3000)
    expect(ticks).toEqual([60, 59, 58, 57])
  })

  it('stops emitting ticks when paused', () => {
    engine.start()
    engine.pause()
    let count = 0
    engine.on('tick', () => count++)
    vi.advanceTimersByTime(5000)
    expect(count).toBe(0)
  })

  // 5.1 — phase transitions
  it('transitions from WORK to BREAK when remaining reaches 0', () => {
    const events: PhaseChangeEvent[] = []
    engine.on('phase-change', (e) => events.push(e))
    engine.start()
    vi.advanceTimersByTime(60 * 1000 + 100)
    expect(events[0]).toEqual({ from: PHASE.WORK, to: PHASE.BREAK })
    expect(engine.state.phase).toBe(PHASE.BREAK)
  })

  it('transitions from BREAK to WORK when remaining reaches 0', () => {
    const events: PhaseChangeEvent[] = []
    engine.on('phase-change', (e) => events.push(e))
    engine.start()
    vi.advanceTimersByTime(60 * 1000 + 100)
    vi.advanceTimersByTime(60 * 1000 + 100)
    expect(events[1]).toEqual({ from: PHASE.BREAK, to: PHASE.WORK })
    expect(engine.state.phase).toBe(PHASE.WORK)
  })

  it('emits session-complete after all work cycles', () => {
    let completed = false
    engine.on('session-complete', () => { completed = true })
    engine.start()
    vi.advanceTimersByTime(60 * 1000 + 100) // ciclo 1 work → break
    vi.advanceTimersByTime(60 * 1000 + 100) // break → ciclo 2 work
    vi.advanceTimersByTime(60 * 1000 + 100) // ciclo 2 work → session-complete
    expect(completed).toBe(true)
  })
})
