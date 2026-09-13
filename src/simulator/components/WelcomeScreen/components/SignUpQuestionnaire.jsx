import * as sound from "../../../utils/audio";
import { useTypewriter } from "../hooks/useTypewriter";

export default function SignUpQuestionnaire({
  setSignUpStep,
  pathfinderMode,
  setPathfinderMode,
  activeQuestions,
  onboardingQ,
  setOnboardingQ,
  onboardingAnswers,
  setOnboardingAnswers,
  onboardingInputVal,
  setOnboardingInputVal,
  isDarkMode,
  currentThemeColor,
  textColor,
  textMuted,
  labelColor,
  authMode,
  signUpStep
}) {
  const { typedQuestion, isTypingQuestion } = useTypewriter(activeQuestions, onboardingQ, signUpStep, authMode, pathfinderMode);

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

  if (!pathfinderMode) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        <button
          onClick={() => { sound.playClockTick(); setSignUpStep(1); }}
          style={{ background: "transparent", border: "none", color: textMuted, cursor: "pointer", fontSize: "12px", fontWeight: "700", textAlign: "left", padding: "0 0 20px 0", letterSpacing: "1px" }}
        >
          ← BACK
        </button>
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontFamily: "var(--font-gamer)", fontSize: "20px", fontWeight: "900", letterSpacing: "2px", color: textColor, textTransform: "uppercase" }}>
            Select Pathfinder Mode
          </div>
          <div style={{ fontSize: "12px", color: textMuted, marginTop: "8px" }}>
            Choose how you want to build your learning roadmap.
          </div>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <button
            onClick={() => { sound.playClockTick(); setPathfinderMode("quick"); setOnboardingQ(0); setOnboardingInputVal(""); }}
            style={{
              background: isDarkMode ? `${currentThemeColor}11` : `${currentThemeColor}0a`,
              border: `1.5px solid ${currentThemeColor}44`,
              borderRadius: "16px", padding: "20px",
              textAlign: "left", cursor: "pointer", transition: "all 0.2s"
            }}
            onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseOut={e => e.currentTarget.style.transform = "none"}
          >
            <div style={{ fontSize: "16px", fontWeight: "900", color: currentThemeColor, marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>[XP]</span> Quick Setup
            </div>
            <div style={{ fontSize: "12px", color: textMuted, lineHeight: "1.5" }}>
              Standard 5 questions to build your path quickly. Ideal for straightforward topics.
            </div>
          </button>

          <button
            onClick={() => { sound.playClockTick(); setPathfinderMode("detailed"); setOnboardingQ(0); setOnboardingInputVal(""); }}
            style={{
              background: isDarkMode ? `${currentThemeColor}11` : `${currentThemeColor}0a`,
              border: `1.5px solid ${currentThemeColor}44`,
              borderRadius: "16px", padding: "20px",
              textAlign: "left", cursor: "pointer", transition: "all 0.2s"
            }}
            onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseOut={e => e.currentTarget.style.transform = "none"}
          >
            <div style={{ fontSize: "16px", fontWeight: "900", color: currentThemeColor, marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>[ARCH]</span> Deep Dive
            </div>
            <div style={{ fontSize: "12px", color: textMuted, lineHeight: "1.5" }}>
              Open-ended questions about your problems, goals, and learning style for a highly tailored AI roadmap.
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      <button
        onClick={handleQuestionBack}
        style={{ background: "transparent", border: "none", color: textMuted, cursor: "pointer", fontSize: "12px", fontWeight: "700", textAlign: "left", padding: "0 0 20px 0", letterSpacing: "1px" }}
      >
        ← BACK
      </button>

      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <span style={{ fontSize: "11px", fontWeight: "800", color: labelColor, letterSpacing: "1px", textTransform: "uppercase" }}>
            QUESTION {onboardingQ + 1} OF 5
          </span>
          <span style={{ fontSize: "12px", fontWeight: "800", color: currentThemeColor }}>
            {Math.round(((onboardingQ) / 5) * 100)}% COMPLETE
          </span>
        </div>
        <div style={{ height: "4px", background: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${((onboardingQ) / 5) * 100}%`, background: `linear-gradient(90deg, ${currentThemeColor} 0%, #ff8c00 100%)`, transition: "width 0.3s ease" }} />
        </div>
      </div>

      <div style={{
        background: isDarkMode ? `${currentThemeColor}05` : `${currentThemeColor}03`,
        border: `1.5px solid ${currentThemeColor}20`,
        borderRadius: "16px", padding: "24px",
        marginBottom: "20px"
      }}>
        <h2 style={{ fontSize: "20px", fontWeight: "800", color: textColor, marginBottom: "8px", lineHeight: "1.4", minHeight: "56px" }}>
          {typedQuestion}
          {isTypingQuestion && (
            <span className="retro-arcade-blink" style={{ display: "inline-block", width: "2px", height: "20px", background: currentThemeColor, marginLeft: "2px", verticalAlign: "middle" }} />
          )}
        </h2>
        <p style={{ color: textMuted, fontSize: "12px", marginBottom: "18px", lineHeight: "1.5" }}>
          [TIP] {activeQuestions[onboardingQ]?.hint}
        </p>

        <textarea
          value={onboardingInputVal}
          onChange={e => setOnboardingInputVal(e.target.value)}
          onKeyDown={handleQuestionKeyDown}
          placeholder={activeQuestions[onboardingQ]?.placeholder}
          rows={3}
          style={{
            width: "100%", background: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
            border: `1.5px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)"}`,
            color: textColor, padding: "14px 18px", borderRadius: "12px",
            fontSize: "14px", fontWeight: "700", outline: "none", resize: "none",
            fontFamily: "'Inter', sans-serif", lineHeight: "1.5", transition: "all 0.25s",
            boxSizing: "border-box"
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = currentThemeColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${currentThemeColor}18`; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)"; e.currentTarget.style.boxShadow = "none"; }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
        <button
          onClick={handleQuestionBack}
          style={{
            flex: 0.35, background: "transparent", border: `1.5px solid ${isDarkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
            borderRadius: "12px", color: textMuted, fontWeight: "800", fontSize: "13px",
            padding: "14px", cursor: "pointer", transition: "all 0.2s"
          }}
        >
          BACK
        </button>
        <button
          onClick={handleQuestionNext}
          disabled={!onboardingInputVal.trim()}
          style={{
            flex: 1,
            background: onboardingInputVal.trim() ? `linear-gradient(135deg, ${currentThemeColor} 0%, #ff8c00 100%)` : (isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"),
            border: "none", borderRadius: "12px",
            color: onboardingInputVal.trim() ? "#fff" : textMuted,
            fontSize: "14px", fontWeight: "900", letterSpacing: "1px",
            textTransform: "uppercase", cursor: onboardingInputVal.trim() ? "pointer" : "not-allowed",
            boxShadow: onboardingInputVal.trim() ? `0 6px 20px ${currentThemeColor}33` : "none",
            transition: "all 0.25s"
          }}
        >
          {onboardingQ === 4 ? "CONFIRM GOALS →" : "CONTINUE →"}
        </button>
      </div>

      <div style={{ textAlign: "center", marginTop: "18px" }}>
        <button
          type="button"
          onClick={() => { sound.playClockTick(); setSignUpStep(3); }}
          style={{
            background: "transparent",
            border: "none",
            color: textMuted,
            fontWeight: "700",
            cursor: "pointer",
            fontSize: "12px",
            textDecoration: "underline",
            padding: 0
          }}
        >
          Skip Interview & Skip Directly to Account Creation
        </button>
      </div>
    </div>
  );
}
