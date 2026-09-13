import { useState, useEffect } from "react";
import * as sound from "../../../utils/audio";
import { fetchUserTheme, loginUser } from "../services/authService";

export default function SignInForm({
  setAuthMode,
  setSignUpStep,
  isDarkMode,
  currentThemeColor,
  textColor,
  textMuted,
  labelColor,
  recognizedClass,
  setRecognizedClass,
  setRecognizedAvatar,
  onAuthSuccess
}) {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Debounced check to recognize username and load their profile theme on the login screen
  useEffect(() => {
    const cleanName = loginUsername.trim();
    if (cleanName.length < 3) {
      setRecognizedClass(null);
      setRecognizedAvatar(null);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchUserTheme(cleanName)
        .then(data => {
          if (data && data.selectedClass) {
            sound.playWhoosh();
            setRecognizedClass(data.selectedClass);
            setRecognizedAvatar(data.avatar);
          }
        })
        .catch(() => {
          setRecognizedClass(null);
          setRecognizedAvatar(null);
        });
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [loginUsername, setRecognizedClass, setRecognizedAvatar]);

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
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      <button
        onClick={() => { sound.playClockTick(); setAuthMode("menu"); setLoginUsername(""); setLoginPassword(""); setLoginError(""); }}
        style={{ background: "transparent", border: "none", color: textMuted, cursor: "pointer", fontSize: "12px", fontWeight: "700", textAlign: "left", padding: "0 0 20px 0", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "6px" }}
      >
        ← BACK TO MAIN MENU
      </button>

      <div style={{ marginBottom: "28px" }}>
        <div style={{ fontFamily: "var(--font-gamer)", fontSize: "28px", fontWeight: "900", letterSpacing: "3px", color: textColor, textTransform: "uppercase" }}>
          CONTINUE
        </div>
        <div style={{ fontSize: "12px", color: textMuted, marginTop: "4px", letterSpacing: "1px" }}>
          Enter credentials to resume your campaign
        </div>
      </div>

      <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {loginError && (
          <div style={{
            background: "rgba(239,68,68,0.08)", border: "1.5px solid rgba(239,68,68,0.25)",
            color: "#ef4444", padding: "12px 16px", borderRadius: "12px", fontSize: "13px",
            fontWeight: "700", display: "flex", alignItems: "center", gap: "8px"
          }}>
            [!] <span>{loginError}</span>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "11px", fontWeight: "800", color: labelColor, letterSpacing: "1px", textTransform: "uppercase" }}>Gamer Tag</label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", opacity: 0.5 }}>[ID]</span>
            <input
              type="text"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              placeholder="Your tag..."
              required
              maxLength={15}
              style={{
                width: "100%", background: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                border: `1.5px solid ${recognizedClass ? currentThemeColor : (isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)")}`,
                color: textColor, padding: "15px 20px 15px 46px", borderRadius: "14px",
                fontSize: "15px", fontWeight: "700", outline: "none", transition: "all 0.25s",
                boxSizing: "border-box"
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = currentThemeColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${currentThemeColor}18`; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = recognizedClass ? currentThemeColor : (isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)"); e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "11px", fontWeight: "800", color: labelColor, letterSpacing: "1px", textTransform: "uppercase" }}>Passkey</label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", opacity: 0.5 }}>[KEY]</span>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%", background: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                border: `1.5px solid ${isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)"}`,
                color: textColor, padding: "15px 20px 15px 46px", borderRadius: "14px",
                fontSize: "15px", fontWeight: "700", outline: "none", transition: "all 0.25s",
                boxSizing: "border-box"
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = currentThemeColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${currentThemeColor}18`; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoggingIn}
          style={{
            background: `linear-gradient(135deg, ${currentThemeColor} 0%, #ff8c00 100%)`,
            border: "none", borderRadius: "14px", padding: "17px 20px",
            color: "#fff", fontSize: "15px", fontWeight: "900", letterSpacing: "2px",
            textTransform: "uppercase", cursor: isLoggingIn ? "not-allowed" : "pointer",
            boxShadow: `0 8px 30px ${currentThemeColor}40`,
            transition: "all 0.25s", marginTop: "8px",
            opacity: isLoggingIn ? 0.7 : 1,
          }}
          onMouseOver={(e) => { if (!isLoggingIn) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 35px ${currentThemeColor}55`; } }}
          onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 8px 30px ${currentThemeColor}40`; }}
        >
          {isLoggingIn ? "CONNECTING..." : "▶  ENTER ARENA"}
        </button>

        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: "12px", color: textMuted }}>No account? </span>
          <button
            type="button"
            onClick={() => { sound.playClockTick(); setAuthMode("signup"); setSignUpStep(1); }}
            style={{ background: "transparent", border: "none", color: currentThemeColor, fontWeight: "800", cursor: "pointer", fontSize: "12px", padding: 0 }}
          >
            Start New Campaign →
          </button>
        </div>
      </form>
    </div>
  );
}
              border: "2px solid transparent",
              borderBottomColor: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
              color: textColor, padding: "18px 20px", borderRadius: "12px",
              fontSize: "15px", fontWeight: "700", outline: "none", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxSizing: "border-box"
            }}
            onFocus={(e) => { 
              e.currentTarget.style.borderColor = currentThemeColor; 
              e.currentTarget.style.boxShadow = `0 8px 20px -10px ${currentThemeColor}80`; 
              e.currentTarget.style.background = isDarkMode ? "rgba(0, 0, 0, 0.6)" : "#fff"; 
            }}
            onBlur={(e) => { 
              e.currentTarget.style.borderColor = "transparent";
              e.currentTarget.style.borderBottomColor = isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"; 
              e.currentTarget.style.boxShadow = "none"; 
              e.currentTarget.style.background = isDarkMode ? "rgba(0, 0, 0, 0.4)" : "rgba(240, 240, 245, 1)"; 
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoggingIn}
          style={{
            background: currentThemeColor,
            border: "none",
            borderRadius: "12px", padding: "20px",
            color: "#fff", fontSize: "16px", fontWeight: "900", letterSpacing: "3px",
            textTransform: "uppercase", cursor: isLoggingIn ? "wait" : "pointer",
            boxShadow: `0 10px 30px -10px ${currentThemeColor}`,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", marginTop: "16px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            position: "relative", overflow: "hidden"
          }}
          onMouseOver={(e) => { 
            if (!isLoggingIn) { 
              e.currentTarget.style.transform = "translateY(-4px)"; 
              e.currentTarget.style.boxShadow = `0 15px 35px -10px ${currentThemeColor}`; 
              e.currentTarget.querySelector('.btn-arrow').style.transform = "translateX(6px)";
            } 
          }}
          onMouseOut={(e) => { 
            if (!isLoggingIn) { 
              e.currentTarget.style.transform = "translateY(0)"; 
              e.currentTarget.style.boxShadow = `0 10px 30px -10px ${currentThemeColor}`; 
              e.currentTarget.querySelector('.btn-arrow').style.transform = "translateX(0)";
            } 
          }}
        >
          <span style={{ position: "relative", zIndex: 2 }}>{isLoggingIn ? "CONNECTING..." : "ENTER ARENA"}</span>
          {!isLoggingIn && <span className="btn-arrow" style={{ position: "relative", zIndex: 2, fontSize: "20px", transition: "transform 0.3s" }}>→</span>}
          {/* Subtle button overlay highlight */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, transparent 100%)", zIndex: 1 }} />
        </button>

        <div style={{ textAlign: "center", marginTop: "12px", borderTop: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`, paddingTop: "24px" }}>
          <span style={{ fontSize: "14px", color: textMuted, fontWeight: "500" }}>New to the arena? </span>
          <button
            type="button"
            onClick={() => { sound.playClockTick(); setAuthMode("signup"); setSignUpStep(1); }}
            style={{ background: "transparent", border: "none", color: currentThemeColor, fontWeight: "800", cursor: "pointer", fontSize: "14px", padding: 0, transition: "opacity 0.2s" }}
            onMouseOver={e => e.currentTarget.style.opacity = 0.8}
            onMouseOut={e => e.currentTarget.style.opacity = 1}
          >
            Create Your Legend
          </button>
        </div>
      </form>
    </div>
  );
}
