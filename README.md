# Palermo Pomodoro

A minimal Pomodoro timer for the desktop. During work sessions, a small floating widget sits at the top of the screen. When break time arrives, a fullscreen overlay with a video and countdown blocks the computer until the break is over.

---

## Features

- Floating always-on-top timer widget (frameless, draggable)
- Fullscreen break overlay — non-closable until the break ends
- Configurable work duration: **30 / 45 / 60 minutes**
- Configurable cycle count: **3 / 4 / 5 pomodoros**
- Break duration fixed at **5 minutes**
- Session complete detection — stops after all cycles finish
- Settings persist across sessions

---

## Stack

| Layer         | Technology            |
| ------------- | --------------------- |
| Desktop shell | Electron              |
| UI            | React 19 + TypeScript |
| Styling       | Tailwind CSS 4        |
| Bundler       | electron-vite         |
| Tests         | Vitest                |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Add the break video

The break overlay video is not included in the repository. Place your video file at:

```
src/renderer/assets/break-video.mp4
```

Any `.mp4` works. The video plays looped and muted during breaks.

### Run in development

```bash
npm run dev
```

### Run tests

```bash
npm test
```

### Build

```bash
npm run build
```

---

## Project Structure

```
src/
├── main/                   # Electron main process (Node.js)
│   ├── index.ts            # App entry, IPC handlers
│   ├── timer-engine.ts     # Timer state machine (EventEmitter)
│   ├── settings.ts         # Settings persistence (userData)
│   ├── window-manager.ts   # BrowserWindow lifecycle
│   └── __tests__/          # Unit tests
├── preload/
│   └── index.ts            # contextBridge — exposes timerAPI to renderers
├── renderer/
│   ├── timer/              # Floating timer widget
│   ├── overlay/            # Fullscreen break overlay
│   └── settings/           # Settings window
└── shared/
    ├── types.ts            # Shared TypeScript types
    ├── ipc-channels.ts     # IPC channel constants
    ├── utils.ts            # Shared utilities (formatTime)
    ├── cn.ts               # Tailwind class merge utility
    └── window.d.ts         # Global Window type declaration (timerAPI)
```

---

## Usage

1. Launch the app — the timer widget appears at the top of the screen
2. Press **▶** to start the first pomodoro
3. When the session ends, the break overlay takes over the screen
4. The overlay closes automatically when the break timer runs out
5. After all cycles complete, the widget shows **DONE**
6. Press **⚙** to open settings and adjust duration or cycle count — resets the timer immediately on save

---

## Architecture Notes

- Timer logic runs entirely in the **main process** via `TimerEngine` — the renderer only displays state received through IPC
- The break overlay is `closable: false` and `alwaysOnTop: screen-saver` — it cannot be dismissed early
- Settings are saved to Electron's `userData` path as `settings.json`
