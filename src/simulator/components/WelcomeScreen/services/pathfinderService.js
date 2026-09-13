import { fetchWithJobPolling } from "../../../utils/asyncJob";
import { BACKEND_URL } from "../constants";

export const generatePathfinderRoadmap = async (payload, pathfinderMode) => {
  const res = await fetchWithJobPolling(`${BACKEND_URL}/api/pathfinder/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers: payload, pathfinderMode })
  });
  const roadmap = await res.json();
  return roadmap;
};

export const createFallbackRoadmap = (onboardingAnswers) => {
  return {
    topic: onboardingAnswers[0] || "General Learning",
    goal: onboardingAnswers[1] || "Master the topic",
    summary: `Personalized basic learning path for ${onboardingAnswers[0] || "General Learning"}.`,
    totalVideosEstimated: 36,
    totalEstimatedHours: 27,
    dailyGoal: "Complete 1 node and watch 1 video daily",
    level1: { title: "Level 1 — Foundations", subtitle: "Basic Syntax & Setups", color: "#10b981", milestones: [] },
    level2: { title: "Level 2 — Intermediate Basics", subtitle: "Data, Tools & Practical Logic", color: "#f59e0b", milestones: [] },
    level3: { title: "Level 3 — Interview Prep & Mastery", subtitle: "Advanced Foundations & Mock Tests", color: "#8b5cf6", milestones: [] }
  };
};
