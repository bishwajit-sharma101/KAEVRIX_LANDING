import { useState } from "react";
import RetroHeader from "./retro/RetroHeader";
import RetroProjectionPad from "./retro/RetroProjectionPad";
import RetroMainMenu from "./retro/RetroMainMenu";
import RetroSignInForm from "./retro/RetroSignInForm";
import RetroClassSelect from "./retro/RetroClassSelect";
import RetroQuestionnaire from "./retro/RetroQuestionnaire";
import RetroCredentialsForm from "./retro/RetroCredentialsForm";
import RetroTicker from "./retro/RetroTicker";

export default function RetroArcadePortal({
  isDarkMode,
  setIsDarkMode,
  currentThemeColor,
  textColor,
  textMuted,
  cardBorder,
  activeClass,
  classStats,
  recognizedClass,
  avatar,
  isGlitching,
  handleShuffleAvatar,
  authMode,
  setAuthMode,
  signUpStep,
  setSignUpStep,
  selectedClassIdx,
  setSelectedClassId,
  carouselDir,
  navigateCarousel,
  pathfinderMode,
  setPathfinderMode,
  activeQuestions,
  onboardingQ,
  setOnboardingQ,
  onboardingAnswers,
  setOnboardingAnswers,
  onboardingInputVal,
  setOnboardingInputVal,
  typedQuestion,
  isTypingQuestion,
  terminalLogs,
  startTerminalSequence,
  onAuthSuccess,
  isMusicMuted,
  musicProfile,
  cycleMusicProfile
}) {
  const [retroShowForm, setRetroShowForm] = useState(false);

  return (
    <div className="retro-crt-screen retro-flicker" style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: isDarkMode ? "#070913" : "#fff7ed",
      border: `8px double ${currentThemeColor}`,
      padding: "35px 50px",
      boxShadow: isDarkMode 
        ? `inset 0 0 100px rgba(0,0,0,0.95), 0 0 60px ${currentThemeColor}33`
        : `inset 0 0 100px rgba(255,247,237,0.1), 0 0 30px rgba(255,106,0,0.15)`,
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      zIndex: 9998,
      fontFamily: "var(--font-gamer)",
      color: textColor,
      boxSizing: "border-box",
      overflow: "hidden",
      transition: "background 0.4s ease-in-out, color 0.4s ease-in-out"
    }}>
      
      {/* Top Bar Game Header */}
      <RetroHeader
        currentThemeColor={currentThemeColor}
        textColor={textColor}
        textMuted={textMuted}
        isDarkMode={isDarkMode}
      />

      {/* Body columns */}
      <div style={{ flex: 1, display: "flex", gap: "50px", alignItems: "center", flexDirection: window.innerWidth < 768 ? "column" : "row", overflow: "hidden", padding: "10px 0" }}>
        
        {/* Left projection pad (holographic character) */}
        {signUpStep !== 4 && (
          <RetroProjectionPad
            currentThemeColor={currentThemeColor}
            textColor={textColor}
            isDarkMode={isDarkMode}
            avatar={avatar}
            isGlitching={isGlitching}
            signUpStep={signUpStep}
            retroShowForm={retroShowForm}
            authMode={authMode}
            recognizedClass={recognizedClass}
            activeClass={activeClass}
          />
        )}

        {/* Right arcade menu panel */}
        <div style={{ flex: 1.1, display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
          
          {signUpStep === 4 ? (
            /* STEP 4 RETRO TERMINAL LOAD */
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontFamily: "'Courier New', monospace" }}>
              {terminalLogs.map((log, lIdx) => {
                if (!log || typeof log !== "string") return null;
                const isLast = lIdx === terminalLogs.length - 1;
                const isSuccess = log.includes("SUCCESS") || log.includes("SECURE") || log.includes("LOGGED") || log.includes("ACTIVE");
                return (
                  <div 
                    key={lIdx} 
                    style={{ 
                      fontSize: "12px", 
                      color: isLast ? "#10b981" : (isSuccess ? "#34d399" : `${currentThemeColor}dd`), 
                      fontWeight: isLast ? "800" : "500",
                      borderRight: isLast ? "2px solid #10b981" : "none",
                      animation: isLast ? "caretBlink 0.8s steps(2, start) infinite" : "none"
                    }}
                  >
                    {log}
                  </div>
                );
              })}
            </div>
          ) : (
            /* STATE-BASED MENU FOR RETRO ARCADE */
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", height: "100%", justifyContent: "center" }}>
              
              {/* MAIN MENU SELECTOR */}
              {!retroShowForm && (
                <RetroMainMenu
                  currentThemeColor={currentThemeColor}
                  textColor={textColor}
                  textMuted={textMuted}
                  isDarkMode={isDarkMode}
                  setIsDarkMode={setIsDarkMode}
                  setAuthMode={setAuthMode}
                  setSignUpStep={setSignUpStep}
                  setRetroShowForm={setRetroShowForm}
                  isMusicMuted={isMusicMuted}
                  musicProfile={musicProfile}
                  cycleMusicProfile={cycleMusicProfile}
                />
              )}

              {/* SIGN IN INPUT VIEW */}
              {retroShowForm && authMode === "signin" && (
                <RetroSignInForm
                  currentThemeColor={currentThemeColor}
                  textColor={textColor}
                  textMuted={textMuted}
                  isDarkMode={isDarkMode}
                  setAuthMode={setAuthMode}
                  setSignUpStep={setSignUpStep}
                  setRetroShowForm={setRetroShowForm}
                  onAuthSuccess={onAuthSuccess}
                />
              )}

              {/* SIGN UP STEP 1 - CHARACTER SELECT */}
              {retroShowForm && authMode === "signup" && signUpStep === 1 && (
                <RetroClassSelect
                  currentThemeColor={currentThemeColor}
                  textColor={textColor}
                  textMuted={textMuted}
                  isDarkMode={isDarkMode}
                  activeClass={activeClass}
                  classStats={classStats}
                  selectedClassIdx={selectedClassIdx}
                  setSelectedClassId={setSelectedClassId}
                  carouselDir={carouselDir}
                  navigateCarousel={navigateCarousel}
                  setAuthMode={setAuthMode}
                  setSignUpStep={setSignUpStep}
                  setRetroShowForm={setRetroShowForm}
                />
              )}

              {/* SIGN UP STEP 2 - PATHFINDER QUESTIONNAIRE */}
              {retroShowForm && authMode === "signup" && signUpStep === 2 && (
                <RetroQuestionnaire
                  currentThemeColor={currentThemeColor}
                  textColor={textColor}
                  textMuted={textMuted}
                  cardBorder={cardBorder}
                  isDarkMode={isDarkMode}
                  activeQuestions={activeQuestions}
                  onboardingQ={onboardingQ}
                  setOnboardingQ={setOnboardingQ}
                  onboardingAnswers={onboardingAnswers}
                  setOnboardingAnswers={setOnboardingAnswers}
                  onboardingInputVal={onboardingInputVal}
                  setOnboardingInputVal={setOnboardingInputVal}
                  typedQuestion={typedQuestion}
                  isTypingQuestion={isTypingQuestion}
                  pathfinderMode={pathfinderMode}
                  setPathfinderMode={setPathfinderMode}
                  setSignUpStep={setSignUpStep}
                />
              )}

              {/* SIGN UP STEP 3 - DEFINE IDENTIFIER */}
              {retroShowForm && authMode === "signup" && signUpStep === 3 && (
                <RetroCredentialsForm
                  currentThemeColor={currentThemeColor}
                  textColor={textColor}
                  textMuted={textMuted}
                  cardBorder={cardBorder}
                  isDarkMode={isDarkMode}
                  avatar={avatar}
                  handleShuffleAvatar={handleShuffleAvatar}
                  activeClass={activeClass}
                  activeQuestions={activeQuestions}
                  onboardingAnswers={onboardingAnswers}
                  pathfinderMode={pathfinderMode}
                  setSignUpStep={setSignUpStep}
                  setAuthMode={setAuthMode}
                  setRetroShowForm={setRetroShowForm}
                  startTerminalSequence={startTerminalSequence}
                  onAuthSuccess={onAuthSuccess}
                />
              )}

              {/* Scrolling Tips Ticker at bottom of panel */}
              <RetroTicker
                currentThemeColor={currentThemeColor}
                isDarkMode={isDarkMode}
              />

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
