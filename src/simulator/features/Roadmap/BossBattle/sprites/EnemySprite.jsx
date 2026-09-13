import { useState, useEffect, useRef } from "react";
import { ENEMY_LIST } from "../constants";

export default function EnemySprite({ enemyConfig, action, isHurt }) {
  const [frame, setFrame] = useState(0);
  const frameRef = useRef(null);
  const config = enemyConfig || ENEMY_LIST[0];

  let sheetSuffix = "_idle";
  let totalFrames = config.idleFrames;
  if (action === "attack") { sheetSuffix = "_attack"; totalFrames = config.attackFrames; }
  else if (action === "hurt") { sheetSuffix = "_hurt"; totalFrames = config.hurtFrames; }
  else if (action === "death") { sheetSuffix = "_death"; totalFrames = config.deathFrames; }

  const fps = action === "attack" ? 12 : action === "hurt" ? 8 : (action === "death" ? 8 : 6);

  useEffect(() => {
    setFrame(0);
    frameRef.current = setInterval(() => {
      setFrame(f => {
        if (action !== "idle" && f >= totalFrames - 1) return totalFrames - 1;
        return f >= totalFrames - 1 ? 0 : f + 1;
      });
    }, 1000 / fps);
    return () => clearInterval(frameRef.current);
  }, [action, fps, totalFrames]);

  const sheetUrl = `/enemies/${config.folder}/${config.name}${sheetSuffix}.png`;
  const bgWidth = totalFrames * 100;
  const xPos = totalFrames <= 1 ? 0 : (frame / (totalFrames - 1)) * 100;

  const filterStyle = isHurt
    ? "drop-shadow(0 0 25px #c8102e) brightness(1.8)"
    : "drop-shadow(0 0 10px rgba(168,85,247,0.4))";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundImage: `url("${sheetUrl}")`,
        backgroundPosition: `${xPos}% 0%`,
        backgroundSize: `${bgWidth}% 100%`,
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
        filter: filterStyle,
      }}
    />
  );
}
