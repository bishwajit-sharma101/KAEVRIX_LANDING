import { useState, useEffect, useRef } from "react";

export default function KnightSprite({ action, isHurt, playerHP }) {
  const [frame, setFrame] = useState(1);
  const frameRef = useRef(null);
  
  const isDead = playerHP <= 0;
  const prefix = action === "attack" ? "Attack" : action === "jumpAttack" ? "JumpAttack" : (action === "hurt" && isDead) ? "Dead" : "Idle";
  const totalFrames = 10;
  const fps = (action === "attack" || action === "jumpAttack") ? 14 : (action === "hurt" && isDead) ? 8 : 8;

  useEffect(() => {
    setFrame(1);
    frameRef.current = setInterval(() => {
      setFrame(f => {
        if (action !== "idle" && (action === "attack" || action === "jumpAttack" || isDead) && f >= totalFrames) return totalFrames;
        return f >= totalFrames ? 1 : f + 1;
      });
    }, 1000 / fps);
    return () => clearInterval(frameRef.current);
  }, [action, fps, totalFrames, isDead]);

  const filterStyle = isHurt
    ? "drop-shadow(0 0 20px #c8102e) drop-shadow(0 0 40px #ff0000) brightness(1.8)"
    : "drop-shadow(0 0 6px rgba(0,229,255,0.3))";

  return (
    <img
      src={`/knight/png/${prefix} (${frame}).png`}
      alt="Knight"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        imageRendering: "auto",
        filter: filterStyle,
      }}
    />
  );
}
