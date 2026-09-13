import { useState } from "react";
import * as sound from "../../../utils/audio";
import { registerUser } from "../services/authService";

export default function SignUpCredentials({
  setAuthMode,
  setSignUpStep,
  isDarkMode,
  currentThemeColor,
  activeClass,
  avatar,
  handleShuffleAvatar,
  isGlitching,
  selectedClassId,
  activeQuestions,
  onboardingAnswers,
  pathfinderMode,
  onAuthSuccess,
  startTerminalSequence,
  textColor,
  textMuted,
  labelColor
}) {
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegisterSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!signUpUsername.trim() || !signUpPassword) return;
    if (signUpPassword.length < 4) {
      setSignUpError("Passkey must be at least 4 characters long");
      return;
    }

    sound.playClockTick();
    setSignUpError("");
    setIsRegistering(true);

    try {
      const data = await registerUser({
        username: signUpUsername,
        password: signUpPassword,
        avatar,
        selectedClass: selectedClassId
      });

      setSignUpStep(4);
      startTerminalSequence({
        authPayload: data,
        selectedClassId,
        activeQuestions,
        onboardingAnswers,
        pathfinderMode,
        onAuthSuccess
      });
    } catch (err) {
      setSignUpError(err.message);
      sound.playIncorrect();
      setIsRegistering(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      <button
        onClick={() => { sound.playClockTick(); setSignUpStep(2); }}
        style={{ background: "transparent", border: "none", color: textMuted, cursor: "pointer", fontSize: "12px", fontWeight: "700", textAlign: "left", padding: "0 0 20px 0", letterSpacing: "1px" }}
      >
        ← BACK TO QUESTIONS
      </button>

      <div style={{ marginBottom: "22px" }}>
        <div style={{ fontFamily: "var(--font-gamer)", fontSize: "24px", fontWeight: "900", letterSpacing: "3px", color: textColor }}>
          NEW GAME
        </div>
        <div style={{ fontSize: "12px", color: textMuted, marginTop: "4px" }}>Set your gamer tag and passkey to begin</div>
      </div>

      <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {signUpError && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1.5px solid rgba(239,68,68,0.25)", color: "#ef4444", padding: "12px 16px", borderRadius: "12px", fontSize: "13px", fontWeight: "700" }}>
            [!] {signUpError}
          </div>
        )}

        {/* Avatar row */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", background: isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1.5px solid ${currentThemeColor}22`, borderRadius: "14px", padding: "14px 18px" }}>
          <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: isDarkMode ? "#0f172a" : "#fff", border: `2px solid ${currentThemeColor}`, overflow: "hidden", flexShrink: 0 }}>
            <img src={avatar} alt="Avatar" className={isGlitching ? "glitch-active" : ""} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <div>
            <div style={{ fontSize: "10px", color: textMuted, fontWeight: "800", letterSpacing: "1px", textTransform: "uppercase" }}>Identity Matrix</div>
            <button type="button" onClick={handleShuffleAvatar} style={{ border: "none", background: "transparent", color: currentThemeColor, padding: 0, fontSize: "12px", fontWeight: "800", cursor: "pointer", marginTop: "2px" }}>
              [RNG] Re-Roll Avatar
            </button>
          </div>
          <div style={{ marginLeft: "auto", background: `${currentThemeColor}22`, borderRadius: "8px", padding: "4px 10px", fontSize: "10px", color: currentThemeColor, fontWeight: "800", letterSpacing: "1px" }}>
            {activeClass.icon} {activeClass.name.split("The ")[1] || activeClass.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "11px", fontWeight: "800", color: labelColor, letterSpacing: "1px", textTransform: "uppercase" }}>Gamer Tag</label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", opacity: 0.5 }}>[ID]</span>
            <input
              type="text"
              value={signUpUsername}
              onChange={(e) => setSignUpUsername(e.target.value)}
              placeholder="Choose a unique tag..."
              required
              maxLength={15}
              style={{
                width: "100%", background: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                border: `1.5px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)"}`,
                color: textColor, padding: "15px 20px 15px 46px", borderRadius: "14px",
                fontSize: "15px", fontWeight: "700", outline: "none", transition: "all 0.25s", boxSizing: "border-box"
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = currentThemeColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${currentThemeColor}18`; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "11px", fontWeight: "800", color: labelColor, letterSpacing: "1px", textTransform: "uppercase" }}>Passkey</label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", opacity: 0.5 }}>[KEY]</span>
            <input
              type="password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              placeholder="•••••••• (Min 4 chars)"
              required
              minLength={4}
              style={{
                width: "100%", background: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                border: `1.5px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)"}`,
                color: textColor, padding: "15px 20px 15px 46px", borderRadius: "14px",
                fontSize: "15px", fontWeight: "700", outline: "none", transition: "all 0.25s", boxSizing: "border-box"
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = currentThemeColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${currentThemeColor}18`; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isRegistering}
          style={{
            background: `linear-gradient(135deg, ${currentThemeColor} 0%, #ff8c00 100%)`,
            border: "none", borderRadius: "14px", padding: "17px 20px",
            color: "#fff", fontSize: "15px", fontWeight: "900", letterSpacing: "2px",
            textTransform: "uppercase", cursor: isRegistering ? "not-allowed" : "pointer",
            boxShadow: `0 8px 30px ${currentThemeColor}40`,
            transition: "all 0.25s", marginTop: "4px",
            opacity: isRegistering ? 0.7 : 1,
          }}
          onMouseOver={(e) => { if (!isRegistering) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 35px ${currentThemeColor}55`; } }}
          onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 8px 30px ${currentThemeColor}40`; }}
        >
          {isRegistering ? "CREATING..." : "▶  START NEW CAMPAIGN"}
        </button>

        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: "12px", color: textMuted }}>Already registered? </span>
          <button type="button" onClick={() => { sound.playClockTick(); setAuthMode("signin"); }} style={{ background: "transparent", border: "none", color: currentThemeColor, fontWeight: "800", cursor: "pointer", fontSize: "12px", padding: 0 }}>
            Continue Saved Game →
          </button>
        </div>
      </form>
    </div>
  );
}
