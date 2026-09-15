import { useState, useEffect, useRef, useMemo } from "react";
import * as sound from "../../utils/audio";
import CognitivePathfinder from "../Roadmap/CognitivePathfinder";
import ProfilePanel from "./ProfilePanel";
import CommunityTab from "../Community/CommunityTab";
import CanvasRuneLoader from "../Shared/CanvasRuneLoader";
import PathfinderScheduler from "../Roadmap/PathfinderScheduler";
import StudyHistory from "./StudyHistory";
import { trackTelemetry, updateScrollDepth, incrementIdleTime, incrementPageDwellTime, incrementRageClicks, resetDeepMetrics } from "../../utils/telemetry.js";
import { User, Swords, Compass, Clock, History, Users, Trophy, Lock, Code, Terminal, Cpu, Layout, Layers, Globe, CheckCircle2, Flame, Zap, Target, ArrowRight, Check, ChevronDown, ChevronUp, RotateCw, List, X } from "lucide-react";
import { MOCK_CURATED_VIDEOS } from "../../utils/mockInterceptor";

const TRENDING_TOPICS = [
  { icon: <Code size={15} />, label: "JavaScript", color: "#f59e0b", players: 1420 },
  { icon: <Terminal size={15} />, label: "Python", color: "#10b981", players: 983 },
  { icon: <Cpu size={15} />, label: "Machine Learning", color: "#8b5cf6", players: 756 },
  { icon: <Layers size={15} />, label: "System Design", color: "#3b82f6", players: 621 },
  { icon: <Layout size={15} />, label: "Algorithms", color: "#ef4444", players: 549 },
  { icon: <Globe size={15} />, label: "Web Dev", color: "#ff6a00", players: 498 },
];

const getCategoryStyle = (category) => {
  switch (category) {
    case "Core Tutorial":
      return { color: "#4338ca", bg: "#e0e7ff" };
    case "Interview Prep":
      return { color: "#065f46", bg: "#d1fae5" };
    case "Pro Tips":
      return { color: "#92400e", bg: "#fef3c7" };
    case "Shortcuts & Cheat Sheets":
      return { color: "#06b6d4", bg: "rgba(6,182,212,0.1)" };
    case "Hacks & Tricks":
      return { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" };
    case "Conceptual Deep Dives":
      return { color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" };
    default:
      return { color: "#ea580c", bg: "rgba(234,88,12,0.1)" };
  }
};


export default function Dashboard({
  isDarkMode,
  curatedVideos,
  selectedVideo,
  setSelectedVideo,
  vsBot,
  setVsBot,
  leaderboard,
  username,
  avatar,
  getRankTitle,
  onStartMatchmaking,
  backendUrl,
  searchQuery,
  searchResults,
  onSearch,
  selectedClass,
  onSurpassLimits,
  onTestJourneyDay,
  isSearching,
  onStartSoloStudy,
  setStatus,
  socket,
  isDrawerOpen,
  setIsDrawerOpen,
  setIsDarkMode,
  isMusicMuted,
  setIsMusicMuted,
  musicProfile,
  setMusicProfile,
  activeTab,
  setActiveTab,
  handleLogout,
  showSchedulerSettings,
  setShowSchedulerSettings,
  showSystemSettings,
  setShowSystemSettings,
  profileAccentColor,
  setProfileAccentColor,
  featureGates,
  isTabLocked,
  handleGatedTabChange,
  lockedFeatureAlert,
  setLockedFeatureAlert,
  practiceContext,
  setPracticeContext
}) {
  const [isRobotHovered, setIsRobotHovered] = useState(false);
  const [personalizedFeed, setPersonalizedFeed] = useState([]);
  const [showDrawerSettings, setShowDrawerSettings] = useState(false);
  const [showTodoPopup, setShowTodoPopup] = useState(false);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [activeMilestones, setActiveMilestones] = useState([]);
  const [allTodayVideos, setAllTodayVideos] = useState([]);
  const [isMobileQuestOpen, setIsMobileQuestOpen] = useState(false);
  const [todayCycleIndex, setTodayCycleIndex] = useState(0);
  const [arenaCategory, setArenaCategory] = useState("All");
  const [showCompletedSection, setShowCompletedSection] = useState(true);

  const battleVideos = useMemo(() => {
    return (curatedVideos && curatedVideos.length > 0) ? curatedVideos : MOCK_CURATED_VIDEOS;
  }, [curatedVideos]);

  const filteredBattleVideos = useMemo(() => {
    if (arenaCategory === "All") return battleVideos;
    return battleVideos.filter(v => 
      v.category?.toLowerCase() === arenaCategory.toLowerCase() ||
      (arenaCategory === "Algorithms" && (v.category === "Core Tutorial" || (v.title && v.title.toLowerCase().includes("javascript"))))
    );
  }, [battleVideos, arenaCategory]);

  const todayVideos = useMemo(() => {
    if (allTodayVideos.length === 0) return [];
    const start = todayCycleIndex;
    const end = start + 4;
    if (end <= allTodayVideos.length) {
      return allTodayVideos.slice(start, end);
    } else {
      return [...allTodayVideos.slice(start, allTodayVideos.length), ...allTodayVideos.slice(0, end - allTodayVideos.length)];
    }
  }, [allTodayVideos, todayCycleIndex]);

  const [loadingToday, setLoadingToday] = useState(false);

  const [showRuneLoader, setShowRuneLoader] = useState(false);
  const [isExploding, setIsExploding] = useState(false);

  const activeLoading = isSearching || loadingFeed || loadingToday;

  useEffect(() => {
    if (activeLoading) {
      setShowRuneLoader(true);
      setIsExploding(false);
    } else if (showRuneLoader && !isExploding) {
      setIsExploding(true);
    }
  }, [activeLoading, showRuneLoader, isExploding]);

  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    // Reset metrics on mount
    resetDeepMetrics();

    // 1. Dwell & Idle Time Tracker
    const timeInterval = setInterval(() => {
      if (document.visibilityState === "visible") {
        incrementPageDwellTime(1);
        
        // If no user activity for 10+ seconds, count as idle time
        if (Date.now() - lastActivityRef.current >= 10000) {
          incrementIdleTime(1);
        }
      }
    }, 1000);

    const recordUserActivity = () => {
      lastActivityRef.current = Date.now();
    };

    window.addEventListener("mousemove", recordUserActivity);
    window.addEventListener("keydown", recordUserActivity);
    window.addEventListener("click", recordUserActivity);
    window.addEventListener("scroll", recordUserActivity);

    // 2. Scroll Depth Tracker
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const pct = Math.min(100, Math.round((window.scrollY / scrollHeight) * 100));
        updateScrollDepth(pct);
      }
    };
    window.addEventListener("scroll", handleScroll);

    // 3. Rage Clicks Detector
    let clickHistory = [];
    const handleClick = (e) => {
      const now = Date.now();
      clickHistory.push({ time: now, target: e.target });
      clickHistory = clickHistory.filter(c => now - c.time < 2000);
      
      if (clickHistory.length >= 3) {
        const firstTarget = clickHistory[0].target;
        const allSame = clickHistory.every(c => c.target === firstTarget);
        if (allSame) {
          incrementRageClicks();
          trackTelemetry({
            eventType: "CLIENT_ERROR",
            metadata: {
              errorType: "RAGE_CLICKS_DETECTED",
              targetTag: firstTarget.tagName || "unknown",
              targetId: firstTarget.id || "unknown",
              targetClass: firstTarget.className || "unknown"
            }
          });
          clickHistory = []; // Reset history
        }
      }
    };
    window.addEventListener("click", handleClick);

    // Cleanup listeners
    return () => {
      clearInterval(timeInterval);
      window.removeEventListener("mousemove", recordUserActivity);
      window.removeEventListener("keydown", recordUserActivity);
      window.removeEventListener("click", recordUserActivity);
      window.removeEventListener("scroll", recordUserActivity);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  const handleExplodeComplete = () => {
    setShowRuneLoader(false);
    setIsExploding(false);
  };

  useEffect(() => {
    if (!username) return;
    const saved = localStorage.getItem(`kaevrix_roadmap_progress_${username}`);
    if (saved) {
      try {
        const roadmap = JSON.parse(saved);
        let milestones = [];
        if (roadmap.level1?.milestones?.some(m => m.status !== "completed")) {
          milestones = roadmap.level1.milestones;
        } else if (roadmap.level2?.milestones?.some(m => m.status !== "completed")) {
          milestones = roadmap.level2.milestones;
        } else if (roadmap.level3?.milestones?.some(m => m.status !== "completed")) {
          milestones = roadmap.level3.milestones;
        } else {
          milestones = roadmap.level3?.milestones || [];
        }
        
        // Only show completed and currently unlocked milestones, hide future locked ones
        milestones = milestones.filter(m => m.status !== "locked");
        
        setActiveMilestones(milestones);
      } catch (e) {
        console.error("Failed to parse roadmap logic in Dashboard:", e);
      }
    }
  }, [username, activeTab]);

  const selectedVideoRef = useRef(selectedVideo);
  useEffect(() => {
    selectedVideoRef.current = selectedVideo;
  }, [selectedVideo]);

  // Load topic from actual AI-generated roadmap (avoids pasting user's raw prompt)
  const roadmapKey = `kaevrix_roadmap_progress_${username}`;
  const savedRoadmapStr = localStorage.getItem(roadmapKey);
  const savedRoadmap = savedRoadmapStr ? JSON.parse(savedRoadmapStr) : null;
  
  // Load answers just as a fallback if no roadmap exists
  const answersKey = `kaevrix_roadmap_answers_${username}`;
  const savedAnswers = localStorage.getItem(answersKey);
  const answers = savedAnswers ? JSON.parse(savedAnswers) : null;
  
  const truncateText = (text, maxLength = 45) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    // Attempt to slice cleanly
    return text.substring(0, maxLength).trim() + "...";
  };

  let rawTopic = savedRoadmap?.topic || (answers && answers[0] ? answers[0].answer : "");
  if (rawTopic.length > 35) {
    // Extract a small relatable title (first 3-4 words) from the massive prompt
    const words = rawTopic.split(/\s+/);
    rawTopic = words.length > 3 ? words.slice(0, 4).join(" ") : rawTopic.substring(0, 30);
  }
  const topic = truncateText(rawTopic);
  const why = truncateText(savedRoadmap?.goal || (answers && answers[1] ? answers[1].answer : ""), 80);

  // Calculate schedule parameters for the quest tracker sidebar
  const getTodayDateString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  const todayDateStr = getTodayDateString();

  const savedSchedule = localStorage.getItem(`kaevrix_roadmap_schedule_${username}`);
  const schedule = savedSchedule ? JSON.parse(savedSchedule) : null;
  const savedTodayProgress = localStorage.getItem(`kaevrix_today_progress_${username}`);
  const todayProgress = savedTodayProgress ? JSON.parse(savedTodayProgress) : null;

  let dailyTarget = 0;
  let completedToday = 0;
  let remainingTodayTarget = 0;
  let velocityStatus = "TRACK";
  let streak = 0;
  let todaysTasks = [];
  let activePendingTasks = [];
  let nextLimitBreakTask = null;
  let completedTodayTasks = [];
  let allIncompleteTasks = [];
  let baselineTarget = 1;
  let quotaDescription = "";

  if (schedule && savedRoadmap) {
    let totalSubtopics = 0;
    let completedSubtopics = 0;
    const allLevels = ["level1", "level2", "level3"];
    
    for (const lk of allLevels) {
      const ms = savedRoadmap[lk]?.milestones || [];
      for (const m of ms) {
        if (m.isEncrypted || !m.keyPoints || m.keyPoints.length === 0) {
          totalSubtopics += 4;
          if (m.status === "completed") completedSubtopics += 4;
        } else {
          totalSubtopics += m.keyPoints.length;
          if (m.status === "completed") {
            completedSubtopics += m.keyPoints.length;
          } else if (m.status === "locked") {
            completedSubtopics += 0;
          } else {
            completedSubtopics += (m.subtopicIndex || 0);
          }
        }
      }
    }

    const elapsedDays = Math.max(0, Math.floor((new Date(todayDateStr) - new Date(schedule.startDate)) / (1000 * 60 * 60 * 24)) + schedule.missedDaysOffset);
    const remainingDays = Math.max(1, schedule.durationDays - elapsedDays);
    
    completedToday = (todayProgress && todayProgress.date === todayDateStr) ? todayProgress.completedToday : 0;
    const completedBeforeToday = Math.max(0, completedSubtopics - completedToday);
    const remainingSubtopicsStartOfToday = Math.max(0, totalSubtopics - completedBeforeToday);
    
    dailyTarget = remainingSubtopicsStartOfToday > 0 ? Math.ceil(remainingSubtopicsStartOfToday / remainingDays) : 0;
    remainingTodayTarget = Math.max(0, dailyTarget - completedToday);
    streak = schedule.streak;

    const targetSubtopicsSoFar = Math.round(totalSubtopics * (elapsedDays / schedule.durationDays));
    if (completedSubtopics > targetSubtopicsSoFar) {
      velocityStatus = "AHEAD";
    } else if (completedSubtopics < targetSubtopicsSoFar) {
      velocityStatus = "BEHIND";
    } else {
      velocityStatus = "TRACK";
    }

    baselineTarget = Math.ceil(totalSubtopics / schedule.durationDays) || 1;
    quotaDescription = `Quota: Baseline of ${baselineTarget}/day is sufficient.`;
    if (dailyTarget > baselineTarget) {
      quotaDescription = `[!]️ Quota increased from ${baselineTarget}/day to catch up.`;
    } else if (dailyTarget < baselineTarget) {
      quotaDescription = `[BONUS] Quota decreased from ${baselineTarget}/day!`;
    }

    // Get flat list of next incomplete subtopics
    const list = [];
    for (const lk of allLevels) {
      const ms = savedRoadmap[lk]?.milestones || [];
      for (const m of ms) {
        if (m.status === "completed") continue;
        if (m.isEncrypted) {
          list.push({
            milestone: m,
            subtopicIndex: 0,
            text: "Decrypt next tier in Pathfinder",
            isEncrypted: true
          });
          continue;
        }
        const startIdx = m.status === "locked" ? 0 : (m.subtopicIndex || 0);
        const keyPoints = m.keyPoints || [];
        for (let i = startIdx; i < keyPoints.length; i++) {
          list.push({
            milestone: m,
            subtopicIndex: i,
            text: keyPoints[i],
            isEncrypted: false
          });
        }
      }
    }
    todaysTasks = list.slice(0, Math.max(2, dailyTarget));
    activePendingTasks = todaysTasks.slice(completedToday);
    nextLimitBreakTask = list.length > 0 ? list[0] : null;
    allIncompleteTasks = list;

    // Get flat list of completed subtopics to extract completed today tasks
    const completedList = [];
    for (const lk of allLevels) {
      const ms = savedRoadmap[lk]?.milestones || [];
      for (const m of ms) {
        if (m.isEncrypted) continue;
        const keyPoints = m.keyPoints || [];
        const completedCount = m.status === "completed" 
          ? keyPoints.length 
          : (m.status === "active" || m.status === "unlocked" || m.status === "revision" ? (m.subtopicIndex || 0) : 0);
        
        for (let i = 0; i < completedCount; i++) {
          completedList.push({
            milestone: m,
            text: keyPoints[i]
          });
        }
      }
    }
    completedTodayTasks = completedToday > 0 ? completedList.slice(-completedToday) : [];
  }

  const cleanMilestoneTitle = (title) => {
    if (!title) return "";
    const rawAns = answers && answers[0] ? answers[0].answer : "";
    let cleaned = title;
    if (rawAns && rawAns.length > 20 && cleaned.includes(rawAns)) {
      cleaned = cleaned.replace(rawAns, "Module:").trim();
    }
    // If it's still weirdly long, just return the last 30 characters (which usually contains the actual subject like "Orientation") or clamp it.
    if (cleaned.length > 45) {
      const words = cleaned.split(" ");
      if (words.length > 4) {
        cleaned = "..." + words.slice(-4).join(" ");
      } else {
        cleaned = cleaned.substring(0, 45) + "...";
      }
    }
    return cleaned;
  };

  // Get active subtopic from roadmap progression
  const getActiveSubtopic = () => {
    if (!activeMilestones || activeMilestones.length === 0) return null;
    const activeMilestone = activeMilestones.find(m => m.status === "active") || activeMilestones.find(m => m.status === "unlocked") || activeMilestones.find(m => m.status !== "completed");
    if (!activeMilestone || activeMilestone.status === "completed") return null;
    
    const subtopicIdx = activeMilestone.subtopicIndex || 0;
    const keyPoints = activeMilestone.keyPoints || [];
    if (subtopicIdx < keyPoints.length) {
      return {
        milestoneTitle: activeMilestone.title,
        subtopic: keyPoints[subtopicIdx]
      };
    }
    return null;
  };

  const activeSubtopicObj = getActiveSubtopic();
  const activeSubtopicStr = activeSubtopicObj ? activeSubtopicObj.subtopic : "";

  // Fetch Recommended for Today videos with instant-load cache & prefetch logic
  useEffect(() => {
    if (!topic || !activeSubtopicStr || searchQuery) {
      setAllTodayVideos([]);
      setTodayCycleIndex(0);
      return;
    }

    let isMounted = true;
    const fetchTodayVideos = async () => {
      // 1. Try serving from cache immediately
      const cacheKey = `kaevrix_cache_rec_v4_${username}_${topic}_${activeSubtopicStr}`;
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAllTodayVideos(parsed);
            setTodayCycleIndex(0);
            setLoadingToday(false);
          }
        } catch (e) {
          console.error("Failed to parse cached recommendations:", e);
        }
      } else {
        setLoadingToday(true);
      }

      const query = activeSubtopicStr;
      try {
        const res = await fetch(`${backendUrl}/api/search?q=${encodeURIComponent(query)}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("kaevrix_token")}` }
        });
        if (res.ok && isMounted) {
          const data = await res.json();
          const sliced = data.slice(0, 16);
          setAllTodayVideos(sliced);
          setTodayCycleIndex(0);
          
          // Update cache
          localStorage.setItem(cacheKey, JSON.stringify(sliced));

          // Clean up old recommendations cache of finished subtopics of this topic
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(`kaevrix_cache_rec_`) && key !== cacheKey) {
              localStorage.removeItem(key);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch today's videos:", err);
      } finally {
        if (isMounted) setLoadingToday(false);
      }
    };

    fetchTodayVideos();
    return () => {
      isMounted = false;
    };
  }, [topic, activeSubtopicStr, searchQuery, backendUrl, username]);

  // Background prefetch logic: look ahead at the next subtopic of this milestone and fetch its recommendation feed
  useEffect(() => {
    if (!topic || !activeMilestones || activeMilestones.length === 0) return;
    const activeMilestone = activeMilestones.find(m => m.status === "active") || activeMilestones.find(m => m.status === "unlocked") || activeMilestones.find(m => m.status !== "completed");
    if (!activeMilestone || activeMilestone.status === "completed") return;

    const subtopicIdx = activeMilestone.subtopicIndex || 0;
    const keyPoints = activeMilestone.keyPoints || [];
    const nextSubtopic = subtopicIdx + 1 < keyPoints.length ? keyPoints[subtopicIdx + 1] : null;

    if (!nextSubtopic) return;

    const prefetchKey = `kaevrix_cache_rec_v4_${username}_${topic}_${nextSubtopic}`;
    if (localStorage.getItem(prefetchKey)) return; // already cached

    const prefetchNext = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/search?q=${encodeURIComponent(nextSubtopic)}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("kaevrix_token")}` }
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem(prefetchKey, JSON.stringify(data.slice(0, 16)));
        }
      } catch (err) {
        console.warn("Failed to prefetch next subtopic recommendations:", err);
      }
    };

    // Pre-fetch in background after 3.5 seconds
    const timer = setTimeout(prefetchNext, 3500);
    return () => clearTimeout(timer);
  }, [topic, activeMilestones, backendUrl, username]);

  // Helper to extract banner pills dynamically from active roadmap
  const getBannerPills = () => {
    if (!topic) return TRENDING_TOPICS;
    
    const roadmapKey = `kaevrix_roadmap_progress_${username}`;
    const savedRoadmap = localStorage.getItem(roadmapKey);
    if (savedRoadmap) {
      try {
        const r = JSON.parse(savedRoadmap);
        const milestones = [
          ...(r.level1?.milestones || []),
          ...(r.level2?.milestones || []),
          ...(r.level3?.milestones || [])
        ];
        
        // Take first 6 milestones
        const titles = milestones.slice(0, 6).map(m => ({
          icon: "*",
          label: m.title,
          color: r.level1?.color || "#ff6a00",
          query: m.searchQuery || `${topic} ${m.title}`
        }));
        if (titles.length > 0) return titles;
      } catch (e) {
        console.error("Error parsing roadmap for banner pills:", e);
      }
    }
    
    return [
      { icon: "[ACAD]", label: `${topic} Basics`, color: "#4f46e5", query: `${topic} basics` },
      { icon: "[DEV]", label: `${topic} Course`, color: "#10b981", query: `${topic} course` },
      { icon: "[CAREER]", label: `${topic} Interview`, color: "#ef4444", query: `${topic} interview` },
      { icon: "[XP]", label: `${topic} Tips`, color: "#f59e0b", query: `${topic} tips` },
    ];
  };

  const activeSubtopicText = allIncompleteTasks && allIncompleteTasks[0] ? allIncompleteTasks[0].text : "";
  const activeMilestoneTitle = allIncompleteTasks && allIncompleteTasks[0] ? allIncompleteTasks[0].milestone.title : "";

  useEffect(() => {
    if (!topic || searchQuery) return;
    
    let isMounted = true;
    const fetchFeed = async () => {
      const currentTopicFocus = activeSubtopicText || activeMilestoneTitle || topic;
      const cacheKey = `kaevrix_feed_v4_${username}_${encodeURIComponent(currentTopicFocus)}_${encodeURIComponent(why)}`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPersonalizedFeed(parsed);
            if (!selectedVideoRef.current && isMounted) {
              setSelectedVideo(parsed[0]);
            }
            return;
          }
        } catch (e) {
          console.error("Error loading cached feed:", e);
        }
      }

      setLoadingFeed(true);
      try {
        const res = await fetch(`${backendUrl}/api/personalized-feed`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("kaevrix_token")}`
          },
          body: JSON.stringify({ topic: currentTopicFocus, why })
        });
        if (res.ok && isMounted) {
          const data = await res.json();
          const videos = data.videos || [];
          setPersonalizedFeed(videos);
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify(videos));
          } catch (e) {
            console.error("Error setting session storage cache:", e);
          }
          if (videos.length > 0 && !selectedVideoRef.current) {
            setSelectedVideo(videos[0]);
          }
        }
      } catch (err) {
        console.error("Error loading personalized feed:", err);
      } finally {
        if (isMounted) setLoadingFeed(false);
      }
    };
    
    fetchFeed();
    return () => {
      isMounted = false;
    };
  }, [topic, activeMilestoneTitle, why, searchQuery, backendUrl, setSelectedVideo, username]);

  const handleTabChange = (tab) => {
    handleGatedTabChange(tab);
  };

  const handleSelectVideo = (video) => {
    sound.playClockTick();
    if (searchQuery) {
      const index = searchResults.findIndex(r => r.id === video.id);
      trackTelemetry({
        eventType: "SEARCH_RESULT_CLICKED",
        metadata: {
          query: searchQuery,
          videoId: video.id,
          videoTitle: video.title,
          index: index !== -1 ? index : 0
        }
      });
    }
    const activeSubtopicText = allIncompleteTasks && allIncompleteTasks[0] ? allIncompleteTasks[0].text : "";
    setSelectedVideo({
      ...video,
      activeSubtopic: activeSubtopicText
    });
    setStatus("mode_selection");
  };

  const getVideoCardStyle = (video) => ({
    display: "flex", 
    flexDirection: "column",
  });

  const renderVideoCardContent = (video, defaultCategory) => {
    const category = video.category || defaultCategory || "Training";
    const catStyle = getCategoryStyle(category);
    return (
      <>
        {/* 16:9 Thumbnail */}
        <div className="hud-thumbnail-wrap">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="hud-thumbnail-img"
            style={{ opacity: 0.92 }}
          />
          {/* Gradient overlay */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)" }} />



          {/* Duration */}
          <span style={{ position: "absolute", bottom: "10px", right: "10px", background: "rgba(0,0,0,0.75)", color: "#fff", padding: "3px 7px", borderRadius: "5px", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.85 }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            {Math.floor((video.duration || 300) / 60)}:{String((video.duration || 300) % 60).padStart(2, '0')}
          </span>
          
          {/* HUD Tech learning progress bar */}
          <div className="hud-progress-bar-hud">
            <div className="hud-progress-bar-hud-fill" style={{ width: selectedVideo?.id === video.id ? "100%" : "30%" }}></div>
          </div>
        </div>

        {/* Card Info */}
        <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Tags */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "9px", fontWeight: "800", color: catStyle.color, background: catStyle.bg, padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase", border: `1px solid ${catStyle.color}25` }}>{category}</span>
            <span style={{ fontSize: "9px", fontWeight: "800", color: "#4338ca", background: "#e0e7ff", padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase", border: "1px solid rgba(67, 56, 202, 0.15)" }}>TRENDING</span>
          </div>

          <h4 style={{ fontSize: "14.5px", fontWeight: "800", color: "var(--text-light)", marginBottom: "6px", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: "1.35", fontFamily: "var(--font-outfit)" }}>
            {video.title}
          </h4>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "auto", display: "flex", alignItems: "center", gap: "4px", fontWeight: "600", textTransform: "uppercase", fontFamily: "monospace", letterSpacing: "0.2px" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}><rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>
            {video.channel}
          </p>
        </div>
      </>
    );
  };

  const renderNavIcon = (id, locked) => {
    if (locked) return <Lock size={15} />;
    switch (id) {
      case "profile": return <User size={16} />;
      case "duels": return <Swords size={16} />;
      case "pathfinder": return <Compass size={16} />;
      case "chronos": return <Clock size={16} />;
      case "history": return <History size={16} />;
      case "community": return <Users size={16} />;
      case "rankings": return <Trophy size={16} />;
      default: return <Compass size={16} />;
    }
  };

  const navItems = [
    { id: "profile", label: "Profile" },
    { id: "duels", label: "Arena" },
    { id: "pathfinder", label: "Pathfinder" },
    { id: "chronos", label: "Chronos" },
    { id: "history", label: "History" },
    { id: "community", label: "Community" },
    { id: "rankings", label: "Global Rankings" },
  ];

  const isProfile = activeTab === "profile";
  const sidebarAccentColor = isProfile ? profileAccentColor : "#ea580c";

  return (
    <div className="dashboard-wrapper">

      {/* Sidebar Navigation */}
      <div id="tour-sidebar-nav" className={`dashboard-sidebar ${isDarkMode ? "dark-theme" : "light-theme"}`}>
        <div style={{ marginBottom: "8px", padding: "0 12px" }} className="dashboard-sidebar-title">
          <span style={{ fontSize: "10px", fontWeight: "800", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "2px", fontFamily: "var(--font-gamer)" }}>NAVIGATION SYSTEM</span>
        </div>
        <div className="dashboard-sidebar-nav">
          {navItems.map(item => {
            const locked = isTabLocked(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`hud-nav-btn ${activeTab === item.id ? "hud-nav-btn-active" : ""}`}
                style={{ 
                  width: "100%",
                  ...(locked ? { opacity: 0.45, filter: "grayscale(0.5)" } : {})
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "20px" }}>
                  {renderNavIcon(item.id, locked)}
                </span>
                <span style={{ fontFamily: "var(--font-outfit)" }}>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Stats Widget */}
        <div className="hud-stats-box dashboard-stats-widget" style={{ marginTop: "24px" }}>
          <div style={{ fontSize: "10px", fontWeight: "800", color: sidebarAccentColor, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "12px", fontFamily: "var(--font-gamer)", display: "flex", alignItems: "center", gap: "5px" }}>
            <span className="hud-pulse-dot" style={{ color: sidebarAccentColor }} />
            LIVE ACTIVITY
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
              <span style={{ color: "var(--text-muted)", fontWeight: "500" }}>Battles now</span>
              <span style={{ fontWeight: "800", color: sidebarAccentColor, fontFamily: "monospace" }}>1,247</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
              <span style={{ color: "var(--text-muted)", fontWeight: "500" }}>Players online</span>
              <span style={{ fontWeight: "800", color: "#10b981", fontFamily: "monospace" }}>3,821</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
              <span style={{ color: "var(--text-muted)", fontWeight: "500" }}>Videos in queue</span>
              <span style={{ fontWeight: "800", color: "#8b5cf6", fontFamily: "monospace" }}>94</span>
            </div>
          </div>
          
          {/* Waveform graphic inside the widget for gaming aesthetic */}
          <div style={{ height: "20px", marginTop: "14px", opacity: 0.25, display: "flex", alignItems: "flex-end", gap: "2px" }}>
            <div style={{ flex: 1, height: "40%", background: sidebarAccentColor, borderRadius: "1px", animation: "pulse 1.2s infinite alternate" }} />
            <div style={{ flex: 1, height: "70%", background: sidebarAccentColor, borderRadius: "1px", animation: "pulse 0.8s infinite alternate-reverse" }} />
            <div style={{ flex: 1, height: "25%", background: sidebarAccentColor, borderRadius: "1px", animation: "pulse 1.5s infinite alternate" }} />
            <div style={{ flex: 1, height: "90%", background: sidebarAccentColor, borderRadius: "1px", animation: "pulse 0.6s infinite alternate-reverse" }} />
            <div style={{ flex: 1, height: "50%", background: sidebarAccentColor, borderRadius: "1px", animation: "pulse 1.1s infinite alternate" }} />
            <div style={{ flex: 1, height: "75%", background: sidebarAccentColor, borderRadius: "1px", animation: "pulse 0.9s infinite alternate-reverse" }} />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="dashboard-content">
        {activeTab === "profile" && (
          <ProfilePanel 
            username={username} 
            selectedClass={selectedClass} 
            onSurpassLimits={onSurpassLimits} 
            onTestJourneyDay={onTestJourneyDay} 
            handleLogout={handleLogout} 
            leaderboard={leaderboard}
            backendUrl={backendUrl}
            getRankTitle={getRankTitle}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            isMusicMuted={isMusicMuted}
            setIsMusicMuted={setIsMusicMuted}
            musicProfile={musicProfile}
            setMusicProfile={setMusicProfile}
            socket={socket}
            showSystemSettings={showSystemSettings}
            setShowSystemSettings={setShowSystemSettings}
            setProfileAccentColor={setProfileAccentColor}
          />
        )}

        {(activeTab === "duels" || activeTab === "study" || activeTab === "arena") && (
          <div style={{ padding: "0 clamp(16px, 4vw, 24px)", boxSizing: "border-box" }}>
            {/* Header Area */}
            {searchQuery ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div>
                  <h2 style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-light)", marginBottom: "4px" }}>
                    Results for "{searchQuery}"
                  </h2>
                  <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: 0 }}>
                    {isSearching ? "Scanning the learning grid..." : `${searchResults?.length || 0} videos found`}
                  </p>
                </div>
                <button onClick={() => onSearch && onSearch("")} style={{ padding: "8px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#fff", color: "var(--text-muted)", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
                  ✕ Clear Search
                </button>
              </div>
            ) : topic ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "24px" }}>
                <div>
                  <div style={{ fontSize: "9px", fontWeight: "800", color: "var(--text-muted)", letterSpacing: "2.5px", fontFamily: "var(--font-gamer)", textTransform: "uppercase", marginBottom: "2px" }}>
                    ACTIVE PATHWAY
                  </div>
                  <h1 style={{ 
                    fontSize: "26px", 
                    fontWeight: "900", 
                    margin: 0, 
                    color: "var(--text-light)",
                    lineHeight: "1.2",
                    fontFamily: "var(--font-outfit)",
                    letterSpacing: "-0.5px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {topic.length > 60 ? topic.substring(0, 60) + "..." : topic}
                  </h1>
                </div>
                {activeSubtopicObj && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                    <span className="hud-tag hud-tag-green" style={{ fontSize: "10px", fontWeight: "800", padding: "4px 10px", borderRadius: "6px" }}>
                      <span className="hud-pulse-dot" />
                      TARGET DIRECTIVE // {activeSubtopicObj.subtopic}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "26px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "14px" }}>
                  <div>
                    <div style={{ fontSize: "10px", fontWeight: "800", color: "#ff6a00", letterSpacing: "2.5px", fontFamily: "var(--font-gamer)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "7px", marginBottom: "4px" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", display: "inline-block", boxShadow: "0 0 10px #ef4444", animation: "pulse 1.5s infinite" }} />
                      ARENA COMBAT HUB // LIVE 1v1 DUEL SIMULATIONS
                    </div>
                    <h1 style={{ 
                      fontSize: "28px", 
                      fontWeight: "900", 
                      margin: 0, 
                      color: "var(--text-light)",
                      lineHeight: "1.2",
                      fontFamily: "var(--font-outfit)",
                      letterSpacing: "-0.5px"
                    }}>
                      Featured Combat Simulations
                    </h1>
                    <p style={{ margin: "6px 0 0 0", color: "var(--text-muted)", fontSize: "14px", maxWidth: "640px", lineHeight: "1.5" }}>
                      Challenge online duelists in real-time video breakdown and quiz clashes, or sharpen your skills in Solo Study mode.
                    </p>
                  </div>

                  {/* Realtime Arena Server Stats */}
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "18px", 
                    background: isDarkMode ? "rgba(255, 255, 255, 0.03)" : "#ffffff", 
                    padding: "10px 18px", 
                    borderRadius: "14px", 
                    border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.03)"
                  }}>
                    <div>
                      <div style={{ fontSize: "9px", fontWeight: "800", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "var(--font-gamer)" }}>WARRIORS ONLINE</div>
                      <div style={{ fontSize: "16px", fontWeight: "900", color: "#10b981", fontFamily: "monospace" }}>1,482</div>
                    </div>
                    <div style={{ width: "1px", height: "24px", background: isDarkMode ? "rgba(255,255,255,0.1)" : "#e2e8f0" }} />
                    <div>
                      <div style={{ fontSize: "9px", fontWeight: "800", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "var(--font-gamer)" }}>ACTIVE DUELS</div>
                      <div style={{ fontSize: "16px", fontWeight: "900", color: "#f59e0b", fontFamily: "monospace" }}>324</div>
                    </div>
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px", overflowX: "auto", paddingBottom: "4px" }}>
                  {["All", "Algorithms", "System Design", "Networking", "Database", "Performance"].map(cat => {
                    const active = arenaCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          sound.playClockTick();
                          setArenaCategory(cat);
                        }}
                        style={{
                          background: active ? (isDarkMode ? "rgba(255, 106, 0, 0.18)" : "#ff6a00") : (isDarkMode ? "rgba(255, 255, 255, 0.04)" : "#ffffff"),
                          color: active ? (isDarkMode ? "#ff6a00" : "#ffffff") : "var(--text-muted)",
                          border: active ? "1px solid #ff6a00" : (isDarkMode ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0"),
                          padding: "6px 14px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "700",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {showRuneLoader ? (
              <CanvasRuneLoader
                isExploding={isExploding}
                onExplodeComplete={handleExplodeComplete}
                isDarkMode={isDarkMode}
                statusText="Entering the Arena"
                subtopic={searchQuery}
              />
            ) : searchQuery ? (
              // Search results mode
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                {(searchResults || []).map((video, idx) => (
                  <div
                    key={`search-vid-${video.id || idx}-${idx}`}
                    onClick={() => handleSelectVideo(video)}
                    className={`hud-card ${selectedVideo?.id === video.id ? "hud-card-active" : ""}`}
                    style={getVideoCardStyle(video)}
                  >
                    {renderVideoCardContent(video)}
                  </div>
                ))}
              </div>
            ) : topic ? (
              // Split Feeds: Recommended for Today & Explore
              <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
                {/* 1. Active Mission (Recommended) */}
                <div id="tour-recommended-videos">
                  <div className="hud-feed-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div className="hud-feed-header-line" />
                      <h3 className="hud-feed-title" style={{ fontSize: "14px", fontWeight: "800", color: "var(--text-muted)", letterSpacing: "0.5px", margin: 0 }}>
                        RECOMMENDED FOR TODAY
                      </h3>
                    </div>
                  </div>
                  
                  {todayVideos.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                      {todayVideos.map((video, idx) => (
                        <div
                          key={`today-vid-${video.id || idx}-${idx}`}
                          onClick={() => handleSelectVideo(video)}
                          className={`hud-card ${selectedVideo?.id === video.id ? "hud-card-active" : ""}`}
                          style={getVideoCardStyle(video)}
                        >
                          {renderVideoCardContent(video, "Core Tutorial")}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: "24px", textAlign: "center", background: isDarkMode ? "rgba(255,255,255,0.01)" : "#f8fafc", borderRadius: "12px", border: "1px dashed var(--glass-border)", color: "var(--text-muted)", fontSize: "13px" }}>
                      {activeSubtopicObj ? "Finding best tutorials for today's objective..." : "Initialize Pathfinder to get custom daily objectives."}
                    </div>
                  )}
                </div>

                {/* 2. Radar (Explore) */}
                <div>
                  <div className="hud-feed-header" style={{ marginTop: "24px" }}>
                    <div className="hud-feed-header-line" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)", boxShadow: "0 0 10px #3b82f6" }} />
                    <h3 className="hud-feed-title" style={{ fontSize: "14px", fontWeight: "800", color: "var(--text-muted)", letterSpacing: "0.5px" }}>
                      KNOWLEDGE BOOSTER (HACKS, TRICKS & DEEP DIVES)
                    </h3>
                  </div>

                  {personalizedFeed.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                      {personalizedFeed.map((video, idx) => (
                        <div
                          key={`feed-vid-${video.id || idx}-${idx}`}
                          onClick={() => handleSelectVideo(video)}
                          className={`hud-card ${selectedVideo?.id === video.id ? "hud-card-active" : ""}`}
                          style={getVideoCardStyle(video)}
                        >
                          {renderVideoCardContent(video)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: "24px", textAlign: "center", background: isDarkMode ? "rgba(255,255,255,0.01)" : "#f8fafc", borderRadius: "12px", border: "1px dashed var(--glass-border)", color: "var(--text-muted)", fontSize: "13px" }}>
                      No recommendations found. Try adjusting your Pathfinder goals.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Arena Featured Combat Videos Grid
              <div id="tour-recommended-videos" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                  {(filteredBattleVideos || []).map((video, idx) => (
                    <div
                      key={`arena-vid-${video.id || idx}-${idx}`}
                      onClick={() => handleSelectVideo(video)}
                      className={`hud-card ${selectedVideo?.id === video.id ? "hud-card-active" : ""}`}
                      style={getVideoCardStyle(video)}
                    >
                      {renderVideoCardContent(video)}
                    </div>
                  ))}
                </div>

                {/* Pathfinder Roadmap CTA Banner */}
                <div style={{
                  padding: "20px 24px",
                  borderRadius: "16px",
                  background: isDarkMode 
                    ? "linear-gradient(135deg, rgba(255, 106, 0, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%)" 
                    : "linear-gradient(135deg, #fff7ed 0%, #f5f3ff 100%)",
                  border: isDarkMode ? "1px solid rgba(255, 106, 0, 0.2)" : "1px solid #fed7aa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "16px"
                }}>
                  <div>
                    <div style={{ fontSize: "10px", fontWeight: "800", color: "#ff6a00", letterSpacing: "1.5px", fontFamily: "var(--font-gamer)", textTransform: "uppercase" }}>
                      BESPOKE CURRICULUM
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-light)", marginTop: "2px" }}>
                      Looking for a custom learning path with milestone progression?
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
                      Generate an AI-powered cognitive roadmap tailored to your specific engineering goals.
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      sound.playClockTick();
                      handleTabChange("pathfinder");
                    }}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "10px",
                      background: "var(--accent-gradient)",
                      border: "none",
                      color: "#ffffff",
                      fontSize: "13px",
                      fontWeight: "800",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: "0 4px 14px rgba(255, 106, 0, 0.3)",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <span>Launch Pathfinder</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}


          </div>
        )}

        {activeTab === "community" && (
          <div style={{ padding: "0 clamp(16px, 4vw, 24px)", boxSizing: "border-box" }}>
            <CommunityTab 
              username={username}
              backendUrl={backendUrl}
              getRankTitle={getRankTitle}
              isDarkMode={isDarkMode}
              socket={socket}
              featureGates={featureGates}
            />
          </div>
        )}

        {activeTab === "pathfinder" && (
          <div style={{ padding: "0", boxSizing: "border-box", width: "100%" }}>
            <CognitivePathfinder
              username={username}
              onTriggerSearch={(topicName) => {
                if (onSearch) onSearch(topicName);
                setActiveTab("duels");
              }}
              onStartSoloStudy={onStartSoloStudy}
              isDarkMode={isDarkMode}
              featureGates={featureGates}
              setLockedFeatureAlert={setLockedFeatureAlert}
              setStatus={setStatus}
              practiceContext={practiceContext}
              setPracticeContext={setPracticeContext}
            />
          </div>
        )}

        {activeTab === "chronos" && (
          <div style={{ padding: "0 clamp(16px, 4vw, 24px)", boxSizing: "border-box" }}>
            <PathfinderScheduler
              roadmap={savedRoadmap}
              username={username}
              isDarkMode={isDarkMode}
              onSelectMilestone={(m) => {
                sound.playClockTick();
                setActiveTab("pathfinder");
              }}
              showSettings={showSchedulerSettings}
              setShowSettings={setShowSchedulerSettings}
            />
          </div>
        )}

        {activeTab === "history" && (
          <div className="history-tab-container" style={{ padding: "0 clamp(16px, 4vw, 24px)", boxSizing: "border-box" }}>
            <StudyHistory
              username={username}
              isDarkMode={isDarkMode}
              onStartSoloStudy={onStartSoloStudy}
            />
          </div>
        )}

        {activeTab === "rankings" && (
          <div style={{ padding: "0 clamp(16px, 4vw, 24px)", boxSizing: "border-box" }}>
            <div style={{ marginBottom: "36px" }}>
              <div style={{ fontSize: "11px", fontWeight: "800", color: "var(--neon-orange)", letterSpacing: "4px", marginBottom: "10px", fontFamily: "var(--font-gamer)" }}>
                GLOBAL RANKINGS
              </div>
              <h2 style={{ 
                fontSize: "44px", fontWeight: "900", margin: 0, lineHeight: 1.1, 
                fontFamily: "var(--font-outfit)", letterSpacing: "-2px",
                background: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
              }}>
                The Top Duelists
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "15px", margin: "10px 0 0", fontWeight: "500" }}>
                Legends across all domains.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {leaderboard.map((player, index) => {
                const isTop3 = index < 3;
                const rankColor = index === 0 ? "var(--neon-gold)" : index === 1 ? "#cbd5e1" : index === 2 ? "#cd7f32" : "var(--text-muted)";
                const rankGlow = index === 0 ? "0 0 15px rgba(255,179,0,0.6)" : index === 1 ? "0 0 10px rgba(203,213,225,0.4)" : index === 2 ? "0 0 10px rgba(205,127,50,0.4)" : "none";
                const isMe = player.username?.toLowerCase() === username?.toLowerCase();
                const playerAvatar = player.avatar || (isMe && avatar ? avatar : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(player.username || "Scholar")}&backgroundColor=transparent`);

                return (
                  <div key={player.username} className="rankings-row" style={{ 
                    position: "relative",
                    display: "flex", alignItems: "center", gap: "24px", padding: "16px 24px", 
                    borderRadius: "4px", cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    background: isMe ? "linear-gradient(90deg, rgba(255,106,0,0.1) 0%, transparent 100%)" : "rgba(255,255,255,0.02)",
                    borderLeft: `4px solid ${isMe ? "var(--neon-orange)" : isTop3 ? rankColor : "transparent"}`,
                    overflow: "hidden"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "linear-gradient(90deg, rgba(255,106,0,0.15) 0%, rgba(255,106,0,0.02) 100%)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = isMe ? "linear-gradient(90deg, rgba(255,106,0,0.1) 0%, transparent 100%)" : "rgba(255,255,255,0.02)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                  >
                    {/* Background glow for Top 3 */}
                    {isTop3 && (
                      <div style={{
                        position: "absolute", top: 0, bottom: 0, left: 0, width: "100px",
                        background: `linear-gradient(90deg, ${rankColor} 0%, transparent 100%)`,
                        opacity: 0.05, pointerEvents: "none"
                      }} />
                    )}

                    {/* Rank Number */}
                    <div style={{ 
                      width: "40px", textAlign: "right", fontSize: isTop3 ? "32px" : "20px", 
                      fontWeight: "900", color: rankColor, fontFamily: "var(--font-gamer)", 
                      textShadow: rankGlow, fontStyle: "italic", letterSpacing: "-2px" 
                    }}>
                      {index + 1}
                    </div>
                    
                    {/* Avatar */}
                    <div className="rankings-avatar-container" style={{ 
                      width: "56px", height: "56px", borderRadius: "12px", 
                      position: "relative", flexShrink: 0, overflow: "hidden", 
                      border: `2px solid ${isTop3 ? rankColor : "var(--glass-border)"}`, 
                      boxShadow: isTop3 ? rankGlow : "none",
                      transform: "rotate(45deg)"
                    }}>
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(-45deg) scale(1.45)" }}>
                        {playerAvatar && playerAvatar.includes('http') ? (
                          <img src={playerAvatar} alt={player.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : playerAvatar ? (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", background: "var(--bg-dark-surface)" }}>{playerAvatar}</div>
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-dark-surface)" }}>
                            <User size={20} color="var(--text-muted)" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* User Info */}
                    <div className="rankings-user-info" style={{ flex: 1, marginLeft: "12px" }}>
                      <div style={{ 
                        fontWeight: "800", color: isMe ? "var(--neon-orange)" : "var(--text-light)", 
                        fontSize: "18px", fontFamily: "var(--font-outfit)", letterSpacing: "1px", 
                        textTransform: "uppercase" 
                      }}>
                        {player.username}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--neon-orange)", marginTop: "4px", fontWeight: "700", fontFamily: "var(--font-gamer)", letterSpacing: "2px" }}>
                        {player.rank || (getRankTitle ? getRankTitle(player.level || 1) : "Grandmaster Spectator")}
                      </div>
                    </div>

                    {/* Stats HUD Block */}
                    <div className="rankings-stats-hud" style={{ display: "flex", alignItems: "center", gap: "32px", borderLeft: "1px solid var(--glass-border)", paddingLeft: "32px" }}>
                      {/* Level Hexagon */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "60px" }}>
                        <div style={{ 
                          fontSize: "24px", fontWeight: "900", color: "var(--text-light)", 
                          fontFamily: "var(--font-gamer)", lineHeight: 1 
                        }}>
                          {player.level || 1}
                        </div>
                        <div style={{ fontSize: "9px", color: "var(--text-muted)", fontWeight: "800", letterSpacing: "2px", marginTop: "4px" }}>
                          LEVEL
                        </div>
                      </div>

                      {/* Score/XP */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "80px" }}>
                        <div style={{ 
                          fontSize: "18px", fontWeight: "800", color: "var(--neon-orange)", 
                          fontFamily: "var(--font-outfit)", lineHeight: 1 
                        }}>
                          {(player.xp || 0).toLocaleString()}
                        </div>
                        <div style={{ fontSize: "9px", color: "var(--text-muted)", fontWeight: "800", letterSpacing: "2px", marginTop: "4px" }}>
                          SCORE
                        </div>
                      </div>

                      {/* Combat Record */}
                      <div style={{ display: "flex", flexDirection: "column", width: "100px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontSize: "10px", fontWeight: "800", color: "var(--neon-green)" }}>{player.wins || 0} W</span>
                          <span style={{ fontSize: "10px", fontWeight: "800", color: "var(--text-muted)" }}>-</span>
                          <span style={{ fontSize: "10px", fontWeight: "800", color: "var(--neon-pink)" }}>{player.losses || 0} L</span>
                        </div>
                        <div style={{ width: "100%", height: "4px", background: "var(--glass-border)", display: "flex" }}>
                          <div style={{ 
                            width: `${(player.wins || 0) + (player.losses || 0) === 0 ? 50 : ((player.wins || 0) / ((player.wins || 0) + (player.losses || 0))) * 100}%`, 
                            height: "100%", background: "var(--neon-green)" 
                          }} />
                          <div style={{ flex: 1, height: "100%", background: "var(--neon-pink)" }} />
                        </div>
                        <div style={{ fontSize: "9px", color: "var(--text-muted)", fontWeight: "800", letterSpacing: "2px", marginTop: "6px", textAlign: "center" }}>
                          WIN RATIO
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Right Sidebar: Quest Tracker (Desktop Sticky + Mobile Floating FAB / Bottom Sheet) */}
      {(activeTab === "duels" || activeTab === "study" || activeTab === "arena") && (() => {
        // Collect all subtopics for today
        const todaySubtopics = [];
        
        // 1. Completed today subtopics (keep most recent 2 so it is crisp)
        if (completedTodayTasks && completedTodayTasks.length > 0) {
          const recentCompleted = completedTodayTasks.slice(-2);
          recentCompleted.forEach(t => {
            todaySubtopics.push({
              text: t.text,
              milestone: t.milestone,
              isDone: true,
              isActive: false
            });
          });
        }

        // 2. Incomplete tasks for today (active + remaining to reach daily target)
        if (allIncompleteTasks && allIncompleteTasks.length > 0) {
          const needed = remainingTodayTarget > 0 ? Math.min(3, remainingTodayTarget + 1) : 2;
          const upcomingToday = allIncompleteTasks.slice(0, needed);
          upcomingToday.forEach((t, idx) => {
            todaySubtopics.push({
              text: t.text,
              milestone: t.milestone,
              isDone: false,
              isActive: idx === 0
            });
          });
        }

        // Fallback to match JavaScript curriculum & featured video titles exactly
        if (todaySubtopics.length === 0) {
          todaySubtopics.push(
            { text: "Object.create vs constructor prototypes", isDone: true, isActive: false },
            { text: "Microtask Queue vs Macrotask Queue", isDone: true, isActive: false },
            { text: "Generational Garbage Collection (Young vs Old gen)", isDone: false, isActive: true },
            { text: "V8 Scavenger (Minor GC) vs Major GC: Mark-Sweep", isDone: false, isActive: false },
            { text: "Memory Leaks, V8 Heap Profiling & GC Optimization", isDone: false, isActive: false }
          );
        }

        const rawMilestoneTitle = allIncompleteTasks[0]?.milestone?.title || activeMilestoneTitle || "Memory Lifecycle & Garbage Collection";
        const cleanedMilestone = cleanMilestoneTitle(rawMilestoneTitle);
        const nodeHeading = (cleanedMilestone.startsWith("...") ? "" : "...") + cleanedMilestone;
        const pendingCount = todaySubtopics.filter(t => !t.isDone).length;
        const doneCount = todaySubtopics.filter(t => t.isDone).length;

        return (
          <>
            {/* Desktop Sticky Right Sidebar */}
            <div id="tour-quest-tracker" className="dashboard-quest-sidebar" style={{ width: "290px", display: "flex", flexDirection: "column", gap: "14px", flexShrink: 0, position: "sticky", top: "20px" }}>
              <div style={{
                background: isDarkMode ? "#111116" : "#ffffff",
                borderRadius: "20px",
                padding: "24px 22px",
                border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #f1f5f9",
                boxShadow: isDarkMode ? "0 10px 30px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column"
              }}>
                
                {/* Header */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: "14px",
                  borderBottom: isDarkMode ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #f1f5f9"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff6a00" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m12 2 10 5-10 5L2 7z" />
                      <path d="m2 12 10 5 10-5" />
                      <path d="m2 17 10 5 10-5" />
                    </svg>
                    <span style={{ fontSize: "12px", fontWeight: "900", color: "#ff6a00", textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: "var(--font-gamer)" }}>
                      QUEST TRACKER
                    </span>
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "#ff6a00", fontFamily: "monospace" }}>
                    {doneCount}/{todaySubtopics.length} Done
                  </span>
                </div>

                {/* Node Title */}
                <div style={{
                  padding: "14px 0 12px 0",
                  borderBottom: isDarkMode ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid #f1f5f9"
                }}>
                  <div style={{
                    fontSize: "11.5px",
                    fontWeight: "900",
                    color: "var(--text-light)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    fontFamily: "var(--font-gamer)",
                    lineHeight: "1.4"
                  }}>
                    {nodeHeading.toUpperCase()}
                  </div>
                </div>

                {/* Subtopics Checklist */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
                  {todaySubtopics.map((task, idx) => {
                    const isDone = task.isDone;
                    const isActive = task.isActive;

                    return (
                      <div
                        key={`quest-row-${idx}`}
                        onClick={() => {
                          if (!isDone && onSearch) {
                            sound.playClockTick();
                            onSearch(task.milestone?.searchQuery || task.milestone?.title || task.text);
                          }
                        }}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                          cursor: isDone ? "default" : "pointer",
                          transition: "all 0.2s ease"
                        }}
                      >
                        {/* Status Icon */}
                        <div style={{ marginTop: "2px", flexShrink: 0 }}>
                          {isDone ? (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : isActive ? (
                            <div style={{
                              width: "14px",
                              height: "14px",
                              borderRadius: "50%",
                              border: "2.5px solid #ff6a00",
                              background: "transparent",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}>
                              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#ff6a00" }} />
                            </div>
                          ) : (
                            <div style={{
                              width: "13px",
                              height: "13px",
                              borderRadius: "50%",
                              border: isDarkMode ? "1.5px solid rgba(255,255,255,0.25)" : "1.5px solid #cbd5e1",
                              background: "transparent"
                            }} />
                          )}
                        </div>

                        {/* Title & Cross-through */}
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: "12.5px",
                            fontWeight: isDone ? "500" : (isActive ? "700" : "500"),
                            color: isDone 
                              ? (isDarkMode ? "rgba(255,255,255,0.38)" : "#94a3b8") 
                              : (isActive ? "var(--text-light)" : (isDarkMode ? "rgba(255,255,255,0.7)" : "#64748b")),
                            textDecoration: isDone ? "line-through" : "none",
                            lineHeight: "1.5",
                            fontFamily: "var(--font-outfit), sans-serif",
                            transition: "all 0.2s ease"
                          }}>
                            {task.text}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Subtle Streak / Velocity Note */}
                <div style={{
                  marginTop: "20px",
                  paddingTop: "14px",
                  borderTop: isDarkMode ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid #f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "11.5px",
                  color: "var(--text-muted)",
                  fontWeight: "600"
                }}>
                  <span>{pendingCount} remaining today</span>
                  <span style={{ color: "#ff6a00", fontWeight: "800", display: "flex", alignItems: "center", gap: "4px" }}>
                    🔥 {streak || 10}d Streak
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Floating Action Button (FAB) [List] */}
            <div className="mobile-quest-fab-container">
              <button
                type="button"
                className="mobile-quest-fab-btn"
                onClick={() => {
                  sound.playClockTick();
                  setIsMobileQuestOpen(true);
                }}
                aria-label="Open Quest Tracker"
                title="Quest Tracker"
              >
                <List size={22} strokeWidth={2.4} color="#ffffff" />
                <span className="mobile-quest-fab-badge">
                  {pendingCount || 2}
                </span>
              </button>
            </div>

            {/* Mobile Quest Tracker Bottom Sheet Modal */}
            {isMobileQuestOpen && (
              <div 
                className="mobile-quest-modal-backdrop"
                onClick={() => setIsMobileQuestOpen(false)}
              >
                <div 
                  className="mobile-quest-modal-card"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mobile-quest-drag-handle" />

                  {/* Modal Header */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingBottom: "12px",
                    borderBottom: isDarkMode ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #f1f5f9"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff6a00" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m12 2 10 5-10 5L2 7z" />
                        <path d="m2 12 10 5 10-5" />
                        <path d="m2 17 10 5 10-5" />
                      </svg>
                      <span style={{ fontSize: "12px", fontWeight: "900", color: "#ff6a00", textTransform: "uppercase", letterSpacing: "1.2px", fontFamily: "var(--font-gamer)" }}>
                        QUEST TRACKER
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "800", color: "#ff6a00", fontFamily: "monospace" }}>
                        {doneCount}/{todaySubtopics.length} Done
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsMobileQuestOpen(false)}
                        style={{
                          background: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                          border: "none",
                          borderRadius: "50%",
                          width: "28px",
                          height: "28px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          color: "var(--text-muted)"
                        }}
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Node Heading */}
                  <div style={{ padding: "10px 0", borderBottom: isDarkMode ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid #f1f5f9" }}>
                    <div style={{ fontSize: "11px", fontWeight: "800", color: "var(--text-light)", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "var(--font-gamer)" }}>
                      {nodeHeading.toUpperCase()}
                    </div>
                  </div>

                  {/* Checklist */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "14px", maxHeight: "360px", overflowY: "auto" }}>
                    {todaySubtopics.map((task, idx) => (
                      <div
                        key={`mob-quest-row-${idx}`}
                        onClick={() => {
                          if (!task.isDone && onSearch) {
                            sound.playClockTick();
                            setIsMobileQuestOpen(false);
                            onSearch(task.milestone?.searchQuery || task.milestone?.title || task.text);
                          }
                        }}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "10px",
                          cursor: task.isDone ? "default" : "pointer"
                        }}
                      >
                        {/* Status Icon */}
                        <div style={{ marginTop: "2px", flexShrink: 0 }}>
                          {task.isDone ? (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : task.isActive ? (
                            <div style={{
                              width: "14px",
                              height: "14px",
                              borderRadius: "50%",
                              border: "2.5px solid #ff6a00",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}>
                              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#ff6a00" }} />
                            </div>
                          ) : (
                            <div style={{
                              width: "13px",
                              height: "13px",
                              borderRadius: "50%",
                              border: isDarkMode ? "1.5px solid rgba(255,255,255,0.25)" : "1.5px solid #cbd5e1"
                            }} />
                          )}
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: "12px",
                            fontWeight: task.isDone ? "500" : (task.isActive ? "700" : "500"),
                            color: task.isDone 
                              ? (isDarkMode ? "rgba(255,255,255,0.38)" : "#94a3b8") 
                              : (task.isActive ? "var(--text-light)" : (isDarkMode ? "rgba(255,255,255,0.7)" : "#64748b")),
                            textDecoration: task.isDone ? "line-through" : "none",
                            lineHeight: "1.4"
                          }}>
                            {task.text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div style={{
                    marginTop: "16px",
                    paddingTop: "12px",
                    borderTop: isDarkMode ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    fontWeight: "700"
                  }}>
                    <span>{pendingCount} remaining today</span>
                    <span style={{ color: "#ff6a00", display: "flex", alignItems: "center", gap: "4px" }}>
                      🔥 {streak || 10}d Streak
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        );
      })()}



    </div>
  );
}
