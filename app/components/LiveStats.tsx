"use client";
import { useState, useEffect, useRef } from "react";

interface Stat { label: string; value: number; suffix?: string; prefix?: string; increment: number; interval: number; }

const INITIAL_STATS: Stat[] = [
  { label: "Agents Registered",  value: 847,     suffix: "",  increment: 1,     interval: 4200 },
  { label: "Evaluations Run",    value: 12483,   suffix: "",  increment: 3,     interval: 1800 },
  { label: "Projects Scored",    value: 3291,    suffix: "",  increment: 1,     interval: 3100 },
  { label: "Grant $ Advised",    value: 4820000, prefix: "$", increment: 32000, interval: 6000 },
];

function formatNum(n: number, prefix = "", suffix = "") {
  if (n >= 1_000_000) return `${prefix}${(n / 1_000_000).toFixed(2)}M${suffix}`;
  if (n >= 1_000)     return `${prefix}${(n / 1_000).toFixed(1)}K${suffix}`;
  return `${prefix}${n.toLocaleString()}${suffix}`;
}

export default function LiveStats() {
  const [stats, setStats] = useState(INITIAL_STATS);
  const [flashing, setFlashing] = useState<number[]>([]);
  const timers = useRef<ReturnType<typeof setInterval>[]>([]);

  useEffect(() => {
    INITIAL_STATS.forEach((stat, i) => {
      const t = setInterval(() => {
        setStats(prev => { const n = [...prev]; n[i] = { ...n[i], value: n[i].value + n[i].increment }; return n; });
        setFlashing(prev => [...prev, i]);
        setTimeout(() => setFlashing(prev => prev.filter(x => x !== i)), 500);
      }, stat.interval + Math.random() * 800);
      timers.current.push(t);
    });
    return () => timers.current.forEach(clearInterval);
  }, []);

  return (
    <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
      {stats.map((s, i) => (
        <div key={s.label}
          style={{
            flex: "1 1 140px",
            padding: "20px 24px",
            borderRight: i < 3 ? "1px solid var(--border)" : "none",
            borderBottom: "1px solid var(--border)",
            borderTop: "1px solid var(--border)",
            borderLeft: i === 0 ? "1px solid var(--border)" : "none",
            background: flashing.includes(i) ? "rgba(200,240,0,0.04)" : "transparent",
            transition: "background 0.3s",
          }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>{s.label}</div>
          <div style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(24px, 3vw, 36px)",
            lineHeight: 1,
            color: "var(--ink)",
            transition: "all 0.3s",
            transform: flashing.includes(i) ? "scale(1.04)" : "scale(1)",
            display: "inline-block",
          }}>
            {formatNum(s.value, s.prefix, s.suffix)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
            <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--ink)", display: "inline-block" }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)" }}>live</span>
          </div>
        </div>
      ))}
    </div>
  );
}