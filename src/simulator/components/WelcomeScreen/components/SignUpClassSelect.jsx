import * as sound from "../../../utils/audio";
import { ENHANCED_CLASSES } from "../constants";

export default function SignUpClassSelect({
  setAuthMode,
  setSignUpStep,
  isDarkMode,
  currentThemeColor,
  activeClass,
  classStats,
  selectedClassIdx,
  textColor,
  textMuted
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0", minHeight: "0" }}>
      <button
        onClick={() => { sound.playClockTick(); setAuthMode("menu"); }}
        style={{ background: "transparent", border: "none", color: textMuted, cursor: "pointer", fontSize: "12px", fontWeight: "700", textAlign: "left", padding: "0 0 20px 0", letterSpacing: "1px" }}
      >
        ← BACK
      </button>

      {/* Title */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ fontFamily: "var(--font-gamer)", fontSize: "13px", fontWeight: "900", letterSpacing: "4px", color: textMuted, textTransform: "uppercase", marginBottom: "6px" }}>— Select Your Class —</div>
        <div style={{ fontFamily: "var(--font-gamer)", fontSize: "28px", fontWeight: "900", letterSpacing: "2px", color: textColor }}>
          {activeClass.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
          <div style={{ background: `${currentThemeColor}22`, border: `1px solid ${currentThemeColor}66`, borderRadius: "20px", padding: "4px 12px", fontSize: "11px", fontWeight: "800", color: currentThemeColor, letterSpacing: "1px", transition: "all 0.3s" }}>
            {selectedClassIdx + 1} / {ENHANCED_CLASSES.length}
          </div>
          <div style={{ fontSize: "11px", color: textMuted, letterSpacing: "0.5px" }}>Use arrows on right →</div>
        </div>
      </div>

      {/* Description card */}
      <div style={{
        background: isDarkMode ? `${currentThemeColor}0a` : `${currentThemeColor}08`,
        border: `1.5px solid ${currentThemeColor}30`,
        borderRadius: "16px", padding: "20px",
        marginBottom: "28px", transition: "all 0.35s ease"
      }}>
        <div style={{ fontSize: "12px", color: textMuted, lineHeight: "1.7", marginBottom: "18px" }}>
          {activeClass.description}
        </div>
        {/* Stat bars */}
        {[
          { label: "FOCUS", value: classStats.focus },
          { label: "SPEED", value: classStats.speed },
          { label: "CHAOS", value: classStats.chaos },
          { label: "DEFENSE", value: classStats.defense },
        ].map(s => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "9px" }}>
            <span style={{ fontSize: "10px", color: textMuted, fontWeight: "800", letterSpacing: "1.5px", minWidth: "58px" }}>{s.label}</span>
            <div style={{ flex: 1, height: "6px", background: isDarkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{
                width: `${s.value}%`, height: "100%", borderRadius: "4px",
                background: `linear-gradient(90deg, ${currentThemeColor} 0%, #ff8c00 100%)`,
                transition: "width 0.45s cubic-bezier(0.4,0,0.2,1)",
                boxShadow: `0 0 8px ${currentThemeColor}66`
              }} />
            </div>
            <span style={{ fontSize: "11px", color: currentThemeColor, fontWeight: "900", minWidth: "26px", textAlign: "right", fontFamily: "var(--font-gamer)" }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Unlock preview — first skill */}
      <div style={{ marginBottom: "24px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `${currentThemeColor}22`, border: `1px solid ${currentThemeColor}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>[XP]</div>
        <div>
          <div style={{ fontSize: "10px", fontWeight: "800", color: textMuted, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "3px" }}>STARTER SKILL</div>
          <div style={{ fontSize: "13px", fontWeight: "800", color: currentThemeColor }}>{activeClass.skills[0]?.name}</div>
          <div style={{ fontSize: "11px", color: textMuted, marginTop: "2px", lineHeight: "1.5" }}>{activeClass.skills[0]?.desc}</div>
        </div>
      </div>

      <button
        onClick={() => { sound.playClockTick(); setSignUpStep(2); }}
        style={{
          background: `linear-gradient(135deg, ${currentThemeColor} 0%, #ff8c00 100%)`,
          border: "none", borderRadius: "14px", padding: "17px 20px",
          color: "#fff", fontSize: "15px", fontWeight: "900", letterSpacing: "2px",
          textTransform: "uppercase", cursor: "pointer",
          boxShadow: `0 8px 30px ${currentThemeColor}40`, transition: "all 0.25s",
          width: "100%"
        }}
        onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 14px 40px ${currentThemeColor}55`; }}
        onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 8px 30px ${currentThemeColor}40`; }}
      >
        ▶  LOCK IN — {activeClass.name.split("The ")[1] || activeClass.name}
      </button>

      <button
        type="button"
        onClick={() => { sound.playClockTick(); setSignUpStep(3); }}
        style={{
          background: "transparent",
          border: `1.5px solid ${isDarkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}`,
          borderRadius: "14px",
          padding: "12px 20px",
          color: textColor,
          fontSize: "13px",
          fontWeight: "800",
          letterSpacing: "1px",
          cursor: "pointer",
          transition: "all 0.2s",
          width: "100%",
          marginTop: "12px"
        }}
        onMouseOver={e => e.currentTarget.style.background = isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"}
        onMouseOut={e => e.currentTarget.style.background = "transparent"}
      >
        ⏭️ Skip Pathfinder & Create Account
      </button>

      <div style={{ textAlign: "center", marginTop: "14px" }}>
        <span style={{ fontSize: "12px", color: textMuted }}>Already registered? </span>
        <button type="button" onClick={() => { sound.playClockTick(); setAuthMode("signin"); }} style={{ background: "transparent", border: "none", color: currentThemeColor, fontWeight: "800", cursor: "pointer", fontSize: "12px", padding: 0 }}>
          Sign In →
        </button>
      </div>
    </div>
  );
}
