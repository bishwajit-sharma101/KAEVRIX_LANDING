import * as sound from "../../../../utils/audio";

export default function BossVictoryDefeat({
  gameState,
  enemyConfig,
  milestone,
  onClose,
  onRetry
}) {
  if (gameState === "victory") {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        height: "100%", padding: "40px", textAlign: "center", gap: "24px",
        fontFamily: "'Cinzel', serif"
      }}>
        <div style={{ fontSize: "64px", filter: "drop-shadow(0 0 30px rgba(16,185,129,0.8))" }}>
          [TOP]
        </div>
        <div style={{ fontSize: "14px", color: "#10b981", letterSpacing: "4px", fontWeight: "900" }}>
          VICTORY ACHIEVED
        </div>
        <h2 style={{ fontSize: "32px", color: "#f8fafc", margin: 0, textShadow: "0 0 15px rgba(16,185,129,0.6)" }}>
          {enemyConfig?.name.toUpperCase()} SLAIN!
        </h2>
        <p style={{ fontSize: "15px", color: "#94a3b8", maxWidth: "440px", lineHeight: "1.6" }}>
          You have vanquished the archetype guardian and mastered <strong>{milestone?.title || "this milestone"}</strong>!
        </p>

        <button
          onClick={() => { sound.playClockTick(); onClose(); }}
          style={{
            padding: "16px 36px",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            border: "none", borderRadius: "12px", color: "#fff",
            fontSize: "15px", fontWeight: "900", cursor: "pointer",
            letterSpacing: "2px", boxShadow: "0 0 30px rgba(16,185,129,0.4)"
          }}
        >
          CLAIM MILESTONE REWARD & CONTINUE
        </button>
      </div>
    );
  }

  if (gameState === "defeat") {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        height: "100%", padding: "40px", textAlign: "center", gap: "24px",
        fontFamily: "'Cinzel', serif"
      }}>
        <div style={{ fontSize: "64px", filter: "drop-shadow(0 0 30px rgba(239,68,68,0.8))" }}>
          [DEFEAT]
        </div>
        <div style={{ fontSize: "14px", color: "#ef4444", letterSpacing: "4px", fontWeight: "900" }}>
          YOU DIED
        </div>
        <h2 style={{ fontSize: "32px", color: "#f8fafc", margin: 0, textShadow: "0 0 15px rgba(239,68,68,0.6)" }}>
          CONFRONTATION FAILED
        </h2>
        <p style={{ fontSize: "15px", color: "#94a3b8", maxWidth: "440px", lineHeight: "1.6" }}>
          The boss overwhelmed your syntax defenses. Review the lesson material and return to conquer!
        </p>

        <div style={{ display: "flex", gap: "16px" }}>
          <button
            onClick={() => { sound.playClockTick(); onClose(); }}
            style={{
              padding: "14px 28px", background: "transparent",
              border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: "10px",
              color: "#94a3b8", fontSize: "13px", fontWeight: "700", cursor: "pointer"
            }}
          >
            RETREAT
          </button>
          <button
            onClick={() => { sound.playClockTick(); onRetry(); }}
            style={{
              padding: "14px 28px",
              background: "linear-gradient(135deg, #c8102e 0%, #800000 100%)",
              border: "1.5px solid #ff4d4d", borderRadius: "10px",
              color: "#fff", fontSize: "14px", fontWeight: "900", cursor: "pointer",
              boxShadow: "0 0 20px rgba(200,16,46,0.4)"
            }}
          >
            RETRY CONFRONTATION
          </button>
        </div>
      </div>
    );
  }

  return null;
}
