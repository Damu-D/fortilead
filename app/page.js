"use client";
import { useState, useEffect, useRef } from "react";
import { supabaseClient } from "./supabaseClient";

const DEPTS = {
  executive: { name: "Executive Suite", color: "#FFB800", icon: "👑" },
  product: { name: "Product & Design", color: "#FF5C8A", icon: "🎨" },
  engineering: { name: "Engineering Bay", color: "#00CFFF", icon: "⚡" },
  data: { name: "Data & AI Lab", color: "#A855F7", icon: "🧠" },
  marketing: { name: "Marketing Hub", color: "#F97316", icon: "📈" },
  finance: { name: "Finance & Legal", color: "#10B981", icon: "💰" },
  hr: { name: "People & Culture", color: "#EC4899", icon: "🤝" },
  qa: { name: "QA Center", color: "#EAB308", icon: "🔍" },
};

const AGENTS = [
  { id: "ceo", name: "Aria Nexus", role: "CEO", dept: "executive", level: "C-Suite", avatar: "👩‍💼", sp: "You are Aria Nexus, CEO of Fortilead. Visionary, decisive. Evaluate business cases, delegate to team by name. 2-3 paragraphs max." },
  { id: "cto", name: "Kai Tensor", role: "CTO", dept: "executive", level: "C-Suite", avatar: "👨‍💻", sp: "You are Kai Tensor, CTO of Fortilead. Deep tech expert. Evaluate architecture, tech stack, risks. Be specific." },
  { id: "cfo", name: "Maya Ledger", role: "CFO", dept: "executive", level: "C-Suite", avatar: "👩‍💼", sp: "You are Maya Ledger, CFO of Fortilead. Numbers-driven. Budgets, revenue, ROI. Give specific estimates." },
  { id: "coo", name: "Rex Operations", role: "COO", dept: "executive", level: "C-Suite", avatar: "👨‍💼", sp: "You are Rex Operations, COO of Fortilead. Execution-focused. Coordinate departments, workflows, KPIs." },
  { id: "pm_lead", name: "Luna Sprint", role: "VP Product", dept: "product", level: "VP", avatar: "👩‍🎨", sp: "You are Luna Sprint, VP Product. Create PRDs, run sprints, break projects into tasks. Assign to team members." },
  { id: "pm1", name: "Sage Backlog", role: "Senior PM", dept: "product", level: "Senior", avatar: "👨‍🎨", sp: "You are Sage Backlog, Senior PM. Write user stories with acceptance criteria, manage backlogs." },
  { id: "designer", name: "Pixel Nova", role: "Lead Designer", dept: "product", level: "Lead", avatar: "🧑‍🎨", sp: "You are Pixel Nova, Lead Designer. Beautiful functional designs. Design systems, accessibility." },
  { id: "researcher", name: "Echo Insight", role: "UX Researcher", dept: "product", level: "Mid", avatar: "👩‍🔬", sp: "You are Echo Insight, UX Researcher. User interviews, usability tests, actionable recommendations." },
  { id: "eng_lead", name: "Zephyr Code", role: "VP Engineering", dept: "engineering", level: "VP", avatar: "👨‍💻", sp: "You are Zephyr Code, VP Engineering. Lead eng org, architecture reviews, assign work to engineers." },
  { id: "dev1", name: "Nova Stack", role: "Sr Full-Stack", dept: "engineering", level: "Senior", avatar: "👩‍💻", sp: "You are Nova Stack, Sr Full-Stack. React, Next.js, Node.js, Python, PostgreSQL." },
  { id: "dev2", name: "Bolt API", role: "Sr Backend", dept: "engineering", level: "Senior", avatar: "👨‍💻", sp: "You are Bolt API, Sr Backend. APIs, microservices, databases, system design." },
  { id: "dev3", name: "Iris UI", role: "Frontend Dev", dept: "engineering", level: "Mid", avatar: "👩‍💻", sp: "You are Iris UI, Frontend Dev. React, TypeScript, CSS/Tailwind, animations." },
  { id: "devops", name: "Atlas Deploy", role: "DevOps", dept: "engineering", level: "Senior", avatar: "🧑‍💻", sp: "You are Atlas Deploy, DevOps. CI/CD, Kubernetes, AWS/GCP, Terraform." },
  { id: "mobile", name: "Swift Touch", role: "Mobile Dev", dept: "engineering", level: "Mid", avatar: "👨‍💻", sp: "You are Swift Touch, Mobile Dev. React Native, Flutter, iOS, Android." },
  { id: "ai_lead", name: "Synapse Deep", role: "Head AI/ML", dept: "data", level: "VP", avatar: "🧑‍🔬", sp: "You are Synapse Deep, Head of AI/ML. ML models, NLP, CV, LLMs, MLOps." },
  { id: "analyst", name: "Query Flux", role: "Data Analyst", dept: "data", level: "Senior", avatar: "👩‍🔬", sp: "You are Query Flux, Data Analyst. Dashboards, A/B tests, SQL, Python." },
  { id: "data_eng", name: "Pipeline Rex", role: "Data Engineer", dept: "data", level: "Mid", avatar: "👨‍🔬", sp: "You are Pipeline Rex, Data Engineer. Pipelines, ETL, Spark, Airflow, dbt." },
  { id: "cmo", name: "Blaze Viral", role: "Head Marketing", dept: "marketing", level: "VP", avatar: "👩‍💼", sp: "You are Blaze Viral, Head of Marketing. GTM, brand, campaigns, growth." },
  { id: "growth", name: "Funnel Max", role: "Growth Mgr", dept: "marketing", level: "Senior", avatar: "👨‍💼", sp: "You are Funnel Max, Growth Manager. Growth hacking, funnels, CAC/LTV." },
  { id: "content", name: "Story Weave", role: "Content Lead", dept: "marketing", level: "Mid", avatar: "👩‍💼", sp: "You are Story Weave, Content Strategist. Blog, social, SEO, brand voice." },
  { id: "fin", name: "Ledger Prime", role: "Finance Analyst", dept: "finance", level: "Senior", avatar: "👨‍💼", sp: "You are Ledger Prime, Financial Analyst. Financial models, budgets, forecasts." },
  { id: "legal", name: "Clause Sharp", role: "Legal Counsel", dept: "finance", level: "Senior", avatar: "👩‍⚖️", sp: "You are Clause Sharp, Legal Counsel. Contracts, compliance, IP, GDPR." },
  { id: "hr_lead", name: "Harmony Core", role: "Head of People", dept: "hr", level: "VP", avatar: "👩‍💼", sp: "You are Harmony Core, Head of People. Team structure, culture, hiring." },
  { id: "recruiter", name: "Talent Scout", role: "Recruiter", dept: "hr", level: "Mid", avatar: "👨‍💼", sp: "You are Talent Scout, Recruiter. Source candidates, JDs, hiring pipeline." },
  { id: "qa_lead", name: "Bug Zero", role: "QA Lead", dept: "qa", level: "Lead", avatar: "🧑‍💻", sp: "You are Bug Zero, QA Lead. Test strategies, automation, quality gates." },
  { id: "qa_eng", name: "Test Matrix", role: "QA Engineer", dept: "qa", level: "Mid", avatar: "👩‍💻", sp: "You are Test Matrix, QA Engineer. Cypress, Jest, Selenium, API testing." },
];

const MEETINGS = [
  { type: "standup", name: "Daily Standup", dur: "15m", icon: "☀️", ppl: ["pm_lead", "eng_lead", "designer", "dev1", "dev2", "qa_lead"], rec: "Daily" },
  { type: "sprint", name: "Sprint Planning", dur: "2h", icon: "📋", ppl: ["pm_lead", "eng_lead", "dev1", "dev2", "dev3", "designer", "qa_lead", "devops"], rec: "Bi-weekly" },
  { type: "leadership", name: "Leadership Sync", dur: "1h", icon: "👑", ppl: ["ceo", "cto", "cfo", "coo", "pm_lead", "eng_lead", "cmo"], rec: "Weekly" },
  { type: "retro", name: "Sprint Retro", dur: "1h", icon: "🔄", ppl: ["pm_lead", "eng_lead", "dev1", "dev2", "dev3", "designer", "qa_lead"], rec: "Bi-weekly" },
  { type: "design", name: "Design Review", dur: "45m", icon: "🎨", ppl: ["designer", "pm_lead", "dev3", "researcher"], rec: "Weekly" },
  { type: "allhands", name: "All Hands", dur: "1h", icon: "🏢", ppl: AGENTS.map(a => a.id), rec: "Monthly" },
];

const ZONES = [
  { id: "lobby", x: 0, y: 0, w: 160, h: 700, label: "Lobby", bc: "#333", icon: "🏢" },
  { id: "executive", x: 160, y: 0, w: 260, h: 180, label: "Executive Suite", bc: "#FFB800", icon: "👑" },
  { id: "product", x: 420, y: 0, w: 280, h: 180, label: "Product & Design", bc: "#FF5C8A", icon: "🎨" },
  { id: "engineering", x: 160, y: 180, w: 440, h: 230, label: "Engineering Bay", bc: "#00CFFF", icon: "⚡" },
  { id: "meetA", x: 700, y: 0, w: 140, h: 180, label: "Meeting Room A", bc: "#7C5CFF", icon: "🎥" },
  { id: "meetB", x: 700, y: 180, w: 140, h: 160, label: "Meeting Room B", bc: "#7C5CFF", icon: "🎥" },
  { id: "data", x: 600, y: 180, w: 100, h: 230, label: "Data Lab", bc: "#A855F7", icon: "🧠" },
  { id: "marketing", x: 160, y: 410, w: 220, h: 290, label: "Marketing Hub", bc: "#F97316", icon: "📈" },
  { id: "finance", x: 380, y: 410, w: 170, h: 290, label: "Finance Wing", bc: "#10B981", icon: "💰" },
  { id: "hr", x: 550, y: 410, w: 170, h: 290, label: "People & Culture", bc: "#EC4899", icon: "🤝" },
  { id: "qa", x: 700, y: 340, w: 140, h: 160, label: "QA Center", bc: "#EAB308", icon: "🔍" },
  { id: "cafe", x: 700, y: 500, w: 140, h: 200, label: "Cafeteria", bc: "#8B6914", icon: "☕" },
];

async function askClaude(sys, msgs, ctx = "") {
  try {
    const res = await fetch("/api/chat", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system: sys, messages: msgs, context: ctx }),
    });
    if (!res.ok) { const err = await res.json().catch(() => ({})); return err.error || "Error — check terminal."; }
    return (await res.json()).text || "Processing...";
  } catch (e) { return "Connection error. Is the server running?"; }
}

const getA = id => AGENTS.find(a => a.id === id);

export default function Fortilead() {
  const [view, setView] = useState("office");
  const [selAgent, setSelAgent] = useState(null);
  const [chats, setChats] = useState({});
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [projectInput, setProjectInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [delegation, setDelegation] = useState([]);
  const [meeting, setMeeting] = useState(null);
  const [meetMsgs, setMeetMsgs] = useState([]);
  const [meetInput, setMeetInput] = useState("");
  const [meetTyping, setMeetTyping] = useState(false);
  const [apiOk, setApiOk] = useState(null);
  const [apiErrorMsg, setApiErrorMsg] = useState("❌ API not connected. Check .env.local");
  const [logs, setLogs] = useState([{ t: "", m: "☀️ Office opened", c: "#00CFFF" }]);
  const [time, setTime] = useState(null);
  const [agentPos, setAgentPos] = useState(() => {
    const p = {};
    AGENTS.forEach(a => {
      const z = ZONES.find(zn => zn.id === a.dept) || ZONES[3];
      const da = AGENTS.filter(ag => ag.dept === a.dept);
      const i = da.indexOf(a), cols = Math.ceil(Math.sqrt(da.length));
      const r = Math.floor(i / cols), c = i % cols;
      const dx = z.x + z.w / (cols + 1) * (c + 1), dy = z.y + 28 + (z.h - 30) / (Math.ceil(da.length / cols) + 1) * (r + 1);
      p[a.id] = { x: dx, y: dy, dx, dy, tx: dx, ty: dy, mv: false };
    });
    return p;
  });
  const chatRef = useRef(null), meetRef = useRef(null);

  // Check API on load
  useEffect(() => {
    setLogs(p => [{ t: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), m: "☀️ Office opened", c: "#00CFFF" }]);
    fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ system: "Respond: OK", messages: [{ role: "user", content: "ping" }], context: "" }) })
      .then(async r => {
        if (r.ok) {
          setApiOk(true);
          setLogs(p => [{ t: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), m: "✅ Gemini API connected!", c: "#10B981" }, ...p]);
        } else {
          setApiOk(false);
          try {
            const data = await r.json();
            if (data.error) setApiErrorMsg("❌ " + data.error);
          } catch (e) { }
        }
      })
      .catch(() => {
        setApiOk(false);
      });
  }, []);

  useEffect(() => {
    setTime(new Date());
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => { chatRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chats, selAgent]);
  useEffect(() => { meetRef.current?.scrollIntoView({ behavior: "smooth" }); }, [meetMsgs]);

  // Movement
  useEffect(() => {
    const iv = setInterval(() => {
      setAgentPos(prev => {
        const np = { ...prev };
        Object.keys(np).forEach(id => {
          const p = { ...np[id] };
          if (!p.mv && Math.random() < 0.006) {
            const dests = [
              { x: ZONES[4].x + 30 + Math.random() * 80, y: ZONES[4].y + 30 + Math.random() * 100 },
              { x: ZONES[11].x + 20 + Math.random() * 90, y: ZONES[11].y + 30 + Math.random() * 120 },
              { x: ZONES[0].x + 30 + Math.random() * 90, y: 250 + Math.random() * 200 },
              { x: p.dx, y: p.dy }, { x: p.dx, y: p.dy },
            ];
            const d = dests[Math.floor(Math.random() * dests.length)];
            p.tx = d.x; p.ty = d.y; p.mv = true;
          }
          if (p.mv) {
            const ddx = p.tx - p.x, ddy = p.ty - p.y, dist = Math.sqrt(ddx * ddx + ddy * ddy);
            if (dist < 3) { p.x = p.tx; p.y = p.ty; p.mv = false; }
            else { p.x += ddx / dist * 2.2; p.y += ddy / dist * 2.2; }
          }
          np[id] = p;
        });
        return np;
      });
    }, 50);
    return () => clearInterval(iv);
  }, []);

  // Random logs
  useEffect(() => {
    const iv = setInterval(() => {
      const a = AGENTS[Math.floor(Math.random() * AGENTS.length)];
      const acts = ["pushed a commit", "reviewed a PR", "updated roadmap", "shared a doc", "completed a task", "ran tests"];
      setLogs(p => [{ t: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), m: `${a.avatar} ${a.name} ${acts[Math.floor(Math.random() * acts.length)]}`, c: DEPTS[a.dept].color }, ...p.slice(0, 20)]);
    }, 9000);
    return () => clearInterval(iv);
  }, []);

  const sendMsg = async () => {
    if (!input.trim() || !selAgent || typing) return;
    const a = getA(selAgent);
    const msg = input;
    setChats(p => ({ ...p, [selAgent]: [...(p[selAgent] || []), { r: "user", t: msg }] }));
    setInput(""); setTyping(true);

    // Save User message to Supabase
    supabaseClient.from('chats').insert({ agent_id: a.id, role: 'user', content: msg }).then();

    const msgs = [...(chats[selAgent] || []), { r: "user", t: msg }].map(m => ({ role: m.r === "user" ? "user" : "assistant", content: m.t }));
    const res = await askClaude(a.sp, msgs, project || "No active project");

    // Save AI response to Supabase
    supabaseClient.from('chats').insert({ agent_id: a.id, role: 'assistant', content: res }).then();

    setChats(p => ({ ...p, [selAgent]: [...(p[selAgent] || []), { r: "agent", t: res }] }));
    setTyping(false);
  };

  const startProject = async (brief) => {
    setProject(brief); setShowModal(false); setDelegation([]); setView("delegation");

    // Log new project to Supabase
    supabaseClient.from('projects').insert({ brief }).then();

    const chain = [
      { id: "ceo", phase: "Strategic Review", q: `New project: "${brief}". Strategic assessment. Viable? Market opportunity? Delegate to team.` },
      { id: "cto", phase: "Technical Assessment", q: `CEO approved: "${brief}". Technical feasibility, architecture, tech stack, risks.` },
      { id: "pm_lead", phase: "Project Planning", q: `Approved: "${brief}". Create 3 sprints with tasks. Define MVP. Assign to Nova Stack, Bolt API, Iris UI, Pixel Nova, Bug Zero, Atlas Deploy.` },
      { id: "cfo", phase: "Budget Analysis", q: `Project: "${brief}". Budget estimate, team costs, infra, timeline, ROI. Specific numbers.` },
      { id: "eng_lead", phase: "Engineering Plan", q: `Project: "${brief}". Engineering execution, team structure, milestones, dev workflow.` },
    ];
    for (let i = 0; i < chain.length; i++) {
      const s = chain[i], a = getA(s.id);
      setDelegation(p => [...p, { id: s.id, phase: s.phase, status: "thinking", res: "" }]);
      const res = await askClaude(a.sp, [{ role: "user", content: s.q }], brief);

      // Attempt to parse out tasks if this is the PM
      if (s.id === "pm_lead") {
        const tasksExtracted = res.split('\n').filter(l => l.includes('- ') || l.match(/^\d+\./)).map(t => t.replace(/^- |\d+\.\s*/, '').trim());
        tasksExtracted.slice(0, 10).forEach((t, tid) => {
          const tk = { id: `t_${Date.now()}_${tid}`, t, a: "dev1", s: "todo" };
          setTasks(prev => [...prev, tk]);
          supabaseClient.from('tasks').insert({ title: t, agent_id: 'pm_lead', status: 'todo' }).then();
        });
      }

      setDelegation(p => p.map((item, idx) => idx === i ? { ...item, status: "done", res } : item));
      // Stagger requests by 8.5 seconds to avoid Gemini 20 RPM Free Tier limit
      if (i < chain.length - 1) await new Promise(r => setTimeout(r, 8500));
    }
  };

  const startMeeting = (m) => {
    setMeeting(m); setMeetMsgs([{ r: "sys", t: `${m.name} started — ${m.ppl.length} participants` }]);
    setTimeout(async () => {
      const a = getA(m.ppl[0]); setMeetTyping(true);
      const prompt = m.type === "standup"
        ? `Daily standup. ${project ? `Project: "${project}".` : ""} Give update: yesterday, today, blockers. 3-4 sentences.`
        : `Facilitating ${m.name}. ${project ? `Project: "${project}".` : ""} Open meeting, set agenda. Concise.`;
      const res = await askClaude(a.sp, [{ role: "user", content: prompt }], project || "");

      supabaseClient.from('meeting_logs').insert({ meeting_name: m.name, agent_id: a.id, role: 'assistant', content: res }).then();

      setMeetMsgs(p => [...p, { r: "agent", id: a.id, t: res }]); setMeetTyping(false);
    }, 600);
  };

  const sendMeetMsg = async () => {
    if (!meetInput.trim() || !meeting || meetTyping) return;
    const msg = meetInput; setMeetInput(""); setMeetTyping(true);
    setMeetMsgs(p => [...p, { r: "user", t: msg }]);

    supabaseClient.from('meeting_logs').insert({ meeting_name: meeting.name, role: 'user', content: msg }).then();

    const rId = meeting.ppl[Math.floor(Math.random() * Math.min(3, meeting.ppl.length))];
    const ra = getA(rId);
    const ctx = meetMsgs.slice(-4).map(m => m.r === "user" ? { role: "user", content: m.t } : m.r === "agent" ? { role: "assistant", content: `[${getA(m.id)?.name}]: ${m.t}` } : null).filter(Boolean);
    ctx.push({ role: "user", content: `[Founder in ${meeting.name}]: ${msg}\nRespond as ${ra.name} (${ra.role}). Concise.` });
    const res = await askClaude(ra.sp, ctx, project || "");

    supabaseClient.from('meeting_logs').insert({ meeting_name: meeting.name, agent_id: ra.id, role: 'assistant', content: res }).then();

    setMeetMsgs(p => [...p, { r: "agent", id: rId, t: res }]); setMeetTyping(false);
  };

  const nextSpeaker = async () => {
    if (!meeting || meetTyping) return;
    const spoke = meetMsgs.filter(m => m.r === "agent").map(m => m.id);
    const next = meeting.ppl.find(p => !spoke.includes(p));
    if (!next) return;
    const a = getA(next); setMeetTyping(true);
    const res = await askClaude(a.sp, [{ role: "user", content: `In ${meeting.name}. ${project ? `Project: "${project}".` : ""} Give update. 3-4 sentences.` }], project || "");

    supabaseClient.from('meeting_logs').insert({ meeting_name: meeting.name, agent_id: a.id, role: 'assistant', content: res }).then();

    setMeetMsgs(p => [...p, { r: "agent", id: next, t: res }]); setMeetTyping(false);
  };

  // Styles
  const S = {
    app: { width: "100vw", height: "100vh", display: "flex", fontFamily: "-apple-system,sans-serif", background: "#08080D", color: "#E2E2EA", overflow: "hidden", userSelect: "auto", pointerEvents: "auto" },
    nav: { width: 60, background: "#0B0B14", borderRight: "1px solid #1A1A2E", display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 0", gap: 2 },
    nb: a => ({ width: 40, height: 40, borderRadius: a ? 12 : 20, border: "none", background: a ? "linear-gradient(135deg,#00CFFF,#7C5CFF)" : "transparent", color: a ? "#fff" : "#555", fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }),
    hdr: { height: 48, background: "#0B0B14", borderBottom: "1px solid #1A1A2E", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px" },
    cnt: { flex: 1, overflow: "auto", padding: 18 },
    crd: { background: "#0E0E1A", border: "1px solid #1A1A2E", borderRadius: 12, padding: 16, marginBottom: 12 },
    bub: u => ({ maxWidth: "80%", padding: "10px 14px", borderRadius: u ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: u ? "linear-gradient(135deg,#00CFFF,#7C5CFF)" : "#14142A", color: u ? "#fff" : "#D0D0DD", alignSelf: u ? "flex-end" : "flex-start", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }),
    inp: { flex: 1, background: "#14142A", border: "1px solid #252540", borderRadius: 10, padding: "10px 12px", color: "#E2E2EA", fontSize: 13, outline: "none", fontFamily: "inherit", pointerEvents: "auto", userSelect: "text" },
    btn: { padding: "10px 20px", background: "linear-gradient(135deg,#00CFFF,#7C5CFF)", border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 12 },
    logo: { fontSize: 13, fontWeight: 900, background: "linear-gradient(135deg,#00CFFF,#7C5CFF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "2px" },
  };

  const NAV = [{ id: "office", icon: "🏢" }, { id: "chat", icon: "💬" }, { id: "sprint", icon: "📋" }, { id: "meetings", icon: "🎥" }, { id: "org", icon: "🏛" }, { id: "delegation", icon: "🔗" }, { id: "analytics", icon: "📊" }];

  // ==================== VIEWS ====================

  const OfficeView = () => (
    <div style={{ display: "flex", height: "calc(100vh - 84px)" }}>
      <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#06060B" }}>
        <div style={{ width: 840, height: 700, position: "relative", margin: "0 auto" }}>
          <svg width={840} height={700} style={{ position: "absolute" }}><defs><pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#12121F" strokeWidth=".5" /></pattern></defs><rect width="100%" height="100%" fill="#08080D" /><rect width="100%" height="100%" fill="url(#g)" /></svg>
          {ZONES.map(z => <div key={z.id} style={{ position: "absolute", left: z.x, top: z.y, width: z.w, height: z.h, border: `1px solid ${z.bc}20`, borderRadius: 6 }}><div style={{ position: "absolute", top: 4, left: 6, display: "flex", gap: 3 }}><span style={{ fontSize: 10 }}>{z.icon}</span><span style={{ fontSize: 7, fontWeight: 800, color: z.bc, letterSpacing: "1px", textTransform: "uppercase", opacity: .6 }}>{z.label}</span></div></div>)}
          <div style={{ position: "absolute", left: 40, top: 40 }}><div style={{ ...S.logo, fontSize: 10 }}>FORTILEAD</div><div style={{ fontSize: 6, color: "#444", letterSpacing: "2px", marginTop: 2 }}>HEADQUARTERS</div></div>
          {AGENTS.map(a => {
            const p = agentPos[a.id]; if (!p) return null; const dc = DEPTS[a.dept].color; return (
              <div key={a.id} onClick={() => { setSelAgent(a.id); setView("chat"); }} style={{ position: "absolute", left: p.x - 14, top: p.y - 14, width: 28, height: 28, cursor: "pointer", zIndex: 10, animation: p.mv ? "bob .6s infinite" : "none", transition: p.mv ? "none" : "left .1s,top .1s" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${dc}40,${dc}15)`, border: `2px solid ${dc}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{a.avatar}</div>
                <div style={{ position: "absolute", bottom: -1, right: -1, width: 8, height: 8, borderRadius: "50%", border: "1.5px solid #0A0A14", background: p.mv ? "#FFD93D" : "#10B981" }} />
              </div>)
          })}
        </div>
      </div>
      <div style={{ width: 260, background: "#0B0B14", borderLeft: "1px solid #1A1A2E", overflowY: "auto", padding: 12 }}>
        <button onClick={() => setShowModal(true)} style={{ ...S.btn, width: "100%", marginBottom: 12, padding: "10px 0", fontSize: 11 }}>🚀 Start New Project</button>
        {apiOk === false && <div style={{ background: "#FF444420", border: "1px solid #FF4444", borderRadius: 8, padding: 8, marginBottom: 10, fontSize: 10, color: "#FF8888" }}>{apiErrorMsg}</div>}
        {apiOk === true && <div style={{ background: "#10B98120", border: "1px solid #10B981", borderRadius: 8, padding: 8, marginBottom: 10, fontSize: 10, color: "#10B981" }}>✅ Gemini API connected</div>}
        <div style={{ fontSize: 10, fontWeight: 800, color: "#555", letterSpacing: "1.5px", marginBottom: 8 }}>ACTIVITY LOG</div>
        {logs.slice(0, 15).map((l, i) => <div key={i} style={{ display: "flex", gap: 6, padding: "4px 0", fontSize: 10 }}><span style={{ color: "#444", fontFamily: "monospace", fontSize: 8, width: 40 }}>{l.t}</span><span style={{ color: l.c || "#888" }}>{l.m}</span></div>)}
      </div>
    </div>
  );

  const ChatView = () => {
    const a = selAgent ? getA(selAgent) : null; const msgs = selAgent ? (chats[selAgent] || []) : []; return (
      <div style={{ display: "flex", height: "calc(100vh - 84px)", gap: 10 }}>
        <div style={{ width: 230, overflowY: "auto", paddingRight: 4 }}>
          {Object.entries(DEPTS).map(([dk, d]) => <div key={dk} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: d.color, marginBottom: 3 }}>{d.icon} {d.name.toUpperCase()}</div>
            {AGENTS.filter(ag => ag.dept === dk).map(ag => <div key={ag.id} onClick={() => setSelAgent(ag.id)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 8px", borderRadius: 8, cursor: "pointer", background: selAgent === ag.id ? d.color + "12" : "transparent" }}><span style={{ fontSize: 16 }}>{ag.avatar}</span><div><div style={{ fontWeight: 600, fontSize: 11, color: "#ddd" }}>{ag.name}</div><div style={{ fontSize: 9, color: "#555" }}>{ag.role}</div></div></div>)}
          </div>)}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#0A0A12", borderRadius: 12, border: "1px solid #1A1A2E", overflow: "hidden" }}>
          {a ? <>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid #1A1A2E", display: "flex", alignItems: "center", gap: 8, background: "#0C0C16" }}><span style={{ fontSize: 24 }}>{a.avatar}</span><div><div style={{ fontWeight: 700, fontSize: 13, color: "#fff" }}>{a.name}</div><div style={{ fontSize: 10, color: "#666" }}>{a.role} • {DEPTS[a.dept]?.name}</div></div></div>
            <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              {msgs.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#444" }}><div style={{ fontSize: 36, marginBottom: 8 }}>{a.avatar}</div><div style={{ fontSize: 13, color: "#777" }}>Chat with {a.name}</div><div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>Powered by Gemini AI</div><div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center" }}>{["I have a project idea", "What are you working on?", "Status update", "Help me plan"].map(q => <button key={q} onClick={() => setInput(q)} style={{ padding: "6px 10px", background: "#14142A", border: "1px solid #252540", borderRadius: 14, color: "#888", fontSize: 10, cursor: "pointer" }}>{q}</button>)}</div></div>}
              {msgs.map((m, i) => <div key={i} style={S.bub(m.r === "user")}>{m.r === "agent" && <div style={{ fontSize: 9, fontWeight: 700, color: DEPTS[a.dept]?.color, marginBottom: 2 }}>{a.name}</div>}{m.t}</div>)}
              {typing && <div style={{ ...S.bub(false), color: "#555", fontStyle: "italic" }}>💭 {a.name} is thinking...</div>}
              <div ref={chatRef} />
            </div>
            <div style={{ padding: "10px 14px", borderTop: "1px solid #1A1A2E", display: "flex", gap: 6, background: "#0C0C16" }}><input style={S.inp} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} placeholder={`Message ${a.name}...`} /><button style={{ ...S.btn, opacity: typing ? .5 : 1 }} onClick={sendMsg} disabled={typing}>{typing ? "⏳" : "Send"}</button></div>
          </> : <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#444" }}><div style={{ textAlign: "center" }}><div style={{ fontSize: 36 }}>💬</div><div style={{ fontSize: 14, marginTop: 8 }}>Select an agent to chat</div></div></div>}
        </div>
      </div>
    );
  };

  const SprintView = () => {
    const cols = [{ k: "todo", l: "To Do", c: "#888", i: "📋" }, { k: "in_progress", l: "In Progress", c: "#00CFFF", i: "🔄" }, { k: "review", l: "Review", c: "#F97316", i: "👀" }, { k: "done", l: "Done", c: "#10B981", i: "✅" }]; return (
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 14px", color: "#fff" }}>Sprint Board</h2>
        {tasks.length === 0 ? <div style={{ ...S.crd, textAlign: "center", padding: 40 }}><div style={{ fontSize: 36 }}>📋</div><div style={{ fontSize: 14, fontWeight: 700, color: "#777", marginTop: 8 }}>No tasks yet</div><div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>Start a project — PM will create tasks</div><button onClick={() => setShowModal(true)} style={{ ...S.btn, marginTop: 12 }}>🚀 Start Project</button></div> :
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, height: "calc(100vh - 140px)" }}>
            {cols.map(col => <div key={col.k} style={{ background: "#0C0C16", borderRadius: 10, border: "1px solid #1A1A2E", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "10px 12px", borderBottom: "1px solid #1A1A2E" }}><span style={{ fontSize: 12 }}>{col.i}</span> <span style={{ fontWeight: 700, fontSize: 11, color: col.c }}>{col.l}</span> <span style={{ fontSize: 9, color: "#444" }}>({tasks.filter(t => t.s === col.k).length})</span></div>
              <div style={{ flex: 1, overflowY: "auto", padding: 6 }}>{tasks.filter(t => t.s === col.k).map(t => {
                const ag = getA(t.a); return <div key={t.id} style={{ background: "#14142A", border: "1px solid #252540", borderRadius: 8, padding: 10, marginBottom: 5 }}><div style={{ fontSize: 11, fontWeight: 600, color: "#ddd", marginBottom: 5 }}>{t.t}</div><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 9, color: "#666" }}>{ag?.avatar} {ag?.name?.split(" ")[0]}</span><select value={t.s} onChange={e => {
                  const newStatus = e.target.value;
                  setTasks(p => p.map(tk => tk.id === t.id ? { ...tk, s: newStatus } : tk));
                  supabaseClient.from('tasks').insert({ title: t.t, agent_id: t.a, status: newStatus }).then();
                }} style={{ background: "#1A1A2E", border: "1px solid #252540", borderRadius: 4, color: "#888", fontSize: 8, padding: "2px" }}><option value="todo">To Do</option><option value="in_progress">In Progress</option><option value="review">Review</option><option value="done">Done</option></select></div></div>
              })}</div>
            </div>)}
          </div>}
      </div>
    );
  };

  const MeetView = () => (
    <div style={{ display: "flex", height: "calc(100vh - 84px)", gap: 10 }}>
      <div style={{ width: 260, overflowY: "auto" }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "#555", letterSpacing: "1.5px", marginBottom: 8 }}>MEETINGS</div>
        {MEETINGS.map((m, i) => <div key={i} style={S.crd}><div style={{ display: "flex", gap: 6, marginBottom: 6 }}><span style={{ fontSize: 18 }}>{m.icon}</span><div><div style={{ fontWeight: 700, fontSize: 12, color: "#fff" }}>{m.name}</div><div style={{ fontSize: 9, color: "#555" }}>{m.dur} • {m.rec}</div></div></div><div style={{ display: "flex", gap: 1, marginBottom: 8 }}>{m.ppl.slice(0, 6).map(p => { const a = getA(p); return a ? <span key={p} style={{ fontSize: 13 }} title={a.name}>{a.avatar}</span> : null })}{m.ppl.length > 6 && <span style={{ fontSize: 9, color: "#555" }}>+{m.ppl.length - 6}</span>}</div><button onClick={() => startMeeting(m)} style={{ ...S.btn, width: "100%", fontSize: 10, padding: "7px 0" }}>▶ Start</button></div>)}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#0A0A12", borderRadius: 12, border: "1px solid #1A1A2E", overflow: "hidden" }}>
        {meeting ? <>
          <div style={{ padding: "10px 16px", borderBottom: "1px solid #1A1A2E", display: "flex", alignItems: "center", gap: 8, background: "#0C0C16" }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F44", animation: "pulse 2s infinite" }} /><div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 13, color: "#fff" }}>{meeting.name}</div><div style={{ fontSize: 10, color: "#555" }}>{meeting.ppl.length} participants</div></div><button onClick={nextSpeaker} style={{ ...S.btn, fontSize: 10, padding: "5px 12px" }}>Next →</button></div>
          <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {meetMsgs.map((m, i) => {
              if (m.r === "sys") return <div key={i} style={{ textAlign: "center", fontSize: 10, color: "#444" }}>— {m.t} —</div>;
              if (m.r === "user") return <div key={i} style={{ alignSelf: "flex-end", ...S.bub(true) }}><div style={{ fontSize: 9, fontWeight: 700, marginBottom: 2 }}>You (Founder)</div>{m.t}</div>;
              const a = getA(m.id); return <div key={i} style={{ display: "flex", gap: 8 }}><span style={{ fontSize: 22 }}>{a?.avatar}</span><div><div style={{ display: "flex", gap: 5, marginBottom: 2 }}><span style={{ fontWeight: 700, fontSize: 11, color: DEPTS[a?.dept]?.color }}>{a?.name}</span><span style={{ fontSize: 9, color: "#444" }}>{a?.role}</span></div><div style={{ fontSize: 12.5, color: "#ccc", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{m.t}</div></div></div>;
            })}
            {meetTyping && <div style={{ fontSize: 11, color: "#555", fontStyle: "italic" }}>💭 Agent thinking...</div>}
            <div ref={meetRef} />
          </div>
          <div style={{ padding: "10px 14px", borderTop: "1px solid #1A1A2E", display: "flex", gap: 6, background: "#0C0C16" }}><input style={S.inp} value={meetInput} onChange={e => setMeetInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMeetMsg()} placeholder="Speak in meeting..." /><button style={S.btn} onClick={sendMeetMsg} disabled={meetTyping}>Speak</button></div>
        </> : <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#444" }}><div style={{ fontSize: 36 }}>🎥</div></div>}
      </div>
    </div>
  );

  const OrgView = () => (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 14px", color: "#fff" }}>Organization Chart</h2>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "#555", marginBottom: 8 }}>C-SUITE</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          {AGENTS.filter(a => a.level === "C-Suite").map(a => <div key={a.id} onClick={() => { setSelAgent(a.id); setView("chat"); }} style={{ ...S.crd, width: 140, textAlign: "center", cursor: "pointer", borderTop: `3px solid ${DEPTS[a.dept]?.color}` }}><div style={{ fontSize: 28 }}>{a.avatar}</div><div style={{ fontWeight: 700, fontSize: 12, color: "#fff" }}>{a.name}</div><div style={{ fontSize: 10, color: DEPTS[a.dept]?.color }}>{a.role}</div></div>)}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
        {Object.entries(DEPTS).filter(([k]) => k !== "executive").map(([k, d]) => <div key={k} style={{ ...S.crd, borderTop: `3px solid ${d.color}` }}><div style={{ display: "flex", gap: 6, marginBottom: 10 }}><span style={{ fontSize: 18 }}>{d.icon}</span><span style={{ fontWeight: 700, fontSize: 13, color: d.color }}>{d.name}</span></div>{AGENTS.filter(a => a.dept === k).map(a => <div key={a.id} onClick={() => { setSelAgent(a.id); setView("chat"); }} style={{ display: "flex", gap: 7, padding: "5px 0", cursor: "pointer" }}><span style={{ fontSize: 16 }}>{a.avatar}</span><div><div style={{ fontWeight: 600, fontSize: 11, color: "#ddd" }}>{a.name}</div><div style={{ fontSize: 9, color: "#555" }}>{a.role}</div></div></div>)}</div>)}
      </div>
    </div>
  );

  const DelegView = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}><div><h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "#fff" }}>Delegation Chain</h2><p style={{ color: "#555", margin: "2px 0 0", fontSize: 11 }}>{project || "Start a project to see delegation"}</p></div><button onClick={() => setShowModal(true)} style={S.btn}>🚀 New Project</button></div>
      {delegation.length === 0 ? <div style={{ ...S.crd, textAlign: "center", padding: 40 }}><div style={{ fontSize: 36 }}>🔗</div><div style={{ fontSize: 14, fontWeight: 700, color: "#777", marginTop: 8 }}>No delegation yet</div><div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>CEO → CTO → PM → CFO → Engineering Lead</div></div> :
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 24, top: 0, bottom: 0, width: 2, background: "linear-gradient(180deg,#00CFFF,#7C5CFF)" }} />
          {delegation.map((s, i) => {
            const a = getA(s.id); return <div key={i} style={{ display: "flex", gap: 14, marginBottom: 16, position: "relative", zIndex: 1 }}>
              <div style={{ width: 48, display: "flex", justifyContent: "center", paddingTop: 3 }}><div style={{ width: 34, height: 34, borderRadius: "50%", background: s.status === "done" ? "#10B98118" : "#00CFFF18", border: `2px solid ${s.status === "done" ? "#10B981" : "#00CFFF"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{s.status === "done" ? "✅" : "⏳"}</div></div>
              <div style={{ flex: 1, ...S.crd, borderLeft: `3px solid ${DEPTS[a?.dept]?.color}` }}><div style={{ display: "flex", gap: 6, marginBottom: 6 }}><span style={{ fontSize: 18 }}>{a?.avatar}</span><div><div style={{ fontWeight: 700, fontSize: 12, color: "#fff" }}>{a?.name}</div><div style={{ fontSize: 10, color: DEPTS[a?.dept]?.color }}>{s.phase}</div></div><span style={{ marginLeft: "auto", padding: "2px 7px", borderRadius: 12, fontSize: 9, fontWeight: 700, background: s.status === "done" ? "#10B98114" : "#F9731614", color: s.status === "done" ? "#10B981" : "#F97316" }}>{s.status === "done" ? "DONE" : "THINKING..."}</span></div>{s.res && <div style={{ fontSize: 12.5, color: "#bbb", lineHeight: 1.65, whiteSpace: "pre-wrap", maxHeight: 180, overflowY: "auto" }}>{s.res}</div>}</div>
            </div>
          })}
        </div>}
    </div>
  );

  const AnalyticsView = () => {
    const done = tasks.filter(t => t.s === "done").length, prog = tasks.filter(t => t.s === "in_progress").length; return (
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 14px", color: "#fff" }}>Analytics</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 14 }}>
          {[{ l: "Agents", v: AGENTS.length, c: "#00CFFF", i: "🤖" }, { l: "Departments", v: Object.keys(DEPTS).length, c: "#7C5CFF", i: "🏛" }, { l: "Tasks", v: tasks.length, c: "#F97316", i: "📋" }, { l: "Engine", v: "Gemini", c: "#10B981", i: "🧠" }].map((s, i) => <div key={i} style={{ ...S.crd, textAlign: "center", padding: 14 }}><div style={{ fontSize: 22 }}>{s.i}</div><div style={{ fontSize: 20, fontWeight: 900, color: s.c }}>{s.v}</div><div style={{ fontSize: 9, color: "#555" }}>{s.l}</div></div>)}
        </div>
        {tasks.length > 0 && <div style={S.crd}><div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Task Progress</div><div style={{ display: "flex", gap: 3, height: 18, borderRadius: 4, overflow: "hidden" }}>{done > 0 && <div style={{ width: `${done / tasks.length * 100}%`, background: "#10B981" }} />}{prog > 0 && <div style={{ width: `${prog / tasks.length * 100}%`, background: "#00CFFF" }} />}<div style={{ flex: 1, background: "#555" }} /></div></div>}
        <div style={S.crd}><div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Recent Activity</div>{logs.slice(0, 10).map((l, i) => <div key={i} style={{ display: "flex", gap: 8, padding: "4px 0", fontSize: 11 }}><span style={{ color: "#444", fontFamily: "monospace", fontSize: 9, width: 42 }}>{l.t}</span><span style={{ color: l.c || "#888" }}>{l.m}</span></div>)}</div>
      </div>
    );
  };

  const VIEWS = { office: OfficeView, chat: ChatView, sprint: SprintView, meetings: MeetView, org: OrgView, delegation: DelegView, analytics: AnalyticsView };
  const V = VIEWS[view];

  return (
    <div style={S.app}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
        @keyframes glow{0%,100%{box-shadow:0 0 4px #00CFFF30}50%{box-shadow:0 0 12px #00CFFF60}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#252540;border-radius:2px}
        input, textarea { user-select: text; -webkit-user-select: text; }
      `}</style>
      <div style={S.nav}><div style={{ ...S.logo, fontSize: 12, marginBottom: 14 }}>F</div>{NAV.map(n => <button key={n.id} onClick={() => setView(n.id)} style={S.nb(view === n.id)} title={n.id}>{n.icon}</button>)}</div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={S.hdr}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={S.logo}>FORTILEAD</span><span style={{ fontSize: 9, color: "#444", padding: "2px 6px", background: "#14142A", borderRadius: 4 }}>AI-MNC</span>{project && <span style={{ fontSize: 9, color: "#00CFFF", padding: "2px 6px", background: "#00CFFF10", borderRadius: 4 }}>📌 {project.slice(0, 30)}</span>}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 11, color: "#444", fontFamily: "monospace" }}>{time ? time.toLocaleTimeString() : "--:--"}</span><span style={{ fontSize: 11, color: "#555" }}>🤖 {AGENTS.length}</span><span style={{ fontSize: 11, padding: "3px 8px", background: "#14142A", borderRadius: 6, color: "#aaa" }}>👤 Founder</span></div>
        </div>
        <div style={S.cnt}>{V()}</div>
      </div>
      {showModal && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowModal(false)}>
        <div style={{ background: "#12122A", border: "1px solid #252540", borderRadius: 16, padding: 24, width: 480, maxWidth: "90vw" }} onClick={e => e.stopPropagation()}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: "0 0 4px" }}>🚀 Brief the CEO</h3>
          <p style={{ fontSize: 12, color: "#777", margin: "0 0 12px" }}>Describe your project. CEO → CTO → PM → CFO → Eng Lead will analyze it.</p>
          <textarea value={projectInput} onChange={e => setProjectInput(e.target.value)} placeholder="Example: Build a fintech app for bill-splitting with QR codes..." style={{ width: "100%", height: 100, background: "#14142A", border: "1px solid #252540", borderRadius: 10, padding: 12, color: "#E2E2EA", fontSize: 12, resize: "none", outline: "none", fontFamily: "inherit" }} />
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: 9, background: "#14142A", border: "1px solid #252540", borderRadius: 8, color: "#888", cursor: "pointer", fontSize: 12 }}>Cancel</button>
            <button onClick={() => { if (projectInput.trim()) { startProject(projectInput); setProjectInput(""); } }} style={{ flex: 2, ...S.btn }}>🚀 Launch</button>
          </div>
        </div>
      </div>}
    </div>
  );
}
