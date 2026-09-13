export default function TerminalBootLoader({ currentThemeColor, terminalLogs }) {
  return (
    <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", position: "relative", zIndex: 10 }}>
      <div style={{
        width: "100%", maxWidth: "600px", borderRadius: "20px",
        background: "#000000eb", border: `2.5px solid ${currentThemeColor}`,
        boxShadow: `0 0 45px ${currentThemeColor}44, inset 0 0 25px ${currentThemeColor}22`,
        padding: "40px", minHeight: "280px",
        fontFamily: "'Courier New', Courier, monospace"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: `1px solid ${currentThemeColor}55`, paddingBottom: "12px", marginBottom: "18px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }} />
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#eab308" }} />
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22c55e" }} />
          <span style={{ color: currentThemeColor, fontSize: "11px", fontWeight: "bold", marginLeft: "10px", letterSpacing: "1.5px" }}>KAEVRIX_ARENA_LOADER_v2.5.bin</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {terminalLogs.map((log, lIdx) => {
            if (!log || typeof log !== "string") return null;
            const isLast = lIdx === terminalLogs.length - 1;
            const isSuccess = log.includes("SUCCESS") || log.includes("SECURE") || log.includes("LOGGED") || log.includes("ACTIVE");
            return (
              <div key={lIdx} style={{ 
                fontSize: "13px", 
                color: isLast ? "#10b981" : (isSuccess ? "#34d399" : `${currentThemeColor}dd`), 
                fontWeight: isLast ? "800" : "500",
                whiteSpace: "nowrap", overflow: "hidden",
                borderRight: isLast ? "2px solid #10b981" : "none",
                animation: isLast ? "caretBlink 0.8s steps(2, start) infinite" : "none"
              }}>
                {log}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
