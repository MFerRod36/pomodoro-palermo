import { useState, useEffect } from 'react'
import { PHASE, type TimerState } from '@shared/types'
import { formatTime } from '@shared/utils'

import breakVideo from '../assets/break-video.mp4'

const INITIAL_STATE: TimerState = {
  phase: PHASE.BREAK,
  remaining: 5 * 60,
  total: 5 * 60,
  isRunning: false,
  currentCycle: 1,
  totalCycles: 4,
}

export default function App(): JSX.Element {
  const [state, setState] = useState<TimerState>(INITIAL_STATE)

  useEffect(() => {
    const unsubTick = window.timerAPI.onTick(setState)
    return () => unsubTick()
  }, [])

  return (
    <div className="w-full h-full bg-blue-950 flex flex-col items-center justify-center gap-8">
      <video
        src={breakVideo}
        autoPlay
        loop
        muted
        className="w-[65%] rounded-xl shadow-2xl"
      />

      <div className="flex flex-col items-center gap-3">
        <span className="font-mono text-7xl font-bold text-white tabular-nums drop-shadow-lg">
          {formatTime(state.remaining)}
        </span>
        <span className="text-slate-400 text-lg">Tomá un descanso</span>
      </div>
    </div>
  )
}
