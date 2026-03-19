# Fortilead

A virtual company headquarters — 26 agent personas, 8 departments, one interactive workspace.

---

## Overview

Fortilead is a browser-based simulation of a tech company's internal operations. You play the role of the Founder. You can walk through an animated office map, start one-on-one conversations with any team member, run meetings, manage a sprint board, and brief the leadership chain on a new project — then watch it get analyzed department by department.

Each agent has a distinct role, name, and personality — from the CEO (Aria Nexus) to the QA Engineer (Test Matrix). Conversations are persistent. The sprint board syncs to Supabase. Meeting logs are stored.

---

## What This Demonstrates

- Component architecture for a multi-view application (7 distinct views, managed with clean state transitions in a single page)
- Supabase integration for persistent chat history, task management, project records, and meeting logs
- Animated SVG canvas with real-time agent position updates (50ms interval, smooth interpolation toward target coordinates)
- Multi-agent conversation routing — the delegation chain sequences 5 executive-level analyses in series, rate-limited to respect the Gemini API free tier
- Data modeling for a role-based agent system (persona, department, seniority level, system prompt)

---

## Key Features

**Office Map**
Animated SVG floor plan with 12 zones. Agents move between their home department, meeting rooms, and the cafeteria at random intervals. Click any agent to open a direct chat.

**Per-Agent Chat**
Each of the 26 agents responds within the context of their role and personality. Messages are stored in Supabase so conversations persist across sessions.

**Sprint Board**
Kanban board with four columns (To Do, In Progress, Review, Done). Tasks are generated when the PM runs project planning. Status updates write back to Supabase.

**Meeting Rooms**
Start a standup, sprint planning, design review, all-hands, or other predefined meeting type. Agents give updates in turn. You can speak as the Founder and a relevant agent responds.

**Delegation Chain**
Submit a project brief. The system routes it through CEO → CTO → VP Product → CFO → VP Engineering. Each executive gives an independent analysis. Requests are staggered to stay within API rate limits.

**Org Chart**
Visual breakdown of all 26 agents by department and seniority level. Click any card to open a direct chat.

**Analytics**
Snapshot of team size, active tasks, task progress bar, and recent activity log.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | React 18, inline styles with a consistent design token system |
| Agent responses | Gemini API (server-side route handler) |
| Persistence | Supabase (chats, tasks, projects, meeting logs) |

---

## Project Structure

```
app/
  page.js             Main application — all views, state, and agent data
  layout.js           Root layout
  api/chat/
    route.js          Server-side handler for Gemini API calls
  supabaseClient.js   Supabase browser client
```

---

## Getting Started

1. Clone the repo
2. Copy `.env.example` to `.env.local` and fill in:
   - `GEMINI_API_KEY` — from [Google AI Studio](https://aistudio.google.com)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. `npm install && npm run dev`

The app displays a banner on startup if the API key is missing or invalid.

---

## Current Status

Working demo. All 7 views are functional. Agent chat, sprint board, and meeting logs persist to Supabase. The delegation chain is fully wired end-to-end.

The application is intentionally contained in a single-page architecture. A natural next step would be splitting views into separate route segments and introducing proper loading states.

---

## Future Improvements

- Separate route segments per view (office, chat, sprint, meetings)
- Supabase Realtime for live agent status across multiple browser sessions
- Task assignment via direct agent chat
- User authentication to scope conversation data to individual sessions
- Mobile layout

---

## Author

Damodaran N K · [damunagarik@gmail.com](mailto:damunagarik@gmail.com)
