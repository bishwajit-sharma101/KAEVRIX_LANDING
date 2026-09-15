import { driver } from "driver.js";
import * as sound from "./audio";

let activeDriver = null;

/**
 * Checks whether the current screen/device is a desktop or tablet device (>= 768px width).
 * Guided tours are disabled on small mobile phone screens unless explicitly forced.
 */
export function isDesktopDevice() {
  if (typeof window === "undefined") return false;
  return window.innerWidth >= 768;
}

/**
 * Initiates the guided product tour for the Kaevrix Demo Simulator (Dashboard / Main Arena)
 * @param {Object|boolean} [options=true] - Options object or isDarkMode boolean
 */
export function startKaevrixTour(options = {}) {
  const isDarkMode = typeof options === "boolean" ? options : (options?.isDarkMode ?? true);
  const force = typeof options === "object" ? !!options?.force : false;

  if (typeof window === "undefined" || (!force && !isDesktopDevice())) return null;

  if (activeDriver) {
    try {
      activeDriver.destroy();
    } catch (e) {}
    activeDriver = null;
  }

  const d = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    overlayColor: isDarkMode ? "rgba(4, 4, 8, 0.82)" : "rgba(15, 23, 42, 0.72)",
    stagePadding: 8,
    stageRadius: 16,
    popoverClass: isDarkMode ? "kaevrix-tour-popover dark-theme" : "kaevrix-tour-popover light-theme",
    nextBtnText: "Next →",
    prevBtnText: "← Back",
    doneBtnText: "Start Exploring 🚀",
    progressText: "{{current}} of {{total}}",
    onHighlightStarted: () => {
      sound.playClockTick();
    },
    onDestroyed: () => {
      sound.playCorrect();
      activeDriver = null;
    },
    steps: [
      {
        element: "#tour-header-logo",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">👋</span>
              <span class="tour-title-text">Welcome to Kaevrix!</span>
              <span class="tour-badge-demo">Demo</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              You're inside the <strong>live Kaevrix demo</strong>!
            </p>
            <p class="tour-desc-p">
              Kaevrix turns anything you want to learn into a step-by-step roadmap with curated videos, AI study notes, and quick quizzes so you actually remember what you study. Let's take a quick 30-second tour!
            </p>
          `,
          side: "bottom",
          align: "start"
        }
      },
      {
        element: "#tour-recommended-videos",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">📺</span>
              <span class="tour-title-text">Best Videos for Your Topic</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              No more scrolling through hundreds of tutorials wondering where to start.
            </p>
            <p class="tour-desc-p">
              Kaevrix picks the <strong>top videos for your current topic</strong> in the right order so you always know what to watch next.
            </p>
          `,
          side: "top",
          align: "center"
        }
      },
      {
        element: "#tour-quest-tracker",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">📋</span>
              <span class="tour-title-text">Daily Study Checklist</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              This is your daily study list.
            </p>
            <p class="tour-desc-p">
              See <strong>what to finish today</strong>, check off bite-sized topics as you complete lessons, and keep your daily learning streak alive.
            </p>
          `,
          side: "left",
          align: "start"
        }
      },
      {
        element: "#tour-search-bar",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">🔍</span>
              <span class="tour-title-text">Search Any Topic</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              Want to learn something specific?
            </p>
            <p class="tour-desc-p">
              Type any programming language, framework, or skill here to instantly find video tutorials and organized study notes.
            </p>
          `,
          side: "bottom",
          align: "center"
        }
      },
      {
        element: "#tour-profile-stats",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">⚡</span>
              <span class="tour-title-text">Your Level & XP</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              Track your learning progress in real time!
            </p>
            <p class="tour-desc-p">
              Every time you watch a lesson or pass a quiz, you earn XP. Level up, unlock custom avatars, and build a profile that proves what you've learned.
            </p>
          `,
          side: "bottom",
          align: "end"
        }
      },
      {
        element: "#tour-sidebar-nav",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">🚀</span>
              <span class="tour-title-text">You're Ready to Explore!</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              Click any video to test the study player, use the sidebar on the left to open your <strong>AI Skill Tree (Pathfinder)</strong>, or search for a topic.
            </p>
            <p class="tour-desc-p">
              Have fun leveling up your skills!
            </p>
          `,
          side: "right",
          align: "start"
        }
      }
    ]
  });

  activeDriver = d;
  d.drive();
  return d;
}

/**
 * Initiates the guided profile tour for the Kaevrix Profile Page
 * @param {Object|boolean} [options={}]
 * @param {boolean} [options.isDarkMode=true] - Current theme state
 * @param {boolean} [options.force=false] - Force launch regardless of viewport size
 * @param {Function} [options.onThemeChange] - Callback to live-preview a theme (e.g. "inferno")
 * @param {Function} [options.onRevertTheme] - Callback to revert back to default theme
 */
export function startProfileTour(options = {}) {
  const isDarkMode = typeof options === "boolean" ? options : (options?.isDarkMode ?? true);
  const force = typeof options === "object" ? !!options?.force : false;
  const onThemeChange = typeof options === "object" ? options?.onThemeChange : null;
  const onRevertTheme = typeof options === "object" ? options?.onRevertTheme : null;

  if (typeof window === "undefined" || (!force && !isDesktopDevice())) return null;

  if (activeDriver) {
    try {
      activeDriver.destroy();
    } catch (e) {}
    activeDriver = null;
  }

  const d = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    overlayColor: isDarkMode ? "rgba(4, 4, 8, 0.82)" : "rgba(15, 23, 42, 0.72)",
    stagePadding: 8,
    stageRadius: 16,
    popoverClass: isDarkMode ? "kaevrix-tour-popover dark-theme" : "kaevrix-tour-popover light-theme",
    nextBtnText: "Next →",
    prevBtnText: "← Back",
    doneBtnText: "Got It! 🌟",
    progressText: "{{current}} of {{total}}",
    onHighlightStarted: () => {
      sound.playClockTick();
    },
    onDestroyed: () => {
      if (onRevertTheme) onRevertTheme();
      if (typeof window !== "undefined" && typeof window.__kaevrix_revertThemePreview === "function") {
        window.__kaevrix_revertThemePreview();
      }
      sound.playCorrect();
      activeDriver = null;
    },
    steps: [
      {
        element: "#tour-profile-hero",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">👤</span>
              <span class="tour-title-text">Your Learning Profile</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              Welcome to your <strong>Learner Profile</strong>!
            </p>
            <p class="tour-desc-p">
              This is your central hub showing your current level, earned XP, daily study streak, and global leaderboard ranking.
            </p>
          `,
          side: "bottom",
          align: "center"
        }
      },
      {
        element: "#tour-mastery-roles",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">📚</span>
              <span class="tour-title-text">Skills & Topics Mastered</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              Every subject you study on Kaevrix (like <em>JavaScript</em>, <em>React</em>, or <em>System Design</em>) gets automatically tracked here as a <strong>permanent skill</strong>.
            </p>
            <p class="tour-desc-p">
              Watch lessons and finish quizzes in that subject to level up each skill individually!
            </p>
          `,
          side: "left",
          align: "start"
        }
      },
      {
        element: "#tour-mastery-xp-bars",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">📈</span>
              <span class="tour-title-text">Skill Levels & Progress Bars</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              Each topic has its own progress bar advancing through ranks from <strong>Beginner</strong> to <strong>Master</strong>.
            </p>
            <p class="tour-desc-p">
              Leveling up your skills unlocks <strong>exclusive animated themes, avatar frames, and visual badges</strong>!
            </p>
          `,
          side: "left",
          align: "start"
        }
      },
      {
        element: "#tour-profile-hero",
        onHighlightStarted: () => {
          if (sound && typeof sound.playLevelUp === "function") {
            sound.playLevelUp();
          } else {
            sound.playClockTick();
          }
          if (onThemeChange) onThemeChange("inferno");
          if (typeof window !== "undefined" && typeof window.__kaevrix_applyThemePreview === "function") {
            window.__kaevrix_applyThemePreview("inferno");
          }
        },
        onDeselected: () => {
          if (onRevertTheme) onRevertTheme();
          if (typeof window !== "undefined" && typeof window.__kaevrix_revertThemePreview === "function") {
            window.__kaevrix_revertThemePreview();
          }
        },
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">🔥</span>
              <span class="tour-title-text">Unlockable Themes: Inferno Aura</span>
              <span class="tour-badge-demo" style="background: rgba(239, 68, 68, 0.2); color: #ef4444; border-color: rgba(239, 68, 68, 0.4);">Live Demo</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              Look at your profile banner now—the <strong>Inferno Theme</strong> is active with glowing fire particles and an animated aura!
            </p>
            <p class="tour-desc-p">
              As you master different skills, you unlock custom cosmetics like <em>Inferno</em>, <em>Lofi Study</em>, <em>Cyberpunk Neon</em>, and more to show off your achievements.
            </p>
          `,
          side: "bottom",
          align: "center"
        }
      },
      {
        element: "#tour-combat-winrate",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">🎯</span>
              <span class="tour-title-text">Quiz Scores & Accuracy</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              This card tracks your quiz scores and answer accuracy from practice sessions.
            </p>
            <p class="tour-desc-p">
              Testing yourself with active recall quizzes ensures you actually retain the material long-term.
            </p>
          `,
          side: "top",
          align: "start"
        }
      },
      {
        element: "#tour-study-watchtime",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">⏱️</span>
              <span class="tour-title-text">Total Study Time</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              This shows the <strong>total time you have spent actively learning</strong> across all your lessons.
            </p>
            <p class="tour-desc-p">
              Every minute counts toward your daily study streak and powers your overall level progression!
            </p>
          `,
          side: "top",
          align: "center"
        }
      }
    ]
  });

  activeDriver = d;
  d.drive();
  return d;
}

/**
 * Initiates the guided tour for the Chronos study scheduler & timeline
 * @param {Object|boolean} [options=true] - Options object or isDarkMode boolean
 */
export function startChronosTour(options = {}) {
  const isDarkMode = typeof options === "boolean" ? options : (options?.isDarkMode ?? true);
  const force = typeof options === "object" ? !!options?.force : false;

  if (typeof window === "undefined" || (!force && !isDesktopDevice())) return null;

  if (activeDriver) {
    try {
      activeDriver.destroy();
    } catch (e) {}
    activeDriver = null;
  }

  const d = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    overlayColor: isDarkMode ? "rgba(4, 4, 8, 0.82)" : "rgba(15, 23, 42, 0.72)",
    stagePadding: 8,
    stageRadius: 16,
    popoverClass: isDarkMode ? "kaevrix-tour-popover dark-theme" : "kaevrix-tour-popover light-theme",
    nextBtnText: "Next →",
    prevBtnText: "← Back",
    doneBtnText: "Got It! 🌟",
    progressText: "{{current}} of {{total}}",
    onHighlightStarted: () => {
      sound.playClockTick();
    },
    onDestroyed: () => {
      sound.playCorrect();
      activeDriver = null;
    },
    steps: [
      {
        element: "#tour-chronos-tabs",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">📅</span>
              <span class="tour-title-text">Study Progress Tracker (Chronos)</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              Welcome to <strong>Chronos</strong>! This is your study schedule and progress tracker.
            </p>
            <p class="tour-desc-p">
              Switch easily between <strong>Daily</strong>, <strong>Weekly</strong>, and <strong>Monthly</strong> views to see your daily goals and track your roadmap progress over time.
            </p>
          `,
          side: "bottom",
          align: "start"
        }
      },
      {
        element: "#tour-chronos-streak",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">🔥</span>
              <span class="tour-title-text">Daily Streak & Bonus XP</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              Study consistently each day to build your <strong>Daily Streak</strong>!
            </p>
            <p class="tour-desc-p">
              Keeping your streak active gives you <strong>up to a 2.0x XP multiplier</strong>, helping you level up faster while building a reliable learning habit.
            </p>
          `,
          side: "bottom",
          align: "end"
        }
      },
      {
        element: "#tour-chronos-chart",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">📊</span>
              <span class="tour-title-text">Weekly Progress Chart</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              This visual chart breaks down your study activity across the week.
            </p>
            <p class="tour-desc-p">
              <strong>Green blocks</strong> show completed topics, <strong>purple blocks</strong> show bonus study sessions, and dashed lines outline your goals for upcoming days.
            </p>
          `,
          side: "top",
          align: "center"
        }
      },
      {
        element: "#tour-chronos-speed",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">⚡</span>
              <span class="tour-title-text">Your Learning Pace</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              Chronos measures how fast you are moving through your curriculum.
            </p>
            <p class="tour-desc-p">
              Staying at or above <strong>1.0x pace</strong> means you are on schedule to finish your learning goal on time!
            </p>
          `,
          side: "left",
          align: "start"
        }
      },
      {
        element: "#tour-chronos-metrics",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">🎯</span>
              <span class="tour-title-text">Completion Forecast</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              These cards calculate your <strong>Days to Finish</strong>, remaining topics, and overall roadmap completion percentage.
            </p>
            <p class="tour-desc-p">
              Never wonder when you'll finish a course again—Chronos gives you a clear finish line!
            </p>
          `,
          side: "left",
          align: "center"
        }
      }
    ]
  });

  activeDriver = d;
  d.drive();
  return d;
}

/**
 * Initiates the guided tour for the Pathfinder AI Curriculum & Skill Tree
 * @param {Object|boolean} [options=true] - Options object or isDarkMode boolean
 */
export function startPathfinderTour(options = {}) {
  const isDarkMode = typeof options === "boolean" ? options : (options?.isDarkMode ?? true);
  const force = typeof options === "object" ? !!options?.force : false;
  const onEnsureLevelOpen = typeof options === "object" ? options?.onEnsureLevelOpen : null;

  if (typeof window === "undefined" || (!force && !isDesktopDevice())) return null;

  if (activeDriver) {
    try {
      activeDriver.destroy();
    } catch (e) {}
    activeDriver = null;
  }

  if (onEnsureLevelOpen) {
    onEnsureLevelOpen();
  }

  const d = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    overlayColor: isDarkMode ? "rgba(4, 4, 8, 0.82)" : "rgba(15, 23, 42, 0.72)",
    stagePadding: 12,
    stageRadius: 16,
    popoverClass: isDarkMode ? "kaevrix-tour-popover dark-theme" : "kaevrix-tour-popover light-theme",
    nextBtnText: "Next →",
    prevBtnText: "← Back",
    doneBtnText: "Start Exploring! 🌟",
    progressText: "{{current}} of {{total}}",
    onHighlightStarted: () => {
      sound.playClockTick();
      if (onEnsureLevelOpen) onEnsureLevelOpen();
    },
    onDestroyed: () => {
      sound.playCorrect();
      activeDriver = null;
    },
    steps: [
      {
        element: "#tour-pathfinder-header",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">🧭</span>
              <span class="tour-title-text">AI Skill Tree (Pathfinder)</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              Welcome to <strong>Pathfinder</strong>!
            </p>
            <p class="tour-desc-p">
              Tell Kaevrix what you want to learn, and our AI builds a personalized, step-by-step roadmap from beginner foundations to advanced concepts. No guesswork on what to learn first.
            </p>
          `,
          side: "bottom",
          align: "start"
        }
      },
      {
        element: "#tour-pathfinder-stats",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">📊</span>
              <span class="tour-title-text">Roadmap Overview</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              See your entire learning roadmap at a glance!
            </p>
            <p class="tour-desc-p">
              Track your <strong>Topics Completed</strong>, total <strong>XP Earned</strong>, number of video lessons, and estimated hours to finish.
            </p>
          `,
          side: "bottom",
          align: "center"
        }
      },
      {
        element: "#tour-pathfinder-levels",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">🪜</span>
              <span class="tour-title-text">Step-by-Step Levels</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              Your learning roadmap is split into clear levels—from <strong>Level 1 Foundations</strong> up to <strong>Level 3 Advanced</strong>.
            </p>
            <p class="tour-desc-p">
              Complete earlier topics to unlock higher levels and test your skills with milestone quizzes!
            </p>
          `,
          side: "top",
          align: "center"
        }
      },
      {
        element: "#tour-pathfinder-active-node",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">🎯</span>
              <span class="tour-title-text">Your Current Active Topic</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              This highlighted card is your <strong>current topic to learn</strong>.
            </p>
            <p class="tour-desc-p">
              Click it to open your curated video lesson, get AI-generated study notes, and take a quick quiz to verify what you learned!
            </p>
          `,
          side: "bottom",
          align: "center"
        }
      }
    ]
  });

  activeDriver = d;
  d.drive();
  return d;
}

/**
 * Initiates the guided tour for the Community & Study Buddies Network
 * @param {Object|boolean} [options=true] - Options object or isDarkMode boolean
 */
export function startCommunityTour(options = {}) {
  const isDarkMode = typeof options === "boolean" ? options : (options?.isDarkMode ?? true);
  const force = typeof options === "object" ? !!options?.force : false;

  if (typeof window === "undefined" || (!force && !isDesktopDevice())) return null;

  if (activeDriver) {
    try {
      activeDriver.destroy();
    } catch (e) {}
    activeDriver = null;
  }

  const d = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    overlayColor: isDarkMode ? "rgba(4, 4, 8, 0.82)" : "rgba(15, 23, 42, 0.72)",
    stagePadding: 8,
    stageRadius: 16,
    popoverClass: isDarkMode ? "kaevrix-tour-popover dark-theme" : "kaevrix-tour-popover light-theme",
    nextBtnText: "Next →",
    prevBtnText: "← Back",
    doneBtnText: "Got It! 🌟",
    progressText: "{{current}} of {{total}}",
    onHighlightStarted: () => {
      sound.playClockTick();
    },
    onDestroyed: () => {
      sound.playCorrect();
      activeDriver = null;
    },
    steps: [
      {
        element: "#tour-community-header",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">👥</span>
              <span class="tour-title-text">Study Community</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              Welcome to the <strong>Kaevrix Learning Community</strong>!
            </p>
            <p class="tour-desc-p">
              Connect with fellow learners worldwide, find study partners working on the same topics, compare progress, and stay motivated together.
            </p>
          `,
          side: "bottom",
          align: "start"
        }
      },
      {
        element: "#tour-community-tabs",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">🤝</span>
              <span class="tour-title-text">Discover & Study Partners</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              Easily navigate the community:
            </p>
            <p class="tour-desc-p">
              • <strong>Discover</strong>: Find active learners studying similar topics.<br/>
              • <strong>My Squad</strong>: View your connected study partners.<br/>
              • <strong>Requests & Messages</strong>: See incoming friend requests and chat!
            </p>
          `,
          side: "bottom",
          align: "start"
        }
      },
      {
        element: "#tour-community-filter",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">🔍</span>
              <span class="tour-title-text">Search & Filters</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              Filter learners by <strong>Highest Level</strong>, <strong>Recent Activity</strong>, or search directly by username to find your friends.
            </p>
          `,
          side: "bottom",
          align: "end"
        }
      },
      {
        element: "#tour-community-pfp",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">👤</span>
              <span class="tour-title-text">View Learner Profiles</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              Curious what other learners are studying?
            </p>
            <p class="tour-desc-p">
              <strong>Click any learner's avatar or username</strong> to view their full profile, skill trees, study stats, and unlocked achievements.
            </p>
          `,
          side: "top",
          align: "start"
        }
      },
      {
        element: "#tour-community-player-stats",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">⚡</span>
              <span class="tour-title-text">Level & Progress Stats</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              Every learner card displays their current <strong>Level</strong>, <strong>XP Progress Bar</strong>, and study activity so you can see who is actively learning.
            </p>
          `,
          side: "top",
          align: "center"
        }
      },
      {
        element: "#tour-community-add-btn",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">➕</span>
              <span class="tour-title-text">Add Study Buddy</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              Click <strong>ADD</strong> to send an instant friend request!
            </p>
            <p class="tour-desc-p">
              Study together, share tips, and keep each other accountable on your learning journey.
            </p>
          `,
          side: "left",
          align: "center"
        }
      }
    ]
  });

  activeDriver = d;
  d.drive();
  return d;
}

/**
 * Initiates the guided tour for the Sanctum Solo Study Room
 * @param {Object|boolean} [options=true] - Options object or isDarkMode boolean
 * @param {boolean} [options.force=false] - Force launch regardless of viewport size
 * @param {Function} [options.onTriggerRecharge] - Callback to trigger the 20-min recharge break & music
 */
export function startSanctumTour(options = {}) {
  const isDarkMode = typeof options === "boolean" ? options : (options?.isDarkMode ?? true);
  const force = typeof options === "object" ? !!options?.force : false;
  const onTriggerRecharge = typeof options === "object" ? options?.onTriggerRecharge : null;

  if (typeof window === "undefined" || (!force && !isDesktopDevice())) return null;

  if (activeDriver) {
    try {
      activeDriver.destroy();
    } catch (e) {}
    activeDriver = null;
  }

  let reachedTimerStep = false;

  const d = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    overlayColor: isDarkMode ? "rgba(4, 4, 8, 0.82)" : "rgba(15, 23, 42, 0.72)",
    stagePadding: 10,
    stageRadius: 16,
    popoverClass: isDarkMode ? "kaevrix-tour-popover dark-theme" : "kaevrix-tour-popover light-theme",
    nextBtnText: "Next →",
    prevBtnText: "← Back",
    doneBtnText: "See 20m Break Demo ☕",
    progressText: "{{current}} of {{total}}",
    onHighlightStarted: (element, step) => {
      sound.playClockTick();
      if (step?.element === "#tour-sanctum-timer") {
        reachedTimerStep = true;
      }
    },
    onDestroyed: () => {
      sound.playCorrect();
      activeDriver = null;
      if (reachedTimerStep && onTriggerRecharge) {
        setTimeout(() => {
          onTriggerRecharge();
        }, 200);
      }
    },
    steps: [
      {
        element: "#tour-sanctum-theatre",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">🎬</span>
              <span class="tour-title-text">Distraction-Free Video Player</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              Welcome to <strong>Sanctum</strong> — your focused study room!
            </p>
            <p class="tour-desc-p">
              Watch your curated video tutorial with built-in progress tracking, free from YouTube algorithms, recommendations, or comment distractions.
            </p>
          `,
          side: "right",
          align: "center"
        }
      },
      {
        element: "#tour-sanctum-notes",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">📝</span>
              <span class="tour-title-text">AI-Generated Study Notes</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              No need to scramble taking manual notes while watching.
            </p>
            <p class="tour-desc-p">
              Kaevrix automatically creates organized Markdown study notes, code snippets, and diagrams for this exact lesson. You can also download them as a PDF!
            </p>
          `,
          side: "left",
          align: "center"
        }
      },
      {
        element: "#tour-sanctum-focus-btn",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">🎧</span>
              <span class="tour-title-text">Ambient Lofi Focus Beats</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              Need to get in the zone?
            </p>
            <p class="tour-desc-p">
              Click <strong>FOCUS</strong> to toggle ambient lofi background music and enter deep focus while studying.
            </p>
          `,
          side: "bottom",
          align: "end"
        }
      },
      {
        element: "#tour-sanctum-quiz-btn",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">⚡</span>
              <span class="tour-title-text">Quick Knowledge Quiz</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              Once you finish watching (90%+ completed), take a quick <strong>Knowledge Quiz</strong>!
            </p>
            <p class="tour-desc-p">
              Active recall testing makes sure you actually remember the key concepts and earn XP to level up your skills.
            </p>
          `,
          side: "bottom",
          align: "end"
        }
      },
      {
        element: "#tour-sanctum-timer",
        popover: {
          title: `
            <div class="tour-title-wrap">
              <span class="tour-icon">⏱️</span>
              <span class="tour-title-text">Study Timer & 20-Min Breaks</span>
            </div>
          `,
          description: `
            <p class="tour-desc-p">
              This clock tracks your active study time in real-time.
            </p>
            <p class="tour-desc-p">
              Every <strong>20 minutes of study</strong>, Kaevrix automatically triggers a short <strong>Recharge Break</strong> with relaxing ambient music to keep your mind fresh and prevent burnout.
            </p>
            <p class="tour-desc-p" style="margin-top: 8px; font-size: 13px; color: #a78bfa; font-weight: 700;">
              ☕ <em>Click <strong>"See 20m Break Demo ☕"</strong> below to jump the clock straight to 20:00 and see the break experience right now!</em>
            </p>
          `,
          side: "bottom",
          align: "center"
        }
      }
    ]
  });

  activeDriver = d;
  d.drive();
  return d;
}
