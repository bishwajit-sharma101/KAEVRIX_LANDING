export default function RetroHeader({
  currentThemeColor,
  textColor,
  textMuted,
  isDarkMode
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `3px double ${currentThemeColor}66`, paddingBottom: "15px", marginBottom: "15px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <img src="/logo.png?v=2" alt="Kaevrix Logo" style={{ width: "48px", height: "48px", objectFit: "contain", filter: `drop-shadow(0 0 8px ${currentThemeColor})` }} />
        <div>
          <div style={{ fontSize: "30px", fontWeight: "900", letterSpacing: "4px", color: textColor, textShadow: isDarkMode ? `0 0 8px ${currentThemeColor}bb` : "none" }}>Kaevrix</div>
          <div style={{ fontSize: "11px", color: "#ff6a00", letterSpacing: "3px", fontWeight: "bold", textTransform: "uppercase" }}>Synchronized Watch-&-Quiz Duel</div>
        </div>
      </div>
      
      <div style={{ textAlign: "right", fontFamily: "var(--font-gamer)" }}>
        <div style={{ fontSize: "12px", color: currentThemeColor, fontWeight: "900", letterSpacing: "1.5px" }}>SYS_STATUS: ONLINE</div>
        <div style={{ fontSize: "10px", color: textMuted, letterSpacing: "1px" }}>INSERT COIN / FREE PLAY</div>
      </div>
    </div>
  );
}
