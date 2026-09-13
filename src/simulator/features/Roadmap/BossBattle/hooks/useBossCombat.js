import { useState, useEffect, useRef } from "react";
import * as sound from "../../../../utils/audio";

export function useBossCombat(bossData, onVictory, onDefeat) {
  const [gameState, setGameState] = useState("dialogue"); // dialogue, combat, victory, defeat
  const [dialogueStage, setDialogueStage] = useState(0); // 0: greeting, 1: after response 1, 2: after response 2
  const [selectedResponse1, setSelectedResponse1] = useState(null);
  
  const [playerHP, setPlayerHP] = useState(100);
  const [bossHP, setBossHP] = useState(100);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timer, setTimer] = useState(25);
  
  const [knightAction, setKnightAction] = useState("idle"); // idle, attack, hurt
  const [enemyAction, setEnemyAction] = useState("idle"); // idle, attack, hurt, death
  const [isPlayerHurt, setIsPlayerHurt] = useState(false);
  const [isBossHurt, setIsBossHurt] = useState(false);
  const [damageNumbers, setDamageNumbers] = useState([]);
  
  const timerRef = useRef(null);

  // Countdown turn timer during combat phase
  useEffect(() => {
    if (gameState !== "combat" || isAnswered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setTimer(25);
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState, currentQ, isAnswered]);

  const addDamageNumber = (text, isCrit = false, isPlayer = false) => {
    const id = Date.now() + Math.random();
    setDamageNumbers(prev => [...prev, { id, text, isCrit, isPlayer }]);
    setTimeout(() => {
      setDamageNumbers(prev => prev.filter(d => d.id !== id));
    }, 1200);
  };

  const handleTimeOut = () => {
    sound.playIncorrect();
    setIsAnswered(true);
    triggerBossAttack(35);
  };

  const triggerPlayerAttack = (dmg = 35) => {
    sound.playWhoosh();
    setKnightAction("attack");
    setTimeout(() => {
      setIsBossHurt(true);
      setEnemyAction("hurt");
      sound.playMatchFound();
      addDamageNumber(`-${dmg} DMG`, true, false);

      setBossHP(prev => {
        const next = Math.max(0, prev - dmg);
        if (next <= 0) {
          setEnemyAction("death");
          setTimeout(() => {
            setGameState("victory");
            sound.playVictory();
            if (onVictory) onVictory();
          }, 1200);
        } else {
          setTimeout(() => {
            setKnightAction("idle");
            setEnemyAction("idle");
            setIsBossHurt(false);
            advanceToNextQuestion();
          }, 1000);
        }
        return next;
      });
    }, 400);
  };

  const triggerBossAttack = (dmg = 30) => {
    sound.playWhoosh();
    setEnemyAction("attack");
    setTimeout(() => {
      setIsPlayerHurt(true);
      setKnightAction("hurt");
      sound.playIncorrect();
      addDamageNumber(`-${dmg} HP`, false, true);

      setPlayerHP(prev => {
        const next = Math.max(0, prev - dmg);
        if (next <= 0) {
          setTimeout(() => {
            setGameState("defeat");
            if (onDefeat) onDefeat();
          }, 1200);
        } else {
          setTimeout(() => {
            setKnightAction("idle");
            setEnemyAction("idle");
            setIsPlayerHurt(false);
            advanceToNextQuestion();
          }, 1000);
        }
        return next;
      });
    }, 400);
  };

  const advanceToNextQuestion = () => {
    if (!bossData || !bossData.questions) return;
    if (currentQ < bossData.questions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Loop questions if boss is still alive
      setCurrentQ(0);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const handleSelectOption = (optIdx) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOption(optIdx);

    const q = bossData?.questions[currentQ];
    if (!q) return;

    const isCorrect = optIdx === q.correctAnswer;
    if (isCorrect) {
      triggerPlayerAttack(35);
    } else {
      triggerBossAttack(30);
    }
  };

  return {
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
  };
}
