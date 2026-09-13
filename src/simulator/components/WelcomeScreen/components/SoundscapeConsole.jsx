import { useState } from "react";
import * as sound from "../../../utils/audio";

export default function SoundscapeConsole({
  isDarkMode,
  cardBorder,
  textColor,
  textMuted,
  musicProfile,
  setMusicProfile,
  keepMusicInGame,
  setKeepMusicInGame
}) {
  const [showMusicSettings, setShowMusicSettings] = useState(false);

  return (
    <div style={{ position: "absolute", top: "20px", right: "120px", zIndex: 9999, display: "flex", gap: "8px", alignItems: "center" }}>
      <button 
        onClick={() => { sound.playClockTick(); setShowMusicSettings(!showMusicSettings); }}
        style={{ background: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)", border: `1px solid ${cardBorder}`, borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
        title="Soundscape Console"
      >
        [TRACK]
      </button>

      {showMusicSettings && (
        <div style={{
          position: "absolute", top: "50px", right: 0, zIndex: 10000,
          width: "280px", background: isDarkMode ? "#111827" : "#ffffff",
          border: "1px solid var(--neon-orange)", borderRadius: "16px",
          padding: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          display: "flex", flexDirection: "column", gap: "12px",
          fontFamily: "var(--font-sans)",
          color: textColor
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--glass-border)", paddingBottom: "8px" }}>
            <span style={{ fontFamily: "var(--font-gamer)", fontSize: "12px", fontWeight: "900", color: "var(--neon-orange)", letterSpacing: "1px" }}>SOUNDSCAPE CONSOLE</span>
            <button 
              onClick={() => { sound.playClockTick(); setShowMusicSettings(false); }}
              style={{ background: "transparent", border: "none", color: textMuted, cursor: "pointer", fontSize: "14px" }}
            >
              X
            </button>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "11px", fontWeight: "bold", color: textMuted, letterSpacing: "0.5px" }}>SELECT STATION:</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxHeight: "150px", overflowY: "auto", paddingRight: "4px" }}>
              {sound.MUSIC_PROFILES.map((p, idx) => {
                const isActive = musicProfile === idx;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      sound.playClockTick();
                      setMusicProfile(idx);
                      localStorage.setItem("kaevrix_music_profile", String(idx));
                    }}
                    style={{
                      textAlign: "left", padding: "8px 12px", borderRadius: "8px",
                      background: isActive ? "var(--accent-gradient)" : "transparent",
                      border: `1px solid ${isActive ? "transparent" : "var(--glass-border)"}`,
                      color: isActive ? "#ffffff" : textColor,
                      cursor: "pointer", fontSize: "12px", transition: "all 0.2s"
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>{p.name}</div>
                    <div style={{ fontSize: "10px", opacity: isActive ? 0.9 : 0.6, marginTop: "2px" }}>{p.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", borderTop: "1px solid var(--glass-border)", paddingTop: "10px", marginTop: "4px" }}>
            <input
              type="checkbox"
              id="keepMusicInGameWelcome"
              checked={keepMusicInGame}
              onChange={(e) => {
                sound.playClockTick();
                const val = e.target.checked;
                setKeepMusicInGame(val);
                localStorage.setItem("kaevrix_music_in_game", String(val));
              }}
              style={{ cursor: "pointer", accentColor: "var(--neon-orange)" }}
            />
            <label htmlFor="keepMusicInGameWelcome" style={{ fontSize: "11px", fontWeight: "600", color: textColor, cursor: "pointer" }}>
              Keep playing during matches
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
