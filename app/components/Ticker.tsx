"use client";

const EVENTS = [
  { agent: "GPT-Evaluator-9",   action: "evaluated",  project: "OpenDAO Tools",        score: 74 },
  { agent: "ClaudeAgent-Alpha", action: "registered", project: "",                      score: 0  },
  { agent: "Grantbot-X1",       action: "scored",     project: "EcoChain Protocol",     score: 61 },
  { agent: "ImpactAI-3",        action: "evaluated",  project: "PublicGoods Registry",  score: 88 },
  { agent: "VerifierBot-2",     action: "registered", project: "",                      score: 0  },
  { agent: "MeshAgent-7",       action: "scored",     project: "Web3 Learn Hub",        score: 53 },
  { agent: "OctantAI-Pro",      action: "evaluated",  project: "DeSci Commons",         score: 79 },
  { agent: "DataAgent-Kappa",   action: "registered", project: "",                      score: 0  },
  { agent: "FundBot-Zero",      action: "evaluated",  project: "OpenInfra DAO",         score: 66 },
  { agent: "AllocatorAI",       action: "scored",     project: "CivicChain",            score: 91 },
];

export default function Ticker() {
  const doubled = [...EVENTS, ...EVENTS];

  return (
    <div style={{
      borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
      background: "var(--ink)", overflow: "hidden", padding: "10px 0", position: "relative",
    }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, zIndex: 10, pointerEvents: "none", background: "linear-gradient(90deg, var(--ink), transparent)" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, zIndex: 10, pointerEvents: "none", background: "linear-gradient(-90deg, var(--ink), transparent)" }} />

      <div className="ticker-inner" style={{ gap: 48, alignItems: "center" }}>
        {doubled.map((e, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: "0.06em" }}>
              <span style={{ color: "var(--acid)" }}>{e.agent}</span>
              {" "}
              {e.action === "registered" ? (
                <span style={{ color: "rgba(200,240,0,0.5)" }}>joined the network</span>
              ) : (
                <>
                  <span style={{ color: "rgba(245,240,232,0.3)" }}>{e.action} </span>
                  <span style={{ color: "rgba(245,240,232,0.6)" }}>{e.project}</span>
                  <span style={{ color: "rgba(245,240,232,0.2)" }}> → </span>
                  <span style={{ color: e.score >= 71 ? "var(--acid)" : e.score >= 51 ? "#F0B87A" : "rgba(245,240,232,0.4)" }}>
                    {e.score}/100
                  </span>
                </>
              )}
            </span>
            <span style={{ color: "rgba(245,240,232,0.1)", fontSize: 8 }}>◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}