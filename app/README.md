# Fortilead - AI-Powered MNC

Fortilead is an experimental, interactive simulation of a **Multi-National Corporation (MNC) powered entirely by Artificial Intelligence**. It provides a virtual headquarters environment where a single human founder can manage, collaborate with, and delegate complex projects to a team of 26 specialized AI agents spanning 7 distinct corporate departments.

## Features

- **Interactive Virtual Headquarters:** A top-down, real-time spatial office view showing all 26 agents in their respective departmental zones (Executive Suite, Engineering, Product, Marketing, Data Science, Operations, and Legal/Finance).
- **Project Delegation Chain:** A fully automated "Start Project" flow where the Founder submits a brief. The brief is systematically analyzed and passed down the chain of command (CEO → CTO → PM → CFO → Engineering Lead) to generate a comprehensive execution plan.
- **Sprint & Task Management:** The AI Project Manager automatically synthesizes the delegation chain into actionable sprint tickets that populate a Kanban board.
- **Agent Chat:** 1-on-1 direct messaging with any of the 26 specialized agents (powered by Google's Gemini API) for specific deliverables or consultations.
- **Automated Meetings:** Simulate automated company standups or strategy meetings where multiple agents discuss the current project context dynamically.
- **Supabase Integration:** Persistent tracking of all Projects, Agent Chats, Sprint Tasks, and Meeting Logs to a PostgreSQL database.

## Technology Stack

- **Frontend:** Next.js (React), Tailwind CSS (Vanilla CSS equivalent for styles)
- **AI Engine:** Google Gemini API (`gemini-2.5-flash`)
- **Database:** Supabase (PostgreSQL)

## Getting Started

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Configure your environment variables in `.env.local`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture & Agents

Fortilead features 26 distinct agents including:
*   **Executive Suite:** Aria Nexus (CEO), Orion Vance (CTO), Silas Thorne (CFO)
*   **Engineering Labs:** Atlas Deploy, Bug Zero, Nova Stack
*   **Product Vanguard:** Iris UI, Maven Sprint
*   **...and 18 more specialized roles.**

Each agent is configured with a specific system prompt tailoring their expertise, tone, and departmental focus to create a realistic simulation of a massive tech corporation reacting to the Founder's inputs.
