import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import * as sound from "../../utils/audio";
import { ENEMY_LIST, getEnemyIndexForMilestone } from "./BossBattle/constants";
import { fetchBossBattleAPI } from "./BossBattle/services/bossService";
import { useBossCombat } from "./BossBattle/hooks/useBossCombat";

import BossDialogueOverlay from "./BossBattle/components/BossDialogueOverlay";
import BossCombatArena from "./BossBattle/components/BossCombatArena";
import BossVictoryDefeat from "./BossBattle/components/BossVictoryDefeat";

export default function BossBattleModal({
  isOpen,
  onClose,
  milestone,
  topic,
  backendUrl,
  onCompleteMilestone
}) {
  const [bossData, setBossData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const enemyIdx = getEnemyIndexForMilestone(milestone);
  const enemyConfig = ENEMY_LIST[enemyIdx];

  const {
    gameState,
    setGameState,
    dialogueStage,
    setDialogueStage,
    selectedResponse1,
    setSelectedResponse1,
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
  } = useBossCombat(bossData, onCompleteMilestone, null);

  const loadBossBattle = async () => {
    setLoading(true);
    setError(false);
    try {
      sound.playClockTick();
      const data = await fetchBossBattleAPI({ backendUrl, milestone, topic });
      setBossData(data);
      sound.playCorrect();
    } catch (err) {
      console.error("Failed to load boss battle data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && milestone) {
      loadBossBattle();
    }
  }, [isOpen, milestone]);

  if (!isOpen) return null;

  const modalContent = (
    <div style={{
      position: "fixed", inset: 0, zIndex: 10000,
      background: "radial-gradient(ellipse at center, rgba(15,10,25,0.95) 0%, rgba(5,2,10,0.98) 100%)",
      backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        position: "relative",
        width: "100%", maxWidth: "960px", height: "640px",
        background: "#08060c",
        border: "3px double #c8102e",
        borderRadius: "20px",
        boxShadow: "0 0 80px rgba(200,16,46,0.35), inset 0 0 40px rgba(0,0,0,0.9)",
        overflow: "hidden"
      }}>
        
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "16px", color: "#c8102e", fontFamily: "'Cinzel', serif" }}>
            <span style={{ fontSize: "36px", animation: "spin 1s linear infinite" }}>[VS]️</span>
            <div style={{ fontSize: "16px", fontWeight: "900", letterSpacing: "3px" }}>CONJURING BOSS ARENA...</div>
          </div>
        ) : error ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "16px", color: "#ef4444", textAlign: "center", padding: "40px" }}>
            <span style={{ fontSize: "36px" }}>[!]️</span>
            <h3>FAILED TO CONJURE BOSS ARENA</h3>
            <p style={{ color: "#94a3b8" }}>The ancient connection failed. Retrying may summon the boss.</p>
            <button onClick={loadBossBattle} style={{ padding: "12px 24px", borderRadius: "10px", background: "#c8102e", border: "none", color: "#fff", fontWeight: "bold", cursor: "pointer" }}>
              RETRY CONJURATION
            </button>
          </div>
        ) : (
          <>
            {gameState === "dialogue" && (
              <BossDialogueOverlay
                enemyConfig={enemyConfig}
                topic={topic}
                dialogueStage={dialogueStage}
                setDialogueStage={setDialogueStage}
                selectedResponse1={selectedResponse1}
                setSelectedResponse1={setSelectedResponse1}
                onStartCombat={() => setGameState("combat")}
                onAbandon={onClose}
              />
            )}

            {gameState === "combat" && (
              <BossCombatArena
                enemyConfig={enemyConfig}
                bossData={bossData}
                playerHP={playerHP}
                bossHP={bossHP}
                currentQ={currentQ}
                selectedOption={selectedOption}
                isAnswered={isAnswered}
                timer={timer}
                knightAction={knightAction}
                enemyAction={enemyAction}
                isPlayerHurt={isPlayerHurt}
                isBossHurt={isBossHurt}
                damageNumbers={damageNumbers}
                handleSelectOption={handleSelectOption}
              />
            )}

            {(gameState === "victory" || gameState === "defeat") && (
              <BossVictoryDefeat
                gameState={gameState}
                enemyConfig={enemyConfig}
                milestone={milestone}
                onClose={onClose}
                onRetry={() => {
                  setGameState("dialogue");
                  setDialogueStage(0);
                }}
              />
            )}
          </>
        )}

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
