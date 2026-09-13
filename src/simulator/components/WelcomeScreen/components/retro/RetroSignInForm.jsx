import { useState } from "react";
import * as sound from "../../../../utils/audio";
import { loginUser } from "../../services/authService";

export default function RetroSignInForm({
  currentThemeColor,
  textColor,
  textMuted,
  isDarkMode,
  setAuthMode,
  setSignUpStep,
  setRetroShowForm,
  onAuthSuccess
}) {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!loginUsername.trim() || !loginPassword) return;

    sound.playClockTick();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const data = await loginUser(loginUsername, loginPassword);
      sound.playMatchFound();
      onAuthSuccess(data.user, data.token);
    } catch (err) {
      setLoginError(err.message);
      sound.playIncorrect();
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px", justifyContent: "center" }}>
      <div style={{ fontSize: "11px", color: textMuted, fontWeight: "900", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "5px" }}>
        ▶ Credentials Validation
      </div>

      {loginError && (
        <div style={{ color: "#ef4444", fontSize: "12px", fontFamily: "'Courier New', monospace", fontWeight: "bold" }}>
          ERROR: {loginError.toUpperCase()}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span style={{ fontSize: "11px", color: currentThemeColor, fontFamily: "var(--font-gamer)", fontWeight: "bold", letterSpacing: "1.5px" }}>GAMER_TAG:</span>
        <input
          type="text"
          value={loginUsername}
          onChange={(e) => setLoginUsername(e.target.value)}
          placeholder="tag..."
          required
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
        <span style={{ fontSize: "11px", color: currentThemeColor, fontFamily: "var(--font-gamer)", fontWeight: "bold", letterSpacing: "1.5px" }}>PASSKEY_HASH:</span>
        <input
          type="password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          placeholder="••••••••"
          required
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

      <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "15px" }}>
        <button
          type="submit"
          disabled={isLoggingIn}
          style={{
            background: `linear-gradient(90deg, ${currentThemeColor} 0%, #ff8c00 100%)`, border: `2px solid ${textColor}`, borderRadius: "10px",
            color: "#fff", fontFamily: "var(--font-gamer)", fontSize: "15px", fontWeight: "900",
            padding: "16px 20px", cursor: isLoggingIn ? "not-allowed" : "pointer", letterSpacing: "2px",
            boxShadow: `0 0 25px ${currentThemeColor}44`, textTransform: "uppercase"
          }}
        >
          {isLoggingIn ? "[ LINKING NODE... ]" : "[ SIGN IN & ENTER ARENA ]"}
        </button>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5px" }}>
          <button
            type="button"
            onClick={() => { sound.playClockTick(); setAuthMode("signup"); setSignUpStep(1); setLoginUsername(""); setLoginPassword(""); setLoginError(""); }}
            style={{ background: "transparent", border: "none", color: currentThemeColor, fontSize: "12px", fontWeight: "bold", cursor: "pointer", fontFamily: "var(--font-gamer)", letterSpacing: "1px" }}
          >
            [ NEED AN ACCOUNT? SIGN UP ]
          </button>
          <button
            type="button"
            onClick={() => { sound.playClockTick(); setLoginUsername(""); setLoginPassword(""); setLoginError(""); setRetroShowForm(false); }}
            style={{ background: "transparent", border: "none", color: textMuted, fontSize: "12px", fontWeight: "bold", cursor: "pointer", fontFamily: "var(--font-gamer)", letterSpacing: "1px" }}
          >
            [ RETURN TO MENU ]
          </button>
        </div>
      </div>
    </form>
  );
}
