import { useState, useEffect } from "react";
import * as sound from "../utils/audio";
import { ENHANCED_CLASSES, QUICK_QUESTIONS, DETAILED_QUESTIONS, getAvatarUrl } from "./WelcomeScreen/constants";
import { getStoredPortalStyle, setStoredPortalStyle, getStoredSelectedClass, getStoredAvatar } from "./WelcomeScreen/utils/storage";
import { getActiveClassTheme, getThemeStyles } from "./WelcomeScreen/utils/theme";
import { useCharacterCarousel } from "./WelcomeScreen/hooks/useCharacterCarousel";
import { useTerminalSequence } from "./WelcomeScreen/hooks/useTerminalSequence";

import SoundscapeConsole from "./WelcomeScreen/components/SoundscapeConsole";
import ClassSelectionPanel from "./WelcomeScreen/components/ClassSelectionPanel";
import SignInForm from "./WelcomeScreen/components/SignInForm";
import SignUpClassSelect from "./WelcomeScreen/components/SignUpClassSelect";
import SignUpQuestionnaire from "./WelcomeScreen/components/SignUpQuestionnaire";
import SignUpCredentials from "./WelcomeScreen/components/SignUpCredentials";
import TerminalBootLoader from "./WelcomeScreen/components/TerminalBootLoader";
import RetroArcadePortal from "./WelcomeScreen/components/RetroArcadePortal";

export default function WelcomeScreen({
  onAuthSuccess,
  isDarkMode,
  setIsDarkMode,
  isMusicMuted,
  setIsMusicMuted,
  musicProfile,
  setMusicProfile,
  keepMusicInGame,
  setKeepMusicInGame
}) {
  // Theme & layout mode state
  const [portalStyle, setPortalStyle] = useState(getStoredPortalStyle);
  const [authMode, setAuthMode] = useState("menu"); // menu, signin, signup
  const [signUpStep, setSignUpStep] = useState(1); // 1: Class Selection, 2: Pathfinder Questions, 3: Credentials, 4: Loading
  const [hoveredButtonId, setHoveredButtonId] = useState(null);

  // Character selection & state
  const [selectedClassId, setSelectedClassId] = useState(getStoredSelectedClass);
  const [recognizedClass, setRecognizedClass] = useState(null);
  const [recognizedAvatar, setRecognizedAvatar] = useState(null);

  // Avatar state
  const [avatarSeed, setAvatarSeed] = useState(() => Math.random().toString(36).substring(7));
  const [avatar, setAvatar] = useState(() => {
    const savedAvatar = getStoredAvatar();
    return savedAvatar && savedAvatar.includes("http")
      ? savedAvatar
      : getAvatarUrl(Math.random().toString(36).substring(7));
  });
  const [isGlitching, setIsGlitching] = useState(false);

  // Questionnaire state
  const [pathfinderMode, setPathfinderMode] = useState(null); // 'quick' or 'detailed'
  const activeQuestions = pathfinderMode === 'detailed' ? DETAILED_QUESTIONS : QUICK_QUESTIONS;
  const [onboardingQ, setOnboardingQ] = useState(0);
  const [onboardingAnswers, setOnboardingAnswers] = useState(Array(5).fill(""));
  const [onboardingInputVal, setOnboardingInputVal] = useState("");

  // Hooks
  const { selectedClassIdx, carouselDir, navigateCarousel } = useCharacterCarousel(
    selectedClassId,
    setSelectedClassId,
    authMode,
    signUpStep
  );
  const { terminalLogs, startTerminalSequence } = useTerminalSequence();

  // Sync avatar seed with selected class
  useEffect(() => {
    const activeCls = ENHANCED_CLASSES.find(c => c.id === selectedClassId);
    if (activeCls) {
      setAvatarSeed(activeCls.avatarSeed);
      setAvatar(getAvatarUrl(activeCls.avatarSeed));
    }
  }, [selectedClassId]);

  const handleShuffleAvatar = () => {
    sound.playGlitch();
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 300);
    const newSeed = Math.random().toString(36).substring(7);
    setAvatarSeed(newSeed);
    setAvatar(getAvatarUrl(newSeed));
  };

  const cycleMusicProfile = () => {
    sound.playClockTick();
    if (isMusicMuted) {
      setIsMusicMuted(false);
      localStorage.setItem("kaevrix_music_muted", "false");
      setMusicProfile(0);
      localStorage.setItem("kaevrix_music_profile", "0");
    } else if (musicProfile === sound.MUSIC_PROFILES.length - 1) {
      setIsMusicMuted(true);
      localStorage.setItem("kaevrix_music_muted", "true");
    } else {
      const nextProfile = musicProfile + 1;
      setMusicProfile(nextProfile);
      localStorage.setItem("kaevrix_music_profile", String(nextProfile));
    }
  };

  const handleTogglePortalStyle = () => {
    sound.playClockTick();
    const nextStyle = portalStyle === "workspace" ? "retro-game" : "workspace";
    setPortalStyle(nextStyle);
    setAuthMode("menu");
    setStoredPortalStyle(nextStyle);
  };

  // Resolved theme colors & active class details
  const { activeClass, currentThemeColor, classStats } = getActiveClassTheme(
    authMode,
    recognizedClass,
    selectedClassId
  );

  const {
    textColor,
    textMuted,
    cardBorder,
    labelColor,
    ambientGlowColor
  } = getThemeStyles(isDarkMode, currentThemeColor);

  return (
    <div
      className="welcome-aaa-overlay"
      style={{ 
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
        display: "flex", flexDirection: "column", 
        overflowY: "auto", overflowX: "hidden", zIndex: 9999,
        fontFamily: "'Inter', sans-serif",
        color: textColor,
      }}
    >
      {/* Light Mode Gradient Layer */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(160deg, #fff7ed 0%, #ffedd5 55%, #ffe0b2 100%)",
        opacity: isDarkMode ? 0 : 1,
        transition: "opacity 0.4s ease-in-out",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Dark Mode Gradient Layer */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 30% 20%, #1a2744 0%, #060c1a 70%)",
        opacity: isDarkMode ? 1 : 0,
        transition: "opacity 0.4s ease-in-out",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Cyber Grid Background */}
      <div className="portal-cyber-grid" />

      {/* Ambient Glow Layers */}
      <div style={{ 
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", 
        width: "90%", height: "45%", 
        background: "radial-gradient(ellipse, rgba(255, 106, 0, 0.09) 0%, transparent 70%)", 
        filter: "blur(90px)", 
        opacity: isDarkMode ? 0 : 1,
        transition: "opacity 0.4s ease-in-out", 
        pointerEvents: "none",
        zIndex: 1
      }} />
      <div style={{ 
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", 
        width: "90%", height: "45%", 
        background: `radial-gradient(ellipse, ${currentThemeColor}2a 0%, transparent 70%)`, 
        filter: "blur(90px)", 
        opacity: isDarkMode ? 1 : 0,
        transition: "opacity 0.4s ease-in-out", 
        pointerEvents: "none",
        zIndex: 1
      }} />

      {/* Theme Toggle (Right) */}
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        style={{ position: "absolute", top: "20px", right: "20px", zIndex: 9999, background: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)", border: `1px solid ${cardBorder}`, borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
        title="Toggle Light/Dark Theme"
      >
        {isDarkMode ? "[DARK]" : "[LIGHT]️"}
      </button>

      {/* Music Toggle (Right) */}
      <button 
        onClick={() => {
          sound.playClockTick();
          const nextMuted = !isMusicMuted;
          setIsMusicMuted(nextMuted);
          localStorage.setItem("kaevrix_music_muted", String(nextMuted));
        }}
        style={{ position: "absolute", top: "20px", right: "70px", zIndex: 9999, background: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)", border: `1px solid ${cardBorder}`, borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
        title={isMusicMuted ? "Unmute Ambient Music" : "Mute Ambient Music"}
      >
        {isMusicMuted ? "[MUTE]" : "[AUDIO]"}
      </button>

      {/* Soundscape Console */}
      <SoundscapeConsole
        isDarkMode={isDarkMode}
        cardBorder={cardBorder}
        textColor={textColor}
        textMuted={textMuted}
        musicProfile={musicProfile}
        setMusicProfile={setMusicProfile}
        keepMusicInGame={keepMusicInGame}
        setKeepMusicInGame={setKeepMusicInGame}
      />

      {/* Dimensional Style Switcher (Left) */}
      <button 
        onClick={handleTogglePortalStyle}
        className="dimensional-switch-btn"
        style={{ 
          position: "absolute", top: "20px", left: "20px", zIndex: 9999, 
          background: isDarkMode ? "rgba(255,106,0,0.12)" : "rgba(255, 255, 255, 0.9)", 
          border: `2px solid ${currentThemeColor}`, 
          color: textColor, display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s"
        }}
      >
        <span className={`dimensional-switch-indicator ${portalStyle === "workspace" ? "workspace-active" : "retro-active"}`} />
        <span style={{ fontFamily: "var(--font-gamer)", fontSize: "11px", fontWeight: "900", letterSpacing: "1px" }}>
          SWITCH PORTAL DESIGN: <span style={{ color: currentThemeColor }}>{portalStyle === "workspace" ? "WORKSPACE" : "RETRO ARCADE"}</span>
        </span>
      </button>

      {/* WORKSPACE MODE: STEP 4 TERMINAL LOADING */}
      {portalStyle === "workspace" && signUpStep === 4 && (
        <TerminalBootLoader
          currentThemeColor={currentThemeColor}
          terminalLogs={terminalLogs}
        />
      )}

      {/* WORKSPACE MODE: SPLIT PANEL INTERFACE */}
      {portalStyle === "workspace" && signUpStep !== 4 && (
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: window.innerWidth < 900 ? "column" : "row",
          position: "relative",
          zIndex: 10,
          minHeight: 0,
        }}>
          {/* LEFT PANEL */}
          <div style={{
            flex: "0 0 48%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 60px 60px 80px",
            position: "relative",
            zIndex: 2,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <img src="/logo.png?v=2" alt="Kaevrix" style={{ width: "36px", height: "36px", objectFit: "contain" }} />
              <span style={{
                fontFamily: "var(--font-gamer)", fontSize: "22px", fontWeight: "900",
                letterSpacing: "4px", color: textColor,
                textShadow: isDarkMode ? `0 0 20px ${currentThemeColor}88` : "none"
              }}>Kaevrix</span>
            </div>
            <div style={{ fontSize: "10px", fontWeight: "800", color: "#ff6a00", letterSpacing: "5px", textTransform: "uppercase", marginBottom: "40px" }}>
              Watch · Quiz · Compete · Ascend
            </div>

            {/* MAIN MENU */}
            {authMode === "menu" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ fontSize: "11px", fontWeight: "800", color: textMuted, letterSpacing: "4px", textTransform: "uppercase", marginBottom: "8px" }}>
                  — Select Mode —
                </div>

                {[
                  { id: "continue", icon: "▶", label: "CONTINUE", sub: "Sign In — Resume Your Journey", action: () => { sound.playClockTick(); setAuthMode("signin"); } },
                  { id: "newgame", icon: "+", label: "NEW GAME", sub: "Sign Up — Create Your Legend", action: () => { sound.playClockTick(); setAuthMode("signup"); setSignUpStep(1); } },
                  { id: "darkmode", icon: isDarkMode ? "[DARK]" : "[LIGHT]️", label: isDarkMode ? "DARK MODE" : "LIGHT MODE", sub: "Toggle visual filter", action: () => { sound.playClockTick(); setIsDarkMode(!isDarkMode); } },
                  { 
                    id: "music", 
                    icon: isMusicMuted ? "[MUTE]" : "[AUDIO]", 
                    label: isMusicMuted ? "SOUNDTRACK: MUTED" : `SOUNDTRACK: ${sound.MUSIC_PROFILES[musicProfile].name.toUpperCase()}`, 
                    sub: isMusicMuted ? "Click to play Lofi Study" : `Play next: ${musicProfile === sound.MUSIC_PROFILES.length - 1 ? "Muted" : sound.MUSIC_PROFILES[musicProfile + 1].name}`, 
                    action: cycleMusicProfile 
                  }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={item.action}
                    onMouseEnter={() => { sound.playClockTick(true); setHoveredButtonId(item.id); }}
                    onMouseLeave={() => setHoveredButtonId(null)}
                    style={{
                      textAlign: "left",
                      background: hoveredButtonId === item.id
                        ? isDarkMode ? `rgba(255,106,0,0.12)` : `rgba(255,106,0,0.08)`
                        : "transparent",
                      border: `2px solid ${hoveredButtonId === item.id ? currentThemeColor : (isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)")}`,
                      borderRadius: "16px",
                      padding: "18px 24px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "18px",
                      transition: "all 0.2s ease",
                      transform: hoveredButtonId === item.id ? "translateX(8px)" : "translateX(0)",
                      boxShadow: hoveredButtonId === item.id ? `0 0 20px ${currentThemeColor}22` : "none",
                    }}
                  >
                    <span style={{
                      width: "40px", height: "40px", borderRadius: "12px",
                      background: hoveredButtonId === item.id ? currentThemeColor : (isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"),
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "18px", fontWeight: "900", flexShrink: 0,
                      fontFamily: "var(--font-gamer)",
                      color: hoveredButtonId === item.id ? "#fff" : currentThemeColor,
                      transition: "all 0.2s",
                    }}>{item.icon}</span>
                    <div>
                      <div style={{
                        fontFamily: "var(--font-gamer)", fontSize: "20px", fontWeight: "900",
                        letterSpacing: "3px", color: hoveredButtonId === item.id ? currentThemeColor : textColor,
                        transition: "color 0.2s",
                      }}>{item.label}</div>
                      <div style={{ fontSize: "11px", color: textMuted, fontWeight: "600", letterSpacing: "1px", marginTop: "3px" }}>{item.sub}</div>
                    </div>
                  </button>
                ))}

                <div style={{ marginTop: "24px", borderTop: `1px solid ${isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, paddingTop: "20px" }}>
                  <div style={{ fontSize: "10px", color: textMuted, letterSpacing: "2px", textTransform: "uppercase", fontWeight: "700" }}>
                    Ranked Arena · Class-Based Combat · Real-Time Duels
                  </div>
                </div>
              </div>
            )}

            {/* SIGN IN FORM */}
            {authMode === "signin" && (
              <SignInForm
                setAuthMode={setAuthMode}
                setSignUpStep={setSignUpStep}
                isDarkMode={isDarkMode}
                currentThemeColor={currentThemeColor}
                textColor={textColor}
                textMuted={textMuted}
                labelColor={labelColor}
                recognizedClass={recognizedClass}
                setRecognizedClass={setRecognizedClass}
                setRecognizedAvatar={setRecognizedAvatar}
                onAuthSuccess={onAuthSuccess}
              />
            )}

            {/* SIGN UP STEP 1 */}
            {authMode === "signup" && signUpStep === 1 && (
              <SignUpClassSelect
                setAuthMode={setAuthMode}
                setSignUpStep={setSignUpStep}
                isDarkMode={isDarkMode}
                currentThemeColor={currentThemeColor}
                activeClass={activeClass}
                classStats={classStats}
                selectedClassIdx={selectedClassIdx}
                textColor={textColor}
                textMuted={textMuted}
              />
            )}

            {/* SIGN UP STEP 2 */}
            {authMode === "signup" && signUpStep === 2 && (
              <SignUpQuestionnaire
                setSignUpStep={setSignUpStep}
                pathfinderMode={pathfinderMode}
                setPathfinderMode={setPathfinderMode}
                activeQuestions={activeQuestions}
                onboardingQ={onboardingQ}
                setOnboardingQ={setOnboardingQ}
                onboardingAnswers={onboardingAnswers}
                setOnboardingAnswers={setOnboardingAnswers}
                onboardingInputVal={onboardingInputVal}
                setOnboardingInputVal={setOnboardingInputVal}
                isDarkMode={isDarkMode}
                currentThemeColor={currentThemeColor}
                textColor={textColor}
                textMuted={textMuted}
                labelColor={labelColor}
                authMode={authMode}
                signUpStep={signUpStep}
              />
            )}

            {/* SIGN UP STEP 3 */}
            {authMode === "signup" && signUpStep === 3 && (
              <SignUpCredentials
                setAuthMode={setAuthMode}
                setSignUpStep={setSignUpStep}
                isDarkMode={isDarkMode}
                currentThemeColor={currentThemeColor}
                activeClass={activeClass}
                avatar={avatar}
                handleShuffleAvatar={handleShuffleAvatar}
                isGlitching={isGlitching}
                selectedClassId={selectedClassId}
                activeQuestions={activeQuestions}
                onboardingAnswers={onboardingAnswers}
                pathfinderMode={pathfinderMode}
                onAuthSuccess={onAuthSuccess}
                startTerminalSequence={startTerminalSequence}
                textColor={textColor}
                textMuted={textMuted}
                labelColor={labelColor}
              />
            )}
          </div>

          {/* RIGHT PANEL SHOWCASE */}
          <ClassSelectionPanel
            authMode={authMode}
            signUpStep={signUpStep}
            isDarkMode={isDarkMode}
            currentThemeColor={currentThemeColor}
            ambientGlowColor={ambientGlowColor}
            activeClass={activeClass}
            classStats={classStats}
            textColor={textColor}
            textMuted={textMuted}
            recognizedClass={recognizedClass}
            recognizedAvatar={recognizedAvatar}
            avatar={avatar}
            isGlitching={isGlitching}
            selectedClassIdx={selectedClassIdx}
            setSelectedClassId={setSelectedClassId}
            carouselDir={carouselDir}
            navigateCarousel={navigateCarousel}
          />
        </div>
      )}

      {/* RETRO ARCADE MODE */}
      {portalStyle === "retro-game" && (
        <RetroArcadePortal
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          currentThemeColor={currentThemeColor}
          textColor={textColor}
          textMuted={textMuted}
          cardBorder={cardBorder}
          activeClass={activeClass}
          classStats={classStats}
          recognizedClass={recognizedClass}
          avatar={avatar}
          isGlitching={isGlitching}
          handleShuffleAvatar={handleShuffleAvatar}
          authMode={authMode}
          setAuthMode={setAuthMode}
          signUpStep={signUpStep}
          setSignUpStep={setSignUpStep}
          selectedClassIdx={selectedClassIdx}
          setSelectedClassId={setSelectedClassId}
          carouselDir={carouselDir}
          navigateCarousel={navigateCarousel}
          pathfinderMode={pathfinderMode}
          setPathfinderMode={setPathfinderMode}
          activeQuestions={activeQuestions}
          onboardingQ={onboardingQ}
          setOnboardingQ={setOnboardingQ}
          onboardingAnswers={onboardingAnswers}
          setOnboardingAnswers={setOnboardingAnswers}
          onboardingInputVal={onboardingInputVal}
          setOnboardingInputVal={setOnboardingInputVal}
          typedQuestion=""
          isTypingQuestion={false}
          terminalLogs={terminalLogs}
          startTerminalSequence={startTerminalSequence}
          onAuthSuccess={onAuthSuccess}
          isMusicMuted={isMusicMuted}
          musicProfile={musicProfile}
          cycleMusicProfile={cycleMusicProfile}
        />
      )}

      <style>{`
        .class-carousel::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
