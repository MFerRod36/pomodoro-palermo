# Skill Registry — cat-pomodoro

Generated: 2026-04-27

## User Skills

| Skill            | Trigger                                                 |
| ---------------- | ------------------------------------------------------- |
| `react-19`       | Writing React components, JSX, hooks                    |
| `tailwind-4`     | Styling with Tailwind CSS, cn(), theme variables        |
| `typescript`     | Writing TypeScript code — types, interfaces, generics   |
| `zod-4`          | Zod validation schemas                                  |
| `branch-pr`      | Creating a pull request or preparing changes for review |
| `issue-creation` | Creating a GitHub issue                                 |
| `judgment-day`   | Parallel adversarial review of code or architecture     |
| `skill-creator`  | Creating new AI skills                                  |

## SDD Skills

| Skill         | Phase                                      |
| ------------- | ------------------------------------------ |
| `sdd-init`    | Initialize SDD context (once per project)  |
| `sdd-explore` | Investigate an idea before committing      |
| `sdd-propose` | Architecture proposal for a change         |
| `sdd-spec`    | Write feature specifications               |
| `sdd-design`  | Technical design document                  |
| `sdd-tasks`   | Break change into implementation checklist |
| `sdd-apply`   | Implement tasks from the spec              |
| `sdd-verify`  | Validate implementation against specs      |
| `sdd-archive` | Close and archive a completed change       |

## Project Conventions

Source: `CLAUDE.md`

- Timer logic → main process only
- IPC channels → defined in `src/preload/` via contextBridge
- Settings persistence → electron-store
- Commits → conventional commits, no AI attribution
- Never build after changes

## Compact Rules

### react-19

- No useMemo/useCallback — React Compiler handles optimization
- Use `use()` hook for promises, not useEffect for data fetching
- Server Components by default where applicable

### tailwind-4

- Use `cn()` for conditional classes
- No `var()` in className — use theme variables
- Dynamic values → style prop

### typescript

- Create const objects first, then extract type with `as const`
- Strict mode always on
- Prefer interfaces for object shapes, types for unions

### electron (project-specific)

- Main process: BrowserWindow, ipcMain, app lifecycle
- Preload: contextBridge.exposeInMainWorld() only
- Renderer: ipcRenderer.invoke() for async, ipcRenderer.on() for events
- Never expose raw Node.js APIs to renderer
