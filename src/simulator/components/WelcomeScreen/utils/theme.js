import { ENHANCED_CLASSES, CLASS_STATS } from "../constants";

export const getActiveClassTheme = (authMode, recognizedClass, selectedClassId) => {
  const activeClassIdToMatch = authMode === "signin" && recognizedClass ? recognizedClass : selectedClassId;
  const activeClass = ENHANCED_CLASSES.find(c => c.id === activeClassIdToMatch) || ENHANCED_CLASSES[0];
  const currentThemeColor = activeClass.themeColor;
  const classStats = CLASS_STATS[activeClass.id] || { focus: 50, speed: 50, disruption: 50, defense: 50, chaos: 50 };

  return {
    activeClass,
    currentThemeColor,
    classStats
  };
};

export const getThemeStyles = (isDarkMode, currentThemeColor) => {
  const overlayBg = isDarkMode 
    ? "radial-gradient(ellipse at top, #111827 0%, #000000 100%)" 
    : "radial-gradient(160deg, #fff7ed 0%, #ffedd5 55%, #ffe8cc 100%)";
  const textColor = isDarkMode ? "#ffffff" : "#1c0a00";
  const textMuted = isDarkMode ? "#9ca3af" : "#92400e";
  const cardBgBase = isDarkMode ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.7)";
  const cardBorder = isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(255,106,0,0.2)";
  const inputBg = isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.95)";
  const labelColor = isDarkMode ? "#9ca3af" : "#92400e";
  const footerBg = isDarkMode ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.85)";
  const ambientGlowColor = isDarkMode ? currentThemeColor : "#ff6a00";

  return {
    overlayBg,
    textColor,
    textMuted,
    cardBgBase,
    cardBorder,
    inputBg,
    labelColor,
    footerBg,
    ambientGlowColor
  };
};
