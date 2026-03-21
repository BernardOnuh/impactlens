"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BARS = [
  { label: "GitHub Activity",      score: 18, max: 25, color: "#0F0E0B" },
  { label: "Onchain History",      score: 16, max: 25, color: "#1A3FBF" },
  { label: "Community Sentiment",  score: 20, max: 25, color: "#E84C2B" },
  { label: "Application Quality",  score: 18, max: 25, color: "#0F0E0B" },
];

function useCountUp(target: number, duration = 1600, delay = 600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      let start: number | null = null;
      const step = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(t);
  }, [target, duration, delay]);
  return val;
}

export default function ScoreDemo() {
  const score = useCountUp(72);
  const [barsActive, setBarsActive] = useState(false);
  useEffect(() => { const t = setTimeout(() => setBarsActive(true), 900); return () => clearTimeout(t); }, []);

  // SVG ring
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const pct = score / 100;
  const offset = circ * (1 - pct);

  return (
    <div style={{
      border: "1.5px solid var(--ink)",
      overflow: "hidden",
      background: "var(--surface)",
    }}>
      {/* Window chrome */}
      <div style={{ background: "var(--ink)", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e", display: "inline-block" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28ca41", display: "inline-block" }} />
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "rgba(245,240,232,0.3)", marginLeft: 8, letterSpacing: "0.1em" }}>
          ImpactLens — Live Evaluation
        </span>
      </div>

      <div style={{ padding: "28px 28px", display: "flex", gap: 32, flexWrap: "wrap" }}>
        {/* Score ring + tier */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: 160 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 16 }}>
            Readiness Score
          </div>

          {/* Ring */}
          <div style={{ position: "relative", width: 130, height: 130, marginBottom: 16 }}>
            <svg width="130" height="130" viewBox="0 0 130 130">
              <circle cx="65" cy="65" r={radius} fill="none" stroke="var(--border)" strokeWidth="8" />
              <motion.circle
                cx="65" cy="65" r={radius}
                fill="none" stroke="var(--acid)" strokeWidth="8"
                strokeLinecap="square"
                strokeDasharray={circ}
                initial={{ strokeDashoffset: circ }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                style={{ transform: "rotate(-90deg)", transformOrigin: "65px 65px" }}
              />
            </svg>
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 44, lineHeight: 1, color: "var(--ink)" }}>{score}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.12em" }}>/100</div>
            </div>
          </div>

          <div style={{
            background: "var(--acid)", padding: "6px 14px",
            fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink)",
          }}>🚀 Strong Candidate</div>

          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 16, color: "var(--ink)", marginTop: 12, fontStyle: "italic" }}>
            $25K – $50K
          </div>
        </div>

        {/* Bars */}
        <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>
            Subscore Breakdown
          </div>
          {BARS.map((b) => (
            <div key={b.label}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Space Mono', monospace", fontSize: 10, marginBottom: 6 }}>
                <span style={{ color: "var(--text-dim)" }}>{b.label}</span>
                <span style={{ color: b.color, fontWeight: 700 }}>{b.score}<span style={{ color: "var(--text-muted)" }}>/{b.max}</span></span>
              </div>
              <div style={{ height: 4, background: "var(--bg2)", overflow: "hidden" }}>
                <motion.div
                  style={{ height: "100%", background: b.color === "#0F0E0B" ? "var(--ink)" : b.color }}
                  initial={{ width: 0 }}
                  animate={{ width: barsActive ? `${(b.score / b.max) * 100}%` : 0 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                />
              </div>
            </div>
          ))}

          <div style={{
            marginTop: 4, padding: "12px 14px",
            background: "var(--bg2)", borderLeft: "2px solid var(--ink)",
            fontFamily: "'Space Mono', monospace", fontSize: 10, lineHeight: 1.8, color: "var(--text-dim)",
          }}>
            ✅ 340+ stars, consistent commits<br />
            ⚠️ Onchain history thin — build more
          </div>
        </div>
      </div>
    </div>
  );
}