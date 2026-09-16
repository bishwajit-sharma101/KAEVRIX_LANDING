"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from '@studio-freight/lenis';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from "framer-motion";
import { 
  Play, 
  Sparkles, 
  ChevronDown, 
  Compass, 
  Activity, 
  Swords, 
  Users, 
  Award,
  BrainCircuit,
  Map as MapIcon,
  Crosshair,
  Flame,
  Check,
  Lock,
  Clock,
  Shield,
  Zap,
  Trophy,
  ArrowRight,
  ExternalLink,
  BookOpen,
  FileText,
  Video,
  RotateCcw,
  Code,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import Image from 'next/image';
import AppClient from "../simulator/AppClient";

// =========================================================================
// JOURNEY PHASES DATA WITH EDITORIAL HIERARCHY & RICH METRICS
// =========================================================================
const journeyPhases = [
  {
    phase: "Phase 01",
    numeral: "01",
    shortLabel: "01 Arena",
    kicker: "PHASE 01 • SMART VIDEO FEED",
    titlePrefix: "Enter The ",
    titleHighlight: "Arena.",
    subtitle: "Watch the right videos, in the right order, for what you're learning right now.",
    desc: "No more scrolling through hundreds of tutorials wondering where to start. The Arena picks the best videos for your current topic and gives you a simple checklist so you always know what to watch next.",
    metric: "🎯 Matched to Your Topic • Smart Video Feed",
    icon: Compass,
    color: "var(--accent-sage)",
    colorHex: "#81B29A",
    tags: ["🎯 Topic-Matched Videos", "📺 Smart Video Feed", "⚔️ Progress Checklist"]
  },
  {
    phase: "Phase 02",
    numeral: "02",
    shortLabel: "02 Map",
    kicker: "PHASE 02 • AI SKILL TREES",
    titlePrefix: "Map Your ",
    titleHighlight: "Mastery.",
    subtitle: "Tell us what you want to learn. We'll build your entire roadmap.",
    desc: "Type in any skill or goal — like \"learn React\" or \"become a data scientist.\" Our AI breaks it down into a step-by-step skill tree, showing you exactly what to learn first and what comes next. No guesswork.",
    metric: "⚡ +60 XP Per Topic • Step-by-Step Path",
    icon: MapIcon,
    color: "var(--accent-terracotta)",
    colorHex: "#E07A5F",
    tags: ["✦ Visual Skill Tree", "🧭 Step-by-Step Path", "⚡ AI-Powered Roadmap"]
  },
  {
    phase: "Phase 03",
    numeral: "03",
    shortLabel: "03 Chronos",
    kicker: "PHASE 03 • STUDY TRACKER & STREAKS",
    titlePrefix: "Track Progress with ",
    titleHighlight: "Chronos.",
    subtitle: "See how fast you're learning, keep your streak alive, and know exactly when you'll finish.",
    desc: "A 50-hour course feels overwhelming — until Chronos breaks it down. It tracks how much you study each day, predicts exactly when you'll finish, and keeps your streak alive with daily goals. Stay consistent and watch the progress add up.",
    metric: "⏱️ Study Tracker • Finish Date Predictions",
    icon: Clock,
    color: "var(--accent-terracotta)",
    colorHex: "#E07A5F",
    tags: ["⏱️ Daily Study Tracker", "📅 Finish Date Predictions", "🔥 Streak Multiplier"]
  },
  {
    phase: "Phase 04",
    numeral: "04",
    shortLabel: "04 Sanctum",
    kicker: "PHASE 04 • STUDY & QUIZ",
    titlePrefix: "Enter The ",
    titleHighlight: "Sanctum.",
    subtitle: "Turn any video into study notes and quiz yourself to make sure you actually learned it.",
    desc: "Just watching a video isn't enough. Sanctum turns any tutorial into organized AI study notes, then quizzes you on the key concepts. If you can pass the quiz, you actually know it — not just \"I watched it\" know it.",
    metric: "🏛️ AI Study Notes • Quiz to Prove You Know It",
    icon: BookOpen,
    color: "var(--accent-navy)",
    colorHex: "#3D405B",
    tags: ["🏛️ Solo Study Mode", "📜 AI Study Notes", "⚔️ Knowledge Quizzes"]
  },
  {
    phase: "Phase 05",
    numeral: "05",
    shortLabel: "05 Level Up",
    kicker: "PHASE 05 • SHOW YOUR PROGRESS",
    titlePrefix: "Level Up ",
    titleHighlight: "For Real.",
    subtitle: "Earn XP, unlock cool avatars, and build a profile that proves what you know.",
    desc: "Every quiz you pass and every lesson you complete earns you real XP. Level up, unlock exclusive avatar cosmetics, and build a public profile that shows exactly what skills you've mastered — real proof, not just a certificate.",
    metric: "✨ Unlockable Cosmetics • Verified Skill Profile",
    icon: Flame,
    color: "var(--text-ink)",
    colorHex: "#2D241F",
    tags: ["✨ Unlockable Cosmetics", "🏆 40+ Levels", "📜 Verified Skill Profile"]
  }
];

// =========================================================================
// HERO FLOATING ARTIFACTS & RUNES
// =========================================================================
const floatyBadges = [
  {
    id: "sanctum",
    icon: BookOpen,
    title: "Study & Quiz Mode",
    shortTitle: "Study & Quiz",
    meta: "AI Notes • Auto-Generated",
    shortMeta: "AI Notes",
    color: "var(--accent-terracotta)",
    colorHex: "#E07A5F",
    demoTab: "sanctum",
    animate: { y: [0, -10, 0], x: [0, 4, 0] },
    duration: 6.2,
    delay: 0,
  },
  {
    id: "chronos",
    icon: Clock,
    title: "Study Progress Tracker",
    shortTitle: "Progress Tracker",
    meta: "1.8 hrs/day • PDF Notes",
    shortMeta: "1.8 hrs/day",
    color: "#E76F51",
    colorHex: "#E76F51",
    demoTab: "chronos",
    animate: { y: [0, 9, 0], x: [0, -5, 0] },
    duration: 7.0,
    delay: 0.6,
  },
  {
    id: "tree",
    icon: BrainCircuit,
    title: "Your Skill Tree",
    shortTitle: "Skill Tree",
    meta: "12 Topics Unlocked",
    shortMeta: "12 Unlocked",
    color: "var(--accent-sage)",
    colorHex: "#81B29A",
    demoTab: "pathfinder",
    animate: { y: [0, -8, 0], x: [0, 5, 0] },
    duration: 7.8,
    delay: 1.2,
  },
  {
    id: "tavern",
    icon: Users,
    title: "Study Together",
    shortTitle: "Study Together",
    meta: "4 Friends Online",
    shortMeta: "4 Online",
    color: "var(--accent-navy)",
    colorHex: "#3D405B",
    demoTab: "community",
    animate: { y: [0, 10, 0], x: [0, -4, 0] },
    duration: 6.5,
    delay: 1.8,
  },
];

const floatyRunes = [
  { symbol: "✦", style: { top: "12%", left: "48%", fontSize: "16px", color: "var(--accent-terracotta)", opacity: 0.6 }, dur: 4.8 },
  { symbol: "✧", style: { top: "22%", left: "7%", fontSize: "20px", color: "var(--accent-gold)", opacity: 0.45 }, dur: 6.2 },
  { symbol: "⟡", style: { top: "20%", right: "7%", fontSize: "18px", color: "var(--accent-terracotta)", opacity: 0.5 }, dur: 5.5 },
  { symbol: "◈", style: { bottom: "24%", left: "7%", fontSize: "16px", color: "var(--accent-navy)", opacity: 0.4 }, dur: 7.0 },
  { symbol: "✦", style: { bottom: "22%", right: "7%", fontSize: "18px", color: "var(--accent-terracotta)", opacity: 0.55 }, dur: 5.2 },
  { symbol: "⌘", style: { top: "44%", right: "5%", fontSize: "15px", color: "var(--accent-sage)", opacity: 0.42 }, dur: 6.8 },
  { symbol: "⚔️", style: { top: "42%", left: "5%", fontSize: "14px", opacity: 0.38 }, dur: 6.0 },
  { symbol: "⚡", style: { bottom: "38%", left: "6%", fontSize: "14px", color: "var(--accent-gold)", opacity: 0.45 }, dur: 5.0 },
  { symbol: "🛡️", style: { bottom: "36%", right: "6%", fontSize: "13px", opacity: 0.35 }, dur: 6.4 },
  { symbol: "✧", style: { top: "34%", left: "50%", fontSize: "13px", color: "var(--accent-sage)", opacity: 0.35 }, dur: 5.8 },
];

// =========================================================================
// 5 ULTRA-INTERACTIVE LIVING SHOWCASE COMPONENTS (WITH MICRO-ANIMATIONS)
// =========================================================================

// --- SHOWCASE 01: NEURAL SKILL TREE WITH INTERACTIVE TOPIC & NODES ---
function SkillTreeShowcase({ onOpenDemo }) {
  const topics = [
    { name: "JavaScript Execution Context", nodes: ["Memory Heap", "Scope Chain", "Async Context", "Event Loop"] },
    { name: "React Fiber Reconciliation", nodes: ["JSX Virtual DOM", "Fiber Work Loop", "Concurrent Mode", "Suspense Boundary"] },
    { name: "Distributed Systems Architecture", nodes: ["RPC Transport", "Raft Consensus", "CAP Theorem", "Eventual Sync"] }
  ];

  const [topicIdx, setTopicIdx] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [stage, setStage] = useState("hovered");
  const [selectedNode, setSelectedNode] = useState(1);

  const currentTopic = topics[topicIdx];

  useEffect(() => {
    let timeout;
    let isCancelled = false;
    setDisplayText("");
    setStage("typing");
    let i = 0;
    const typeInterval = setInterval(() => {
      if (isCancelled) {
        clearInterval(typeInterval);
        return;
      }
      i++;
      setDisplayText(currentTopic.name.slice(0, i));
      if (i >= currentTopic.name.length) {
        clearInterval(typeInterval);
        timeout = setTimeout(() => {
          if (isCancelled) return;
          setStage("generated");
          timeout = setTimeout(() => {
            if (isCancelled) return;
            setStage("hovered");
          }, 400);
        }, 300);
      }
    }, 28);

    return () => {
      isCancelled = true;
      clearInterval(typeInterval);
      clearTimeout(timeout);
    };
  }, [topicIdx]);

  const nodeDetails = [
    { title: currentTopic.nodes[0], xp: "+45 XP", dur: "30m", lessons: ["Foundations & Allocations", "Garbage Collection"], state: "completed" },
    { title: currentTopic.nodes[1], xp: "+60 XP", dur: "45m", lessons: ["Lexical Scoping Chains", "Call Stack Push / Pop"], state: "completed" },
    { title: currentTopic.nodes[2], xp: "+90 XP", dur: "1h 15m", lessons: ["Microtask Queues", "Starvation Mitigation"], state: "active" },
    { title: currentTopic.nodes[3], xp: "+120 XP", dur: "1h 45m", lessons: ["Mastery Assessment", "Boss Synthesis Trial"], state: "locked" }
  ];

  return (
    <div className="showcase-glass-card showcase-tree-wrapper">
      <div className="v-prompt-container">
        <button
          type="button"
          className="v-prompt-corner-link"
          onClick={() => {
            if (typeof onOpenDemo === "function") {
              onOpenDemo("pathfinder");
            }
          }}
          title="Experience Demo"
          aria-label="Experience Demo"
        >
          <span className="corner-link-text">Experience Demo</span>
          <ExternalLink size={11} strokeWidth={2.4} />
        </button>

        <div className="v-prompt-bar">
          <div className="v-prompt-left">
            <Sparkles size={14} className="prompt-sparkle" />
            <span className="prompt-tag">PROMPT:</span>
            <span className="prompt-query">{displayText}<span className="prompt-blink">|</span></span>
          </div>
          <button
            type="button"
            className={`v-btn-transmute ${stage !== "typing" ? "active" : ""}`}
            onClick={() => {
              if (typeof onOpenDemo === "function") {
                onOpenDemo("pathfinder");
              }
            }}
            title="Open Pathfinder in Interactive Demo"
          >
            <Sparkles size={12} />
            <span>Transmuted</span>
          </button>
        </div>
      </div>

      <div className="v-tree-stage">
        <div className="v-grid-dots" />
        <svg className="v-svg-tree" viewBox="0 0 460 380" width="460" height="380">
          <defs>
            <linearGradient id="vTreeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#81B29A" stopOpacity="0.95" />
              <stop offset="38%" stopColor="#81B29A" stopOpacity="1" />
              <stop offset="68%" stopColor="#E07A5F" stopOpacity="1" />
              <stop offset="100%" stopColor="#E07A5F" stopOpacity="0.2" />
            </linearGradient>
            <filter id="vTreeGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d="M 120 0 L 120 50 L 220 135 L 140 235 L 230 325"
            fill="none"
            stroke="rgba(45, 36, 31, 0.14)"
            strokeWidth="2.5"
            strokeDasharray="4 4"
          />

          <motion.path
            d="M 120 0 L 120 50 L 220 135 L 140 235 L 230 325"
            fill="none"
            stroke="url(#vTreeGrad)"
            strokeWidth="3.5"
            filter="url(#vTreeGlow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: stage === "typing" ? 0.12 : 0.72 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />

          {selectedNode === 1 && (
            <>
              <motion.line
                x1="220" y1="135" x2="275" y2="135"
                stroke="#81B29A"
                strokeWidth="1.8"
                strokeDasharray="3 3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              <circle cx="275" cy="135" r="3" fill="#81B29A" />
            </>
          )}
        </svg>

        <div 
          className={`v-node completed ${selectedNode === 0 ? "is-selected" : ""}`} 
          style={{ left: "120px", top: "50px" }}
          onClick={() => setSelectedNode(0)}
        >
          <div className="v-halo" />
          <div className="v-core"><Check size={13} strokeWidth={3} /></div>
          <span className="v-title">{currentTopic.nodes[0]}</span>
        </div>

        <div 
          className={`v-node completed ${selectedNode === 1 ? "is-hovered is-selected" : ""}`} 
          style={{ left: "220px", top: "135px" }}
          onClick={() => setSelectedNode(1)}
        >
          <div className="v-halo" />
          <div className="v-core"><Check size={13} strokeWidth={3} /></div>
          <span className="v-title">{currentTopic.nodes[1]}</span>

          <motion.div 
            className="v-hover-tag"
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="hover-pill">
              <span>Inspect</span>
              <span className="hover-dot" />
            </div>
            <div className="hover-pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 3L19 12L12.5 13.5L9.5 20L4 3Z" fill="#2D241F" stroke="#FFFFFF" strokeWidth="1.6"/>
              </svg>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="v-card-popup"
          style={{ left: "275px", top: "135px" }}
          initial={{ y: "-50%", scale: 0.95, opacity: 0 }}
          animate={{
            y: "-50%",
            scale: 1,
            opacity: 1,
            boxShadow: "0 16px 36px -8px rgba(129, 178, 154, 0.28), 0 2px 8px rgba(0,0,0,0.04)"
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div className="v-card-badges">
            <span className="badge-pill sage">VERIFIED NODE</span>
            <span className="badge-pill terra">{nodeDetails[selectedNode].state.toUpperCase()}</span>
          </div>
          <h3 className="v-card-title">{nodeDetails[selectedNode].title}</h3>
          <div className="v-card-stats">
            <span className="v-stat-xp">{nodeDetails[selectedNode].xp}</span>
            <span className="v-stat-dur"><Clock size={11} /> {nodeDetails[selectedNode].dur}</span>
          </div>
          <div className="v-card-lessons">
            {nodeDetails[selectedNode].lessons.map((lesson, lIdx) => (
              <div key={lIdx} className="v-lesson-item">
                <Check size={10} strokeWidth={3} className="check-sage" />
                <span className={selectedNode <= 1 ? "struck" : ""}>{lesson}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div 
          className={`v-node active ${selectedNode === 2 ? "is-selected" : ""}`} 
          style={{ left: "140px", top: "235px" }}
          onClick={() => setSelectedNode(2)}
        >
          <div className="v-halo active-halo" />
          <div className="v-core"><div className="active-rune-dot" /></div>
          <span className="v-title">{currentTopic.nodes[2]}</span>
        </div>

        <div 
          className={`v-node locked ${selectedNode === 3 ? "is-selected" : ""}`} 
          style={{ left: "230px", top: "325px" }}
          onClick={() => setSelectedNode(3)}
        >
          <div className="v-core"><Lock size={12} /></div>
          <span className="v-title">{currentTopic.nodes[3]}</span>
        </div>
      </div>
    </div>
  );
}

// --- SHOWCASE 02: CURATED VIDEO ARENA & SIDE QUEST LOG (CLEAN, NO BIG WRAPPING BOX) ---
function ArenaShowcase({ onOpenDemo }) {
  const [selectedVid, setSelectedVid] = useState(0);

  const videos = [
    {
      id: 1,
      title: "Generational Garbage Collection (Young vs Old gen)",
      duration: "6:20",
      theme: "code",
    },
    {
      id: 2,
      title: "V8 Scavenger (Minor GC) vs Major GC: Mark-Sweep",
      duration: "7:10",
      theme: "hardware",
    },
    {
      id: 3,
      title: "Microtask Queue vs Macrotask Queue: Event Loop",
      duration: "5:45",
      theme: "terminal",
    },
    {
      id: 4,
      title: "Detached DOM Tree Memory Leaks & Profiling",
      duration: "9:15",
      theme: "server",
    }
  ];

  const [questItems, setQuestItems] = useState([
    { id: 1, title: "Object.create vs constructor prototypes", done: true },
    { id: 2, title: "Microtask Queue vs Macrotask Queue", done: true },
    { id: 3, title: "Call stack starvation and rendering ticks", done: true },
    { id: 4, title: "Async/await syntactic sugar under the hood", done: true },
    { id: 5, title: "Generational Garbage Collection (Young vs Old gen)", active: true, done: false },
    { id: 6, title: "Detached DOM tree memory leaks", done: false }
  ]);

  const toggleQuest = (id) => {
    setQuestItems(prev => prev.map(q => {
      if (q.id === id) {
        if (q.done) return { ...q, done: false, active: true };
        if (q.active) return { ...q, done: true, active: false };
        return { ...q, active: true };
      }
      return q;
    }));
  };

  return (
    <div className="showcase-glass-card showcase-arena-clean-stage">
      {/* Top Simple Title (Direct, No Noise) */}
      <div className="arena-simple-top-bar">
        <div className="arena-title-row">
          <Sparkles size={16} className="sparkle-gold-icon" style={{ color: "#E07A5F" }} />
          <span className="arena-heading-text">Recommended videos for this topic</span>
        </div>

        <button
          type="button"
          className="arena-simple-corner-link"
          onClick={(e) => {
            e.stopPropagation();
            if (typeof onOpenDemo === "function") {
              onOpenDemo("duels");
            }
          }}
          title="Experience Demo"
          aria-label="Experience Demo"
        >
          <span className="corner-link-text">Experience Demo</span>
          <ExternalLink size={11} strokeWidth={2.4} />
        </button>
      </div>

      {/* Main Split: Featured Video / Grid (Left) + Floating Side Quest Log (Right) */}
      <div className="arena-clean-split">
        {/* Video Stage (1 Featured on Mobile, 4 Grid on Desktop) */}
        <div className="arena-simple-video-grid">
          {videos.map((vid, idx) => {
            const isSelected = selectedVid === idx;
            return (
              <motion.div
                key={vid.id}
                className={`simple-video-box ${isSelected ? "vid-box-selected" : ""} ${idx === 0 ? "vid-active-target" : ""} ${idx > 1 ? "desktop-only-vid" : ""}`}
                onClick={() => setSelectedVid(idx)}
                whileHover={{ y: -4, scale: 1.025 }}
                transition={{ duration: 0.2 }}
              >
                {/* Clean Thumbnail Stage */}
                <div className={`clean-thumb-stage thumb-bg-${vid.theme}`}>
                  <div className="clean-thumb-art">
                    {vid.theme === "code" && (
                      <div className="thumb-art-code">
                        <span>function *generationalGC()</span>
                        <span>  yield youngGen.scavenge()</span>
                      </div>
                    )}
                    {vid.theme === "hardware" && (
                      <div className="thumb-art-chip">
                        <div className="chip-mini-core" />
                      </div>
                    )}
                    {vid.theme === "terminal" && (
                      <div className="thumb-art-term">
                        <span>$ node --trace-gc</span>
                      </div>
                    )}
                    {vid.theme === "server" && (
                      <div className="thumb-art-bars">
                        <span className="art-bar b1" />
                        <span className="art-bar b2" />
                        <span className="art-bar b3" />
                      </div>
                    )}
                  </div>

                  {/* Duration Badge */}
                  <span className="clean-duration-pill">{vid.duration}</span>

                  {/* Subtle Play Overlay */}
                  <div className="clean-play-icon">
                    <Play size={12} fill="#FFFFFF" color="#FFFFFF" style={{ marginLeft: "1px" }} />
                  </div>
                </div>

                {/* Video Simple Title */}
                <div className="simple-video-info">
                  <h3 className="simple-video-title">{vid.title}</h3>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Floating Side Quest Log (Right) */}
        <motion.div
          className="arena-floating-quest-log"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="afq-header">
            <div className="afq-brand">
              <Swords size={15} color="#E07A5F" />
              <span className="afq-title">QUEST TRACKER</span>
            </div>
            <span className="afq-count">4/6 Done</span>
          </div>

          <div className="afq-subtitle">
            ...MEMORY LIFECYCLE &amp; GARBAGE COLLECTION
          </div>

          <div className="afq-divider" />

          <div className="afq-list">
            {questItems.map((q) => (
              <div
                key={q.id}
                className={`afq-item ${q.done ? "afq-done" : q.active ? "afq-active" : "afq-pending"}`}
                onClick={() => toggleQuest(q.id)}
              >
                <div className="afq-bullet">
                  {q.done && <Check size={13} strokeWidth={3.2} className="afq-check" />}
                  {q.active && <span className="afq-dot" />}
                  {!q.done && !q.active && <span className="afq-circle" />}
                </div>
                <span className="afq-label">{q.title}</span>
              </div>
            ))}
          </div>

          <div className="afq-footer">
            <span className="afq-rem">2 remaining today</span>
            <span className="afq-streak">
              <Flame size={12} />
              <span>10d Streak</span>
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// --- SHOWCASE 03: CHRONOS STUDY VELOCITY & DIRECTIVES DASHBOARD ---
function ChronosVelocityShowcase({ onOpenDemo }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  const days = [
    { label: "Day 1", ratio: "2/5", total: 5, filled: 2, overflow: 0, status: "past" },
    { label: "Day 2", ratio: "6/5", total: 5, filled: 5, overflow: 1, status: "past" },
    { label: "Today", ratio: "4/5", total: 5, filled: 4, overflow: 0, status: "today" },
    { label: "Day 4", ratio: "0/6", total: 6, filled: 0, overflow: 0, status: "future" },
    { label: "Day 5", ratio: "0/5", total: 5, filled: 0, overflow: 0, status: "future" },
    { label: "Day 6", ratio: "0/5", total: 5, filled: 0, overflow: 0, status: "future" },
    { label: "Day 7", ratio: "0/5", total: 5, filled: 0, overflow: 0, status: "future" }
  ];

  return (
    <div className="showcase-glass-card showcase-chronos-clean-stage">
      {/* Top Row with Streak Badge & Corner Demo Link */}
      <div className="chronos-clean-top-bar">
        <div className="chronos-streak-badge">
          <span className="streak-fire-icon">🔥</span>
          <span className="streak-badge-text">10 DAYS STREAK</span>
          <span className="streak-xp-tag">2.0X XP</span>
        </div>

        <button
          type="button"
          className="chronos-clean-corner-link"
          onClick={(e) => {
            e.stopPropagation();
            if (typeof onOpenDemo === "function") {
              onOpenDemo("chronos");
            }
          }}
          title="Experience Demo"
          aria-label="Experience Demo"
        >
          <span className="corner-link-text">Experience Demo</span>
          <ExternalLink size={11} strokeWidth={2.4} />
        </button>
      </div>

      {/* Main Split Grid: 7-Day Chart (Left) + 4 Metric Cards (Right) */}
      <div className="chronos-clean-split">
        {/* Left: 7-Day Directives Chart Panel (Clean & Spacious) */}
        <div className="chronos-chart-stage">
          <div className="chronos-bars-grid">
            {days.map((item, i) => {
              const isToday = item.status === "today";
              const isHovered = hoveredDay === i;
              const maxSlots = Math.max(item.total, item.filled + item.overflow);
              
              const slots = Array.from({ length: maxSlots }, (_, slotIdx) => {
                const isFilled = slotIdx < item.filled;
                const isOverflow = slotIdx >= item.total && slotIdx < item.filled + item.overflow;
                const isDashedActive = (isToday || item.status === "past") && !isFilled && slotIdx < item.total;
                return { isFilled, isOverflow, isDashedActive };
              }).reverse();

              return (
                <div
                  key={item.label}
                  className={`chronos-day-col ${isToday ? "is-today" : ""} ${isHovered ? "is-hovered" : ""}`}
                  onMouseEnter={() => setHoveredDay(i)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  {/* Brick Stack */}
                  <div className="day-brick-stack">
                    {slots.map((slot, sIdx) => {
                      let brickClass = "brick-empty";
                      if (slot.isOverflow) brickClass = "brick-overflow";
                      else if (slot.isFilled) brickClass = "brick-filled";
                      else if (slot.isDashedActive) brickClass = "brick-dashed-active";

                      return (
                        <motion.div
                          key={sIdx}
                          className={`directive-brick ${brickClass}`}
                          initial={{ scale: 0.85, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.22, delay: i * 0.03 + sIdx * 0.015 }}
                        />
                      );
                    })}
                  </div>

                  {/* Day Baseline Info */}
                  <div className="day-col-footer">
                    <span className={`day-ratio ${isToday ? "ratio-today" : ""}`}>{item.ratio}</span>
                    <span className={`day-name ${isToday ? "name-today" : ""}`}>{item.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="chart-base-line" />
        </div>

        {/* Right: Metrics Cards Stack (Wider & Spacious) */}
        <div className="chronos-metrics-panel">
          {/* Card 1: Study Speed */}
          <motion.div
            className="chronos-metric-card card-speed"
            whileHover={{ x: 4, scale: 1.015 }}
            transition={{ duration: 0.18 }}
          >
            <div className="metric-header-line">
              <Clock size={12} className="m-icon icon-orange" />
              <span className="m-label">STUDY SPEED</span>
            </div>
            <div className="m-value val-green">1.2x speed</div>
            <div className="m-desc">Pacing on schedule with timeline targets.</div>
          </motion.div>

          {/* Card 2: Path Subtopics */}
          <motion.div
            className="chronos-metric-card card-subtopics"
            whileHover={{ x: 4, scale: 1.015 }}
            transition={{ duration: 0.18 }}
          >
            <div className="metric-header-line">
              <Sparkles size={12} className="m-icon icon-purple" />
              <span className="m-label">PATH SUBTOPICS</span>
            </div>
            <div className="m-value val-purple">12 / 69</div>
            <div className="m-desc">57 subtopics remaining to complete entire path.</div>
          </motion.div>

          {/* Card 3: Days To Finish */}
          <motion.div
            className="chronos-metric-card card-days"
            whileHover={{ x: 4, scale: 1.015 }}
            transition={{ duration: 0.18 }}
          >
            <div className="metric-header-line">
              <BookOpen size={12} className="m-icon icon-teal" />
              <span className="m-label">DAYS TO FINISH</span>
            </div>
            <div className="m-value val-green">10 Days</div>
            <div className="m-desc highlight-pace">✦ On pace to finish 2 days early!</div>
          </motion.div>

          {/* Card 4: Goal Match */}
          <motion.div
            className="chronos-metric-card card-sync"
            whileHover={{ x: 4, scale: 1.015 }}
            transition={{ duration: 0.18 }}
          >
            <div className="metric-header-line">
              <Crosshair size={12} className="m-icon icon-green" />
              <span className="m-label">GOAL MATCH</span>
            </div>
            <div className="m-value val-green">100% Sync</div>
            <div className="m-desc highlight-pace">✦ Synchronization stable</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// --- SHOWCASE 03: FULLY ANIMATED SANCTUM LOOP (YOUTUBE VIDEO -> FULL STUDY NOTES -> NORMAL MCQ QUIZ) ---
function TrialCombatShowcase({ onOpenDemo }) {
  const [sanctumStep, setSanctumStep] = useState(0); // 0: Video, 1: Notes, 2: Quiz
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [notesScrolled, setNotesScrolled] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(null); // 'synth', 'trial', 'optB'
  
  const containerRef = useRef(null);
  const synthBtnRef = useRef(null);
  const trialBtnRef = useRef(null);
  const optBRef = useRef(null);

  const [cursorState, setCursorState] = useState({
    x: 240,
    y: 120,
    clicking: false,
    duration: 0.8,
    visible: true,
  });

  // Calculate pixel-perfect center coordinates of target element relative to container
  const getCenterOf = (elRef, fallbackX, fallbackY) => {
    if (containerRef.current && elRef?.current) {
      const cRect = containerRef.current.getBoundingClientRect();
      const tRect = elRef.current.getBoundingClientRect();
      return {
        x: Math.round(tRect.left - cRect.left + tRect.width / 2) - 4,
        y: Math.round(tRect.top - cRect.top + tRect.height / 2) - 3,
      };
    }
    return { x: fallbackX, y: fallbackY };
  };

  // Automated Infinite Cinematic Loop Timeline
  useEffect(() => {
    let timers = [];
    const runTimeline = () => {
      // --- SCENE 1: YOUTUBE VIDEO STREAM (0s - 3.2s) ---
      setSanctumStep(0);
      setSelectedOpt(null);
      setNotesScrolled(false);
      setButtonPressed(null);
      setCursorState({ x: 230, y: 110, clicking: false, duration: 0.8, visible: true });

      // Cursor glides directly to "Turn Into AI Study Notes" button
      timers.push(setTimeout(() => {
        const coords = getCenterOf(synthBtnRef, 240, 345);
        setCursorState({ x: coords.x, y: coords.y, clicking: false, duration: 0.8, visible: true });
      }, 1400));

      // Cursor clicks "Turn Into AI Study Notes"
      timers.push(setTimeout(() => {
        const coords = getCenterOf(synthBtnRef, 240, 345);
        setCursorState({ x: coords.x, y: coords.y, clicking: true, duration: 0.12, visible: true });
        setButtonPressed('synth');
      }, 2300));

      // Cursor unclicks
      timers.push(setTimeout(() => {
        const coords = getCenterOf(synthBtnRef, 240, 345);
        setCursorState({ x: coords.x, y: coords.y, clicking: false, duration: 0.12, visible: true });
      }, 2650));

      // --- SCENE 2: AI STUDY NOTES FULL EXPANSION (3.0s - 7.0s) ---
      timers.push(setTimeout(() => {
        setSanctumStep(1);
        setButtonPressed(null);
        setCursorState({ x: 220, y: 75, clicking: false, duration: 0.6, visible: true });
      }, 3000));

      // Auto-scrolling the synthesized notebook
      timers.push(setTimeout(() => {
        setNotesScrolled(true);
        setCursorState({ x: 200, y: 140, clicking: false, duration: 0.9, visible: true });
      }, 4100));

      // Cursor glides directly to "Take Quick Quiz" button
      timers.push(setTimeout(() => {
        const coords = getCenterOf(trialBtnRef, 240, 345);
        setCursorState({ x: coords.x, y: coords.y, clicking: false, duration: 0.8, visible: true });
      }, 5400));

      // Cursor clicks "Take Quick Quiz"
      timers.push(setTimeout(() => {
        const coords = getCenterOf(trialBtnRef, 240, 345);
        setCursorState({ x: coords.x, y: coords.y, clicking: true, duration: 0.12, visible: true });
        setButtonPressed('trial');
      }, 6300));

      // Cursor unclicks
      timers.push(setTimeout(() => {
        const coords = getCenterOf(trialBtnRef, 240, 345);
        setCursorState({ x: coords.x, y: coords.y, clicking: false, duration: 0.12, visible: true });
      }, 6650));

      // --- SCENE 3: NORMAL ACTIVE RECALL MCQ QUIZ (7.0s - 12.6s) ---
      timers.push(setTimeout(() => {
        setSanctumStep(2);
        setSelectedOpt(null);
        setButtonPressed(null);
        setCursorState({ x: 180, y: 100, clicking: false, duration: 0.6, visible: true });
      }, 7000));

      // Cursor glides directly to Option B (The correct answer)
      timers.push(setTimeout(() => {
        const coords = getCenterOf(optBRef, 240, 240);
        setCursorState({ x: coords.x, y: coords.y, clicking: false, duration: 0.8, visible: true });
      }, 8200));

      // Cursor clicks Option B!
      timers.push(setTimeout(() => {
        const coords = getCenterOf(optBRef, 240, 240);
        setCursorState({ x: coords.x, y: coords.y, clicking: true, duration: 0.12, visible: true });
        setButtonPressed('optB');
        setSelectedOpt(1); // Option B index
      }, 9200));

      // Cursor unclicks & drifts away to reveal the victory card
      timers.push(setTimeout(() => {
        setCursorState({ x: 340, y: 310, clicking: false, duration: 0.8, visible: false });
      }, 9600));

      // --- RESTART THE INFINITE DEMO LOOP ---
      timers.push(setTimeout(() => {
        runTimeline();
      }, 12600));
    };

    runTimeline();

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, []);

  return (
    <div className="showcase-glass-card showcase-combat-wrapper">
      <div ref={containerRef} className="combat-container-relative sanctum-cinematic-stage">
        {/* Animated Virtual Mouse Cursor */}
        {cursorState.visible && (
          <motion.div
            className="virtual-gliding-cursor"
            animate={{
              x: cursorState.x,
              y: cursorState.y,
            }}
            transition={{
              duration: cursorState.duration,
              ease: [0.25, 1, 0.5, 1],
            }}
          >
            <div className={`cursor-pointer-icon ${cursorState.clicking ? "cursor-pressed" : ""}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="cursor-svg">
                <path
                  d="M4 3L11 20L14 13L21 10L4 3Z"
                  fill="#2D241F"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {cursorState.clicking && (
              <span className="virtual-click-pulse" />
            )}
          </motion.div>
        )}

        {/* Top-Corner External Link to Sanctum Demo */}
        <button
          type="button"
          className="combat-corner-link"
          onClick={() => {
            if (typeof onOpenDemo === "function") {
              onOpenDemo("sanctum");
            }
          }}
          title="Experience Demo"
          aria-label="Experience Demo"
        >
          <span className="corner-link-text">Experience Demo</span>
          <ExternalLink size={11} strokeWidth={2.4} />
        </button>

        <div className="combat-arena-box sanctum-master-box">
          {/* ================= STEP 0: CLEAN YOUTUBE-STYLE VIDEO SCREEN ================= */}
          {sanctumStep === 0 && (
            <motion.div
              key="step-video"
              className="sanctum-step-view sanctum-step-video-only"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              {/* YouTube-Style Video Player Screen */}
              <div className="sanctum-yt-video-screen">
                {/* Center Visual Wave Animation */}
                <div className="yt-stage-center">
                  <div className="yt-center-waves">
                    {[18, 36, 50, 28, 44, 22, 38, 30, 48].map((h, i) => (
                      <motion.span
                        key={i}
                        className="yt-wave-bar"
                        animate={{ height: [h * 0.35, h, h * 0.45] }}
                        transition={{
                          duration: 0.65 + (i % 4) * 0.12,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* YouTube Bottom Controls Bar with Scrubber & Timer */}
                <div className="yt-bottom-controls">
                  {/* Scrubber Progress Bar */}
                  <div className="yt-scrubber-track">
                    <motion.div
                      className="yt-scrubber-fill"
                      initial={{ width: "28%" }}
                      animate={{ width: "54%" }}
                      transition={{ duration: 3.0, ease: "linear" }}
                    />
                    <motion.div 
                      className="yt-scrubber-head"
                      initial={{ left: "28%" }}
                      animate={{ left: "54%" }}
                      transition={{ duration: 3.0, ease: "linear" }}
                    />
                  </div>

                  {/* YouTube Controls Row */}
                  <div className="yt-controls-row">
                    <div className="yt-left-controls">
                      <div className="yt-play-icon">
                        <Play size={13} fill="currentColor" />
                      </div>
                      <span className="yt-timer-text">04:18 / 14:30</span>
                    </div>

                    <div className="yt-right-controls">
                      <span className="yt-quality-badge">HD</span>
                      <div className="yt-fullscreen-icon" title="Full screen">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Title Neatly Placed Under The Video */}
              <div className="sanctum-video-title-box">
                <h3 className="sanctum-video-headline">
                  JavaScript Event Loop & Async Mastery
                </h3>
              </div>

              {/* Action Button: Easy English & Game-Like */}
              <div className="sanctum-btn-container">
                <button
                  ref={synthBtnRef}
                  type="button"
                  className={`btn-sanctum-primary ${buttonPressed === 'synth' ? "btn-active-clicked" : ""}`}
                >
                  <Sparkles size={15} />
                  <span>Turn Into AI Study Notes</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ================= STEP 1: AI STUDY NOTES (TAKING WHOLE SPACE) ================= */}
          {sanctumStep === 1 && (
            <motion.div
              key="step-notes"
              className="sanctum-step-view sanctum-step-notes-full"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              {/* Structured AI Study Notebook Taking Whole Card Space */}
              <div className="sanctum-notes-container-full">
                <div className="notes-meta-bar">
                  <div className="notes-meta-left">
                    <BookOpen size={13} className="notes-book-icon" />
                    <span className="notes-doc-title">SANCTUM STUDY NOTES • CHAPTER 04</span>
                  </div>
                  <span className="notes-scroll-hint">
                    {notesScrolled ? "✓ Notes extracted" : "Auto-scrolling notes ↓"}
                  </span>
                </div>

                <div className="notes-scroll-viewport-full">
                  <motion.div
                    className="notes-scroll-motion-track"
                    animate={{ y: notesScrolled ? -85 : 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                  >
                    {/* Note Section 1 */}
                    <div className="note-card-chunk">
                      <div className="note-chunk-tag">
                        <span className="chunk-num">01</span>
                        <span className="chunk-title">The Microtask Rule</span>
                      </div>
                      <p className="note-chunk-body">
                        Synchronous code runs first. Then, JavaScript runs all <strong>Promise callbacks</strong> (Microtasks) before running any <strong>setTimeout</strong> timers (Macrotasks).
                      </p>
                    </div>

                    {/* Note Section 2: Code Snippet */}
                    <div className="note-card-chunk code-chunk">
                      <div className="note-chunk-tag">
                        <Code size={12} />
                        <span className="chunk-title">Quick Code Example</span>
                      </div>
                      <div className="syntax-code-block">
                        <code>
                          <span className="c-dim">// 1. Main thread runs first</span>{"\n"}
                          <span className="c-fn">console</span>.<span className="c-meth">log</span>(<span className="c-str">'1: Start'</span>);{"\n\n"}
                          <span className="c-dim">// 2. Timer waits in Macrotask queue</span>{"\n"}
                          <span className="c-fn">setTimeout</span>(() =&gt; <span className="c-fn">console</span>.<span className="c-meth">log</span>(<span className="c-str">'3: Timer'</span>), <span className="c-num">0</span>);{"\n\n"}
                          <span className="c-dim">// 3. Promise runs right away</span>{"\n"}
                          <span className="c-fn">Promise</span>.<span className="c-meth">resolve</span>().<span className="c-meth">then</span>(() =&gt; <span className="c-fn">console</span>.<span className="c-meth">log</span>(<span className="c-str">'2: Promise'</span>));{"\n\n"}
                          <span className="c-res">// Output order: 1 ➔ 2 ➔ 3</span>
                        </code>
                      </div>
                    </div>

                    {/* Note Section 3: Chronos Textbook Binding */}
                    <div className="note-chronos-box">
                      <div className="chronos-chip-left">
                        <Clock size={13} className="chronos-clock" />
                        <span>CHRONOS VELOCITY</span>
                      </div>
                      <p className="chronos-text">
                        Saved into Chapter 4 of your personal <strong>PDF Textbook</strong> (+1.8 hrs saved).
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Clean Single Button Beneath Notes */}
              <div className="sanctum-btn-container">
                <button
                  ref={trialBtnRef}
                  type="button"
                  className={`btn-sanctum-primary ${buttonPressed === 'trial' ? "btn-active-clicked" : ""}`}
                >
                  <Swords size={15} />
                  <span>Take Quick Quiz</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ================= STEP 2: CLEAN NORMAL MCQ QUIZ ================= */}
          {sanctumStep === 2 && (
            <motion.div
              key="step-exam"
              className="sanctum-step-view sanctum-step-exam-full"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              {/* Clean Normal MCQ Quiz Top Header */}
              <div className="mcq-quiz-header">
                <div className="mcq-header-left">
                  <span className="mcq-status-dot" />
                  <span className="mcq-step-title">Question 1 of 5</span>
                </div>
                <div className="mcq-xp-badge">
                  <Sparkles size={12} />
                  <span>+50 XP</span>
                </div>
              </div>

              {/* Question Card */}
              <div className="mcq-prompt-card">
                <p className="mcq-question-text">
                  When both a Promise callback and a 0ms <code>setTimeout</code> timer are waiting, which one runs first?
                </p>
              </div>

              {/* Multiple Choice Options (Option B Auto-Clicked & Verified) */}
              <div className="combat-answers-stack">
                {[
                  { 
                    label: "A", 
                    text: "The setTimeout timer", 
                    correct: false
                  },
                  { 
                    label: "B", 
                    text: "The Promise callback (Microtasks run first)", 
                    correct: true,
                    explanation: "✓ Correct! Microtask queue drains before timers run (+50 XP)"
                  },
                  { 
                    label: "C", 
                    text: "Both run at the exact same time", 
                    correct: false
                  }
                ].map((opt, idx) => {
                  const isSelected = selectedOpt === idx;
                  const isCorrect = opt.correct;
                  return (
                    <div
                      key={idx}
                      ref={idx === 1 ? optBRef : null}
                      className={`combat-choice-card ${isSelected ? (isCorrect ? "selected-correct" : "selected-wrong") : ""}`}
                    >
                      <div className="choice-badge">
                        {isSelected ? (isCorrect ? <CheckCircle2 size={13} /> : <XCircle size={13} />) : opt.label}
                      </div>
                      <div className="choice-body">
                        <span className="choice-text">{opt.text}</span>
                        {isSelected && isCorrect && (
                          <motion.div 
                            className="choice-success-tag"
                            initial={{ opacity: 0, y: 3 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Sparkles size={12} />
                            <span>{opt.explanation}</span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Clean Footer Status */}
              <div className="mcq-bottom-bar">
                <span className="mcq-footer-text">
                  {selectedOpt === 1 ? "✨ Memory Verified • 100% Correct" : "Choose the right answer to earn XP"}
                </span>
                {selectedOpt === 1 && (
                  <span className="mcq-verified-pill">✓ Verified</span>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- SHOWCASE 05: LEVEL UP REALITY — SEAMLESS MCQ -> +60XP -> LEVEL UP -> CRIMSON AURA STORY ---
function LevelUpShowcase({ onOpenDemo }) {
  const [step, setStep] = useState(0); // 0: MCQ, 1: +60XP, 2: LevelUp Bar, 3: Crimson Robot
  const [selectedOpt, setSelectedOpt] = useState(-1);
  const [cursorState, setCursorState] = useState({ x: 260, y: 155, clicking: false, visible: true });
  const [barProgress, setBarProgress] = useState(80);
  const [currentLevel, setCurrentLevel] = useState(24);
  const [isLeveledUp, setIsLeveledUp] = useState(false);

  useEffect(() => {
    let timers = [];

    if (step === 0) {
      setSelectedOpt(-1);
      setCursorState({ x: 260, y: 155, clicking: false, visible: true });
      setBarProgress(80);
      setCurrentLevel(24);
      setIsLeveledUp(false);

      // 1. Move cursor down to Option B
      timers.push(setTimeout(() => {
        setCursorState({ x: 260, y: 205, clicking: false, visible: true });
      }, 700));

      // 2. Click Option B
      timers.push(setTimeout(() => {
        setCursorState({ x: 260, y: 205, clicking: true, visible: true });
      }, 1400));

      // 3. Option B verified correct
      timers.push(setTimeout(() => {
        setSelectedOpt(1);
        setCursorState({ x: 260, y: 205, clicking: false, visible: false });
      }, 1600));

      // 4. Transition to +60XP
      timers.push(setTimeout(() => {
        setStep(1);
      }, 3000));
    } else if (step === 1) {
      // Show +60XP for 1600ms, then go to Level Up Stage
      timers.push(setTimeout(() => {
        setStep(2);
      }, 1600));
    } else if (step === 2) {
      // RESET TO CLEAR LEVEL 24 STATE FIRST
      setBarProgress(80);
      setCurrentLevel(24);
      setIsLeveledUp(false);

      // 1. Let the user clearly see and read Level 24 for 1.1s, then start filling bar
      timers.push(setTimeout(() => {
        setBarProgress(100);
      }, 1100));

      // 2. When bar reaches 100% (after 1.3s transition), smoothly flip to Level 25
      timers.push(setTimeout(() => {
        setCurrentLevel(25);
        setIsLeveledUp(true);
      }, 2400));

      // 3. Hold and celebrate Level 25 for 2.0s before transitioning to Crimson Robot Aura
      timers.push(setTimeout(() => {
        setStep(3);
      }, 4400));
    } else if (step === 3) {
      // Show Crimson Robot Aura for 4000ms, then loop back to 0
      timers.push(setTimeout(() => {
        setStep(0);
      }, 4000));
    }

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, [step]);

  return (
    <div className="showcase-glass-card showcase-combat-wrapper levelup-story-stage">
      <div className="combat-container-relative">
        {/* Top-Corner External Link to Profile / Wardrobe Demo */}
        <button
          type="button"
          className="combat-corner-link"
          onClick={() => {
            if (typeof onOpenDemo === "function") {
              onOpenDemo("profile");
            }
          }}
          title="Experience Demo"
          aria-label="Experience Demo"
        >
          <span className="corner-link-text">Experience Demo</span>
          <ExternalLink size={11} strokeWidth={2.4} />
        </button>

        <AnimatePresence mode="wait">
          {/* STEP 0: EXACT SANCTUM MCQ QUIZ ANIMATION WITH GLIDING CURSOR */}
          {step === 0 && (
            <motion.div
              key="mcq-step"
              className="combat-arena-box sanctum-step-view sanctum-step-exam-full"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.96 }}
              transition={{ duration: 0.3 }}
            >
              {/* Gliding Virtual Cursor */}
              {cursorState.visible && (
                <motion.div
                  className="virtual-gliding-cursor"
                  animate={{
                    x: cursorState.x,
                    y: cursorState.y,
                  }}
                  transition={{
                    duration: 0.7,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                >
                  <div className={`cursor-pointer-icon ${cursorState.clicking ? "cursor-pressed" : ""}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="cursor-svg">
                      <path
                        d="M4 3L11 20L14 13L21 10L4 3Z"
                        fill="#2D241F"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  {cursorState.clicking && (
                    <span className="virtual-click-pulse" />
                  )}
                </motion.div>
              )}

              {/* Clean MCQ Top Header */}
              <div className="mcq-quiz-header">
                <div className="mcq-header-left">
                  <span className="mcq-status-dot" />
                  <span className="mcq-step-title">Question 1 of 5</span>
                </div>
                <div className="mcq-xp-badge">
                  <Sparkles size={12} />
                  <span>+60 XP</span>
                </div>
              </div>

              {/* Question Card */}
              <div className="mcq-prompt-card">
                <p className="mcq-question-text">
                  When both a Promise callback and a 0ms <code>setTimeout</code> timer are waiting, which one runs first?
                </p>
              </div>

              {/* Multiple Choice Options */}
              <div className="combat-answers-stack">
                {[
                  { 
                    label: "A", 
                    text: "The setTimeout timer", 
                    correct: false
                  },
                  { 
                    label: "B", 
                    text: "The Promise callback (Microtasks run first)", 
                    correct: true,
                    explanation: "✓ Correct! Microtask queue drains before timers run (+60 XP)"
                  },
                  { 
                    label: "C", 
                    text: "Both run at the exact same time", 
                    correct: false
                  }
                ].map((opt, idx) => {
                  const isSelected = selectedOpt === idx;
                  const isCorrect = opt.correct;
                  return (
                    <div
                      key={idx}
                      className={`combat-choice-card ${isSelected ? (isCorrect ? "selected-correct" : "selected-wrong") : ""}`}
                    >
                      <div className="choice-badge">
                        {isSelected ? (isCorrect ? <CheckCircle2 size={13} /> : <XCircle size={13} />) : opt.label}
                      </div>
                      <div className="choice-body">
                        <span className="choice-text">{opt.text}</span>
                        {isSelected && isCorrect && (
                          <motion.div 
                            className="choice-success-tag"
                            initial={{ opacity: 0, y: 3 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Sparkles size={12} />
                            <span>{opt.explanation}</span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* MCQ Bottom Status Bar */}
              <div className="mcq-bottom-bar">
                <span className="mcq-footer-text">
                  {selectedOpt === 1 ? "✨ Memory Verified • 100% Correct" : "Choose the right answer to earn XP"}
                </span>
                {selectedOpt === 1 && (
                  <span className="mcq-verified-pill">✓ Verified</span>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 1: +60 XP TEXT ANIMATION */}
          {step === 1 && (
            <motion.div
              key="xp-step"
              className="levelup-anim-frame levelup-xp-gain-wrap"
              initial={{ opacity: 0, scale: 0.65, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.15, y: -16 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 320, damping: 22 }}
            >
              <div className="xp-gain-burst-ring" />
              <motion.div 
                className="xp-gain-text"
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              >
                +60 XP
              </motion.div>
            </motion.div>
          )}

          {/* STEP 2: CLEAR, SATISFYING LEVEL 24 -> 25 PROGRESSION */}
          {step === 2 && (
            <motion.div
              key="bar-step"
              className="levelup-anim-frame levelup-bar-wrap"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.96 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {/* Level Status Header */}
              <div className="levelup-level-header">
                <span className="level-label">LEVEL</span>
                <div className="level-number-flip">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentLevel}
                      initial={{ opacity: 0, y: 14, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -14, scale: 1.25 }}
                      transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                      className={`level-num-val ${isLeveledUp ? "is-leveled-up" : ""}`}
                    >
                      {currentLevel}
                    </motion.span>
                  </AnimatePresence>
                </div>
                {isLeveledUp && (
                  <motion.span 
                    className="levelup-sparkle-pill"
                    initial={{ opacity: 0, scale: 0.5, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    ✦ LEVEL UP!
                  </motion.span>
                )}
              </div>

              {/* XP Fraction & Subtitle */}
              <div className="levelup-xp-fraction-row">
                <span className="xp-fraction-num">
                  {isLeveledUp ? "3,000 / 3,000 XP (100%)" : "2,940 / 3,000 XP"}
                </span>
                <span className={`xp-fraction-tag ${isLeveledUp ? "tag-ascended" : ""}`}>
                  {isLeveledUp ? "✨ Milestone Achieved" : "+60 XP Gained"}
                </span>
              </div>

              {/* Ultra-Smooth Charge Bar */}
              <div className="levelup-track">
                <motion.div 
                  className="levelup-fill"
                  initial={{ width: "80%" }}
                  animate={{ width: `${barProgress}%` }}
                  transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="levelup-fill-glow" />
                  <div className="levelup-fill-shimmer" />
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: ROBOT AVATAR WITH EXACT CRIMSON MOON COSMETIC AURA */}
          {step === 3 && (
            <motion.div
              key="robot-step"
              className="levelup-anim-frame levelup-robot-aura-wrap"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              {/* Crimson Radial Ambient Aura */}
              <div className="crimson-ambient-glow" />

              {/* Falling Crimson Rose Petals / Embers */}
              <div className="crimson-petals-field">
                {[15, 35, 65, 85].map((leftPos, idx) => (
                  <div 
                    key={idx} 
                    className="crimson-petal" 
                    style={{ 
                      left: `${leftPos}%`, 
                      animationDuration: `${2.8 + (idx % 2) * 0.7}s`, 
                      animationDelay: `${idx * 0.3}s` 
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#b71c1c">
                      <path d="M12 2C9 2 6 4.5 6 8.5c0 3.5 2.5 6.5 6 11.5c3.5-5 6-8 6-11.5C18 4.5 15 2 12 2zm0 10c-1.9 0-3.5-1.6-3.5-3.5S10.1 5 12 5s3.5 1.6 3.5 3.5S13.9 12 12 12z"/>
                    </svg>
                  </div>
                ))}
              </div>

              {/* Glowing Crimson Moon Aura Circle with Bat Wings */}
              <div className="crimson-avatar-portal">
                {/* Left Bat Wing */}
                <div className="crimson-bat-wing-left">
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="#110007" stroke="#ff1744" strokeWidth="1" style={{ filter: "drop-shadow(0 0 4px #ff1744)" }}>
                    <path d="M 2 12 Q 10 10, 16 4 Q 18 10, 22 14 C 18 14, 15 17, 16 22 Q 11 18, 2 12 Z" />
                  </svg>
                </div>

                {/* Right Bat Wing */}
                <div className="crimson-bat-wing-right">
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="#110007" stroke="#ff1744" strokeWidth="1" style={{ transform: "scaleX(-1)", filter: "drop-shadow(0 0 4px #ff1744)" }}>
                    <path d="M 2 12 Q 10 10, 16 4 Q 18 10, 22 14 C 18 14, 15 17, 16 22 Q 11 18, 2 12 Z" />
                  </svg>
                </div>

                {/* Eclipse Glow Border Ring */}
                <div className="crimson-eclipse-ring" />

                {/* The Robot Avatar Core */}
                <div className="crimson-robot-core">
                  <svg width="68" height="68" viewBox="0 0 64 64" fill="none">
                    {/* Antenna */}
                    <line x1="32" y1="14" x2="32" y2="4" stroke="#ff1744" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="32" cy="4" r="3.5" fill="#ff1744" style={{ filter: "drop-shadow(0 0 6px #ff1744)" }} />
                    {/* Head Box */}
                    <rect x="12" y="14" width="40" height="36" rx="14" fill="#110007" stroke="#ff1744" strokeWidth="2.4" />
                    {/* Visor */}
                    <rect x="18" y="22" width="28" height="15" rx="7.5" fill="#000000" />
                    {/* Glowing Crimson Eyes */}
                    <circle cx="26" cy="29.5" r="3.5" fill="#ff1744" style={{ filter: "drop-shadow(0 0 6px #ff1744)" }} />
                    <circle cx="38" cy="29.5" r="3.5" fill="#ff1744" style={{ filter: "drop-shadow(0 0 6px #ff1744)" }} />
                    {/* Smile */}
                    <path d="M26 42 Q32 46 38 42" stroke="#ff1744" strokeWidth="2.4" strokeLinecap="round" fill="none" />
                    {/* Chest Pill */}
                    <rect x="22" y="52" width="20" height="7" rx="3.5" fill="#ff1744" />
                  </svg>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// =========================================================================
// STICKY SCROLL JOURNEY COMPONENT (MASTERCLASS SPLIT-SCREEN WITH WATERMARK & RAIL)
// =========================================================================
function StickyScrollJourney({ onOpenDemo }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    let index = Math.floor(latest * journeyPhases.length);
    if (latest >= 1) index = journeyPhases.length - 1;
    if (index !== activeIndex && index >= 0 && index < journeyPhases.length) {
      setActiveIndex(index);
    }
  });

  return (
    <div ref={containerRef} className="scroll-journey-wrapper" style={{ height: `${journeyPhases.length * 100}vh`, position: 'relative' }}>
      <div className="sticky-container">
        
        {/* Dynamic Background Ambient Glow Aura */}
        <div className="ambient-glow-wrapper">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeIndex}
              className="ambient-glow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                background: `radial-gradient(circle at 65% 50%, ${journeyPhases[activeIndex].colorHex} 0%, transparent 68%)`
              }}
            />
          </AnimatePresence>
        </div>

        {/* Master Split-Screen Layout */}
        <div className="journey-master-layout">
          
          {/* Combined Left Block: Rail + Editorial Narrative */}
          <div className="journey-left-block">
            {/* Vertical Progress Rail */}
            <div className="journey-milestone-rail" aria-hidden="true">
              {journeyPhases.map((phase, idx) => (
                <div 
                  key={idx} 
                  className={`rail-node ${activeIndex === idx ? "active" : activeIndex > idx ? "completed" : ""}`}
                  onClick={() => setActiveIndex(idx)}
                >
                  <div className="rail-node-dot">
                    {activeIndex > idx ? <Check size={10} strokeWidth={3} /> : idx + 1}
                  </div>
                  {idx < journeyPhases.length - 1 && <div className="rail-line" />}
                </div>
              ))}
            </div>

            {/* LEFT COLUMN: Bold Narrative & Giant Editorial Hierarchy */}
            <div className="journey-narrative-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="narrative-content-block"
                >
                  {/* Giant Numeral Watermark in Background (Desktop) */}
                  <div className="phase-numeral-watermark" aria-hidden="true">
                    {journeyPhases[activeIndex].numeral}
                  </div>

                  {/* Phase Kicker Pill */}
                  <div 
                    className="phase-kicker-pill"
                    style={{
                      borderColor: `${journeyPhases[activeIndex].colorHex}35`,
                      color: journeyPhases[activeIndex].colorHex
                    }}
                  >
                    <Sparkles size={11} style={{ color: journeyPhases[activeIndex].colorHex }} />
                    <span>{journeyPhases[activeIndex].kicker}</span>
                  </div>

                  {/* Massive Display Title */}
                  <h2 className="journey-phase-title">
                    {journeyPhases[activeIndex].titlePrefix}
                    <span className="title-highlight-italic" style={{ color: journeyPhases[activeIndex].colorHex }}>
                      {journeyPhases[activeIndex].titleHighlight}
                    </span>
                  </h2>

                  {/* High-Contrast Subtitle */}
                  <p className="journey-phase-subtitle">
                    {journeyPhases[activeIndex].subtitle}
                  </p>

                  {/* Body Description */}
                  <p className="journey-phase-desc">
                    {journeyPhases[activeIndex].desc}
                  </p>

                  {/* Key Feature Badges */}
                  <div className="journey-feature-tags">
                    {journeyPhases[activeIndex].tags.map((tag, tIdx) => (
                      <span key={tIdx} className="journey-feature-tag">{tag}</span>
                    ))}
                  </div>

                  {/* Phase Metric Callout */}
                  <div className="journey-metric-badge">
                    <span className="metric-dot" style={{ background: journeyPhases[activeIndex].colorHex }} />
                    <span className="metric-text">{journeyPhases[activeIndex].metric}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT COLUMN: Dynamic Living Showcase Card */}
          <div className="journey-showcase-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="journey-showcase-motion-wrapper"
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -15 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {activeIndex === 0 && <ArenaShowcase onOpenDemo={onOpenDemo} />}
                {activeIndex === 1 && <SkillTreeShowcase onOpenDemo={onOpenDemo} />}
                {activeIndex === 2 && <ChronosVelocityShowcase onOpenDemo={onOpenDemo} />}
                {activeIndex === 3 && <TrialCombatShowcase onOpenDemo={onOpenDemo} />}
                {activeIndex === 4 && <LevelUpShowcase onOpenDemo={onOpenDemo} />}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}


// =========================================================================
// MAIN LANDING PAGE COMPONENT
// =========================================================================
export default function LandingPage() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [gotcha, setGotcha] = useState("");
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (typeof window !== "undefined" && window.Element && Element.prototype.releasePointerCapture) {
      const origRelease = Element.prototype.releasePointerCapture;
      Element.prototype.releasePointerCapture = function (pId) {
        try {
          if (this.hasPointerCapture && !this.hasPointerCapture(pId)) return;
          origRelease.call(this, pId);
        } catch (e) {}
      };
    }
  }, []);

  const handleOpenDemo = (tab = "duels") => {
    let normalizedTab = tab;
    if (normalizedTab === "study" || normalizedTab === "arena") normalizedTab = "duels";
    if (normalizedTab === "tavern") normalizedTab = "community";

    if (typeof window !== "undefined") {
      sessionStorage.setItem("kaevrix_demo_mode", "true");
      sessionStorage.setItem("kaevrix_autostart_tour", "true");
      ["duels", "pathfinder", "chronos", "community", "profile", "sanctum"].forEach(k => {
        sessionStorage.removeItem(`kaevrix_seen_tour_${k}`);
      });
      if (normalizedTab === "sanctum") {
        sessionStorage.setItem("kaevrix_current_tab", "duels");
        sessionStorage.setItem("kaevrix_current_status", "solo_study");
        const defaultVideo = {
          id: "solo_js_event_loop",
          title: "JavaScript Event Loop & Async Architecture",
          channelTitle: "Kaevrix Sanctum Solo Study",
          thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
          url: "https://www.youtube.com/watch?v=8aGhZQkoFbQ",
          videoId: "8aGhZQkoFbQ",
          duration: "14:30",
          views: "1.2M",
          publishedAt: "2024-01-01"
        };
        sessionStorage.setItem("kaevrix_selected_solo_video", JSON.stringify(defaultVideo));
      } else {
        sessionStorage.setItem("kaevrix_current_tab", normalizedTab);
        sessionStorage.setItem("kaevrix_current_status", "idle");
      }
    }
    setIsDemoOpen(true);
  };
  
  // Smooth & Slow Scroll via Lenis
  useEffect(() => {
    if (isDemoOpen) {
      document.body.style.overflow = "auto";
      return;
    }

    let lenis;
    let reqId;

    try {
      lenis = new Lenis({
        duration: 2.2, // Cinematic slow and luxurious deceleration
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Silky exponential curve
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.75, // Deliberate and smooth scroll velocity
        touchMultiplier: 1.5,
      });

      window.lenis = lenis;

      function raf(time) {
        lenis.raf(time);
        reqId = requestAnimationFrame(raf);
      }
      reqId = requestAnimationFrame(raf);
    } catch (e) {
      console.error("Lenis init fallback:", e);
    }

    return () => {
      if (reqId) cancelAnimationFrame(reqId);
      if (lenis) lenis.destroy();
      window.lenis = null;
    };
  }, [isDemoOpen]);

  const smoothScrollTo = (target) => {
    if (window.lenis) {
      window.lenis.scrollTo(target, { duration: 1.8 });
    } else {
      const el = typeof target === "string" ? document.querySelector(target) : target;
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleJoinWaitlist = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, _gotcha: gotcha })
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  if (isDemoOpen) {
    return (
      <div style={{ width: "100%", minHeight: "100vh", background: "#060608" }}>
        <AppClient onExit={() => setIsDemoOpen(false)} />
      </div>
    );
  }

  return (
    <div className="clean-game-root">

      {/* Navigation */}
      <nav className="clean-nav">
        <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Image src="/logo.png" alt="Kaevrix Logo" width={32} height={32} priority style={{ width: "32px", height: "32px", objectFit: "contain", display: "block" }} />
          <span className="logo-text">Kaevrix</span>
        </div>
        <div className="nav-links">
          <a href="#journey" className="nav-link" onClick={(e) => { e.preventDefault(); smoothScrollTo('#journey'); }}>The Journey</a>
          <a href="#lore" className="nav-link" onClick={(e) => { e.preventDefault(); smoothScrollTo('#lore'); }}>FAQ</a>
        </div>
        <button className="mobile-nav-demo-btn" onClick={() => handleOpenDemo("duels")}>
          <Sparkles size={13} />
          <span>Demo</span>
        </button>
      </nav>

      <main>
        {/* ==================== HERO SECTION ==================== */}
        <section className="hero-section">
          {/* Radial Warm Aura */}
          <div className="hero-radial-glow" />

          {/* Floaty Runes / Astrological Particles */}
          <div className="floaty-runes-layer" aria-hidden="true">
            {floatyRunes.map((rune, i) => (
              <motion.div
                key={i}
                className="floaty-rune"
                style={rune.style}
                animate={{
                  y: [0, -14, 0],
                  opacity: [rune.style.opacity, rune.style.opacity * 1.4, rune.style.opacity],
                  rotate: [0, 8, -8, 0]
                }}
                transition={{
                  duration: rune.dur,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {rune.symbol}
              </motion.div>
            ))}
          </div>

          {/* Floaty RPG Badges / Floating Artifacts */}
          <div className="floaty-badges-layer">
            {floatyBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={badge.id}
                  className={`floaty-badge floaty-badge-${badge.id}`}
                  onClick={() => handleOpenDemo(badge.demoTab || "pathfinder")}
                  animate={badge.animate}
                  transition={{
                    duration: badge.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: badge.delay
                  }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.96 }}
                  title={`Open ${badge.title} Demo`}
                >
                  <div className="floaty-icon-box" style={{ background: `${badge.colorHex || '#E07A5F'}15`, color: badge.color }}>
                    <Icon size={16} strokeWidth={2.2} />
                    <span className="floaty-icon-glow" style={{ background: badge.colorHex || '#E07A5F' }} />
                  </div>
                  <div className="floaty-info">
                    <span className="floaty-title floaty-title-desktop">{badge.title}</span>
                    <span className="floaty-title floaty-title-mobile">{badge.shortTitle}</span>
                    <span className="floaty-meta floaty-meta-desktop">{badge.meta}</span>
                    <span className="floaty-meta floaty-meta-mobile">{badge.shortMeta}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Central Hero Column */}
          <div className="container hero-content">
            <motion.div 
              className="hero-kicker-wrap"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="hero-kicker-text">AI Learning &amp; Personalized Study Platform</span>
            </motion.div>

            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <span className="hero-title-main">Level up in real life.</span>
              <span className="hero-title-italic">The character is you.</span>
            </motion.h1>

            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Kaevrix is a personalized AI learning platform that turns anything you want to learn into a <span className="hero-hl hl-terra">visual skill tree</span>. Quiz yourself with <span className="hero-hl hl-sage">AI-powered study notes</span>, track your <span className="hero-hl hl-navy">daily progress</span>, and actually remember what you studied.
            </motion.p>

            <motion.div 
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <button className="btn-primary-large" onClick={() => handleOpenDemo("duels")}>
                <span className="btn-shimmer-sweep" />
                <Sparkles size={18} />
                <span>Try Demo</span>
              </button>
              <button className="btn-secondary-large" onClick={() => smoothScrollTo("#save-point")}>
                <Sparkles size={15} style={{ color: "var(--accent-terracotta)" }} />
                <span>Claim Early Access</span>
              </button>
            </motion.div>

            {/* Social Proof Badges */}
            <motion.div 
              className="hero-social-proof"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="avatar-stack">
                <div className="avatar-mini" style={{ background: "var(--accent-terracotta)", color: "white" }}>⚔️</div>
                <div className="avatar-mini" style={{ background: "var(--accent-navy)", color: "white" }}>🛡️</div>
                <div className="avatar-mini" style={{ background: "var(--accent-sage)", color: "white" }}>⚡</div>
              </div>
              <div className="proof-text">
                <span className="proof-highlight">2,400+ learners</span> signed up for early access
              </div>
              <span className="proof-live-dot" title="Live roster" />
            </motion.div>
          </div>

          {/* Bottom Scroll Prompt */}
          <motion.div 
            className="hero-scroll-prompt"
            onClick={() => smoothScrollTo("#journey")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <span className="scroll-prompt-text">See How It Works</span>
            <motion.div 
              animate={{ y: [0, 6, 0] }} 
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown size={18} color="var(--accent-terracotta)" />
            </motion.div>
          </motion.div>
        </section>

        {/* ==============================================================
            THE EXPERIENTIAL STICKY SCROLL SECTION
            ============================================================== */}
        <section id="journey">
          <StickyScrollJourney onOpenDemo={handleOpenDemo} />
        </section>

        {/* SEO: All feature descriptions as crawlable HTML for search engines */}
        <section
          aria-label="Kaevrix Features Overview"
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            borderWidth: 0,
          }}
        >
          <h2>How Kaevrix Works — Your Personalized Learning Journey</h2>
          <div>
            <h3>Smart Video Feed — Enter The Arena</h3>
            <p>Watch the right videos, in the right order, for what you are learning right now.</p>
            <p>No more scrolling through hundreds of tutorials wondering where to start. The Arena picks the best videos for your current topic and gives you a simple checklist so you always know what to watch next.</p>
          </div>
          <div>
            <h3>AI Skill Trees — Map Your Mastery</h3>
            <p>Tell us what you want to learn. Kaevrix builds your entire personalized learning roadmap.</p>
            <p>Type in any skill or goal, like learn React or become a data scientist. Our AI breaks it down into a step-by-step skill tree, showing you exactly what to learn first and what comes next. No guesswork.</p>
          </div>
          <div>
            <h3>Study Progress Tracker — Chronos</h3>
            <p>See how fast you are learning, keep your streak alive, and know exactly when you will finish.</p>
            <p>A 50-hour course feels overwhelming until Chronos breaks it down. It tracks how much you study each day, predicts exactly when you will finish, and keeps your streak alive with daily goals. Stay consistent and watch the progress add up.</p>
          </div>
          <div>
            <h3>AI Study Notes and Knowledge Quizzes — Enter The Sanctum</h3>
            <p>Turn any video into study notes and quiz yourself to make sure you actually learned it.</p>
            <p>Just watching a video is not enough. Sanctum turns any tutorial into organized AI study notes, then quizzes you on the key concepts. If you can pass the quiz, you actually know it.</p>
          </div>
          <div>
            <h3>Gamified Progression and Skill Verification — Level Up For Real</h3>
            <p>Earn XP, unlock cool avatars, and build a profile that proves what you know.</p>
            <p>Every quiz you pass and every lesson you complete earns you real XP. Level up, unlock exclusive avatar cosmetics, and build a public profile that shows exactly what skills you have mastered.</p>
          </div>
        </section>

        {/* Lore / FAQ Clean */}
        <section id="lore" className="faq-section">
          <div className="faq-inner">
            <div className="faq-header">
              <h2>FAQ</h2>
              <p className="hero-subtitle">Common questions, answered.</p>
            </div>
            
            <div className="faq-list">
              {[
                { q: "What is Kaevrix?", a: "Kaevrix is a learning app that turns any subject into an interactive skill tree. It recommends the best videos, creates AI study notes, quizzes you to make sure you remember, and tracks your progress — all in one place." },
                { q: "What is Sanctum?", a: "Sanctum is your personal study room. Pick any video tutorial, and Sanctum turns it into clean, organized study notes. Then it quizzes you on the key points so you actually retain what you learned, not just passively watch." },
                { q: "What is Chronos?", a: "Chronos is your study dashboard. It tracks how much you study each day, shows when you'll finish your current topic, keeps your daily streak going, and automatically saves your notes as a downloadable PDF — like building your own textbook." },
                { q: "What is a learning roadmap?", a: "It's a personalized study plan. Tell Kaevrix what you want to learn (like 'full-stack development'), and it creates a clear, step-by-step path from beginner to advanced." },
                { q: "How are skill trees created?", a: "Our AI breaks any topic into smaller, logical steps. It figures out what you need to learn first, then maps out the whole path visually. As you complete quizzes, you unlock the next topics." },
                { q: "How does quizzing help me learn?", a: "Quizzing (active recall) forces your brain to pull information from memory instead of just re-reading it. Research shows this is one of the most effective ways to actually remember what you study long-term." },
                { q: "How does progress tracking work?", a: "Every quiz you pass and every lesson you finish earns XP. Your profile shows your level, your skill tree progress, and which topics you've mastered — a clear record of everything you've learned." }
              ].map((faq, i) => (
                <details key={i} className="faq-item">
                  <summary>{faq.q} <ChevronDown size={20} color="var(--accent-terracotta)" /></summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Save Point (Waitlist) Clean */}
        <section id="save-point" className="save-point-section">
          <div className="save-point-container">
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "56px", margin: "0 0 16px 0", fontWeight: 500 }}>Get Early Access</h2>
            <p style={{ fontSize: "20px", color: "var(--text-muted)", margin: 0, lineHeight: 1.6 }}>
              Join the waitlist. Early members get exclusive avatar cosmetics.
            </p>

            {status === "success" ? (
              <div style={{ marginTop: "48px", fontSize: "24px", fontFamily: "var(--font-display)", color: "var(--accent-sage)" }}>
                ✨ You're in! We'll notify you when it's ready.
              </div>
            ) : (
              <form onSubmit={handleJoinWaitlist}>
                <input type="text" name="_gotcha" style={{ display: "none" }} value={gotcha} onChange={(e) => setGotcha(e.target.value)} tabIndex="-1" autoComplete="off" />
                <input 
                  className="save-input" 
                  name="email"
                  type="email" 
                  placeholder="Enter your email address..." 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === "loading"}
                />
                <button type="submit" disabled={status === "loading"} className="btn-save">
                  {status === "loading" ? "Joining..." : (
                    <>Claim Early Access <Sparkles size={16} /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>

        <footer style={{ textAlign: "center", padding: "60px 24px", color: "var(--text-muted)", fontSize: "14px", position: "relative", zIndex: 20 }}>
          © {new Date().getFullYear()} Kaevrix by Astrix Network. | <a href="/privacy" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Privacy</a> | <a href="/terms" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Terms</a>
        </footer>
      </main>
    </div>
  );
}
