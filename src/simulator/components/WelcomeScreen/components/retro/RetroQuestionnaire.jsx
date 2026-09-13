import * as sound from "../../../../utils/audio";

export default function RetroQuestionnaire({
  currentThemeColor,
  textColor,
  textMuted,
  cardBorder,
  isDarkMode,
  activeQuestions,
  onboardingQ,
  setOnboardingQ,
  onboardingAnswers,
  setOnboardingAnswers,
  onboardingInputVal,
  setOnboardingInputVal,
  typedQuestion,
  isTypingQuestion,
  pathfinderMode,
  setPathfinderMode,
  setSignUpStep
}) {
  const handleQuestionNext = () => {
    if (!onboardingInputVal.trim()) return;
    sound.playClockTick();

    const newAnswers = [...onboardingAnswers];
    newAnswers[onboardingQ] = onboardingInputVal.trim();
    setOnboardingAnswers(newAnswers);

    if (onboardingQ < 4) {
      const nextQ = onboardingQ + 1;
      setOnboardingQ(nextQ);
      setOnboardingInputVal(newAnswers[nextQ] || "");
    } else {
      setSignUpStep(3);
    }
  };

  const handleQuestionBack = () => {
    sound.playClockTick();
    if (pathfinderMode && onboardingQ === 0) {
      setPathfinderMode(null);
    } else if (onboardingQ > 0) {
      const prevQ = onboardingQ - 1;
      setOnboardingQ(prevQ);
      setOnboardingInputVal(onboardingAnswers[prevQ] || "");
    } else {
      setSignUpStep(1);
    }
  };

  const handleQuestionKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleQuestionNext();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", justifyContent: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "11px", color: textMuted, fontWeight: "900", letterSpacing: "3px", textTransform: "uppercase" }}>
          ▶ PATHFINDER QUESTIONNAIRE [{onboardingQ + 1}/5]
        </span>
        <span style={{ fontSize: "11px", color: currentThemeColor, fontWeight: "900" }}>
          {Math.round(((onboardingQ) / 5) * 100)}% COMPLETE
        </span>
      </div>

      <div style={{
        background: isDarkMode ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.6)",
        border: `2px solid ${currentThemeColor}44`,
        borderRadius: "10px", padding: "20px",
        display: "flex", flexDirection: "column", gap: "12px"
      }}>
        <h2 style={{ fontSize: "18px", fontWeight: "900", color: textColor, minHeight: "48px", letterSpacing: "1px", margin: 0, lineHeight: "1.3" }}>
          {typedQuestion}
          {isTypingQuestion && (
            <span className="retro-arcade-blink" style={{ display: "inline-block", width: "2px", height: "18px", background: currentThemeColor, marginLeft: "2px" }} />
          )}
        </h2>
        <div style={{ fontSize: "11px", color: textMuted, letterSpacing: "1px" }}>
          HINT: {activeQuestions[onboardingQ]?.hint.toUpperCase()}
        </div>

        <textarea
          value={onboardingInputVal}
          onChange={e => setOnboardingInputVal(e.target.value)}
          onKeyDown={handleQuestionKeyDown}
          placeholder={activeQuestions[onboardingQ]?.placeholder.toUpperCase()}
          rows={3}
          style={{
            background: isDarkMode ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.9)",
            border: `2px solid ${currentThemeColor}44`,
            borderRadius: "8px",
            color: textColor, padding: "12px 16px", outline: "none", resize: "none",
            fontSize: "15px", fontFamily: "var(--font-gamer)", fontWeight: "bold",
            letterSpacing: "1px", boxSizing: "border-box"
          }}
          onFocus={e => e.currentTarget.style.borderColor = currentThemeColor}
          onBlur={e => e.currentTarget.style.borderColor = `${currentThemeColor}44`}
        />
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="button"
          onClick={handleQuestionBack}
          style={{
            flex: 0.35, border: `2px solid ${cardBorder}`, background: "transparent",
            borderRadius: "8px", color: textMuted, fontFamily: "var(--font-gamer)",
            fontSize: "12px", fontWeight: "900", padding: "14px", cursor: "pointer"
          }}
        >
          BACK
        </button>
        <button
          type="button"
          onClick={handleQuestionNext}
          disabled={!onboardingInputVal.trim()}
          style={{
            flex: 1, background: onboardingInputVal.trim() ? `linear-gradient(90deg, ${currentThemeColor} 0%, #ff8c00 100%)` : "transparent",
            border: `2px solid ${onboardingInputVal.trim() ? textColor : `${currentThemeColor}44`}`,
            borderRadius: "8px", color: onboardingInputVal.trim() ? "#fff" : textMuted,
            fontFamily: "var(--font-gamer)", fontSize: "13px", fontWeight: "900",
            padding: "14px 20px", cursor: onboardingInputVal.trim() ? "pointer" : "not-allowed",
            letterSpacing: "1.5px"
          }}
        >
          {onboardingQ === 4 ? "[ LOCK IN GOALS ]" : "[ CONTINUE ]"}
        </button>
      </div>

      <div style={{ textAlign: "center", marginTop: "12px" }}>
        <button
          type="button"
          onClick={() => { sound.playClockTick(); setSignUpStep(3); }}
          style={{
            background: "transparent", border: "none", color: textMuted,
            fontFamily: "var(--font-gamer)", fontSize: "11px", fontWeight: "bold",
            cursor: "pointer", letterSpacing: "1px", textDecoration: "underline", padding: 0
          }}
        >
          [ SKIP DIRECTLY TO ACCOUNT CREATION ]
        </button>
      </div>
    </div>
  );
}
