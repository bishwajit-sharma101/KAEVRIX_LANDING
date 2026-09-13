import { useState, useEffect } from "react";
import { RETRO_TIPS } from "../../constants";

export default function RetroTicker({ currentThemeColor, isDarkMode }) {
  const [retroTipIdx, setRetroTipIdx] = useState(0);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setRetroTipIdx(prev => (prev + 1) % RETRO_TIPS.length);
    }, 6000);
    return () => clearInterval(tipInterval);
  }, []);

  return (
    <div style={{ marginTop: "auto", paddingTop: "10px", borderTop: `2px double ${currentThemeColor}44` }}>
      <div className="retro-ticker-container" style={{
        background: isDarkMode ? "rgba(0, 0, 0, 0.45)" : "rgba(255, 255, 255, 0.7)",
        border: `1px solid ${isDarkMode ? "rgba(255, 106, 0, 0.15)" : "rgba(255, 106, 0, 0.3)"}`,
        transition: "background 0.4s"
      }}>
        <div className="retro-ticker-text" style={{
          color: isDarkMode ? "#ff8c00" : "#d97706",
          transition: "color 0.4s"
        }}>
          {RETRO_TIPS[retroTipIdx]}
        </div>
      </div>
    </div>
  );
}
