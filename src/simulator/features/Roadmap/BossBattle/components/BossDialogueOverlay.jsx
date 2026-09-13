import * as sound from "../../../../utils/audio";
import { getDialogueScript } from "../constants";

export default function BossDialogueOverlay({
  enemyConfig,
  topic,
  dialogueStage,
  setDialogueStage,
  selectedResponse1,
  setSelectedResponse1,
  onStartCombat,
  onAbandon
}) {
  const enemyName = enemyConfig?.name || "Snake";
  const script = getDialogueScript(enemyName, topic);

  const handleResponse1 = (idx) => {
    sound.playClockTick();
    setSelectedResponse1(idx);
    setDialogueStage(1);
  };

  const handleResponse2 = () => {
    sound.playClockTick();
    setDialogueStage(2);
  };

  const handleEngageBoss = () => {
    sound.playClockTick();
    onStartCombat();
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      padding: "40px",
      justifyContent: "space-between",
      fontFamily: "'Cinzel', 'Times New Roman', serif"
    }}>
      {/* Top Banner: Boss Identity */}
      <div style={{ textAlign: "center", borderBottom: "2px solid rgba(200, 16, 46, 0.4)", paddingBottom: "16px" }}>
        <div style={{ fontSize: "11px", color: "#c8102e", letterSpacing: "4px", fontWeight: "900", textTransform: "uppercase" }}>
          — FOUL CONFRONTATION —
        </div>
        <h2 style={{ fontSize: "28px", color: "#e2e8f0", letterSpacing: "3px", margin: "6px 0 0 0", textShadow: "0 0 10px rgba(200,16,46,0.6)" }}>
          {enemyName.toUpperCase()} ARCHETYPE
        </h2>
      </div>

      {/* Dialogue Dialogue Box */}
      <div style={{
        background: "rgba(10, 10, 15, 0.85)",
        border: "1.5px solid rgba(200, 16, 46, 0.5)",
        borderRadius: "16px",
        padding: "28px 36px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
        backdropFilter: "blur(8px)"
      }}>
        {dialogueStage === 0 && (
          <>
            <p style={{ fontSize: "17px", color: "#f8fafc", lineHeight: "1.7", fontStyle: "italic", margin: 0 }}>
              "{script.greeting}"
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
              {script.responses1.map((resp, i) => (
                <button
                  key={i}
                  onClick={() => handleResponse1(i)}
                  style={{
                    textAlign: "left",
                    padding: "14px 20px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(200,16,46,0.3)",
                    borderRadius: "10px",
                    color: "#cbd5e1",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontFamily: "inherit"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#c8102e"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(200,16,46,0.3)"; e.currentTarget.style.color = "#cbd5e1"; }}
                >
                  ▶ {resp}
                </button>
              ))}
            </div>
          </>
        )}

        {dialogueStage === 1 && (
          <>
            <p style={{ fontSize: "17px", color: "#f8fafc", lineHeight: "1.7", fontStyle: "italic", margin: 0 }}>
              "{script.reactions1[selectedResponse1 || 0]}"
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
              {script.responses2.map((resp, i) => (
                <button
                  key={i}
                  onClick={handleResponse2}
                  style={{
                    textAlign: "left",
                    padding: "14px 20px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(200,16,46,0.3)",
                    borderRadius: "10px",
                    color: "#cbd5e1",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontFamily: "inherit"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#c8102e"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(200,16,46,0.3)"; e.currentTarget.style.color = "#cbd5e1"; }}
                >
                  ▶ {resp}
                </button>
              ))}
            </div>
          </>
        )}

        {dialogueStage === 2 && (
          <>
            <p style={{ fontSize: "18px", color: "#ff4d4d", lineHeight: "1.7", fontWeight: "bold", textAlign: "center", margin: 0, textShadow: "0 0 15px rgba(255,0,0,0.5)" }}>
              "{script.finalThreat}"
            </p>

            <button
              onClick={handleEngageBoss}
              style={{
                marginTop: "16px",
                padding: "16px 32px",
                background: "linear-gradient(135deg, #c8102e 0%, #800000 100%)",
                border: "2px solid #ff4d4d",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "900",
                letterSpacing: "2px",
                cursor: "pointer",
                boxShadow: "0 0 30px rgba(200,16,46,0.5)",
                fontFamily: "inherit",
                textTransform: "uppercase"
              }}
            >
              [VS]️ CONFRONT BOSS IN COMBAT
            </button>
          </>
        )}
      </div>

      {/* Footer Abandon Button */}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={onAbandon}
          style={{ background: "transparent", border: "none", color: "#64748b", fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}
        >
          [ RETREAT FROM COMBAT ]
        </button>
      </div>
    </div>
  );
}
