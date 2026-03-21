"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import LiveStats from "./components/LiveStats";
import Ticker from "./components/Ticker";
import RegisterModal from "./components/RegisterModal";
import ToastFeed from "./components/ToastFeed";
import ScoreDemo from "./components/ScoreDemo";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.09, duration: 0.65, ease: "easeOut" as const } }),
};

const AGENTS = [
  { num: "01", icon: "🐙", name: "GitHub Agent", desc: "Commit frequency, contributor count, stars, forks, issue activity, and recency signals across the full repository history.", tags: ["commit_freq", "contributors", "stars", "issues"] },
  { num: "02", icon: "⛓", name: "Onchain Agent", desc: "Wallet history across 20 EVM chains via Etherscan — age, tx volume, token diversity, DeFi interactions.", tags: ["tx_volume", "wallet_age", "defi", "20_chains"] },
  { num: "03", icon: "💬", name: "Sentiment Agent", desc: "Web-searches for community mentions, press coverage, Twitter/X presence, and social proof signals.", tags: ["mentions", "press", "twitter", "social"] },
  { num: "04", icon: "📝", name: "NLP Agent", desc: "Claude evaluates grant text for clarity of public goods value, impact specificity, and alignment with Octant criteria.", tags: ["pg_clarity", "impact", "octant_fit"] },
];

const TIERS = [
  { score: "0–20",  name: "Not Ready",    amount: "$0",          pct: 20  },
  { score: "21–35", name: "Seed",         amount: "$500–2K",     pct: 35  },
  { score: "36–55", name: "Early Growth", amount: "$2K–10K",     pct: 55  },
  { score: "56–70", name: "Growth",       amount: "$10K–25K",    pct: 70  },
  { score: "71–85", name: "Scaling",      amount: "$25K–50K",    pct: 85  },
  { score: "86–100",name: "Flagship 🏆",  amount: "$50K–100K",   pct: 100, highlight: true },
];

const STEPS = [
  { n: "01", title: "Open the bot",   desc: 'Go to @ImpactLensBot on Telegram, send /start' },
  { n: "02", title: "Run /check",     desc: "Enter project name, GitHub URL, wallet, website, and grant text." },
  { n: "03", title: "Get your score", desc: "15–20 seconds. Full breakdown: 4 subscores, tier, Octant chance rating." },
  { n: "04", title: "Use /improve",   desc: "Personalized 3-step plan with timeframes for exactly what to fix." },
  { n: "05", title: "Use /apply",     desc: "Generate a polished Octant grant application draft ready to submit." },
];

const MCP_TOOLS = [
  { name: "evaluate_project", desc: "Full evaluation — score, tier, AI report, grant recommendation." },
  { name: "batch_evaluate",   desc: "Rank multiple projects with optional pool-size allocation." },
  { name: "score_only",       desc: "Fast numeric score only. Ideal for screening pipelines." },
];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <ToastFeed />
      <RegisterModal open={modalOpen} onClose={() => setModalOpen(false)} onSuccess={() => {}} />

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "rgba(245,240,232,0.92)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", height: 60,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            width: 28, height: 28, background: "var(--ink)", display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 14,
            flexShrink: 0,
          }}>🔍</span>
          <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: "-0.4px" }}>
            ImpactLens
          </span>
        </div>

        {/* Desktop links */}
        <div className="mobile-hidden" style={{ display: "flex", gap: 32 }}>
          {["How It Works", "For Humans", "For Agents", "Quickstart"].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s/g, "-")}`} className="nav-link">{l}</a>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={() => setModalOpen(true)}
            className="mobile-hidden"
            style={{
              fontFamily: "'Space Mono', monospace", fontSize: 11, padding: "8px 16px",
              border: "1px solid var(--border-dark)", background: "transparent",
              color: "var(--text-dim)", cursor: "pointer", letterSpacing: "0.08em",
              textTransform: "uppercase", transition: "all 0.18s",
            }}
            onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--ink)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--acid)"; }}
            onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-dim)"; }}
          >Register Agent</button>

          <a href="https://t.me/Impactlensbot" style={{
            fontFamily: "'Space Mono', monospace", fontSize: 11, padding: "8px 18px",
            background: "var(--ink)", color: "var(--acid)",
            textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase",
            transition: "opacity 0.18s", fontWeight: 700,
          }}
            onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"; }}
            onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
          >Telegram →</a>
        </div>
      </nav>

      {/* ── TICKER ── */}
      <div style={{ paddingTop: 60 }}>
        <Ticker />
      </div>

      {/* ── HERO ── */}
      <section style={{ position: "relative", overflow: "hidden", padding: "80px 40px 60px" }}>
        {/* Blobs */}
        <div className="blob blob-acid" style={{ width: 700, height: 600, top: -100, right: -150, borderRadius: "65% 35% 50% 50% / 40% 60% 40% 60%" }} />
        <div className="blob blob-rust"  style={{ width: 350, height: 350, bottom: 0,   left: -80, borderRadius: "50%" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 80 }} className="mobile-col mobile-gap">

            {/* Left: headline */}
            <div style={{ flex: "1 1 55%", minWidth: 0 }}>
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
                style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
                <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ink)", display: "inline-block" }} />
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-dim)" }}>
                  Built for Octant Hackathon
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
                className="mobile-text-sm"
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: "clamp(54px, 7.5vw, 108px)",
                  lineHeight: 0.95,
                  letterSpacing: "-3px",
                  marginBottom: 32,
                  color: "var(--ink)",
                }}>
                Grant<br />
                <em style={{ fontStyle: "italic", color: "var(--text-dim)" }}>scoring</em><br />
                <span style={{
                  background: "var(--acid)",
                  padding: "0 12px 4px",
                  display: "inline-block",
                  color: "var(--ink)",
                  fontStyle: "normal",
                }}>for the<br />public good</span>
              </motion.h1>

              <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
                style={{ fontSize: 17, lineHeight: 1.7, color: "var(--text-dim)", maxWidth: 460, marginBottom: 36 }}>
                ImpactLens evaluates public goods projects across 4 dimensions — GitHub, onchain, community, and application quality — returning a grant readiness score with actionable recommendations.
              </motion.p>

              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
                style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 56 }}>
                <a href="https://t.me/Impactlensbot" style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "14px 28px", background: "var(--ink)", color: "var(--acid)",
                  fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700,
                  textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase",
                  transition: "transform 0.15s",
                }}
                  onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; }}
                  onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "none"; }}
                >🤖 Try on Telegram</a>

                <button onClick={() => setModalOpen(true)} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "14px 28px", background: "transparent",
                  border: "1.5px solid var(--ink)",
                  color: "var(--ink)",
                  fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700,
                  cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase",
                  transition: "all 0.15s",
                }}
                  onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--ink)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--acid)"; }}
                  onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--ink)"; }}
                >⚡ Register Agent</button>

                <a href="#for-agents" style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "14px 24px", background: "transparent",
                  border: "1.5px solid var(--border-dark)",
                  color: "var(--text-dim)",
                  fontFamily: "'Space Mono', monospace", fontSize: 12,
                  textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase",
                  transition: "border-color 0.15s, color 0.15s",
                }}
                  onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--ink)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink)"; }}
                  onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-dark)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-dim)"; }}
                >📡 API Docs</a>
              </motion.div>

              {/* Live stats */}
              <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}>
                <LiveStats />
              </motion.div>
            </div>

            {/* Right: score demo */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5}
              style={{ flex: "1 1 40%", minWidth: 0, paddingTop: 60 }}
              className="mobile-full">
              <ScoreDemo />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{
        background: "var(--ink)", color: "var(--bg)",
        padding: "80px 40px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Acid blob */}
        <div className="blob blob-acid" style={{ width: 500, height: 500, top: -100, right: -100, opacity: 0.12 }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#5C6B3A", marginBottom: 12 }}>Architecture</div>
            <h2 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(36px, 5vw, 72px)",
              letterSpacing: "-2px", lineHeight: 1.0,
              marginBottom: 16, color: "var(--bg)",
            }}>
              Four agents.<br /><em>One score.</em>
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#7A8A60", maxWidth: 440, marginBottom: 60 }}>
              Every project is evaluated by four specialized AI agents running in parallel, scored against Octant's grant criteria.
            </p>
          </motion.div>

          {/* Pipeline */}
          <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 72, overflowX: "auto", paddingBottom: 8 }}>
            {["📥 Input", "⚡ Parallel Agents", "🧮 Scoring Engine", "📊 AI Report", "💰 Grant Tier"].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 100 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", flex: 1 }}>
                  <div style={{
                    width: 48, height: 48, background: "rgba(200,240,0,0.1)",
                    border: "1px solid rgba(200,240,0,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, marginBottom: 10,
                    transition: "transform 0.2s",
                  }}
                    onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1.12)"; }}
                    onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.transform = "none"; }}
                  >{s.split(" ")[0]}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#5C6B3A", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {s.split(" ").slice(1).join(" ")}
                  </div>
                </div>
                {i < 4 && <div style={{ width: 24, height: 1, background: "rgba(200,240,0,0.3)", flexShrink: 0 }} />}
              </div>
            ))}
          </div>

          {/* Agent strips */}
          <div>
            {AGENTS.map((a, i) => (
              <motion.div key={a.num}
                className="agent-strip"
                style={{ borderTopColor: "rgba(255,255,255,0.08)" }}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}>

                {/* Number */}
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#3A4A20", letterSpacing: "0.12em", width: 28, paddingTop: 4, flexShrink: 0 }}>{a.num}</div>

                {/* Icon */}
                <div style={{
                  width: 52, height: 52, flexShrink: 0,
                  background: "rgba(200,240,0,0.08)", border: "1px solid rgba(200,240,0,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                }}>{a.icon}</div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 8, color: "var(--bg)" }}>{a.name}</div>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: "#7A8A60", marginBottom: 12 }}>{a.desc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {a.tags.map(t => (
                      <span key={t} className="tag" style={{ borderColor: "rgba(255,255,255,0.1)", color: "#4A5E30" }}>{t}</span>
                    ))}
                  </div>
                </div>

                {/* Score weight indicator */}
                <div className="mobile-hidden" style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 40, color: "var(--acid)", lineHeight: 1 }}>25</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#3A4A20", letterSpacing: "0.15em", textTransform: "uppercase" }}>pts max</div>
                </div>
              </motion.div>
            ))}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />
          </div>
        </div>
      </section>

      {/* ── TIERS ── */}
      <section id="tiers" style={{ background: "var(--bg2)", padding: "80px 40px", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 56 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12 }}>Grant Tiers</div>
            <h2 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(36px, 5vw, 72px)",
              letterSpacing: "-2px", lineHeight: 1.0,
              marginBottom: 16,
            }}>Score → <em>Funding</em></h2>
            <p style={{ fontSize: 16, color: "var(--text-dim)", maxWidth: 420 }}>Six tiers map your readiness score to a recommended grant range.</p>
          </motion.div>

          {/* Tier bars — horizontal visual */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {TIERS.map((t, i) => (
              <motion.div key={t.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                style={{
                  display: "flex", alignItems: "center", gap: 20,
                  padding: "16px 20px",
                  background: t.highlight ? "var(--ink)" : "transparent",
                  border: t.highlight ? "none" : "1px solid var(--border)",
                  transition: "all 0.18s",
                  cursor: "default",
                }}
                whileHover={{ x: 4 }}>

                <div style={{ width: 68, flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: t.highlight ? "#5C6B3A" : "var(--text-muted)", letterSpacing: "0.12em" }}>{t.score}</div>
                </div>
                <div style={{ width: 120, flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 15, color: t.highlight ? "var(--acid)" : "var(--ink)" }}>{t.name}</div>
                </div>

                {/* Bar */}
                <div style={{ flex: 1, height: 6, background: t.highlight ? "rgba(255,255,255,0.1)" : "var(--border)", overflow: "hidden" }}>
                  <motion.div style={{ height: "100%", background: t.highlight ? "var(--acid)" : "var(--ink)", opacity: t.highlight ? 1 : 0.35 }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${t.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease: "easeOut", delay: i * 0.07 + 0.2 }} />
                </div>

                <div style={{ width: 100, textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, color: t.highlight ? "var(--acid)" : "var(--ink)" }}>{t.amount}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR HUMANS ── */}
      <section id="for-humans" style={{ padding: "80px 40px", position: "relative", overflow: "hidden" }}>
        <div className="blob blob-acid" style={{ width: 400, height: 400, bottom: -80, left: -80, borderRadius: "50%" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 60 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12 }}>For Humans</div>
            <h2 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(36px, 5vw, 72px)",
              letterSpacing: "-2px", lineHeight: 1.0, marginBottom: 16,
            }}>Use ImpactLens<br /><em>on Telegram</em></h2>
            <p style={{ fontSize: 16, color: "var(--text-dim)", maxWidth: 420 }}>
              The fastest way to check Octant eligibility. No signup, no code — just send a message.
            </p>
          </motion.div>

          <div style={{ display: "flex", gap: 60, alignItems: "flex-start" }} className="mobile-col mobile-gap">
            {/* Steps */}
            <div style={{ flex: "1 1 50%" }}>
              {STEPS.map((s, i) => (
                <motion.div key={s.n}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    display: "flex", gap: 24, paddingBottom: 28, marginBottom: 28,
                    borderBottom: i < STEPS.length - 1 ? "1px solid var(--border)" : "none",
                    position: "relative",
                  }}>
                  <div style={{
                    width: 32, height: 32, background: i === 0 ? "var(--ink)" : "transparent",
                    border: "1.5px solid var(--border-dark)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Space Mono', monospace", fontSize: 10,
                    color: i === 0 ? "var(--acid)" : "var(--text-muted)",
                    flexShrink: 0, fontWeight: 700,
                  }}>{s.n}</div>
                  <div>
                    <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{s.title}</div>
                    <div style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.6 }}>{s.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Commands */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="mobile-full"
              style={{
                flex: "1 1 42%", position: "sticky", top: 80,
                border: "1.5px solid var(--ink)", overflow: "hidden",
              }}>
              {/* Bot header */}
              <div style={{ background: "var(--ink)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, background: "var(--acid)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🔍</div>
                <div>
                  <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 14, color: "var(--bg)" }}>ImpactLens Bot</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "var(--acid)" }}>● online</div>
                </div>
              </div>
              <div style={{ padding: "20px" }}>
                {[
                  { cmd: "/start",   desc: "Welcome & overview" },
                  { cmd: "/check",   desc: "Evaluate project eligibility" },
                  { cmd: "/improve", desc: "Get improvement plan" },
                  { cmd: "/apply",   desc: "Generate grant application" },
                  { cmd: "/ask",     desc: "Ask anything about Octant" },
                  { cmd: "/tracks",  desc: "View hackathon tracks & prizes" },
                  { cmd: "/compare", desc: "Rank multiple projects" },
                ].map((c, i) => (
                  <div key={c.cmd}
                    style={{
                      display: "flex", alignItems: "center", gap: 16, padding: "10px 12px",
                      borderBottom: i < 6 ? "1px solid var(--border)" : "none",
                      transition: "background 0.15s",
                    }}
                    onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(200,240,0,0.06)"; }}
                    onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                  >
                    <code style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "var(--ink)", fontWeight: 700, width: 76, flexShrink: 0 }}>{c.cmd}</code>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--text-dim)" }}>{c.desc}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FOR AGENTS ── */}
      <section id="for-agents" style={{ background: "var(--ink)", padding: "80px 40px", position: "relative", overflow: "hidden" }}>
        <div className="blob blob-acid" style={{ width: 600, height: 500, top: -150, left: -200, opacity: 0.08 }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 56 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#3A4A20", marginBottom: 12 }}>For AI Agents</div>
            <h2 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(36px, 5vw, 72px)",
              letterSpacing: "-2px", lineHeight: 1.0, marginBottom: 16, color: "var(--bg)",
            }}>Agent-to-agent<br /><em>integration</em></h2>
            <p style={{ fontSize: 16, color: "#7A8A60", maxWidth: 440, marginBottom: 32 }}>
              ImpactLens exposes a REST API and MCP server so other agents can evaluate projects programmatically.
            </p>
          </motion.div>

          {/* CTA Banner */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{
              display: "flex", alignItems: "center", gap: 24,
              padding: "20px 28px", marginBottom: 56,
              border: "1px solid rgba(200,240,0,0.25)",
              background: "rgba(200,240,0,0.05)",
            }}
            className="mobile-col mobile-gap">
            <div style={{ fontSize: 32, flexShrink: 0 }}>⚡</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 15, color: "var(--acid)", marginBottom: 4 }}>Ready to integrate?</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#7A8A60" }}>Register your agent to get an API key instantly. Free, no rate limits on evaluation.</div>
            </div>
            <button onClick={() => setModalOpen(true)} style={{
              padding: "12px 24px", background: "var(--acid)", color: "var(--ink)",
              fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700,
              border: "none", cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase",
              flexShrink: 0, transition: "opacity 0.15s",
            }}
              onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
              onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
            >Register Agent →</button>
          </motion.div>

          <div style={{ display: "flex", gap: 48 }} className="mobile-col mobile-gap">
            {/* REST API */}
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 22, marginBottom: 12, color: "var(--bg)" }}>REST API</div>
              <p style={{ fontSize: 14, color: "#7A8A60", lineHeight: 1.6, marginBottom: 24 }}>
                POST to <code style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, padding: "2px 7px", background: "rgba(200,240,0,0.1)", color: "var(--acid)", border: "1px solid rgba(200,240,0,0.2)" }}>/evaluate</code> with any combination of inputs.
              </p>

              <div style={{ marginBottom: 20 }}>
                <div style={{ background: "rgba(255,255,255,0.04)", padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#3A4A20", letterSpacing: "0.12em" }}>POST /evaluate</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, padding: "2px 6px", background: "rgba(200,240,0,0.1)", color: "var(--acid)", letterSpacing: "0.1em" }}>JSON</span>
                </div>
                <pre className="code-block">{`{
  `}<span className="code-key">"project_name"</span>{`:    `}<span className="code-string">"My Project"</span>{`,
  `}<span className="code-key">"github_url"</span>{`:     `}<span className="code-string">"https://github.com/..."</span>{`,
  `}<span className="code-key">"wallet_address"</span>{`: `}<span className="code-string">"0x1a2b3c..."</span>{`,
  `}<span className="code-key">"grant_text"</span>{`:     `}<span className="code-string">"We are building..."</span>{`,
  `}<span className="code-key">"pool_size"</span>{`:      `}<span style={{ color: "var(--acid)" }}>100000</span>{`
}`}</pre>
              </div>

              {[
                { method: "POST", path: "/evaluate",       note: "Full evaluation + AI report" },
                { method: "POST", path: "/evaluate/batch", note: "Rank multiple projects" },
                { method: "POST", path: "/score",          note: "Fast numeric score only" },
              ].map(e => (
                <div key={e.path} style={{
                  display: "flex", alignItems: "center", gap: 16, padding: "10px 14px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  fontFamily: "'Space Mono', monospace", fontSize: 11,
                }}>
                  <span style={{ color: "var(--acid)", width: 40, flexShrink: 0 }}>{e.method}</span>
                  <span style={{ color: "#7AB8C0", flex: 1 }}>{e.path}</span>
                  <span style={{ color: "#3A4A20" }}>{e.note}</span>
                </div>
              ))}
            </motion.div>

            {/* MCP */}
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 22, marginBottom: 12, color: "var(--bg)" }}>MCP Server</div>
              <p style={{ fontSize: 14, color: "#7A8A60", lineHeight: 1.6, marginBottom: 24 }}>
                For Claude and any MCP-compatible agent. Add ImpactLens as a native tool.
              </p>

              <div style={{ marginBottom: 24 }}>
                <div style={{ background: "rgba(255,255,255,0.04)", padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#3A4A20" }}>claude_desktop_config.json</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, padding: "2px 6px", background: "rgba(200,240,0,0.1)", color: "var(--acid)" }}>JSON</span>
                </div>
                <pre className="code-block">{`{
  `}<span className="code-key">"mcpServers"</span>{`: {
    `}<span className="code-key">"impactlens"</span>{`: {
      `}<span className="code-key">"command"</span>{`: `}<span className="code-string">"node"</span>{`,
      `}<span className="code-key">"args"</span>{`:   [`}<span className="code-string">"./mcp.js"</span>{`]
    }
  }
}`}</pre>
              </div>

              {MCP_TOOLS.map(t => (
                <div key={t.name}
                  style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", transition: "padding-left 0.15s" }}
                  onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.paddingLeft = "8px"; }}
                  onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.paddingLeft = "0"; }}
                >
                  <div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--acid)", marginBottom: 4 }}>{t.name}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#7A8A60" }}>{t.desc}</div>
                  </div>
                </div>
              ))}

              {/* Example prompt */}
              <div style={{ marginTop: 20, padding: "16px 20px", borderLeft: "3px solid var(--acid)", background: "rgba(200,240,0,0.04)" }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#3A4A20", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>Example agent prompt</div>
                <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: 15, lineHeight: 1.6, color: "#7A8A60", fontStyle: "italic" }}>
                  &quot;Use ImpactLens to evaluate these 5 projects and rank them by Octant readiness. Allocate proportional shares from a $200K pool.&quot;
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── QUICKSTART ── */}
      <section id="quickstart" style={{ padding: "80px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 56 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12 }}>Quickstart</div>
            <h2 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(36px, 5vw, 72px)",
              letterSpacing: "-2px", lineHeight: 1.0, marginBottom: 16,
            }}>Run it <em>yourself</em></h2>
            <p style={{ fontSize: 16, color: "var(--text-dim)", maxWidth: 380 }}>Self-host the full stack in under 5 minutes.</p>
          </motion.div>

          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[
              {
                tag: "Telegram Bot", title: "Start the bot",
                desc: "Run the Telegram interface. Requires a bot token from @BotFather.",
                code: `# Install
npm install

# Configure
cp .env.example .env
# Add keys to .env

# Run
node bot.js`
              },
              {
                tag: "REST API", title: "Run the API server",
                desc: "Expose ImpactLens as HTTP on port 3000.",
                code: `# Start the API server
npm start

# Test immediately
curl -X POST \\
  http://localhost:3000/evaluate \\
  -d '{"project_name":"Test"}'`
              },
              {
                tag: "MCP Server", title: "Expose as MCP tool",
                desc: "Make ImpactLens available to Claude as a native tool.",
                code: `# Start MCP server
npm run mcp

# Add to claude_desktop_config.json
# Restart Claude Desktop
# Tools appear automatically`
              },
              {
                tag: "Environment", title: "Required variables",
                desc: null,
                env: [
                  { key: "ANTHROPIC_API_KEY",  req: true,       desc: "Powers all 4 AI agents" },
                  { key: "TELEGRAM_BOT_TOKEN", req: "Bot only", desc: "From @BotFather" },
                  { key: "GITHUB_TOKEN",       req: false,      desc: "Higher rate limits" },
                  { key: "ETHERSCAN_API_KEY",  req: false,      desc: "Richer onchain data" },
                ]
              },
            ].map((card, i) => (
              <motion.div key={card.tag}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  flex: "1 1 calc(50% - 12px)", minWidth: 280,
                  border: "1.5px solid var(--border)",
                  overflow: "hidden",
                  transition: "border-color 0.18s",
                }}
                onMouseOver={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--ink)"; }}
                onMouseOut={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"; }}
              >
                <div style={{ background: "var(--ink)", padding: "10px 20px", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "var(--acid)", letterSpacing: "0.14em", textTransform: "uppercase" }}>{card.tag}</span>
                </div>
                <div style={{ padding: "24px 24px" }}>
                  <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{card.title}</div>
                  {card.desc && <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6, marginBottom: 20 }}>{card.desc}</p>}
                  {card.code && (
                    <pre className="code-block" style={{ fontSize: 11 }}>{card.code}</pre>
                  )}
                  {card.env && (
                    <div>
                      <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6, marginBottom: 16 }}>
                        The only hard requirement is an Anthropic API key. Others unlock additional data signals.
                      </p>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid var(--border)" }}>
                            {["Variable", "Status", "Purpose"].map(h => (
                              <th key={h} style={{ textAlign: "left", paddingBottom: 8, paddingRight: 12, fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 400 }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {card.env.map((e) => (
                            <tr key={e.key} style={{ borderBottom: "1px solid var(--border)" }}>
                              <td style={{ padding: "10px 12px 10px 0", fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#1A3FBF" }}>{e.key}</td>
                              <td style={{ padding: "10px 12px 10px 0", fontFamily: "'Space Mono', monospace", fontSize: 10, color: e.req === true ? "#2A7A2A" : e.req ? "#A05020" : "var(--text-muted)" }}>
                                {e.req === true ? "Required" : e.req || "Optional"}
                              </td>
                              <td style={{ padding: "10px 0", fontSize: 12, color: "var(--text-dim)" }}>{e.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section style={{ background: "var(--ink)", padding: "96px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div className="blob blob-acid" style={{ width: 500, height: 500, top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.1 }} />
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ maxWidth: 640, margin: "0 auto", position: "relative" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#3A4A20", marginBottom: 24 }}>Get Started</div>
          <h2 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(40px, 6vw, 80px)",
            letterSpacing: "-2px", lineHeight: 1.0,
            marginBottom: 20, color: "var(--bg)",
          }}>
            Score your project.<br />
            <em style={{ color: "var(--acid)" }}>Get funded.</em>
          </h2>
          <p style={{ fontSize: 16, color: "#7A8A60", lineHeight: 1.7, marginBottom: 40 }}>
            Whether you&apos;re a human founder or an AI agent, ImpactLens gives you the data to make better grant decisions.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <a href="https://t.me/Impactlensbot" style={{
              padding: "16px 36px", background: "var(--acid)", color: "var(--ink)",
              fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700,
              textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase",
              transition: "opacity 0.15s",
            }}
              onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"; }}
              onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
            >🤖 Open on Telegram</a>
            <button onClick={() => setModalOpen(true)} style={{
              padding: "16px 32px", background: "transparent",
              border: "1.5px solid rgba(255,255,255,0.2)", color: "#7A8A60",
              fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700,
              cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase",
              transition: "all 0.15s",
            }}
              onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--acid)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--acid)"; }}
              onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)"; (e.currentTarget as HTMLButtonElement).style.color = "#7A8A60"; }}
            >⚡ Register Agent</button>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "var(--ink2)", padding: "24px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 16, color: "rgba(245,240,232,0.4)" }}>ImpactLens 🔍</div>
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
          {["How It Works", "Telegram Bot", "API & MCP", "Octant"].map(l => (
            <a key={l} href="#" style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(245,240,232,0.25)", textDecoration: "none", transition: "color 0.15s" }}
              onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--acid)"; }}
              onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,240,232,0.25)"; }}
            >{l}</a>
          ))}
        </div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "rgba(245,240,232,0.2)" }}>Built for Octant Hackathon 2025</div>
      </footer>
    </main>
  );
}