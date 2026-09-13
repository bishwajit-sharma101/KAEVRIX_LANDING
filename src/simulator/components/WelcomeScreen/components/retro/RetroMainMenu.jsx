import { useState } from "react";
import * as sound from "../../../../utils/audio";

export default function RetroMainMenu({
  currentThemeColor,
  textColor,
  textMuted,
  isDarkMode,
  setIsDarkMode,
  setAuthMode,
  setSignUpStep,
  setRetroShowForm,
  isMusicMuted,
  musicProfile,
  cycleMusicProfile
}) {
  const [hoveredButtonId, setHoveredButtonId] = useState(null);

  const menuItems = [
    { id: "continue", label: "CONTINUE PREVIOUS LEVEL [ LOGIN ]", desc: "Access the arena via signed passkey", action: () => { sound.playClockTick(); setAuthMode("signin"); setRetroShowForm(true); } },
    { id: "newgame", label: "START NEW CAMPAIGN [ SIGN UP ]", desc: "Select battle class and register gamer tag", action: () => { sound.playClockTick(); setAuthMode("signup"); setSignUpStep(1); setRetroShowForm(true); } },
    { id: "toggle", label: `CALIBRATE GRAPHICS: ${isDarkMode ? "DARK MODE" : "LIGHT MODE"}`, desc: "Toggle interface light/dark filters", action: () => { sound.playClockTick(); setIsDarkMode(!isDarkMode); } },
    { 
      id: "music", 
      label: `AMBIENT SOUNDTRACK: [ ${isMusicMuted ? "MUTED" : sound.MUSIC_PROFILES[musicProfile].name.toUpperCase()} ]`, 
      desc: "Current active station. Click to cycle / mute", 
      action: cycleMusicProfile
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px", justifyContent: "center" }}>
      <div className="retro-arcade-blink" style={{ fontSize: "12px", color: "#ff6a00", fontWeight: "900", fontFamily: "var(--font-gamer)", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "5px" }}>
        ● INSERT COIN OR SELECT START
      </div>

      <div style={{ fontSize: "11px", color: textMuted, fontWeight: "900", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "2px" }}>
        ▶ Main Campaign Selection
      </div>

      {menuItems.map(item => (
        <button
          key={item.id}
          onClick={item.action}
          onMouseEnter={() => { sound.playClockTick(true); setHoveredButtonId(item.id); }}
          onMouseLeave={() => setHoveredButtonId(null)}
          style={{
            textAlign: "left", 
            background: hoveredButtonId === item.id 
              ? `${currentThemeColor}1a` 
              : (isDarkMode ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.6)"),
            border: `2px solid ${hoveredButtonId === item.id ? currentThemeColor : (isDarkMode ? `${currentThemeColor}22` : `${currentThemeColor}44`)}`,
            borderRadius: "12px",
            color: hoveredButtonId === item.id ? (isDarkMode ? "#fff" : currentThemeColor) : textColor,
            fontFamily: "var(--font-gamer)", fontSize: "18px", fontWeight: "900",
            letterSpacing: "2.5px", cursor: "pointer", display: "flex", flexDirection: "column",
            gap: "6px", padding: "18px 24px", transition: "all 0.2s ease-out",
            boxShadow: hoveredButtonId === item.id ? `0 0 20px ${currentThemeColor}33` : "none",
            transform: hoveredButtonId === item.id ? "scale(1.02)" : "scale(1)"
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {hoveredButtonId === item.id ? "▶" : "  "} {item.label}
          </span>
          <span style={{ fontSize: "11px", color: textMuted, fontWeight: "normal", paddingLeft: "18px", letterSpacing: "1px" }}>
            {item.desc}
          </span>
        </button>
      ))}
    </div>
  );
}
