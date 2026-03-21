"use client";
import { useState, useEffect } from "react";

interface Toast { id: number; text: string; type: "register" | "eval" | "score"; }

const AGENT_NAMES = ["NeuralGrantBot","OctantAI-7","EvalAgent-X","FundMapper-3","PGFinder","ChainEval-Pro","ImpactBot-9","GrantWeaver-2","PublicAI-Alpha","ScoreBot-Z"];
const PROJECT_NAMES = ["OpenDAO Tools","PublicGoods.xyz","EcoChain Protocol","CivicLedger","DeSci Commons","Web3 Learn Hub","OpenInfra DAO","FreeNode Network"];

let toastId = 0;

function randomToast(): Toast {
  const agent = AGENT_NAMES[Math.floor(Math.random() * AGENT_NAMES.length)];
  const project = PROJECT_NAMES[Math.floor(Math.random() * PROJECT_NAMES.length)];
  const score = Math.floor(Math.random() * 55) + 40;
  const r = Math.random();
  if (r < 0.3) return { id: toastId++, type: "register", text: `${agent} joined the network` };
  if (r < 0.6) return { id: toastId++, type: "eval",     text: `${agent} evaluated ${project}` };
  return { id: toastId++, type: "score", text: `${project} scored ${score}/100` };
}

export default function ToastFeed() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [exiting, setExiting] = useState<number[]>([]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 3500 + Math.random() * 4000;
      timeoutId = setTimeout(() => {
        const t = randomToast();
        setToasts(prev => [...prev.slice(-2), t]);
        setTimeout(() => {
          setExiting(prev => [...prev, t.id]);
          setTimeout(() => {
            setToasts(prev => prev.filter(x => x.id !== t.id));
            setExiting(prev => prev.filter(x => x !== t.id));
          }, 320);
        }, 3800);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeoutId);
  }, []);

  const dotColor = (type: Toast["type"]) =>
    type === "register" ? "#C8F000" : type === "score" ? "#E84C2B" : "#1A3FBF";

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
      {toasts.map(t => (
        <div key={t.id} className={exiting.includes(t.id) ? "toast-out" : "toast-in"}
          style={{
            display: "flex", alignItems: "flex-start", gap: 10,
            padding: "12px 16px",
            background: "var(--ink)",
            border: "1px solid rgba(255,255,255,0.1)",
            maxWidth: 280,
            boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
          }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: dotColor(t.type), flexShrink: 0, marginTop: 3, display: "inline-block" }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "rgba(245,240,232,0.6)", lineHeight: 1.5, letterSpacing: "0.04em" }}>{t.text}</span>
        </div>
      ))}
    </div>
  );
}
