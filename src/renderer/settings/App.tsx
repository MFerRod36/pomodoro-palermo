import { useState, useEffect } from 'react'
import { cn } from '@shared/cn'

const DURATIONS = [30, 45, 60] as const
const CYCLES = [3, 4, 5] as const

type Duration = (typeof DURATIONS)[number]
type CycleCount = (typeof CYCLES)[number]

export default function App(): JSX.Element {
  const [duration, setDuration] = useState<Duration>(30)
  const [cycles, setCycles] = useState<CycleCount>(4)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    window.timerAPI.loadSettings().then((config) => {
      setDuration((DURATIONS as readonly number[]).includes(config.workDuration) ? (config.workDuration as Duration) : 30)
      setCycles((CYCLES as readonly number[]).includes(config.cycles) ? (config.cycles as CycleCount) : 4)
      setLoaded(true)
    })
  }, [])

  async function handleSave(): Promise<void> {
    await window.timerAPI.saveSettings({ workDuration: duration, breakDuration: 5, cycles })
  }

  if (!loaded) return <div className="bg-blue-950 w-full h-full" />

  return (
    <div
      className="flex flex-col gap-5 bg-blue-950 p-5 w-full h-full select-none"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      <div className="flex items-center justify-between" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Configuración</span>
        <button
          onClick={() => window.close()}
          className="text-slate-500 hover:text-red-400 transition-colors text-sm leading-none"
        >
          ✕
        </button>
      </div>

      <div style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Duración de trabajo</p>
        <div className="flex gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={cn(
                'flex-1 py-1.5 rounded-lg text-sm font-semibold transition-colors',
                duration === d
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-900 text-slate-400 hover:bg-blue-800 hover:text-white'
              )}
            >
              {d}m
            </button>
          ))}
        </div>
      </div>

      <div style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Ciclos</p>
        <div className="flex gap-2">
          {CYCLES.map((c) => (
            <button
              key={c}
              onClick={() => setCycles(c)}
              className={cn(
                'flex-1 py-1.5 rounded-lg text-sm font-semibold transition-colors',
                cycles === c
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-900 text-slate-400 hover:bg-blue-800 hover:text-white'
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="mt-auto w-full border border-blue-500 text-blue-300 hover:bg-blue-600 hover:border-blue-600 hover:text-white text-sm font-semibold py-2 rounded-lg transition-colors"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        Guardar
      </button>
    </div>
  )
}
