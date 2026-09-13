export const getStoredPortalStyle = () => {
  if (typeof window === "undefined") return "workspace";
  return localStorage.getItem("kaevrix_portal_style") || "workspace";
};

export const setStoredPortalStyle = (style) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("kaevrix_portal_style", style);
  }
};

export const getStoredSelectedClass = () => {
  if (typeof window === "undefined") return "doomscroller";
  return localStorage.getItem("kaevrix_class") || "doomscroller";
};

export const getStoredAvatar = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("kaevrix_avatar");
};

export const saveUserRoadmapData = (username, roadmap, answersPayload = []) => {
  if (typeof window === "undefined" || !username) return;
  const roadmapStr = JSON.stringify(roadmap);
  localStorage.setItem(`kaevrix_roadmap_progress_${username}`, roadmapStr);
  localStorage.setItem(`kaevrix_roadmap_answers_${username}`, JSON.stringify(answersPayload));
  localStorage.setItem(`kaevrix_roadmap_${username}`, roadmapStr);
};
