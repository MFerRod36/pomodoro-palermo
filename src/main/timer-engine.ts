import { EventEmitter } from 'events'
import { PHASE, type Phase, type TimerState, type TimerConfig, type PhaseChangeEvent } from '../shared/types'

const TICK_INTERVAL_MS = 1000

export class TimerEngine extends EventEmitter {
  private _interval: ReturnType<typeof setInterval> | null = null
  private _state: TimerState
  private _config: TimerConfig

  constructor(config: TimerConfig) {
    super()
    this._config = config
    this._state = this._buildInitialState(PHASE.WORK)
  }

  get state(): TimerState {
    return { ...this._state }
  }

  start(): void {
    if (this._state.isRunning) return
    this._state.isRunning = true
    this._interval = setInterval(() => this._tick(), TICK_INTERVAL_MS)
    this.emit('tick', this.state)
  }

  pause(): void {
    if (!this._state.isRunning) return
    this._state.isRunning = false
    this._clearInterval()
    this.emit('tick', this.state)
  }

  reset(config: TimerConfig): void {
    this.pause()
    this._config = config
    this._state = this._buildInitialState(PHASE.WORK)
    this.emit('tick', this.state)
  }

  private _tick(): void {
    this._state.remaining -= 1
    this.emit('tick', this.state)

    if (this._state.remaining <= 0) {
      this._transition()
    }
  }

  private _transition(): void {
    this._clearInterval()
    const from = this._state.phase
    const event: PhaseChangeEvent = { from, to: from === PHASE.WORK ? PHASE.BREAK : PHASE.WORK }

    if (from === PHASE.WORK) {
      const nextCycle = this._state.currentCycle + 1

      if (nextCycle > this._config.cycles) {
        // All cycles completed — stop after last work session
        this._state.isRunning = false
        this.emit('session-complete')
        return
      }

      // Transition to break, advance cycle count
      this._state = {
        phase: PHASE.BREAK,
        remaining: this._config.breakDuration * 60,
        total: this._config.breakDuration * 60,
        isRunning: false,
        currentCycle: nextCycle,
        totalCycles: this._config.cycles,
      }
    } else {
      // Break ended → back to work
      this._state = {
        phase: PHASE.WORK,
        remaining: this._config.workDuration * 60,
        total: this._config.workDuration * 60,
        isRunning: false,
        currentCycle: this._state.currentCycle,
        totalCycles: this._config.cycles,
      }
    }

    this.emit('phase-change', event)
    this.start()
  }

  private _clearInterval(): void {
    if (this._interval) {
      clearInterval(this._interval)
      this._interval = null
    }
  }

  private _buildInitialState(phase: Phase): TimerState {
    const duration = phase === PHASE.WORK ? this._config.workDuration : this._config.breakDuration
    return {
      phase,
      remaining: duration * 60,
      total: duration * 60,
      isRunning: false,
      currentCycle: 1,
      totalCycles: this._config.cycles,
    }
  }
}
