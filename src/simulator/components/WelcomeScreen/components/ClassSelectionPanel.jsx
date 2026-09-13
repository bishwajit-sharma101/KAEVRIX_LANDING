import * as sound from "../../../utils/audio";
import { ENHANCED_CLASSES } from "../constants";

export default function ClassSelectionPanel({
  authMode,
  signUpStep,
  isDarkMode,
  currentThemeColor,
  ambientGlowColor,
  activeClass,
  classStats,
  textColor,
  textMuted,
  recognizedClass,
  recognizedAvatar,
  avatar,
  isGlitching,
  selectedClassIdx,
  setSelectedClassId,
  carouselDir,
  navigateCarousel
}) {
  return (
    <div style={{
      flex: 1,
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    }}>
      {/* Light Mode Panel Background */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, rgba(255,106,0,0.07) 0%, transparent 65%)",
        opacity: isDarkMode ? 0 : 1,
        transition: "opacity 0.4s ease-in-out",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Dark Mode Panel Background */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at center, ${currentThemeColor}0f 0%, transparent 65%)`,
        opacity: isDarkMode ? 1 : 0,
        transition: "opacity 0.4s ease-in-out",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Decorative background orb (Light Mode) */}
      <div style={{
        position: "absolute",
        width: "420px", height: "420px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,106,0,0.07) 0%, transparent 70%)",
        filter: "blur(50px)",
        opacity: isDarkMode ? 0 : 1,
        transition: "opacity 0.4s ease-in-out",
        pointerEvents: "none",
        zIndex: 1,
      }} />

      {/* Decorative background orb (Dark Mode) */}
      <div style={{
        position: "absolute",
        width: "420px", height: "420px",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${currentThemeColor}12 0%, transparent 70%)`,
        filter: "blur(50px)",
        opacity: isDarkMode ? 1 : 0,
        transition: "opacity 0.4s ease-in-out",
        pointerEvents: "none",
        zIndex: 1,
      }} />

      {/* Concentric ring decorations */}
      <div style={{
        position: "absolute",
        width: "380px", height: "380px",
        borderRadius: "50%",
        border: `1px solid ${ambientGlowColor}${isDarkMode ? "18" : "22"}`,
        animation: "portalOrbitalSpin 30s linear infinite",
        pointerEvents: "none",
        transition: "border-color 0.4s ease-in-out",
        zIndex: 2,
      }} />
      <div style={{
        position: "absolute",
        width: "280px", height: "280px",
        borderRadius: "50%",
        border: `1px dashed ${ambientGlowColor}${isDarkMode ? "22" : "18"}`,
        animation: "portalOrbitalSpin 20s linear infinite reverse",
        pointerEvents: "none",
        transition: "border-color 0.4s ease-in-out",
        zIndex: 2,
      }} />

      {/* Glowing projector pad at the bottom (Light Mode) */}
      <div style={{
        position: "absolute",
        bottom: "120px",
        width: "220px", height: "28px",
        background: "radial-gradient(ellipse, rgba(255,106,0,0.35) 0%, transparent 75%)",
        borderRadius: "50%",
        filter: "blur(8px)",
        opacity: isDarkMode ? 0 : 1,
        transition: "opacity 0.4s ease-in-out",
        pointerEvents: "none",
        zIndex: 2,
      }} />

      {/* Glowing projector pad at the bottom (Dark Mode) */}
      <div style={{
        position: "absolute",
        bottom: "120px",
        width: "220px", height: "28px",
        background: `radial-gradient(ellipse, ${currentThemeColor}99 0%, transparent 75%)`,
        borderRadius: "50%",
        filter: "blur(8px)",
        opacity: isDarkMode ? 1 : 0,
        transition: "opacity 0.4s ease-in-out",
        pointerEvents: "none",
        zIndex: 2,
      }} />

      {/* Light cone (Light Mode) */}
      <div style={{
        position: "absolute",
        bottom: "120px",
        width: "240px", height: "340px",
        background: "linear-gradient(to top, rgba(255,106,0,0.11) 0%, transparent 75%)",
        clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
        opacity: isDarkMode ? 0 : 1,
        transition: "opacity 0.4s ease-in-out",
        pointerEvents: "none",
        zIndex: 2,
      }} />

      {/* Light cone (Dark Mode) */}
      <div style={{
        position: "absolute",
        bottom: "120px",
        width: "240px", height: "340px",
        background: `linear-gradient(to top, ${currentThemeColor}25 0%, transparent 75%)`,
        clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
        opacity: isDarkMode ? 1 : 0,
        transition: "opacity 0.4s ease-in-out",
        pointerEvents: "none",
        zIndex: 2,
      }} />

      {/* CAROUSEL NAV ARROWS (only during class select) */}
      {authMode === "signup" && signUpStep === 1 && (
        <>
          {/* Left Arrow */}
          <button
            onClick={() => navigateCarousel('left')}
            style={{
              position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)",
              zIndex: 10, width: "52px", height: "52px", borderRadius: "50%",
              background: isDarkMode ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.65)",
              border: `2px solid ${currentThemeColor}88`,
              color: currentThemeColor, fontSize: "26px", fontWeight: "900",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s ease",
              boxShadow: `0 0 20px ${currentThemeColor}33`,
              backdropFilter: "blur(8px)"
            }}
            onMouseOver={e => { e.currentTarget.style.background = currentThemeColor; e.currentTarget.style.color = "#fff"; }}
            onMouseOut={e => { e.currentTarget.style.background = isDarkMode ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.65)"; e.currentTarget.style.color = currentThemeColor; }}
            title="Previous Class (Left Arrow)"
          >‹</button>

          {/* Right Arrow */}
          <button
            onClick={() => navigateCarousel('right')}
            style={{
              position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)",
              zIndex: 10, width: "52px", height: "52px", borderRadius: "50%",
              background: isDarkMode ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.65)",
              border: `2px solid ${currentThemeColor}88`,
              color: currentThemeColor, fontSize: "26px", fontWeight: "900",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s ease",
              boxShadow: `0 0 20px ${currentThemeColor}33`,
              backdropFilter: "blur(8px)"
            }}
            onMouseOver={e => { e.currentTarget.style.background = currentThemeColor; e.currentTarget.style.color = "#fff"; }}
            onMouseOut={e => { e.currentTarget.style.background = isDarkMode ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.65)"; e.currentTarget.style.color = currentThemeColor; }}
            title="Next Class (Right Arrow)"
          >›</button>
        </>
      )}

      {/* Character Projection Avatar */}
      <div style={{
        position: "relative",
        zIndex: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: "translateY(-10px)"
      }}>
        {/* Floating dialog prompt bubble */}
        <div style={{
          position: "absolute", top: "-55px",
          background: isDarkMode ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.9)",
          border: `2px solid ${currentThemeColor}`, borderRadius: "12px",
          padding: "8px 16px", fontSize: "11px", fontFamily: "var(--font-gamer)",
          letterSpacing: "1.5px", color: textColor, zIndex: 4,
          boxShadow: isDarkMode ? `0 0 20px ${currentThemeColor}44` : "0 4px 15px rgba(0,0,0,0.08)",
          whiteSpace: "nowrap"
        }}>
          {signUpStep === 2 ? "DEFINING GOALS..." : signUpStep === 3 ? "READY TO ENROLL..." : (authMode === "signup" ? "SELECTING ARCHETYPE..." : (recognizedClass ? `${activeClass.name.toUpperCase()} LOADED` : "AWAITING USER KEY..."))}
        </div>

        {/* Bot Avatar Image */}
        <div
          className="portal-projector-glow"
          style={{
            width: "280px", height: "280px",
            position: "relative",
            animation: carouselDir ? `carouselSlide${carouselDir === 'right' ? 'Out' : 'In'} 0.18s ease` : "portalFloat 5s ease-in-out infinite",
            filter: `drop-shadow(0 0 35px ${currentThemeColor}aa)`
          }}
        >
          <img
            src={authMode === "signin" && recognizedAvatar ? recognizedAvatar : avatar}
            alt={activeClass.name}
            className={isGlitching ? "glitch-active" : ""}
            style={{
              width: "100%", height: "100%", objectFit: "contain",
              transform: "scale(1.1)",
              transition: "all 0.3s ease"
            }}
          />
        </div>

        {/* Class badge under avatar */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
          marginTop: "12px"
        }}>
          <div style={{
            background: isDarkMode ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.9)",
            border: `2px solid ${currentThemeColor}`,
            borderRadius: "20px", padding: "6px 20px",
            display: "flex", alignItems: "center", gap: "10px",
            boxShadow: `0 4px 20px ${currentThemeColor}44`,
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease"
          }}>
            <span style={{ fontSize: "18px" }}>{activeClass.icon}</span>
            <span style={{
              fontFamily: "var(--font-gamer)", fontSize: "14px", fontWeight: "900",
              letterSpacing: "2px", color: ambientGlowColor, textTransform: "uppercase"
            }}>{activeClass.name}</span>
          </div>
          {/* Dot indicators under class badge — only during Step 1 */}
          {authMode === "signup" && signUpStep === 1 ? (
            <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
              {ENHANCED_CLASSES.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => { sound.playClockTick(); setSelectedClassId(c.id); }}
                  style={{
                    width: i === selectedClassIdx ? "22px" : "7px", height: "7px",
                    borderRadius: "4px", border: "none", padding: 0, cursor: "pointer",
                    background: i === selectedClassIdx ? currentThemeColor : (isDarkMode ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.18)"),
                    transition: "all 0.25s ease",
                  }}
                />
              ))}
            </div>
          ) : (
            <div style={{ fontSize: "10px", color: "#10b981", fontWeight: "800", letterSpacing: "2px", textTransform: "uppercase" }}>
              ● SYSTEM ONLINE
            </div>
          )}
        </div>
      </div>

      {/* Stats mini display top-right corner — hide during class select (shown in left panel) */}
      {authMode !== "signup" || signUpStep !== 1 ? (
      <div style={{
        position: "absolute", top: "30px", right: "30px",
        display: "flex", flexDirection: "column", gap: "8px",
        opacity: 0.6,
        pointerEvents: "none",
      }}>
        {[
          { label: "FOCUS", value: classStats.focus },
          { label: "SPEED", value: classStats.speed },
          { label: "CHAOS", value: classStats.chaos },
        ].map(s => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "9px", color: textMuted, fontWeight: "800", letterSpacing: "1px", width: "40px" }}>{s.label}</span>
            <div style={{ width: "70px", height: "4px", background: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(255,106,0,0.12)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ width: `${s.value}%`, height: "100%", background: ambientGlowColor, borderRadius: "2px", transition: "width 0.4s ease" }} />
            </div>
            <span style={{ fontSize: "9px", color: ambientGlowColor, fontWeight: "800" }}>{s.value}</span>
          </div>
        ))}
      </div>
      ) : null}

      {/* Kaevrix watermark + tagline bottom left */}
      <div style={{
        position: "absolute", bottom: "30px", left: "30px",
        opacity: 0.35, pointerEvents: "none",
        fontFamily: "'Courier New', monospace", fontSize: "9px",
        color: textColor, lineHeight: "1.6"
      }}>
        <div>SYS: ONLINE</div>
        <div>ARENA: READY</div>
        <div>v2.5 // KAEVRIX</div>
      </div>

    </div>
  );
}
