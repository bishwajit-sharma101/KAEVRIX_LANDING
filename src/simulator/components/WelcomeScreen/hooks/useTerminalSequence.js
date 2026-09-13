import { useState } from "react";
import * as sound from "../../../utils/audio";
import { ENHANCED_CLASSES } from "../constants";
import { generatePathfinderRoadmap, createFallbackRoadmap } from "../services/pathfinderService";
import { saveUserRoadmapData } from "../utils/storage";

export function useTerminalSequence() {
  const [terminalLogs, setTerminalLogs] = useState([]);

  const startTerminalSequence = async ({
    authPayload,
    selectedClassId,
    activeQuestions,
    onboardingAnswers,
    pathfinderMode,
    onAuthSuccess
  }) => {
    const activeCls = ENHANCED_CLASSES.find(c => c.id === selectedClassId) || ENHANCED_CLASSES[0];
    const initialLogs = [
      `>>> INITIATING NEURAL CONNECT v2.5...`,
      `>>> SHIELD PROTOCOLS ACTIVE.`,
      `>>> SYNTHESIZING CLASS LINK: [${activeCls.name.toUpperCase()}]... SUCCESS.`,
      `>>> REGISTERING GAMER TAG [${authPayload.user.username.toUpperCase()}]... SUCCESS.`,
      `>>> CONNECTING TO PATHFINDER ENGINE...`,
      `>>> ANALYZING PROFILE GOALS...`,
      `>>> GENERATING CUSTOM SKILL ROADMAP...`
    ];

    setTerminalLogs([]);

    for (let i = 0; i < initialLogs.length; i++) {
      sound.playClockTick(true);
      setTerminalLogs(prev => [...prev, initialLogs[i]]);
      await new Promise(r => setTimeout(r, 400));
    }

    try {
      const payload = activeQuestions.map((q, i) => ({
        question: q.question,
        answer: onboardingAnswers[i]
      }));

      const roadmap = await generatePathfinderRoadmap(payload, pathfinderMode);
      saveUserRoadmapData(authPayload.user.username, roadmap, payload);

      const successLogs = [
        `>>> ROADMAP GENERATED SUCCESSFULLY. [${roadmap.totalVideosEstimated || 36} NODES, ${roadmap.totalEstimatedHours || 25} HOURS]`,
        `>>> CALIBRATING AVATAR MEMORY CORE... LOGGED.`,
        `>>> SYSTEM READY. ENTERING KAEVRIX ARENA...`
      ];

      for (let i = 0; i < successLogs.length; i++) {
        sound.playClockTick(true);
        setTerminalLogs(prev => [...prev, successLogs[i]]);
        await new Promise(r => setTimeout(r, 400));
      }

      setTimeout(() => {
        sound.playMatchFound();
        onAuthSuccess(authPayload.user, authPayload.token);
      }, 600);

    } catch (err) {
      console.error("Roadmap generation error:", err);
      const errorLogs = [
        `>>> PATHFINDER ERROR: GENERATION FAILED.`,
        `>>> COMPILING COMPACT CORE ROADMAP AS FALLBACK... SUCCESS.`,
        `>>> SYSTEM READY. ENTERING KAEVRIX ARENA...`
      ];

      for (let i = 0; i < errorLogs.length; i++) {
        sound.playIncorrect();
        setTerminalLogs(prev => [...prev, errorLogs[i]]);
        await new Promise(r => setTimeout(r, 450));
      }

      const fallbackRoadmap = createFallbackRoadmap(onboardingAnswers);
      saveUserRoadmapData(authPayload.user.username, fallbackRoadmap, []);

      setTimeout(() => {
        sound.playMatchFound();
        onAuthSuccess(authPayload.user, authPayload.token);
      }, 600);
    }
  };

  return {
    terminalLogs,
    startTerminalSequence
  };
}
