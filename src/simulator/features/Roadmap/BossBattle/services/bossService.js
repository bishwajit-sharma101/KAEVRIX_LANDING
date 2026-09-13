import { fetchWithJobPolling } from "../../../../utils/asyncJob";
import { trackTelemetry } from "../../../../utils/telemetry.js";

export const fetchBossBattleAPI = async ({ backendUrl, milestone, topic }) => {
  const res = await fetchWithJobPolling(`${backendUrl}/api/pathfinder/boss-battle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${typeof window !== "undefined" ? localStorage.getItem("kaevrix_token") : ""}`
    },
    body: JSON.stringify({
      milestoneId: milestone.id,
      milestoneTitle: milestone.title,
      milestoneDescription: milestone.description,
      keyPoints: milestone.keyPoints || [],
      topic: topic || "Frontend Development"
    })
  });
  
  const data = await res.json();
  if (!res.ok || !data.questions) {
    throw new Error(data.error || "Failed to generate boss battle parameters");
  }

  trackTelemetry({
    eventName: 'boss_battle_generated',
    properties: {
      milestoneTitle: milestone.title,
      topic,
      bossName: data.bossName || "Boss",
      questionCount: data.questions.length
    }
  });

  return data;
};
