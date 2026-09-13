import * as sound from "../../../../utils/audio";
import { ENHANCED_CLASSES } from "../../constants";

export default function RetroClassSelect({
  currentThemeColor,
  textColor,
  textMuted,
  isDarkMode,
  activeClass,
  classStats,
  selectedClassIdx,
  setSelectedClassId,
  carouselDir,
  navigateCarousel,
  setAuthMode,
  setSignUpStep,
  setRetroShowForm
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", justifyContent: "center" }}>
      <div style={{ fontSize: "11px", color: textMuted, fontWeight: "900", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "2px" }}>
        ▶ SELECT CLASS ARCHETYPE · {selectedClassIdx + 1} / {ENHANCED_CLASSES.length}
      </div>

      {/* Retro Carousel Row */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Left Arrow */}
        <button
          onClick={() => navigateCarousel('left')}
          style={{
            width: "48px", height: "56px", flexShrink: 0, borderRadius: "6px",
            background: `${currentThemeColor}18`,
            border: `2px solid ${currentThemeColor}88`,
            color: currentThemeColor, fontSize: "22px", fontWeight: "900",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-gamer)",
            transition: "all 0.15s",
            boxShadow: `0 0 10px ${currentThemeColor}33`
          }}
          onMouseEnter={e => { e.currentTarget.style.background = currentThemeColor; e.currentTarget.style.color = "#000"; }}
          onMouseLeave={e => { e.currentTarget.style.background = `${currentThemeColor}18`; e.currentTarget.style.color = currentThemeColor; }}
        >◄</button>

        {/* Center Character */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{
            width: "100px", height: "100px", borderRadius: "8px",
            border: `3px solid ${currentThemeColor}`,
            background: isDarkMode ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
            boxShadow: `0 0 25px ${currentThemeColor}66, inset 0 0 15px ${currentThemeColor}11`,
            animation: carouselDir ? `carouselSlide${carouselDir === 'right' ? 'Out' : 'In'} 0.18s ease` : "retroCharPulse 2s ease-in-out infinite",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}>
            <img
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${activeClass.avatarSeed || activeClass.id}&backgroundColor=transparent`}
              alt={activeClass.name}
              style={{ width: "85%", height: "85%", objectFit: "contain" }}
            />
          </div>
          <div style={{
            fontFamily: "var(--font-gamer)", fontSize: "14px", fontWeight: "900",
            color: currentThemeColor, letterSpacing: "2px", marginTop: "8px",
            textShadow: `0 0 8px ${currentThemeColor}88`,
            transition: "color 0.2s"
          }}>
            {activeClass.name.toUpperCase()}
          </div>
          <div style={{ fontSize: "10px", color: textMuted, textAlign: "center", maxWidth: "180px", lineHeight: "1.4", marginTop: "4px", fontFamily: "var(--font-gamer)" }}>
            {activeClass.description}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => navigateCarousel('right')}
          style={{
            width: "48px", height: "56px", flexShrink: 0, borderRadius: "6px",
            background: `${currentThemeColor}18`,
            border: `2px solid ${currentThemeColor}88`,
            color: currentThemeColor, fontSize: "22px", fontWeight: "900",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-gamer)",
            transition: "all 0.15s",
            boxShadow: `0 0 10px ${currentThemeColor}33`
          }}
          onMouseEnter={e => { e.currentTarget.style.background = currentThemeColor; e.currentTarget.style.color = "#000"; }}
          onMouseLeave={e => { e.currentTarget.style.background = `${currentThemeColor}18`; e.currentTarget.style.color = currentThemeColor; }}
        >►</button>
      </div>

      {/* Dot Indicators */}
      <div style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
        {ENHANCED_CLASSES.map((c, i) => (
          <button
            key={c.id}
            onClick={() => { sound.playClockTick(); setSelectedClassId(c.id); }}
            style={{
              width: i === selectedClassIdx ? "18px" : "6px", height: "6px",
              borderRadius: "3px", border: "none", padding: 0, cursor: "pointer",
              background: i === selectedClassIdx ? currentThemeColor : `${currentThemeColor}44`,
              transition: "all 0.25s ease",
            }}
          />
        ))}
      </div>

      {/* Stats Bars */}
      <div style={{
        background: isDarkMode ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.6)",
        border: `2px solid ${currentThemeColor}44`,
        borderRadius: "8px", padding: "12px 14px",
        transition: "border-color 0.2s"
      }}>
        {[
          { label: "FOCUS", value: classStats.focus },
          { label: "SPEED", value: classStats.speed },
          { label: "CHAOS", value: classStats.chaos },
          { label: "DEFENSE", value: classStats.defense },
        ].map(s => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "5px" }}>
            <span style={{ fontSize: "9px", color: currentThemeColor, fontWeight: "900", letterSpacing: "1px", minWidth: "48px", fontFamily: "var(--font-gamer)" }}>{s.label}</span>
            <div style={{ flex: 1, height: "4px", background: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{
                width: `${s.value}%`, height: "100%",
                background: `linear-gradient(90deg, ${currentThemeColor} 0%, #ff8c00 100%)`,
                transition: "width 0.4s ease"
              }} />
            </div>
            <span style={{ fontSize: "9px", color: currentThemeColor, fontWeight: "900", minWidth: "24px", textAlign: "right", fontFamily: "var(--font-gamer)" }}>{s.value}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "2px" }}>
        <button
          onClick={() => { sound.playClockTick(); setSignUpStep(2); }}
          style={{
            background: `linear-gradient(90deg, ${currentThemeColor} 0%, #ff8c00 100%)`, border: `2px solid ${textColor}`,
            borderRadius: "10px", color: "#fff", fontFamily: "var(--font-gamer)",
            fontSize: "13px", fontWeight: "900", padding: "14px 20px", cursor: "pointer", letterSpacing: "2px"
          }}
        >
          [ CONFIRM: {activeClass.name.split("The ")[1] || activeClass.name} ]
        </button>
        <button
          type="button"
          onClick={() => { sound.playClockTick(); setSignUpStep(3); }}
          style={{
            background: "transparent", border: `2px dashed ${currentThemeColor}aa`,
            borderRadius: "10px", color: textColor, fontFamily: "var(--font-gamer)",
            fontSize: "12px", fontWeight: "900", padding: "10px 20px", cursor: "pointer", letterSpacing: "1.5px"
          }}
        >
          [ SKIP PATHFINDER & CREATE ACCOUNT ]
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2px" }}>
        <button
          onClick={() => { sound.playClockTick(); setAuthMode("signin"); setRetroShowForm(true); }}
          style={{
            background: "transparent", border: "none", color: currentThemeColor, fontFamily: "var(--font-gamer)",
            fontSize: "12px", fontWeight: "900", cursor: "pointer", letterSpacing: "1px"
          }}
        >
          [ HAVE AN ACCOUNT? SIGN IN ]
        </button>
        
        <button
          onClick={() => { sound.playClockTick(); setRetroShowForm(false); }}
          style={{
            background: "transparent", border: "none", color: textMuted, fontFamily: "var(--font-gamer)",
            fontSize: "12px", fontWeight: "900", cursor: "pointer", letterSpacing: "1px"
          }}
        >
          [ RETURN TO MENU ]
        </button>
      </div>
    </div>
  );
}
