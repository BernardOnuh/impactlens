"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Loader2, Copy } from "lucide-react";

interface Props { open: boolean; onClose: () => void; onSuccess: (agent: string) => void; }

const AGENT_TYPES = [
  { id: "mcp",    label: "MCP Client", desc: "Claude Desktop, Cursor" },
  { id: "rest",   label: "REST API",   desc: "HTTP integration" },
  { id: "custom", label: "Custom",     desc: "Any framework" },
];

const inputStyle = {
  width: "100%", padding: "12px 14px",
  fontFamily: "'Space Mono', monospace", fontSize: 12,
  color: "var(--ink)", background: "var(--bg2)",
  border: "1.5px solid var(--border)",
  outline: "none", transition: "border-color 0.18s",
};

export default function RegisterModal({ open, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<"form" | "loading" | "done">("form");
  const [agentName, setAgentName] = useState("");
  const [agentType, setAgentType] = useState("mcp");
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const apiKey = agentName
    ? `il_${agentName.toLowerCase().replace(/\s+/g, "_")}_${Math.random().toString(36).slice(2, 10)}`
    : "il_your_agent_key_here";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentName.trim()) return;
    setStep("loading");
    setTimeout(() => { setStep("done"); onSuccess(agentName); }, 1800);
  };

  const handleCopy = () => { navigator.clipboard.writeText(apiKey); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleClose = () => { onClose(); setTimeout(() => { setStep("form"); setAgentName(""); setEmail(""); }, 400); };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(15,14,11,0.7)", backdropFilter: "blur(4px)" }}
            onClick={handleClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            style={{ position: "fixed", inset: 0, zIndex: 51, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, pointerEvents: "none" }}>

            <div style={{ pointerEvents: "auto", width: "100%", maxWidth: 440 }} onClick={e => e.stopPropagation()}>
              <div style={{ background: "var(--surface)", border: "1.5px solid var(--ink)", overflow: "hidden", boxShadow: "0 40px 80px rgba(15,14,11,0.4)" }}>

                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "var(--ink)", borderBottom: "none" }}>
                  <div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--acid)", marginBottom: 4 }}>Agent Registration</div>
                    <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: "var(--bg)" }}>
                      {step === "done" ? "You're in 🎉" : "Register Your Agent"}
                    </div>
                  </div>
                  <button onClick={handleClose} style={{
                    width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(245,240,232,0.5)",
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                    onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)"; }}
                    onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                  ><X size={14} /></button>
                </div>

                {/* Body */}
                <div style={{ padding: "24px 24px" }}>
                  <AnimatePresence mode="wait">
                    {step === "form" && (
                      <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                        <div>
                          <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: 8 }}>Agent Name *</label>
                          <input type="text" value={agentName} onChange={e => setAgentName(e.target.value)}
                            placeholder="e.g. GrantBot-Alpha, MyEvalAgent..." required
                            style={inputStyle}
                            onFocus={e => { (e.target as HTMLInputElement).style.borderColor = "var(--ink)"; }}
                            onBlur={e => { (e.target as HTMLInputElement).style.borderColor = "var(--border)"; }}
                          />
                        </div>

                        <div>
                          <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: 8 }}>Integration Type</label>
                          <div style={{ display: "flex", gap: 8 }}>
                            {AGENT_TYPES.map(t => (
                              <button key={t.id} type="button" onClick={() => setAgentType(t.id)}
                                style={{
                                  flex: 1, padding: "12px 8px", textAlign: "left",
                                  background: agentType === t.id ? "var(--ink)" : "transparent",
                                  border: `1.5px solid ${agentType === t.id ? "var(--ink)" : "var(--border)"}`,
                                  cursor: "pointer", transition: "all 0.15s",
                                }}>
                                <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 13, marginBottom: 2, color: agentType === t.id ? "var(--acid)" : "var(--ink)" }}>{t.label}</div>
                                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: agentType === t.id ? "rgba(200,240,0,0.5)" : "var(--text-muted)" }}>{t.desc}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: 8 }}>Email (optional)</label>
                          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                            placeholder="agent@yourproject.xyz"
                            style={inputStyle}
                            onFocus={e => { (e.target as HTMLInputElement).style.borderColor = "var(--ink)"; }}
                            onBlur={e => { (e.target as HTMLInputElement).style.borderColor = "var(--border)"; }}
                          />
                        </div>

                        <button type="submit" style={{
                          padding: "14px", background: "var(--ink)", color: "var(--acid)",
                          fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700,
                          border: "none", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase",
                          transition: "opacity 0.15s",
                        }}
                          onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
                          onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                        >Register Agent →</button>

                        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "var(--text-muted)", textAlign: "center", lineHeight: 1.6 }}>
                          Free to use. No rate limits. API key generated instantly.
                        </p>
                      </motion.form>
                    )}

                    {step === "loading" && (
                      <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "40px 0" }}>
                        <Loader2 size={28} style={{ color: "var(--ink)", animation: "spin 1s linear infinite" }} />
                        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--text-dim)", textAlign: "center", lineHeight: 1.7 }}>
                          <div>Provisioning agent identity...</div>
                          <div style={{ color: "var(--text-muted)", marginTop: 4, fontSize: 10 }}>Generating API key & registering to network</div>
                        </div>
                      </motion.div>
                    )}

                    {step === "done" && (
                      <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "var(--ink)", borderLeft: "3px solid var(--acid)" }}>
                          <Check size={18} style={{ color: "var(--acid)", flexShrink: 0 }} />
                          <div>
                            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 14, color: "var(--acid)" }}>{agentName} is live</div>
                            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "rgba(245,240,232,0.4)", marginTop: 2 }}>Registered to ImpactLens network</div>
                          </div>
                        </div>

                        <div>
                          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>Your API Key</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", border: "1px solid var(--border)", background: "var(--bg2)" }}>
                            <code style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#1A3FBF", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{apiKey}</code>
                            <button onClick={handleCopy} style={{
                              background: "none", border: "none", cursor: "pointer", padding: 4,
                              color: copied ? "#2A7A2A" : "var(--text-muted)", transition: "color 0.15s",
                            }}>{copied ? <Check size={14} /> : <Copy size={14} />}</button>
                          </div>
                          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--text-muted)", marginTop: 6 }}>Save this key — it won&apos;t be shown again.</p>
                        </div>

                        <div style={{ overflow: "hidden", border: "1px solid var(--border)" }}>
                          <div style={{ background: "var(--ink)", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "rgba(245,240,232,0.3)", letterSpacing: "0.14em", textTransform: "uppercase" }}>Quick start</span>
                            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "var(--acid)" }}>{agentType === "mcp" ? "JSON" : "bash"}</span>
                          </div>
                          <pre className="code-block" style={{ fontSize: 10 }}>
                            {agentType === "mcp"
                              ? `{\n  "mcpServers": {\n    "impactlens": {\n      "command": "node",\n      "args": ["./mcp.js"],\n      "env": { "API_KEY": "${apiKey}" }\n    }\n  }\n}`
                              : `curl -X POST https://api.impactlens.xyz/evaluate \\\n  -H "Authorization: Bearer ${apiKey}" \\\n  -d '{"github_url":"...","project_name":"..."}'`}
                          </pre>
                        </div>

                        <button onClick={handleClose} style={{
                          padding: "12px", background: "transparent", border: "1.5px solid var(--border)",
                          color: "var(--text-dim)", fontFamily: "'Space Mono', monospace", fontSize: 11,
                          cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase",
                          transition: "all 0.15s",
                        }}
                          onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--ink)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--ink)"; }}
                          onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-dim)"; }}
                        >Close</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}