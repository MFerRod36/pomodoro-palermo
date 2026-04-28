import { useState, useEffect } from 'react'
import { PHASE, type TimerState } from '@shared/types'
import { formatTime } from '@shared/utils'
import { cn } from '@shared/cn'

const INITIAL_STATE: TimerState = {
  phase: PHASE.WORK,
  remaining: 25 * 60,
  total: 25 * 60,
  isRunning: false,
  currentCycle: 1,
  totalCycles: 4,
}

export default function App(): JSX.Element {
  const [state, setState] = useState<TimerState>(INITIAL_STATE)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    const unsubTick = window.timerAPI.onTick(setState)
    const unsubComplete = window.timerAPI.onSessionComplete(() => setCompleted(true))
    return () => {
      unsubTick()
      unsubComplete()
    }
  }, [])

  const isWork = state.phase === PHASE.WORK

  function handlePlayPause(): void {
    if (state.isRunning) {
      window.timerAPI.pause()
    } else {
      window.timerAPI.start()
    }
  }

  return (
    <div
      className="flex items-center gap-2 bg-blue-950 px-1 py-1 rounded-2xl w-full h-full select-none shadow-xl"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      <span className={cn('text-[11px] font-bold uppercase tracking-widest w-10 shrink-0', isWork ? 'text-red-400' : 'text-emerald-400')}>
        {completed ? 'DONE' : state.phase}
      </span>

      <span className="text-[11px] text-slate-500 w-7 text-center shrink-0">
        {state.currentCycle}/{state.totalCycles}
      </span>

      <span className="font-mono text-base font-semibold text-white flex-1 text-center tabular-nums">
        {formatTime(state.remaining)}
      </span>

      <div
        className="flex items-center gap-5"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <button
          onClick={() => window.timerAPI.openSettings()}
          className="text-slate-500 hover:text-white transition-colors"
          title="Configuración"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.34.07-.69.07-1.08s-.03-.74-.07-1.08l2.32-1.82c.21-.16.27-.45.14-.69l-2.2-3.81c-.13-.24-.42-.32-.66-.24l-2.74 1.1c-.57-.44-1.18-.81-1.86-1.08L14.5 2.42c-.04-.26-.27-.42-.5-.42h-4c-.23 0-.46.16-.5.42L9.13 5.38C8.45 5.65 7.84 6 7.27 6.46L4.53 5.36c-.24-.09-.53 0-.66.24L1.67 9.41c-.14.24-.08.53.14.69l2.32 1.82C4.1 12.26 4.07 12.61 4.07 13s.03.74.07 1.08L1.81 15.9c-.21.16-.27.45-.14.69l2.2 3.81c.13.24.42.32.66.24l2.74-1.1c.57.44 1.18.81 1.86 1.08l.42 2.96c.04.26.27.42.5.42h4c.23 0 .46-.16.5-.42l.42-2.96c.68-.27 1.29-.64 1.86-1.08l2.74 1.1c.24.09.53 0 .66-.24l2.2-3.81c.14-.24.08-.53-.14-.69l-2.32-1.82z"/>
          </svg>
        </button>

        <button
          onClick={handlePlayPause}
          disabled={completed}
          className="text-white hover:opacity-70 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          title={state.isRunning ? 'Pausar' : 'Iniciar'}
        >
          {state.isRunning ? (
            <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor">
              <rect x="0" y="0" width="4" height="16" rx="1" />
              <rect x="10" y="0" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="16" viewBox="0 0 12 16" fill="currentColor">
              <path d="M0 0L12 8L0 16V0Z" />
            </svg>
          )}
        </button>

        <button
          onClick={() => window.timerAPI.quit()}
          className="text-base text-white hover:text-red-400 transition-colors leading-none"
          title="Cerrar"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
