export default function RetroProjectionPad({
  currentThemeColor,
  textColor,
  isDarkMode,
  avatar,
  isGlitching,
  signUpStep,
  retroShowForm,
  authMode,
  recognizedClass,
  activeClass
}) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", minHeight: "360px" }}>
      {/* Glowing projector pad */}
      <div style={{ 
        width: "200px", height: "24px", 
        background: `radial-gradient(ellipse, ${currentThemeColor} 0%, transparent 75%)`, 
        borderRadius: "50%", filter: `drop-shadow(0 0 12px ${currentThemeColor})`, 
        position: "absolute", bottom: "30px", zIndex: 1 
      }} />
      
      {/* Conical light cone projector */}
      <div style={{ 
        width: "220px", height: "300px", 
        background: `linear-gradient(to top, ${currentThemeColor}2e 0%, transparent 80%)`, 
        clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)", 
        position: "absolute", bottom: "38px", zIndex: 2, pointerEvents: "none" 
      }} />

      {/* Projecting Avatar with breathing idle animation */}
      <div className="retro-breathing-character" style={{ 
        position: "absolute", bottom: "50px", zIndex: 3, 
        width: "220px", height: "220px", 
        filter: `drop-shadow(0 0 25px ${currentThemeColor}dd)` 
      }}>
        <img 
          src={avatar} 
          alt="Projection character" 
          className={isGlitching ? "glitch-active" : ""}
          style={{ width: "100%", height: "100%", objectFit: "contain", transform: "scale(1.08)" }} 
        />
      </div>

      {/* Floating dialog prompt bubble */}
      <div style={{
        position: "absolute", top: "15px", 
        background: isDarkMode ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.9)",
        border: `2px solid ${currentThemeColor}`, borderRadius: "10px",
        padding: "10px 16px", fontSize: "12px", fontFamily: "var(--font-gamer)",
        letterSpacing: "1.5px", color: textColor, zIndex: 4, 
        boxShadow: isDarkMode ? `0 0 20px ${currentThemeColor}44` : "0 4px 15px rgba(0,0,0,0.08)", 
        textAlign: "center",
        transition: "background 0.4s ease-in-out, color 0.4s ease-in-out"
      }}>
        {signUpStep === 2 ? "DEFINING GOALS..." : signUpStep === 3 ? "READY TO ENROLL..." : (retroShowForm && authMode === "signup" ? "SELECTING ARCHETYPE..." : (recognizedClass ? `${activeClass.name.toUpperCase()} LOADED` : "AWAITING USER KEY..."))}
      </div>

      {/* Character Name Badge */}
      <div style={{ position: "absolute", bottom: "-10px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
        <div style={{ fontSize: "16px", fontWeight: "900", color: currentThemeColor, letterSpacing: "2.5px", textTransform: "uppercase", textShadow: isDarkMode ? `0 0 8px ${currentThemeColor}66` : "none" }}>
          {activeClass.name}
        </div>
        <div style={{ fontSize: "10px", color: "#10b981", letterSpacing: "2px", fontWeight: "bold" }}>
          ● STATUS: SYSTEM_ONLINE
        </div>
      </div>
    </div>
  );
}
