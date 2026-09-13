import PlayerKnightSVG from "../sprites/PlayerKnightSVG";
import KnightSprite from "../sprites/KnightSprite";
import EnemySprite from "../sprites/EnemySprite";
import {
  PixelCallbackDemonSVG,
  PixelScopeWardenSVG,
  PixelDOMDestroyerSVG,
  PixelSyntaxSentinelSVG,
  PixelGarbageCollectorSVG
} from "../sprites/BossSVGs";

export default function BossCombatArena({
  enemyConfig,
  bossData,
  playerHP,
  bossHP,
  currentQ,
  selectedOption,
  isAnswered,
  timer,
  knightAction,
  enemyAction,
  isPlayerHurt,
  isBossHurt,
  damageNumbers,
  handleSelectOption
}) {
  const currentQuestion = bossData?.questions[currentQ];

  const renderBossSprite = () => {
    if (enemyConfig?.name === "Demon") return <PixelCallbackDemonSVG isHurt={isBossHurt} />;
    if (enemyConfig?.name === "Warden") return <PixelScopeWardenSVG isHurt={isBossHurt} />;
    if (enemyConfig?.name === "Destroyer") return <PixelDOMDestroyerSVG isHurt={isBossHurt} />;
    if (enemyConfig?.name === "Sentinel") return <PixelSyntaxSentinelSVG isHurt={isBossHurt} />;
    if (enemyConfig?.name === "Collector") return <PixelGarbageCollectorSVG isHurt={isBossHurt} />;
    return <EnemySprite enemyConfig={enemyConfig} action={enemyAction} isHurt={isBossHurt} />;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "24px", gap: "16px", justifyContent: "space-between" }}>
      {/* Health Bars Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px" }}>
        {/* Player Health Bar */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "900", color: "#00e5ff", letterSpacing: "1px" }}>
            <span>KNIGHT CHAMPION</span>
            <span>{playerHP} / 100 HP</span>
          </div>
          <div style={{ height: "12px", background: "rgba(0,0,0,0.6)", borderRadius: "6px", border: "1px solid rgba(0,229,255,0.4)", overflow: "hidden" }}>
            <div style={{ width: `${playerHP}%`, height: "100%", background: "linear-gradient(90deg, #00e5ff 0%, #0088ff 100%)", transition: "width 0.3s ease" }} />
          </div>
        </div>

        {/* Turn Timer Badge */}
        <div style={{
          width: "48px", height: "48px", borderRadius: "50%",
          background: timer <= 5 ? "rgba(239,68,68,0.2)" : "rgba(0,0,0,0.6)",
          border: `2px solid ${timer <= 5 ? "#ef4444" : "#c8102e"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px", fontWeight: "900", color: timer <= 5 ? "#ef4444" : "#fff"
        }}>
          {timer}s
        </div>

        {/* Boss Health Bar */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "900", color: "#c8102e", letterSpacing: "1px" }}>
            <span>{enemyConfig?.name.toUpperCase()} BOSS</span>
            <span>{bossHP} / 100 HP</span>
          </div>
          <div style={{ height: "12px", background: "rgba(0,0,0,0.6)", borderRadius: "6px", border: "1px solid rgba(200,16,46,0.4)", overflow: "hidden" }}>
            <div style={{ width: `${bossHP}%`, height: "100%", background: "linear-gradient(90deg, #c8102e 0%, #ff0000 100%)", transition: "width 0.3s ease" }} />
          </div>
        </div>
      </div>

      {/* Center Sprite Stage */}
      <div style={{
        flex: 1, position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        padding: "0 60px 20px 60px", minHeight: "220px",
        background: "radial-gradient(ellipse at bottom, rgba(200,16,46,0.15) 0%, transparent 70%)"
      }}>
        {/* Floating Damage Numbers */}
        {damageNumbers.map(d => (
          <div
            key={d.id}
            style={{
              position: "absolute",
              left: d.isPlayer ? "120px" : "calc(100% - 180px)",
              bottom: "160px",
              color: d.isPlayer ? "#ef4444" : "#ff007f",
              fontSize: d.isCrit ? "28px" : "22px",
              fontWeight: "900",
              fontFamily: "'Cinzel', serif",
              textShadow: "0 0 10px rgba(0,0,0,0.8)",
              animation: "floatUp 1.2s ease-out forwards",
              zIndex: 99
            }}
          >
            {d.text}
          </div>
        ))}

        {/* Player Knight Sprite */}
        <div style={{
          width: "140px", height: "140px",
          transform: knightAction === "attack" ? "translateX(60px) scale(1.1)" : "translateX(0)",
          transition: "transform 0.2s ease"
        }}>
          <KnightSprite action={knightAction} isHurt={isPlayerHurt} playerHP={playerHP} />
        </div>

        {/* Boss Enemy Sprite */}
        <div style={{
          width: "160px", height: "160px",
          transform: enemyAction === "attack" ? "translateX(-60px) scale(1.1)" : "translateX(0)",
          transition: "transform 0.2s ease"
        }}>
          {renderBossSprite()}
        </div>
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <div style={{
          background: "rgba(10, 10, 15, 0.85)",
          border: "1.5px solid rgba(200, 16, 46, 0.4)",
          borderRadius: "16px", padding: "20px 24px",
          display: "flex", flexDirection: "column", gap: "14px"
        }}>
          <div style={{ fontSize: "16px", fontWeight: "800", color: "#f8fafc", lineHeight: "1.4" }}>
            {currentQuestion.question}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {currentQuestion.options?.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQuestion.correctAnswer;
              
              let btnBg = "rgba(255,255,255,0.04)";
              let btnBorder = "rgba(200,16,46,0.3)";
              let btnColor = "#cbd5e1";

              if (isAnswered) {
                if (isCorrect) {
                  btnBg = "rgba(16,185,129,0.2)";
                  btnBorder = "#10b981";
                  btnColor = "#10b981";
                } else if (isSelected) {
                  btnBg = "rgba(239,68,68,0.2)";
                  btnBorder = "#ef4444";
                  btnColor = "#ef4444";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  style={{
                    textAlign: "left",
                    padding: "14px 18px",
                    borderRadius: "10px",
                    background: btnBg,
                    border: `1.5px solid ${btnBorder}`,
                    color: btnColor,
                    fontSize: "13.5px",
                    fontWeight: "700",
                    cursor: isAnswered ? "default" : "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
