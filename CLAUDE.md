# Cat Pomodoro — Project Context

## What This Is

A desktop Pomodoro app inspired by Cat Gatekeeper. During work sessions, a small floating timer sits at the top of the screen. When break time arrives, a fullscreen overlay with a fat cat video and countdown timer blocks the computer until the break is over.

## Stack

- **Electron** — desktop shell, screen blocking, always-on-top windows
- **React 19** — UI layer
- **TypeScript** — strict mode
- **Tailwind CSS 4** — styling
- **Vite** — bundler (via electron-vite)

## Project Structure

```
src/
  main/         → Electron main process (Node.js context)
  preload/      → Electron preload scripts (bridge between main and renderer)
  renderer/     → React app (browser context)
    components/ → Atomic components
    pages/      → App views (Home, Settings)
    hooks/      → Custom React hooks
    store/      → State management
```

## Key Electron Concepts (important for this project)

- **Main process**: Controls the app lifecycle, creates BrowserWindows, handles timers
- **Renderer process**: The React UI — runs in a browser-like sandbox
- **Preload script**: Secure bridge — exposes specific Node APIs to the renderer via `contextBridge`
- **IPC (Inter-Process Communication)**: How main and renderer talk to each other (`ipcMain` / `ipcRenderer`)

## Windows

1. **Main window**: Small floating timer (always-on-top, draggable, no frame)
2. **Break overlay**: Fullscreen, always-on-top, non-closable during break

## Rules

- Never build after changes (just edit files)
- Use conventional commits only — no AI attribution
- IPC channels must be defined in `src/preload/` — never expose raw Node APIs
- Timer logic lives in the main process, NOT the renderer
- All user settings are persisted via `electron-store`
