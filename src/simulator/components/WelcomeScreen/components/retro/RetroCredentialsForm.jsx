import { useState } from "react";
import * as sound from "../../../../utils/audio";
import { registerUser } from "../../services/authService";

export default function RetroCredentialsForm({
  currentThemeColor,
  textColor,
  textMuted,
  cardBorder,
  isDarkMode,
  avatar,
  handleShuffleAvatar,
  activeClass,
  activeQuestions,
  onboardingAnswers,
  pathfinderMode,
  setSignUpStep,
  setAuthMode,
  setRetroShowForm,
  startTerminalSequence,
  onAuthSuccess
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
        selectedClass: activeClass.id
      });

      setSignUpStep(4);
      startTerminalSequence({
        authPayload: data,
        selectedClassId: activeClass.id,
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
    <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", justifyContent: "center" }}>
      <div style={{ fontSize: "11px", color: textMuted, fontWeight: "900", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "5px" }}>
        ▶ Credentials Initialization
      </div>

      {signUpError && (
        <div style={{ color: "#ef4444", fontSize: "12px", fontFamily: "'Courier New', monospace", fontWeight: "bold" }}>
          ERROR: {signUpError.toUpperCase()}
        </div>
      )}

      <div style={{ 
        display: "flex", gap: "12px", alignItems: "center", 
        background: isDarkMode ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.6)", 
        padding: "12px 18px", borderRadius: "8px", border: `2px solid ${cardBorder}`,
        transition: "background 0.4s"
      }}>
        <button 
          type="button" 
          onClick={handleShuffleAvatar}
          style={{ border: "none", background: "transparent", color: currentThemeColor, fontFamily: "var(--font-gamer)", fontSize: "12px", fontWeight: "900", cursor: "pointer", letterSpacing: "1px" }}
        >
          [RNG] RE-ROLL AVATAR MATRIX
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span style={{ fontSize: "11px", color: currentThemeColor, fontFamily: "var(--font-gamer)", fontWeight: "bold", letterSpacing: "1.5px" }}>ALIAS:</span>
        <input
          type="text"
          value={signUpUsername}
          onChange={(e) => setSignUpUsername(e.target.value)}
          placeholder="alias..."
          required
          maxLength={15}
          style={{ 
            background: isDarkMode ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.8)", 
            border: `2px solid ${currentThemeColor}44`, 
            borderRadius: "8px", 
            color: textColor, 
            padding: "12px 18px", 
            outline: "none", 
            fontSize: "16px", 
            fontFamily: "var(--font-gamer)", 
            fontWeight: "bold", 
            letterSpacing: "1.5px",
            transition: "background 0.4s, color 0.4s"
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = currentThemeColor}
          onBlur={(e) => e.currentTarget.style.borderColor = `${currentThemeColor}44`}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span style={{ fontSize: "11px", color: currentThemeColor, fontFamily: "var(--font-gamer)", fontWeight: "bold", letterSpacing: "1.5px" }}>PASSWORD:</span>
        <input
          type="password"
          value={signUpPassword}
          onChange={(e) => setSignUpPassword(e.target.value)}
          placeholder="••••••••"
          required
          minLength={4}
          style={{ 
            background: isDarkMode ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.8)", 
            border: `2px solid ${currentThemeColor}44`, 
            borderRadius: "8px", 
            color: textColor, 
            padding: "12px 18px", 
            outline: "none", 
            fontSize: "16px", 
            fontFamily: "var(--font-gamer)", 
            fontWeight: "bold", 
            letterSpacing: "1.5px",
            transition: "background 0.4s, color 0.4s"
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = currentThemeColor}
          onBlur={(e) => e.currentTarget.style.borderColor = `${currentThemeColor}44`}
        />
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
        <button
          type="button"
          onClick={() => { sound.playClockTick(); setSignUpStep(2); }}
          style={{
            flex: 0.4, border: `2px solid ${cardBorder}`, background: "transparent",
            borderRadius: "10px", color: textMuted, fontFamily: "var(--font-gamer)",
            fontSize: "13px", fontWeight: "900", padding: "16px 14px", cursor: "pointer"
          }}
        >
          BACK
        </button>
        <button
          type="submit"
          disabled={isRegistering}
          style={{
            flex: 1, background: `linear-gradient(90deg, ${currentThemeColor} 0%, #ff8c00 100%)`, border: `2px solid ${textColor}`,
            borderRadius: "10px", color: "#fff", fontFamily: "var(--font-gamer)",
            fontSize: "14px", fontWeight: "900", padding: "16px 20px", cursor: isRegistering ? "not-allowed" : "pointer", letterSpacing: "1.5px"
          }}
        >
          {isRegistering ? "[ SYNC LOAD... ]" : "[ SIGN UP & REGISTER ]"}
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5px" }}>
        <button
          onClick={() => { sound.playClockTick(); setAuthMode("signin"); setRetroShowForm(true); }}
          style={{
            background: "transparent", border: "none", color: currentThemeColor, fontFamily: "var(--font-gamer)",
            fontSize: "12px", fontWeight: "900", cursor: "pointer", letterSpacing: "1px"
          }}
        >
          [ HAVE AN ACCOUNT? SIGN IN ]
        </button>
        
        <button
          onClick={() => { sound.playClockTick(); setRetroShowForm(false); }}
          style={{
            background: "transparent", border: "none", color: textMuted, fontFamily: "var(--font-gamer)",
            fontSize: "12px", fontWeight: "900", cursor: "pointer", letterSpacing: "1px"
          }}
        >
          [ RETURN TO MENU ]
        </button>
      </div>
    </form>
  );
}
