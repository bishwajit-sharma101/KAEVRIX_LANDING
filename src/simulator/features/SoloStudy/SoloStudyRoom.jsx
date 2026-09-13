import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { fetchWithJobPolling } from "../../utils/asyncJob";
import * as sound from "../../utils/audio";
import YoutubePlayer from "../Shared/YoutubePlayer";
import { parseMarkdownToHTML } from "../../utils/markdown";
import { HIGH_QUALITY_NOTE_1, HIGH_QUALITY_NOTE_2 } from "../../utils/studyNotesData";
import RechargeOverlay from "./RechargeOverlay";
import InteractiveLesson from "../Roadmap/InteractiveLesson";
import { trackTelemetry } from "../../utils/telemetry.js";
import { RotateCcw, Clock, Lock, Unlock, Trophy, Zap, FileText, Check, X as LucideX } from "lucide-react";


export default function SoloStudyRoom({ video, username, isDarkMode, backendUrl, onBack, onAddSoloXp, onCodingModeChange, featureGates = {} }) {
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === "undefined") return "notes";
    return sessionStorage.getItem("kaevrix_solostudy_active_tab") || "notes";
  }); // notes, quiz
  const [notes, setNotes] = useState(() => {
    if (video?.notes) return video.notes;
    const title = (video?.title || "").toLowerCase();
    if (title.includes("execution context") || title.includes("call stack")) return HIGH_QUALITY_NOTE_1;
    if (title.includes("closure") || title.includes("memory management")) return HIGH_QUALITY_NOTE_2;
    return null;
  });
  const [notesError, setNotesError] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [statusText, setStatusText] = useState("Analyzing video context...");

  useEffect(() => {
    sessionStorage.setItem("kaevrix_solostudy_active_tab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [isFocusPlaying, setIsFocusPlaying] = useState(false);
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const focusAudioRef = useRef(null);
  const [noteStyle, setNoteStyle] = useState(() => {
    if (typeof window === "undefined") return "smart";
    return sessionStorage.getItem("kaevrix_solostudy_note_style") || "smart";
  });

  useEffect(() => {
    sessionStorage.setItem("kaevrix_solostudy_note_style", noteStyle);
  }, [noteStyle]);

  const [isRegenModalOpen, setIsRegenModalOpen] = useState(false);
  const [tempRegenStyle, setTempRegenStyle] = useState("smart");
  const [showInteractiveOverlay, setShowInteractiveOverlay] = useState(true);

  // Quiz States: not_started, loading, active, completed
  const [quizState, setQuizState] = useState("not_started");
  const [questions, setQuestions] = useState([]);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [gradedAnswers, setGradedAnswers] = useState([]); // null, 'correct', 'incorrect' for each question
  const [earnedXp, setEarnedXp] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [isQuizReady, setIsQuizReady] = useState(false);
  const [quizError, setQuizError] = useState(false);
  const quizDataRef = useRef(null);

  const [currentCode, setCurrentCode] = useState("");
  const [testResults, setTestResults] = useState(null);
  const [consoleError, setConsoleError] = useState(null);

  useEffect(() => {
    if (onCodingModeChange) {
      onCodingModeChange(activeTab === "quiz");
    }
  }, [activeTab, onCodingModeChange]);

  useEffect(() => {
    if (questions[currentQIdx]) {
      if (questions[currentQIdx].type === "coding") {
        setCurrentCode(questions[currentQIdx].starterCode || "");
        setTestResults(null);
        setConsoleError(null);
      }
    }
  }, [currentQIdx, questions]);

  useEffect(() => {
    if (notes && notes.trim().startsWith("{")) {
      setShowInteractiveOverlay(true);
    }
  }, [notes]);

  const handleRunCode = () => {
    sound.playClockTick();
    const currentQ = questions[currentQIdx];
    if (!currentQ || currentQ.type !== "coding") return;

    try {
      setConsoleError(null);
      
      // Try to dynamically match the function name if 'solve' isn't explicitly used
      const functionNameMatch = currentCode.match(/function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(/);
      const dynamicFuncName = functionNameMatch ? functionNameMatch[1] : null;

      const solver = new Function(`
        ${currentCode}
        if (typeof solve === 'function') return solve;
        if ('${dynamicFuncName}' && typeof window === 'undefined' && eval("typeof " + '${dynamicFuncName}') === 'function') return eval('${dynamicFuncName}');
        
        // Fallback checks
        if (typeof checkDataType === 'function') return checkDataType;
        if ('${dynamicFuncName}') {
            try { return eval('${dynamicFuncName}'); } catch (e) {}
        }
        throw new Error("Could not find the function to execute. Please ensure your function is defined correctly.");
      `)();

      const results = [];
      for (let tc of currentQ.testCases) {
        let parsedInput;
        if (tc.input === "undefined") {
          parsedInput = undefined;
        } else if (tc.input === "NaN") {
          parsedInput = NaN;
        } else {
          try {
            parsedInput = JSON.parse(tc.input);
          } catch {
            try {
              parsedInput = new Function('return (' + tc.input + ')')();
            } catch {
              parsedInput = tc.input;
            }
          }
        }

        let parsedExpected;
        if (tc.expected === "undefined") {
          parsedExpected = undefined;
        } else if (tc.expected === "NaN") {
          parsedExpected = NaN;
        } else {
          try {
            parsedExpected = JSON.parse(tc.expected);
          } catch {
            try {
              parsedExpected = new Function('return (' + tc.expected + ')')();
            } catch {
              parsedExpected = tc.expected;
            }
          }
        }

        const got = solver(parsedInput);
        const passed = JSON.stringify(got) === JSON.stringify(parsedExpected);
        results.push({
          input: tc.input,
          expected: parsedExpected,
          got: got,
          passed
        });
      }

      setTestResults(results);
      
      const allPassed = results.every(r => r.passed);
      if (allPassed) {
        sound.playCorrect();
      } else {
        sound.playIncorrect();
      }
    } catch (err) {
      console.error("User Code Execution Error:", err);
      setConsoleError(err.message);
      sound.playIncorrect();
    }
  };

  const handleSubmitCode = () => {
    sound.playClockTick();
    const currentQ = questions[currentQIdx];
    if (!currentQ || currentQ.type !== "coding") return;

    let results = [];
    let allPassed = false;
    try {
      const functionNameMatch = currentCode.match(/function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(/);
      const dynamicFuncName = functionNameMatch ? functionNameMatch[1] : null;

      const solver = new Function(`
        ${currentCode}
        if (typeof solve === 'function') return solve;
        if ('${dynamicFuncName}' && typeof window === 'undefined' && eval("typeof " + '${dynamicFuncName}') === 'function') return eval('${dynamicFuncName}');
        
        if (typeof checkDataType === 'function') return checkDataType;
        if ('${dynamicFuncName}') {
            try { return eval('${dynamicFuncName}'); } catch (e) {}
        }
        throw new Error("Could not find the function to execute. Please ensure your function is defined correctly.");
      `)();

      for (let tc of currentQ.testCases) {
        let parsedInput;
        if (tc.input === "undefined") {
          parsedInput = undefined;
        } else if (tc.input === "NaN") {
          parsedInput = NaN;
        } else {
          try {
            parsedInput = JSON.parse(tc.input);
          } catch {
            try {
              parsedInput = new Function('return (' + tc.input + ')')();
            } catch {
              parsedInput = tc.input;
            }
          }
        }

        let parsedExpected;
        if (tc.expected === "undefined") {
          parsedExpected = undefined;
        } else if (tc.expected === "NaN") {
          parsedExpected = NaN;
        } else {
          try {
            parsedExpected = JSON.parse(tc.expected);
          } catch {
            try {
              parsedExpected = new Function('return (' + tc.expected + ')')();
            } catch {
              parsedExpected = tc.expected;
            }
          }
        }

        const got = solver(parsedInput);
        const passed = JSON.stringify(got) === JSON.stringify(parsedExpected);
        results.push({
          input: tc.input,
          expected: parsedExpected,
          got: got,
          passed
        });
      }

      setTestResults(results);
      allPassed = results.every(r => r.passed);
    } catch (err) {
      setConsoleError(err.message);
      sound.playIncorrect();
      return;
    }

    if (allPassed) {
      setGradedAnswers(prev => {
        const next = [...prev];
        next[currentQIdx] = "correct";
        return next;
      });
      setSelectedAnswers(prev => {
        const next = [...prev];
        next[currentQIdx] = "passed_code";
        return next;
      });
      sound.playCorrect();
    } else {
      sound.playIncorrect();
      setConsoleError("Submit Failed: Some test cases did not pass.");
    }
  };

  // ═══ Study Timer & Recharge ═══
  const RECHARGE_THRESHOLD = 1200; // 20 minutes in seconds
  const [studyElapsedSec, setStudyElapsedSec] = useState(0);
  const [studyCycles, setStudyCycles] = useState(0);
  const [isRecharging, setIsRecharging] = useState(false);
  const studyTimerRef = useRef(null);
  const lastRechargedMilestoneRef = useRef(0);

  // Study timer — ticks every second, pauses during recharge
  useEffect(() => {
    if (isRecharging) {
      if (studyTimerRef.current) clearInterval(studyTimerRef.current);
      return;
    }
    studyTimerRef.current = setInterval(() => {
      setStudyElapsedSec(prev => prev + 1);
    }, 1000);
    return () => { if (studyTimerRef.current) clearInterval(studyTimerRef.current); };
  }, [isRecharging]);

  // Trigger recharge every 20 minutes (1200s/20m, 2400s/40m, 3600s/60m, etc.)
  useEffect(() => {
    const currentMilestone = Math.floor(studyElapsedSec / RECHARGE_THRESHOLD);
    if (studyElapsedSec > 0 && currentMilestone > lastRechargedMilestoneRef.current && !isRecharging) {
      lastRechargedMilestoneRef.current = currentMilestone;
      if (focusAudioRef.current && isFocusPlaying) {
        focusAudioRef.current.pause();
        setIsFocusPlaying(false);
      }
      setIsRecharging(true);
    }
  }, [studyElapsedSec, isRecharging, isFocusPlaying, RECHARGE_THRESHOLD]);

  // Recharge complete handler - do NOT reset studyElapsedSec to 0, keep counting upwards (20m -> 40m...)
  const handleRechargeComplete = useCallback(() => {
    setIsRecharging(false);
    setStudyCycles(prev => prev + 1);
    sound.playCorrect();
  }, []);

  // Format seconds to MM:SS
  const formatStudyTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Retrieve onboarding answers and AI roadmap for personalization
  const roadmapKey = `kaevrix_roadmap_progress_${username}`;
  const savedRoadmap = useMemo(() => {
    const savedRoadmapStr = localStorage.getItem(roadmapKey);
    if (!savedRoadmapStr) return null;
    try {
      return JSON.parse(savedRoadmapStr);
    } catch (e) {
      return null;
    }
  }, [roadmapKey]);

  const answersKey = `kaevrix_roadmap_answers_${username}`;
  const answers = useMemo(() => {
    const savedAnswers = localStorage.getItem(answersKey);
    if (!savedAnswers) return [];
    try {
      return JSON.parse(savedAnswers);
    } catch (e) {
      return [];
    }
  }, [answersKey]);

  const topic = useMemo(() => {
    let rawTopic = savedRoadmap?.topic || (answers && answers[0] ? answers[0].answer : (video.category || "General learning"));
    if (rawTopic.length > 35) {
      const words = rawTopic.split(/\s+/);
      rawTopic = words.length > 3 ? words.slice(0, 4).join(" ") : rawTopic.substring(0, 30);
    }
    return rawTopic;
  }, [savedRoadmap, answers, video.category]);

  // Track if unlocked alert has played
  const alertPlayedRef = useRef(false);

  useEffect(() => {
    if (progress >= 90 && !alertPlayedRef.current) {
      alertPlayedRef.current = true;
      sound.playCorrect();
    }
  }, [progress]);

  const handleProgress = (percent) => {
    setProgress(percent);
  };

  const handleFinished = () => {
    setProgress(100);
  };

  // Save study session to localStorage history
  const saveStudySession = (notesText, questions = []) => {
    try {
      const historyKey = `kaevrix_study_history_${username}`;
      const existingHistoryStr = localStorage.getItem(historyKey);
      const history = existingHistoryStr ? JSON.parse(existingHistoryStr) : [];
      
      const videoId = video.id || video.videoId;
      const index = history.findIndex(item => (item.video?.id === videoId || item.video?.videoId === videoId || item.id === videoId));
      
      const newRecord = {
        id: videoId || Date.now().toString(),
        timestamp: new Date().toISOString(),
        video: {
          id: video.id || video.videoId,
          title: video.title,
          channel: video.channel,
          videoId: video.videoId || video.id,
          url: video.url || `https://www.youtube.com/watch?v=${video.videoId || video.id}`
        },
        notes: notesText,
        questions: questions,
        topic: topic || "General Learning",
        subTopic: video.activeSubtopic || video.title,
      };
      
      if (index !== -1) {
        history[index] = newRecord;
      } else {
        history.unshift(newRecord);
      }
      
      localStorage.setItem(historyKey, JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save study history:", e);
    }
  };

  // Generate Notes & Quiz in a single consolidated LLM call
  const handleGenerateNotes = async (isBackground = false) => {
    const isBg = isBackground === true;
    if (featureGates.NOTES_GEN_DISABLED) {
      if (!isBg) {
        alert("Notes & quiz generation is temporarily disabled for maintenance. Please try again later.");
      }
      return;
    }
    if (!isBg) {
      setLoadingNotes(true);
    }
    setIsQuizReady(false);
    setQuizError(false);
    setNotesError(false);
    
    const statusMessages = [
      "Analyzing video context & topics...",
      "Aligning study guide with onboarding goals...",
      "Structuring deep theoretical breakdown...",
      "Constructing syntax comparison matrices...",
      "Formulating code examples...",
      "Pinpointing core mock interview questions...",
      "Preparing interactive practice challenges...",
      "Formatting and rendering guide..."
    ];
    if (!isBg) {
      setStatusText(statusMessages[0]);
    }

    let msgIdx = 0;
    let logInterval;
    if (!isBg) {
      logInterval = setInterval(() => {
        msgIdx++;
        if (msgIdx < statusMessages.length) {
          setStatusText(statusMessages[msgIdx]);
        } else {
          clearInterval(logInterval);
        }
      }, 1500);
    }

    try {
      if (!isBg) {
        sound.playClockTick();
      }
      const milestone = {
        id: `solo-${video.id}`,
        title: video.title,
        description: video.channel,
        keyPoints: ["Understand video concepts", "Practice exercises", "Review interview prep"]
      };

      const devKeywords = [
        "developer", "engineer", "programming", "coding", "software", "web dev",
        "frontend", "backend", "fullstack", "full stack", "javascript", "python",
        "react", "node", "java", "c++", "c#", "rust", "go language", "golang", "devops",
        "data science", "machine learning", "database", "sql", "html", "css", "git", "leet", "leetcode", "hacker", "hackerrank"
      ];
      const whyAnswer = answers.find(a => a.question.toLowerCase().includes("why") || a.question.toLowerCase().includes("dream"))?.answer || "";
      const isDev = devKeywords.some(kw => 
        topic.toLowerCase().includes(kw) || 
        video.title.toLowerCase().includes(kw) || 
        whyAnswer.toLowerCase().includes(kw)
      );

      const completedMilestones = savedRoadmap 
        ? [
            ...(savedRoadmap.level1?.milestones || []),
            ...(savedRoadmap.level2?.milestones || []),
            ...(savedRoadmap.level3?.milestones || [])
          ]
            .filter(m => m.status === "completed")
            .map(m => m.title)
        : [];

      const res = await fetchWithJobPolling(`${backendUrl}/api/pathfinder/study-notes`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("kaevrix_token")}`
        },
        body: JSON.stringify({
          topic,
          milestone,
          answers,
          noteStyle,
          videoId: video.id,
          videoTitle: video.title,
          videoDuration: video.duration,
          isDeveloper: isDev,
          completedMilestones,
          difficulty: savedRoadmap?.difficulty || "Medium",
          devGoal: savedRoadmap?.devGoal || ""
        })
      });
      
      const data = await res.json();
      if (!res.ok || !data.notes) {
        throw new Error(data.error || "Server failed to return valid notes");
      }
      
      if (logInterval) clearInterval(logInterval);
      trackTelemetry({
        eventType: "NOTES_GENERATED",
        roadmapId: savedRoadmap?._id || savedRoadmap?.id,
        topic: savedRoadmap?.topic || topic,
        videoId: video.id,
        metadata: { noteStyle }
      });
      if (!isBg) {
        setNotes(data.notes);
        saveStudySession(data.notes, data.postVideoQuestions || []); // Persistent save to study history
      } else {
        // In background generation mode, do not overwrite existing notes!
        if (data.notes && !notes) {
          setNotes(data.notes);
          saveStudySession(data.notes, data.postVideoQuestions || []);
        }
      }
      
      // Store the unified enqueued quiz results directly
      if (data.postVideoQuestions) {
        quizDataRef.current = data;
        setIsQuizReady(true);
      }
      if (!isBg) {
        sound.playCorrect();
      }
    } catch (err) {
      console.error("Combined Notes & Quiz generation failed:", err);
      if (logInterval) clearInterval(logInterval);
      trackTelemetry({
        eventType: "NOTES_GENERATION_FAILED",
        roadmapId: savedRoadmap?._id || savedRoadmap?.id,
        topic: savedRoadmap?.topic || topic,
        videoId: video.id,
        metadata: { error: err.message || String(err) }
      });
      setNotesError(true);
      setQuizError(true);
    } finally {
      if (!isBg) {
        setLoadingNotes(false);
      }
    }
  };

  // Load existing notes from video prop or history on mount if available
  useEffect(() => {
    // 1. If video object already has notes (e.g. from Revisit), use them directly
    if (video?.notes) {
      setNotes(video.notes);
      if (video.questions && video.questions.length > 0) {
        quizDataRef.current = { postVideoQuestions: video.questions };
        setIsQuizReady(true);
      }
      return;
    }

    try {
      const historyKey = `kaevrix_study_history_${username}`;
      const existingHistoryStr = localStorage.getItem(historyKey);
      if (existingHistoryStr) {
        let history = JSON.parse(existingHistoryStr);
        let migrated = false;
        history = history.map(item => {
          if (item.notes && (item.notes.includes("→") || item.notes.includes("->") || item.notes.includes("=>"))) {
            item.notes = item.notes
              .replace(/[\u2192\u2794\u279c\u27a1]/g, "-->")
              .replace(/->/g, "-->")
              .replace(/=>/g, "==>");
            migrated = true;
          }
          return item;
        });
        if (migrated) {
          localStorage.setItem(historyKey, JSON.stringify(history));
        }

        const videoId = video.id || video.videoId;
        const savedRecord = history.find(item => (
          (videoId && (item.video?.id === videoId || item.video?.videoId === videoId || item.id === videoId)) ||
          (item.video?.title && video.title && item.video.title.trim().toLowerCase() === video.title.trim().toLowerCase())
        ));
        if (savedRecord) {
          if (savedRecord.notes) {
            setNotes(savedRecord.notes);
          }
          if (savedRecord.questions && savedRecord.questions.length > 0) {
            quizDataRef.current = { postVideoQuestions: savedRecord.questions };
            setIsQuizReady(true);
          } else if (savedRecord.notes) {
            // Trigger background generation for the quiz if missing from legacy records
            handleGenerateNotes(true);
          }
        }
      }
    } catch (e) {
      console.error("Failed to load study notes from history on mount:", e);
    }
  }, [video.id, video.videoId, video.title, video.notes, username]);



  // Start Quiz
  const handleStartQuiz = async () => {
    if (!isQuizReady || !quizDataRef.current) return;
    setQuizState("loading");
    sound.playClockTick();
    try {
        const quiz = quizDataRef.current;
        setQuestions(quiz.postVideoQuestions || []);
        setSelectedAnswers(Array(quiz.postVideoQuestions?.length || 5).fill(null));
        setGradedAnswers(Array(quiz.postVideoQuestions?.length || 5).fill(null));
        setCurrentQIdx(0);
        trackTelemetry({
          eventType: "QUIZ_STARTED",
          roadmapId: savedRoadmap?._id || savedRoadmap?.id,
          topic: savedRoadmap?.topic || topic,
          videoId: video.id,
          metadata: { totalQuestions: quiz.postVideoQuestions?.length || 5 }
        });
        setQuizState("active");
        sound.playMatchFound();
    } catch (err) {
      console.error("Quiz fetch error:", err);
      setQuizError(true);
    }
  };

  // Select Option
  const handleSelectOption = (optIdx) => {
    if (selectedAnswers[currentQIdx] !== null) return; // Answer already locked

    const correctIdx = questions[currentQIdx].answerIndex;
    const isCorrect = optIdx === correctIdx;

    setSelectedAnswers(prev => {
      const next = [...prev];
      next[currentQIdx] = optIdx;
      return next;
    });

    setGradedAnswers(prev => {
      const next = [...prev];
      next[currentQIdx] = isCorrect ? "correct" : "incorrect";
      return next;
    });

    trackTelemetry({
      eventType: "QUIZ_QUESTION_ANSWERED",
      roadmapId: savedRoadmap?._id || savedRoadmap?.id,
      topic: savedRoadmap?.topic || topic,
      videoId: video.id,
      metadata: {
        questionIndex: currentQIdx,
        questionText: questions[currentQIdx].question,
        selectedOption: optIdx,
        correctOption: correctIdx,
        isCorrect
      }
    });

    if (isCorrect) {
      sound.playCorrect();
    } else {
      sound.playIncorrect();
    }
  };

  // Next Question
  const handleNextQ = () => {
    sound.playClockTick();
    if (currentQIdx < questions.length - 1) {
      setCurrentQIdx(prev => prev + 1);
    } else {
      // End Quiz
      const score = gradedAnswers.filter(g => g === "correct").length;
      const xp = score * 20; // 20 XP per correct answer
      setQuizScore(score);
      setEarnedXp(xp);

      const totalQs = questions.length;
      const passed = score >= Math.ceil(totalQs * 0.6);

      trackTelemetry({
        eventType: "QUIZ_COMPLETED",
        roadmapId: savedRoadmap?._id || savedRoadmap?.id,
        topic: savedRoadmap?.topic || topic,
        videoId: video.id,
        metadata: { score, totalQuestions: totalQs, passed }
      });

      trackTelemetry({
        eventType: passed ? "QUIZ_PASSED" : "QUIZ_FAILED",
        roadmapId: savedRoadmap?._id || savedRoadmap?.id,
        topic: savedRoadmap?.topic || topic,
        videoId: video.id,
        metadata: { score, totalQuestions: totalQs }
      });

      setQuizState("completed");
      sound.playVictory();
    }
  };

  // Claim XP & Exit
  const handleClaimXpAndExit = () => {
    sound.playClockTick();
    onAddSoloXp(earnedXp, video.title, studyElapsedSec, topic);
    onBack();
  };

  // Download Notes as PDF
  const handleDownloadNotes = () => {
    sound.playClockTick();
    
    // Create a temporary hidden iframe to handle printing
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.zIndex = '-9999';
    
    document.body.appendChild(iframe);
    
    const htmlContent = parseMarkdownToHTML(notes);
    const doc = iframe.contentWindow.document;
    
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${(video.title || "Kaevrix_Study_Notes").replace(/[^a-z0-9]/gi, '_')} - Study Guide</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;700;900&family=Fira+Code:wght@400;500;600&display=swap');

            @page {
              margin: 10mm 12mm 10mm 12mm;
              size: auto;
            }

            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
              box-sizing: border-box;
            }

            html, body {
              padding: 0 !important;
              margin: 0 !important;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              color: #0f172a;
              background: #ffffff;
            }

            body {
              font-size: 13.5px;
              line-height: 1.6;
            }

            /* 1. Official Kaevrix Brand Header */
            .print-header-banner {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding-bottom: 8px;
              margin-bottom: 12px;
              border-bottom: 2px solid #ff6a00;
              page-break-after: avoid;
              break-after: avoid;
            }
            .brand-left {
              display: flex;
              align-items: center;
              gap: 9px;
            }
            .brand-left img {
              width: 26px;
              height: 26px;
              object-fit: contain;
              display: block;
            }
            .brand-info {
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .brand-name {
              font-family: 'Outfit', sans-serif;
              font-size: 17px;
              font-weight: 900;
              letter-spacing: 1.2px;
              color: #0f172a;
              line-height: 1;
            }
            .brand-badge {
              font-family: 'Outfit', sans-serif;
              font-size: 9px;
              font-weight: 800;
              letter-spacing: 0.5px;
              color: #ea580c;
              background: #fff7ed;
              border: 1px solid #fed7aa;
              padding: 2px 6px;
              border-radius: 4px;
              text-transform: uppercase;
              line-height: 1;
            }
            .brand-right {
              text-align: right;
              font-family: 'Inter', sans-serif;
            }
            .meta-topic {
              font-size: 11.5px;
              font-weight: 700;
              color: #0f172a;
              line-height: 1.2;
            }
            .meta-date {
              font-size: 10px;
              color: #64748b;
              line-height: 1.2;
            }

            /* Headings - comfortable, bold & readable with balanced breathing room */
            h1, h2, h3, h4 {
              font-family: 'Outfit', sans-serif;
              font-weight: 900;
              letter-spacing: -0.02em;
              color: #ea580c;
              page-break-after: avoid;
              break-after: avoid;
            }
            h1 { 
              font-size: 21px !important; 
              border-bottom: 2px solid #ffedd5 !important;
              padding-bottom: 5px !important;
              margin-top: 10px !important;
              margin-bottom: 8px !important;
              line-height: 1.25 !important;
            }
            h2 { 
              font-size: 16px !important; 
              border-left: 3.5px solid #ea580c !important;
              padding-left: 10px !important;
              margin-top: 16px !important;
              margin-bottom: 8px !important;
              line-height: 1.25 !important;
            }
            h3 { 
              font-size: 14px !important; 
              color: #ea580c !important; 
              margin-top: 13px !important;
              margin-bottom: 6px !important;
              line-height: 1.25 !important;
            }
            h4 {
              font-size: 13px !important;
              margin-top: 10px !important;
              margin-bottom: 4px !important;
              line-height: 1.25 !important;
            }

            /* Paragraphs & Lists - readable size with balanced space between elements */
            p {
              margin: 0 0 10px 0 !important;
              font-size: 13.5px !important;
              line-height: 1.6 !important;
              color: #1e293b !important;
            }
            ul, ol {
              padding-left: 20px !important;
              margin: 4px 0 10px 0 !important;
            }
            li {
              margin-bottom: 4px !important;
              font-size: 13.5px !important;
              line-height: 1.55 !important;
              color: #1e293b !important;
            }

            /* Inline code */
            :not(pre) > code {
              font-family: 'Fira Code', 'Menlo', 'Monaco', monospace;
              background: #fff7ed !important;
              color: #ea580c !important;
              padding: 2px 5px !important;
              border-radius: 4px !important;
              border: 1px solid #fed7aa !important;
              font-size: 12.5px !important;
              font-weight: 600 !important;
            }

            /* Code block container - spacious, legible font, avoiding cramped lines */
            .code-screenshot-window {
              background: #090d16 !important;
              border: 1px solid #1e293b !important;
              border-radius: 8px !important;
              margin: 12px 0 16px 0 !important;
              box-shadow: none !important;
              overflow: visible !important;
              page-break-inside: auto !important;
              break-inside: auto !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .code-screenshot-window > div:first-child {
              background: #0d1321 !important;
              border-bottom: 1px solid #1e293b !important;
              padding: 6px 14px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: space-between !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .code-screenshot-window .code-copy-btn {
              display: none !important;
            }
            .code-screenshot-window > div:last-child {
              background: #05070c !important;
              padding: 12px 16px !important;
              overflow: visible !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .code-screenshot-window pre,
            .code-screenshot-window pre code {
              background: transparent !important;
              color: #f8fafc !important;
              font-family: 'Fira Code', 'Menlo', 'Monaco', monospace !important;
              font-size: 12px !important;
              line-height: 1.52 !important;
              white-space: pre-wrap !important;
              word-break: break-word !important;
              overflow: visible !important;
              page-break-inside: auto !important;
              break-inside: auto !important;
            }

            /* Plain pre blocks (ASCII art diagrams) */
            pre:not(.code-screenshot-window pre) {
              background: #090d16 !important;
              color: #38bdf8 !important;
              border: 1px solid #1e293b !important;
              border-radius: 8px !important;
              padding: 10px 14px !important;
              margin: 10px 0 14px 0 !important;
              font-size: 10.5px !important;
              line-height: 1.32 !important;
              white-space: pre !important;
              overflow: visible !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            /* High-contrast, vivid syntax tokens in print */
            .tok-keyword { color: #ff7b72 !important; font-weight: 700 !important; }
            .tok-string { color: #7ee787 !important; }
            .tok-func { color: #d2a8ff !important; font-weight: 600 !important; }
            .tok-builtin { color: #79c0ff !important; font-weight: 600 !important; }
            .tok-num { color: #ffa657 !important; font-weight: 600 !important; }
            .tok-comment { color: #8b949e !important; font-style: italic !important; }

            blockquote {
              border-left: 3.5px solid #ff6a00 !important;
              background: #fff7ed !important;
              margin: 10px 0 14px 0 !important;
              padding: 6px 14px !important;
              border-radius: 0 6px 6px 0 !important;
              color: #475569 !important;
              font-style: italic !important;
              font-size: 12.5px !important;
              line-height: 1.55 !important;
              page-break-inside: auto !important;
              break-inside: auto !important;
            }

            /* Tables - clear font, comfortable row padding, natural flow across pages */
            .markdown-table-wrapper,
            div:has(> table) {
              margin: 10px 0 14px 0 !important;
              box-shadow: none !important;
              border-radius: 6px !important;
              border: 1px solid #cbd5e1 !important;
              overflow: visible !important;
              page-break-inside: auto !important;
              break-inside: auto !important;
            }
            table {
              width: 100% !important;
              border-collapse: collapse !important;
              margin: 0 !important;
              font-size: 12px !important;
              overflow: visible !important;
              page-break-inside: auto !important;
              break-inside: auto !important;
            }
            thead {
              display: table-header-group !important;
            }
            tr {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            th, td {
              border: 1px solid #cbd5e1 !important;
              padding: 7px 10px !important;
              text-align: left !important;
              line-height: 1.4 !important;
              font-size: 12px !important;
            }
            th {
              background-color: #f1f5f9 !important;
              font-weight: 800 !important;
              color: #0f172a !important;
              font-size: 12px !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            td {
              color: #334155 !important;
            }

            @media print {
              *, *::before, *::after {
                overflow: visible !important;
              }
              html, body {
                padding: 0 !important;
                margin: 0 !important;
                background: #ffffff !important;
                overflow: visible !important;
              }
              .code-screenshot-window,
              .code-screenshot-window * {
                overflow: visible !important;
              }
              .code-screenshot-window, table, blockquote, pre {
                page-break-inside: auto !important;
                break-inside: auto !important;
              }
              tr {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-header-banner">
            <div class="brand-left">
              <img src="/logo.png?v=2" alt="Kaevrix Logo" id="kaevrix-print-logo" />
              <div class="brand-info">
                <span class="brand-name">KAEVRIX</span>
                <span class="brand-badge">STUDY CODEX</span>
              </div>
            </div>
            <div class="brand-right">
              <div class="meta-topic">${video.title || "JavaScript Architecture"}</div>
              <div class="meta-date">Compiled on ${new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</div>
            </div>
          </div>
          ${htmlContent}
        </body>
      </html>
    `);
    doc.close();

    const doPrint = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    };

    // Ensure logo image is fully loaded before triggering print dialog
    const logoImg = doc.getElementById("kaevrix-print-logo");
    if (logoImg) {
      if (logoImg.complete && logoImg.naturalHeight > 0) {
        setTimeout(doPrint, 250);
      } else {
        logoImg.onload = () => setTimeout(doPrint, 250);
        logoImg.onerror = () => setTimeout(doPrint, 250);
        setTimeout(doPrint, 700);
      }
    } else {
      setTimeout(doPrint, 400);
    }

    iframe.contentWindow.addEventListener('afterprint', () => {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
    });
  };

  const isCodingChallenge = false;

  const parsedLesson = useMemo(() => {
    if (!notes || !notes.trim().startsWith("{")) return null;
    try {
      return JSON.parse(notes);
    } catch (e) {
      console.error("Failed to parse interactive notes", e);
      return null;
    }
  }, [notes]);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 2000,
      background: isDarkMode 
        ? "radial-gradient(circle at 80% 20%, #1f1105 0%, #0c0805 40%, #050302 100%)" 
        : "radial-gradient(circle at 80% 20%, #fff7f0 0%, #faf6f3 40%, #ffffff 100%)",
      color: isDarkMode ? "#f8fafc" : "#0f172a",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Inter', var(--font-sans)",
      overflow: "hidden"
    }} className="animate-slideup animate-glow-background">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;700;900&display=swap');

        @keyframes slideUp {
          from { transform: translateY(100vh); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideup {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes progressGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(255,106,0,0.2), 0 0 30px rgba(255,106,0,0.1); }
          50% { box-shadow: 0 0 40px rgba(255,106,0,0.5), 0 0 80px rgba(255,106,0,0.2); }
        }
        .unlocked-pulse {
          animation: pulse 1.5s infinite ease-in-out;
        }
        
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(0.5deg); }
        }
        @keyframes auraPulse {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50% { transform: scale(1.2); opacity: 0.85; }
        }
        @keyframes skeletonShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-float-card {
          animation: floatCard 4s ease-in-out infinite;
        }
        .animate-aura-pulse {
          animation: auraPulse 3s ease-in-out infinite;
        }
        .skeleton-line {
          height: 8px;
          border-radius: 4px;
          background: linear-gradient(90deg, 
            rgba(255, 106, 0, 0.12) 25%, 
            rgba(255, 179, 0, 0.25) 50%, 
            rgba(255, 106, 0, 0.12) 75%
          );
          background-size: 200% 100%;
          animation: skeletonShimmer 1.8s infinite linear;
        }
        
        /* Completely remove vertical & horizontal scrollbars while preserving smooth scrolling */
        .custom-scrollbar,
        .custom-scrollbar *,
        .solo-study-no-scrollbar,
        .solo-study-no-scrollbar * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .custom-scrollbar::-webkit-scrollbar,
        .custom-scrollbar *::-webkit-scrollbar,
        .solo-study-no-scrollbar::-webkit-scrollbar,
        .solo-study-no-scrollbar *::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
          background: transparent !important;
        }

        /* High-Fidelity Markdown notes typography styling */
        .study-notes-document {
          font-family: 'Inter', sans-serif;
          max-width: 1060px;
          margin: 0 auto;
          padding: 0;
        }
        .study-notes-document h1, .study-notes-document h2, .study-notes-document h3 {
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          letter-spacing: -0.015em;
          line-height: 1.35;
        }
        .study-notes-document h1 {
          font-size: 36px;
          margin: 40px 0 20px 0;
          background: linear-gradient(135deg, #ff6a00, #ffb300, #ff4500);
          background-size: 200% auto;
          animation: textGradient 4s linear infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        @keyframes textGradient {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .study-notes-document h2 {
          font-size: 24px;
          margin: 36px 0 16px 0;
          padding-bottom: 12px;
          position: relative;
        }
        .study-notes-document h2::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 60px;
          height: 4px;
          border-radius: 2px;
          background: linear-gradient(90deg, #ff6a00, transparent);
        }
        .notes-dark h2 { color: #facc15; }
        .notes-light h2 { color: #ea580c; }
        
        .study-notes-document h3 {
          font-size: 22px;
          margin: 28px 0 10px 0;
          letter-spacing: 0;
        }
        .notes-dark h3 { color: #fed7aa; }
        .notes-light h3 { color: #9a3412; }
        
        .study-notes-document p {
          font-size: 17px;
          line-height: 1.7;
          margin-bottom: 20px;
          letter-spacing: 0.01em;
        }
        .notes-dark p { color: rgba(255,255,255,0.88); }
        .notes-light p { color: #334155; }
        
        .study-notes-document strong {
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          display: inline-block;
          margin: 0 2px;
          box-shadow: none;
        }
        .notes-dark strong { 
          color: #1e293b;
          background: linear-gradient(120deg, #fef08a 0%, #fde047 100%);
        }
        .notes-light strong { 
          color: #0f172a;
          background: linear-gradient(120deg, #ffedd5 0%, #fed7aa 100%);
          border-bottom: 2px solid #fdba74;
        }

        .study-notes-document blockquote {
          margin: 24px 0;
          padding: 16px 24px;
          border-left: 4px solid #ff6a00;
          border-radius: 0 12px 12px 0;
          font-style: italic;
          font-size: 16px;
        }
        .notes-dark blockquote {
          background: linear-gradient(90deg, rgba(255,106,0,0.1) 0%, transparent 100%);
          color: #fb923c;
        }
        .notes-light blockquote {
          background: linear-gradient(90deg, rgba(255,106,0,0.05) 0%, transparent 100%);
          color: #c2410c;
        }

        /* Bullet points and lists */
        .study-notes-document ul, .study-notes-document ol {
          padding-left: 24px;
          margin: 16px 0 24px 0;
        }
        .study-notes-document li {
          margin-bottom: 10px;
          line-height: 1.7;
          font-size: 15.5px;
        }
        .study-notes-document li::marker {
          color: #ff6a00;
        }
        .notes-dark li { color: rgba(255,255,255,0.85); }
        .notes-light li { color: #475569; }

        /* Tables */
        .study-notes-document table {
          display: block;
          width: 100%;
          overflow-x: auto;
          border-collapse: separate;
          border-spacing: 0;
          margin: 24px 0;
          font-size: 14.5px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
        }
        .notes-dark table {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(20, 25, 35, 0.4);
        }
        .notes-light table {
          border: 1px solid #e2e8f0;
          background: #ffffff;
        }
        .study-notes-document th, .study-notes-document td {
          padding: 14px 20px;
          text-align: left;
        }
        .study-notes-document th {
          font-weight: 800;
          text-transform: uppercase;
          font-size: 12.5px;
          letter-spacing: 0.8px;
        }
        .notes-dark th {
          background: rgba(255, 255, 255, 0.05);
          color: #e2e8f0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .notes-light th {
          background: #f8fafc;
          color: #475569;
          border-bottom: 1px solid #e2e8f0;
        }
        .study-notes-document td {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .notes-dark td {
          color: rgba(255,255,255,0.85);
          border-color: rgba(255, 255, 255, 0.05);
        }
        .notes-light td {
          color: #334155;
          border-color: #f1f5f9;
        }
        .study-notes-document tr:last-child td {
          border-bottom: none;
        }

        /* Code Snippets */
        .study-notes-document code {
          font-family: 'Fira Code', 'Courier New', monospace;
          font-size: 14.5px;
          padding: 4px 8px;
          border-radius: 6px;
          font-weight: 600;
        }
        .notes-dark code {
          background: rgba(255, 106, 0, 0.15);
          color: #fb923c;
          border: 1px solid rgba(255, 106, 0, 0.25);
        }
        .notes-light code {
          background: #fff7ed;
          color: #ea580c;
          border: 1px solid #ffedd5;
        }
        .study-notes-document pre code {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          color: inherit !important;
          font-weight: 500;
          box-shadow: none;
        }
        
        /* Mermaid Graphs properly scrollable */
        .study-notes-document .mermaid {
          display: flex;
          justify-content: center;
          width: 100%;
          overflow-x: auto;
          margin: 24px 0;
          padding: 16px;
          background: var(--bg-secondary);
          border-radius: 12px;
        }

        /* Mobile Typography Tuning */
        @media (max-width: 768px) {
          .study-notes-document h1 {
            font-size: 24px !important;
            margin: 16px 0 12px 0 !important;
            line-height: 1.3 !important;
          }
          .study-notes-document h2 {
            font-size: 19px !important;
            margin: 22px 0 12px 0 !important;
          }
          .study-notes-document h3 {
            font-size: 16px !important;
            margin: 18px 0 8px 0 !important;
          }
          .study-notes-document p {
            font-size: 14.5px !important;
            line-height: 1.65 !important;
            margin-bottom: 14px !important;
          }
          .study-notes-document ul, .study-notes-document ol {
            padding-left: 20px !important;
            margin: 10px 0 16px 0 !important;
          }
          .study-notes-document li {
            font-size: 14px !important;
            margin-bottom: 8px !important;
            line-height: 1.6 !important;
          }
          .study-notes-document code {
            font-size: 13px !important;
            word-break: break-word !important;
          }
          .study-notes-document pre {
            padding: 12px 14px !important;
            margin: 14px 0 !important;
            border-radius: 10px !important;
          }
          .study-notes-document pre code {
            font-size: 12.5px !important;
          }
        }
      `}</style>

      {/* Top Header Navigation */}
      <div style={{
        background: isDarkMode ? "rgba(13, 8, 5, 0.7)" : "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: isDarkMode ? "1px solid rgba(255, 106, 0, 0.15)" : "1px solid rgba(255, 106, 0, 0.1)",
        padding: "12px 16px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        zIndex: 10,
        boxShadow: "0 4px 30px rgba(0,0,0,0.05)"
      }}>
        {/* Left Side: Circular Back Button */}
        <button 
          onClick={() => {
            sound.playClockTick();
            if (quizState === "active") {
              trackTelemetry({
                eventType: "QUIZ_ABANDONED",
                roadmapId: savedRoadmap?._id || savedRoadmap?.id,
                topic: savedRoadmap?.topic || topic,
                videoId: video.id,
                metadata: {
                  questionsAnswered: gradedAnswers.filter(g => g !== null).length,
                  totalQuestions: questions.length
                }
              });
            }
            onBack();
          }}
          title="Exit Training"
          style={{
            background: isDarkMode ? "rgba(255, 106, 0, 0.08)" : "#fff7ed",
            border: isDarkMode ? "1px solid rgba(255, 106, 0, 0.2)" : "1px solid #ffedd5",
            color: isDarkMode ? "#ff8c3a" : "#ea580c",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: "900",
            cursor: "pointer",
            transition: "all 0.2s",
            flexShrink: 0
          }}
          onMouseOver={e => { e.currentTarget.style.color = isDarkMode ? "#ffffff" : "#ea580c"; e.currentTarget.style.background = isDarkMode ? "rgba(255, 106, 0, 0.16)" : "#ffedd5"; }}
          onMouseOut={e => { e.currentTarget.style.color = isDarkMode ? "#ff8c3a" : "#ea580c"; e.currentTarget.style.background = isDarkMode ? "rgba(255, 106, 0, 0.08)" : "#fff7ed"; }}
        >
          ←
        </button>
        
        {/* Right Side: Navigation Pills */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "8px", 
          flexWrap: "wrap", 
          justifyContent: "flex-end" 
        }}>
          {/* Dev Fast Forward Button (Hidden/Subtle) */}
          <button
            onClick={() => setStudyElapsedSec(prev => prev + 300)}
            title="Dev: Add 5 minutes"
            style={{
              background: "transparent",
              border: isDarkMode ? "1px dashed rgba(255,255,255,0.1)" : "1px dashed rgba(0,0,0,0.1)",
              color: isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
              padding: "4px 8px",
              borderRadius: "12px",
              fontSize: "10px",
              fontWeight: "800",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseOver={e => {
              e.currentTarget.style.color = "#ff6a00";
              e.currentTarget.style.borderColor = "#ff6a00";
            }}
            onMouseOut={e => {
              e.currentTarget.style.color = isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)";
              e.currentTarget.style.borderColor = isDarkMode ? "1px dashed rgba(255,255,255,0.1)" : "1px dashed rgba(0,0,0,0.1)";
            }}
          >
            +5m
          </button>

          {/* Study Timer Pill */}
          <span style={{
            fontSize: "12px",
            fontWeight: "800",
            padding: "6px 14px",
            borderRadius: "20px",
            background: (studyElapsedSec > 0 && (RECHARGE_THRESHOLD - (studyElapsedSec % RECHARGE_THRESHOLD)) <= 60)
              ? "rgba(124, 58, 237, 0.12)"
              : (isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"),
            color: (studyElapsedSec > 0 && (RECHARGE_THRESHOLD - (studyElapsedSec % RECHARGE_THRESHOLD)) <= 60) ? "#a78bfa" : (isDarkMode ? "#94a3b8" : "#64748b"),
            border: (studyElapsedSec > 0 && (RECHARGE_THRESHOLD - (studyElapsedSec % RECHARGE_THRESHOLD)) <= 60)
              ? "1.5px solid rgba(124, 58, 237, 0.3)"
              : (isDarkMode ? "1.5px solid rgba(255,255,255,0.08)" : "1.5px solid #e2e8f0"),
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: "0.5px",
            transition: "all 0.5s ease",
            animation: (studyElapsedSec > 0 && (RECHARGE_THRESHOLD - (studyElapsedSec % RECHARGE_THRESHOLD)) <= 60) ? "auraPulse 2s ease-in-out infinite" : "none",
          }}>
            <Clock size={13} />
            {formatStudyTime(studyElapsedSec)}
          </span>

          {/* Watched Percentage Pill / Quiz Trigger */}
          <button 
            onClick={() => {
              if (progress >= 90) {
                sound.playClockTick();
                setActiveTab("quiz");
                if (quizState === "not_started") {
                  handleStartQuiz();
                }
              }
            }}
            disabled={progress < 90}
            title={progress >= 90 ? "Click to start Level Up Quiz" : `${Math.round(progress)}% watched`}
            style={{
              fontSize: "12px",
              fontWeight: "800",
              padding: "6px 14px",
              borderRadius: "20px",
              background: progress >= 90 
                ? "linear-gradient(135deg, #10b981, #059669)" 
                : (isDarkMode ? "rgba(255, 106, 0, 0.1)" : "rgba(255, 106, 0, 0.08)"),
              color: progress >= 90 ? "#ffffff" : "#ff6a00",
              border: progress >= 90 ? "none" : `1.5px solid ${isDarkMode ? "rgba(255, 106, 0, 0.4)" : "#ffedd5"}`,
              cursor: progress >= 90 ? "pointer" : "default",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: progress >= 90 ? "0 4px 14px rgba(16,185,129,0.35)" : "none",
              transition: "all 0.2s ease"
            }}
          >
            {progress >= 90 ? (
              <>
                <Zap size={13} fill="#ffffff" />
                <span>START QUIZ</span>
              </>
            ) : (
              <span>{Math.round(progress)}% SEEN</span>
            )}
          </button>
        </div>
      </div>
 
      {/* Main Splitscreen Layout (Edge-to-edge on mobile like YouTube) */}
      <div style={{ 
        display: "flex", 
        flexDirection: isMobile ? "column" : "row", 
        flex: 1, 
        overflowY: isMobile ? "auto" : "hidden", 
        overflowX: "hidden",
        padding: isMobile ? "0px" : "24px", 
        gap: isMobile ? "0px" : "24px",
        boxSizing: "border-box",
        width: "100%"
      }} className="solo-study-no-scrollbar">
        
        {/* Left Side: Large Immersive Player (100% full width on mobile) */}
        <div style={{
          width: isMobile ? "100%" : ((isNotesExpanded || isCodingChallenge) ? "0%" : "55%"),
          display: (isNotesExpanded || isCodingChallenge) ? "none" : "flex",
          padding: isMobile ? "0" : "32px",
          flexDirection: "column",
          gap: isMobile ? "0" : "32px",
          background: isMobile ? "#000000" : (isDarkMode ? "rgba(13, 8, 5, 0.6)" : "rgba(255, 255, 255, 0.6)"),
          backdropFilter: isMobile ? "none" : "blur(16px)",
          borderRadius: isMobile ? "0px" : "24px",
          border: isMobile ? "none" : (isDarkMode ? "1px solid rgba(255, 106, 0, 0.15)" : "1px solid rgba(255, 106, 0, 0.1)"),
          boxShadow: isMobile ? "0 4px 16px rgba(0,0,0,0.2)" : (isDarkMode ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 40px rgba(0,0,0,0.05)"),
          overflowY: isMobile ? "visible" : "auto",
          boxSizing: "border-box"
        }} className="custom-scrollbar">
          
          {/* Theatre Player Wrapper (100% full width, edge-to-edge on mobile like YouTube) */}
          <div style={{
            position: "relative",
            width: "100%",
            paddingTop: "56.25%", // 16:9 Aspect Ratio
            background: "#000000",
            borderRadius: isMobile ? "0px" : "20px",
            overflow: "hidden",
            boxShadow: isMobile ? "none" : (isDarkMode ? "0 20px 50px rgba(0,0,0,0.5)" : "0 10px 30px rgba(0,0,0,0.15)"),
            border: isMobile ? "none" : (isDarkMode ? "2px solid rgba(255, 106, 0, 0.18)" : "2px solid #ffedd5"),
            animation: isMobile ? "none" : "progressGlow 4s infinite"
          }}>
            <div style={{ position: "absolute", inset: 0 }}>
              <YoutubePlayer 
                videoId={video?.videoId || video?.id || (typeof video === "string" ? video : "")} 
                onProgress={handleProgress} 
                onFinished={handleFinished} 
                isFrozen={isRecharging} 
              />
            </div>
          </div>
 
          {/* Video Title & Action Row (Desktop only - removed on mobile for clean YouTube look) */}
          {!isMobile && (
            <div style={{ 
              display: "flex", 
              flexDirection: "row", 
              justifyContent: "space-between", 
              alignItems: "center",
              gap: "16px",
              marginTop: "8px"
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", textAlign: "left", flex: 1 }}>
                <div style={{ color: "var(--text-muted)", fontSize: "10px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Solo Training Theatre
                </div>
                <h1 style={{ 
                  fontSize: "20px", 
                  fontWeight: "950", 
                  color: isDarkMode ? "#ffffff" : "#0f172a", 
                  margin: 0,
                  lineHeight: "1.4"
                }}>
                  {video.title}
                </h1>
              </div>

              {/* Quiz Access Button */}
              <div style={{ flexShrink: 0, alignSelf: "auto" }}>
                {progress < 90 ? (
                  <button 
                    disabled 
                    style={{
                      padding: "10px 20px",
                      borderRadius: "10px",
                      background: isDarkMode ? "rgba(255,255,255,0.02)" : "#f8fafc",
                      border: isDarkMode ? "1px solid rgba(255,255,255,0.06)" : "1px solid #e2e8f0",
                      color: "var(--text-muted)",
                      fontSize: "12.5px",
                      fontWeight: "750",
                      cursor: "not-allowed",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      justifyContent: "center"
                    }}
                  >
                    <span>Quiz Locked</span>
                    <span style={{ fontSize: "11px", opacity: 0.8 }}>({Math.round(progress)}% / 90%)</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      sound.playClockTick();
                      setActiveTab("quiz");
                      if (quizState === "not_started") {
                        handleStartQuiz();
                      }
                    }}
                    style={{
                      padding: "12px 24px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      border: "none",
                      color: "#ffffff",
                      fontSize: "13px",
                      fontWeight: "900",
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(16,185,129,0.3)",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      justifyContent: "center"
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 6px 18px rgba(16,185,129,0.45)";
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = "0 4px 15px rgba(16,185,129,0.3)";
                    }}
                  >
                    <span>Start Level Up Quiz</span>
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
 
        {/* Right Side: Interactive Notes & Quizzes */}
        <div style={{
          width: isMobile ? "100%" : ((isNotesExpanded || isCodingChallenge) ? "100%" : "45%"),
          display: "flex",
          flexDirection: "column",
          height: isMobile ? "auto" : "100%",
          background: isMobile ? (isDarkMode ? "transparent" : "#ffffff") : (isDarkMode ? "rgba(13, 8, 5, 0.85)" : "rgba(255, 255, 255, 0.85)"),
          backdropFilter: isMobile ? "none" : "blur(20px)",
          borderRadius: isMobile ? "0px" : "24px",
          border: isMobile ? "none" : (isDarkMode ? "1px solid rgba(255, 106, 0, 0.2)" : "1px solid rgba(255, 106, 0, 0.15)"),
          boxShadow: isMobile ? "none" : (isDarkMode ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 40px rgba(0,0,0,0.05)"),
          overflow: isMobile ? "visible" : "hidden",
          transition: "width 0.3s ease",
          margin: "0",
          boxSizing: "border-box"
        }}>
          
          {/* Section Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: isDarkMode ? "1px solid rgba(255, 106, 0, 0.15)" : "1px solid #ffedd5",
            padding: isMobile ? "14px 20px" : "16px 24px",
            flexShrink: 0,
            gap: "12px",
            background: isMobile ? (isDarkMode ? "rgba(13, 8, 5, 0.95)" : "rgba(255, 255, 255, 0.95)") : "transparent",
            backdropFilter: isMobile ? "blur(12px)" : "none",
            WebkitBackdropFilter: isMobile ? "blur(12px)" : "none",
            position: isMobile ? "sticky" : "static",
            top: 0,
            zIndex: 10
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center",
                gap: "8px",
                background: isDarkMode ? "rgba(255, 106, 0, 0.08)" : "#fff7ed",
                padding: "6px 12px",
                borderRadius: "20px",
                border: isDarkMode ? "1px solid rgba(255, 106, 0, 0.15)" : "1px solid #ffedd5",
              }}>
                <span style={{ fontSize: "15px", display: "flex", alignItems: "center", filter: "drop-shadow(0 0 8px rgba(255, 106, 0, 0.5))" }}>
                  {activeTab === "notes" ? <FileText size={15} /> : <Zap size={15} />}
                </span>
                <span style={{ 
                  fontSize: "12.5px", 
                  fontWeight: "900", 
                  color: isDarkMode ? "#ffb300" : "#ea580c",
                  fontFamily: "'Outfit', sans-serif",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap"
                }}>
                  {activeTab === "notes" ? "AI Study Guide" : "Quest Quiz"}
                </span>
              </div>
            </div>

            {/* Focus Audio Element */}
            <audio ref={focusAudioRef} src="/songs/song16.mp3" loop />

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {activeTab === "notes" && notes && (
                <>
                  <button 
                    onClick={handleDownloadNotes}
                    title="Download Notes as PDF"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--text-secondary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      padding: "6px",
                      borderRadius: "8px"
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
                      e.currentTarget.style.color = isDarkMode ? "#fff" : "#000";
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </button>

                  <button
                    onClick={() => {
                      sound.playGlitch && sound.playGlitch();
                    }}
                    title="Locked • Regenerate Note Style (Coming Soon)"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: isDarkMode ? "rgba(255, 255, 255, 0.35)" : "rgba(45, 36, 31, 0.35)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "not-allowed",
                      transition: "all 0.2s",
                      padding: "6px",
                      borderRadius: "8px",
                      position: "relative"
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                    </svg>
                    <Lock size={10} style={{ position: "absolute", bottom: "3px", right: "2px", color: isDarkMode ? "#ef4444" : "#e07a5f" }} />
                  </button>
                </>
              )}

              {/* Focus Audio Toggle Button */}
              <button
                onClick={() => {
                  sound.playClockTick();
                  if (focusAudioRef.current) {
                    if (isFocusPlaying) {
                      focusAudioRef.current.pause();
                      setIsFocusPlaying(false);
                      setIsNotesExpanded(false);
                    } else {
                      focusAudioRef.current.play().then(() => {
                        setIsFocusPlaying(true);
                        setIsNotesExpanded(true);
                      }).catch(err => console.log("Audio block", err));
                    }
                  }
                }}
                title={isFocusPlaying ? "Deactivate Focus Mode" : "Activate Focus Mode"}
                style={{
                  background: isFocusPlaying ? (isDarkMode ? "rgba(16, 185, 129, 0.15)" : "#d1fae5") : "transparent",
                  border: isFocusPlaying ? (isDarkMode ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid #10b981") : (isDarkMode ? "1px solid rgba(255,255,255,0.15)" : "1px solid #cbd5e1"),
                  color: isFocusPlaying ? "#10b981" : "var(--text-secondary)",
                  borderRadius: "20px",
                  padding: "0 14px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  flexShrink: 0,
                  fontSize: "12px",
                  fontWeight: "800",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  fontFamily: "'Outfit', sans-serif",
                  gap: "6px"
                }}
                onMouseOver={e => {
                  if (!isFocusPlaying) {
                    e.currentTarget.style.background = isDarkMode ? "rgba(255,255,255,0.05)" : "#f1f5f9";
                    e.currentTarget.style.color = "var(--text-primary)";
                    e.currentTarget.style.borderColor = isDarkMode ? "rgba(255,255,255,0.25)" : "#94a3b8";
                  }
                }}
                onMouseOut={e => {
                  if (!isFocusPlaying) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text-secondary)";
                    e.currentTarget.style.borderColor = isDarkMode ? "rgba(255,255,255,0.15)" : "#cbd5e1";
                  }
                }}
              >
                {isFocusPlaying ? (
                  <>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
                    <span>FOCUSING</span>
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </svg>
                    <span>FOCUS</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div style={{ 
            flex: isMobile ? "none" : 1, 
            overflowY: isMobile ? "visible" : "auto", 
            padding: isMobile ? "20px 20px 100px 20px" : "12px 24px 40px 24px", 
            boxSizing: "border-box",
            width: "100%"
          }}>
            
            {/* 1. STUDY NOTES TAB */}
            {activeTab === "notes" && (
              <div style={{ height: "100%" }}>
                {loadingNotes ? (
                  /* Notes Generation Loading Screen */
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    minHeight: "380px",
                    textAlign: "center",
                    position: "relative"
                  }}>
                    {/* Glowing Gold/Orange Aura behind the card */}
                    <div className="animate-aura-pulse" style={{
                      position: "absolute",
                      width: "180px",
                      height: "180px",
                      borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(255, 106, 0, 0.25) 0%, rgba(255, 179, 0, 0.08) 55%, transparent 70%)",
                      filter: "blur(24px)",
                      pointerEvents: "none",
                      zIndex: 0,
                      transform: "translateY(-40px)"
                    }} />

                    {/* Floating Document Card */}
                    <div className="animate-float-card" style={{
                      position: "relative",
                      zIndex: 1,
                      width: "240px",
                      height: "170px",
                      background: isDarkMode ? "rgba(30, 41, 59, 0.45)" : "rgba(255, 255, 255, 0.8)",
                      border: isDarkMode ? "1.5px solid rgba(255, 106, 0, 0.25)" : "1.5px solid rgba(255, 106, 0, 0.15)",
                      borderRadius: "16px",
                      boxShadow: isDarkMode ? "0 15px 35px rgba(0,0,0,0.3)" : "0 10px 25px rgba(255, 106, 0, 0.08)",
                      backdropFilter: "blur(12px)",
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      boxSizing: "border-box",
                      marginBottom: "28px"
                    }}>
                      {/* Document Header Icon & Title Skeleton */}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: isDarkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)", paddingBottom: "10px" }}>
                        <span style={{ fontSize: "16px" }}>*</span>
                        <div className="skeleton-line" style={{ width: "50%", height: "8px" }} />
                      </div>

                      {/* Document Body Lines */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div className="skeleton-line" style={{ width: "90%" }} />
                        <div className="skeleton-line" style={{ width: "85%" }} />
                        <div className="skeleton-line" style={{ width: "95%" }} />
                        <div className="skeleton-line" style={{ width: "60%" }} />
                      </div>

                      {/* Floating glowing pen tip drawing the content */}
                      <div className="animate-aura-pulse" style={{
                        position: "absolute",
                        bottom: "24px",
                        right: "32px",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#ff6a00",
                        boxShadow: "0 0 10px #ff6a00, 0 0 20px #ffb300"
                      }} />
                    </div>

                    {/* Status Info */}
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <h3 style={{ 
                        fontSize: "17px", 
                        fontWeight: "900", 
                        margin: "0 0 4px 0",
                        background: "linear-gradient(135deg, #ff6a00, #ffb300)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        color: isDarkMode ? "transparent" : "#ea580c"
                      }}>
                        {statusText}
                      </h3>
                      <p style={{ color: "var(--text-muted)", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1.2px", margin: 0 }}>
                        Crafting Study Deck
                      </p>
                    </div>
                  </div>
                ) : notesError ? (
                  /* Render beautiful Notes Generation Error Screen with Retry Button */
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    minHeight: "380px",
                    textAlign: "center",
                    padding: "20px"
                  }}>
                    <div style={{
                      width: "64px",
                      height: "64px",
                      background: "rgba(239, 68, 68, 0.1)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "20px",
                      border: "1.5px solid rgba(239, 68, 68, 0.25)"
                    }}>
                      <LucideX size={28} color="#ef4444" />
                    </div>
                    <h3 style={{ fontSize: "18px", fontWeight: "900", color: isDarkMode ? "#ffffff" : "#0f172a", margin: "0 0 10px 0" }}>
                      Generation Failed
                    </h3>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px", maxWidth: "420px", margin: "0 0 24px 0", lineHeight: "1.6" }}>
                      We encountered an issue while generating your study notes and quiz questions. The AI engine might have timed out or encountered an error.
                    </p>
                    <button
                      onClick={() => {
                        sound.playClockTick();
                        handleGenerateNotes();
                      }}
                      style={{
                        padding: "12px 28px",
                        background: "linear-gradient(135deg, #ef4444, #dc2626)",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "12px",
                        fontWeight: "900",
                        fontSize: "14px",
                        cursor: "pointer",
                        boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={e => e.currentTarget.style.transform = "scale(1.02)"}
                      onMouseOut={e => e.currentTarget.style.transform = "none"}
                    >
                      Retry AI Generation
                    </button>
                  </div>
                ) : notes ? (
                  /* Render Markdown guide or Interactive Lesson */
                  <>
                    {parsedLesson && showInteractiveOverlay ? (
                      <div style={{ flex: 1, height: "100%", width: "100%", minHeight: "560px", borderRadius: "16px", overflow: "hidden" }}>
                        <InteractiveLesson
                          lessonData={parsedLesson}
                          isDarkMode={isDarkMode}
                          onClose={() => {
                            sound.playClockTick();
                            setIsNotesExpanded(false);
                            setShowInteractiveOverlay(false);
                          }}
                          isExpanded={isNotesExpanded}
                          onToggleExpand={() => setIsNotesExpanded(prev => !prev)}
                          onGenerate={() => handleGenerateNotes()}
                        />
                      </div>
                    ) : (
                      <div className={`study-notes-document ${isDarkMode ? 'notes-dark' : 'notes-light'}`}>
                        {parsedLesson ? (
                          <div style={{
                            padding: "48px 24px",
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: "420px",
                            maxWidth: "460px",
                            margin: "0 auto"
                          }}>
                            <div style={{
                              width: "64px",
                              height: "64px",
                              borderRadius: "20px",
                              background: isDarkMode ? "rgba(255, 106, 0, 0.12)" : "#fff7ed",
                              border: isDarkMode ? "1px solid rgba(255, 106, 0, 0.3)" : "1px solid #fed7aa",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "30px",
                              marginBottom: "16px",
                              boxShadow: "0 8px 24px rgba(255, 106, 0, 0.15)"
                            }}>
                              <Zap size={24} color="#ea580c" />
                            </div>

                            <h2 style={{
                              fontSize: "22px",
                              fontWeight: "900",
                              color: isDarkMode ? "#ffffff" : "#0f172a",
                              marginBottom: "8px",
                              fontFamily: "'Outfit', sans-serif"
                            }}>
                              {parsedLesson.topicName || topic || "Interactive Story Mode"}
                            </h2>

                            <p style={{
                              color: isDarkMode ? "#94a3b8" : "#64748b",
                              fontSize: "14px",
                              lineHeight: "1.6",
                              marginBottom: "28px"
                            }}>
                              Interactive concept tree is compiled and ready with adaptive checkpoints.
                            </p>

                            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                              <button
                                onClick={() => {
                                  sound.playClockTick();
                                  setShowInteractiveOverlay(true);
                                }}
                                style={{
                                  padding: "12px 28px",
                                  borderRadius: "12px",
                                  background: "linear-gradient(135deg, #ff6a00 0%, #ea580c 100%)",
                                  color: "#ffffff",
                                  fontSize: "14px",
                                  fontWeight: "800",
                                  border: "none",
                                  cursor: "pointer",
                                  boxShadow: "0 4px 16px rgba(234, 88, 12, 0.35)",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  transition: "all 0.2s"
                                }}
                                onMouseOver={e => e.currentTarget.style.transform = "translateY(-1px)"}
                                onMouseOut={e => e.currentTarget.style.transform = "none"}
                              >
                                Resume Story Mode
                              </button>

                              <button
                                onClick={() => {
                                  sound.playClockTick();
                                  handleGenerateNotes();
                                }}
                                style={{
                                  padding: "12px 20px",
                                  borderRadius: "12px",
                                  background: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                                  border: isDarkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid #cbd5e1",
                                  color: isDarkMode ? "#cbd5e1" : "#475569",
                                  fontSize: "13px",
                                  fontWeight: "750",
                                  cursor: "pointer",
                                  transition: "all 0.2s"
                                }}
                              >
                                Regenerate
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <StudyNotesContent notes={notes} isDarkMode={isDarkMode} isFocusMode={isFocusPlaying} />

                            {/* Level Up Quiz Banner at Bottom of Notes */}
                            <div style={{
                              marginTop: "32px",
                              marginBottom: "16px",
                              padding: isMobile ? "16px" : "20px",
                              borderRadius: "16px",
                              background: isDarkMode ? "rgba(255, 106, 0, 0.05)" : "#fff7ed",
                              border: isDarkMode ? "1px solid rgba(255, 106, 0, 0.2)" : "1px solid #fed7aa",
                              textAlign: "center",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "10px"
                            }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                {progress >= 90 ? (
                                  <Zap size={18} color="#10b981" />
                                ) : (
                                  <Lock size={16} color={isDarkMode ? "#fb923c" : "#ea580c"} />
                                )}
                                <span style={{ fontSize: "14px", fontWeight: "900", color: isDarkMode ? "#ffffff" : "#0f172a" }}>
                                  {progress >= 90 ? "Knowledge Verified! Level Up Quiz Unlocked" : `Level Up Quiz Locked (${Math.round(progress)}% / 90%)`}
                                </span>
                              </div>
                              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0, maxWidth: "380px", lineHeight: "1.5" }}>
                                {progress >= 90 
                                  ? "You have completed the required video training. Prove your mastery to gain Solo XP!" 
                                  : "Watch at least 90% of the video to unlock the mastery quiz and earn solo XP."}
                              </p>
                              {progress >= 90 ? (
                                <button
                                  onClick={() => {
                                    sound.playClockTick();
                                    setActiveTab("quiz");
                                    if (quizState === "not_started") {
                                      handleStartQuiz();
                                    }
                                  }}
                                  style={{
                                    padding: "10px 24px",
                                    borderRadius: "12px",
                                    background: "linear-gradient(135deg, #10b981, #059669)",
                                    border: "none",
                                    color: "#ffffff",
                                    fontSize: "13px",
                                    fontWeight: "900",
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    boxShadow: "0 4px 15px rgba(16,185,129,0.3)"
                                  }}
                                >
                                  <Zap size={14} fill="#ffffff" />
                                  <span>Start Level Up Quiz</span>
                                </button>
                              ) : (
                                <div style={{
                                  fontSize: "11.5px",
                                  fontWeight: "750",
                                  color: "var(--text-muted)",
                                  padding: "6px 14px",
                                  borderRadius: "10px",
                                  background: isDarkMode ? "rgba(255,255,255,0.04)" : "#f1f5f9",
                                  border: isDarkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0"
                                }}>
                                  Keep Watching to Unlock ({Math.round(progress)}% / 90%)
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  /* Call to Action Generate notes */
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    minHeight: "350px",
                    textAlign: "center"
                  }}>
                    {/* Premium open-book card icon */}
                    <div style={{
                      position: "relative",
                      width: "80px",
                      height: "80px",
                      marginBottom: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: isDarkMode ? "rgba(255, 106, 0, 0.1)" : "#fff7ed",
                      borderRadius: "20px",
                      border: isDarkMode ? "1px solid rgba(255, 106, 0, 0.2)" : "1px solid #ffedd5",
                      boxShadow: isDarkMode ? "0 8px 24px rgba(0,0,0,0.3)" : "0 8px 24px rgba(255, 106, 0, 0.05)",
                    }}>
                      <div className="animate-aura-pulse" style={{
                        position: "absolute",
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(255, 106, 0, 0.3) 0%, transparent 70%)",
                        filter: "blur(8px)",
                        pointerEvents: "none"
                      }} />
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{
                        color: "#ff6a00",
                        position: "relative",
                        zIndex: 1
                      }}>
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                        <path d="M6 6h10" />
                        <path d="M6 10h10" />
                        <path d="M6 14h10" />
                      </svg>
                    </div>

                    <h3 style={{ 
                      fontSize: "22px", 
                      fontWeight: "900", 
                      marginBottom: "12px",
                      fontFamily: "'Outfit', sans-serif",
                      letterSpacing: "-0.02em",
                      color: isDarkMode ? "#ffffff" : "#0f172a"
                    }}>
                      {noteStyle === "interactive" ? "Interactive Story Engine" :
                       noteStyle === "smart" ? "AI Study Codex" :
                       noteStyle === "visual" ? "Visual Memory Maps" :
                       "Standard Study Guide"}
                    </h3>
                    <p style={{ 
                      color: isDarkMode ? "#94a3b8" : "#475569", 
                      fontSize: "14.5px", 
                      marginBottom: "32px", 
                      maxWidth: "360px", 
                      lineHeight: "1.6",
                      textAlign: "center"
                    }}>
                      {noteStyle === "interactive" ? (
                        <>Generate step-by-step interactive disclosure, quick quizzes, dynamic pipelines, and code comparisons for <strong style={{ color: "#ff6a00", background: "none", boxShadow: "none", padding: 0 }}>"{topic && topic.length > 40 ? topic.substring(0, 40) + "..." : topic}"</strong>.</>
                      ) : noteStyle === "smart" ? (
                        <>Generate a comprehensive guide for <strong style={{ color: "#ff6a00", background: "none", boxShadow: "none", padding: 0 }}>"{topic && topic.length > 40 ? topic.substring(0, 40) + "..." : topic}"</strong> with syntax comparison matrices, refactoring blueprints, and core interview questions.</>
                      ) : noteStyle === "visual" ? (
                        <>Generate a highly visual guide prioritizing diagrams, Mermaid charts, flowcharts, and visual story layouts for <strong style={{ color: "#ff6a00", background: "none", boxShadow: "none", padding: 0 }}>"{topic && topic.length > 40 ? topic.substring(0, 40) + "..." : topic}"</strong>.</>
                      ) : (
                        <>Generate an exhaustive, traditional study guide layout with definitions and exercises for <strong style={{ color: "#ff6a00", background: "none", boxShadow: "none", padding: 0 }}>"{topic && topic.length > 40 ? topic.substring(0, 40) + "..." : topic}"</strong>.</>
                      )}
                    </p>

                    {/* Note Style Toggle Switch */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      background: isDarkMode ? "rgba(0,0,0,0.2)" : "#f8fafc",
                      padding: "6px",
                      borderRadius: "16px",
                      border: isDarkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e2e8f0",
                      marginBottom: "24px"
                    }}>
                      <button
                        onClick={() => setNoteStyle("basic")}
                        style={{
                          padding: "8px 20px",
                          borderRadius: "12px",
                          border: "none",
                          background: noteStyle === "basic" ? (isDarkMode ? "rgba(255, 106, 0, 0.15)" : "#ffedd5") : "transparent",
                          color: noteStyle === "basic" ? "#ff6a00" : (isDarkMode ? "#94a3b8" : "#64748b"),
                          fontWeight: noteStyle === "basic" ? "800" : "600",
                          fontSize: "13.5px",
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                      >
                        Basic Notes
                      </button>
                      <button
                        onClick={() => setNoteStyle("smart")}
                        style={{
                          padding: "8px 20px",
                          borderRadius: "12px",
                          border: "none",
                          background: noteStyle === "smart" ? (isDarkMode ? "rgba(255, 106, 0, 0.15)" : "#ffedd5") : "transparent",
                          color: noteStyle === "smart" ? "#ff6a00" : (isDarkMode ? "#94a3b8" : "#64748b"),
                          fontWeight: noteStyle === "smart" ? "800" : "600",
                          fontSize: "13.5px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        Smart Notes *
                      </button>
                      <button
                        onClick={() => setNoteStyle("visual")}
                        style={{
                          padding: "8px 20px",
                          borderRadius: "12px",
                          border: "none",
                          background: noteStyle === "visual" ? (isDarkMode ? "rgba(255, 106, 0, 0.15)" : "#ffedd5") : "transparent",
                          color: noteStyle === "visual" ? "#ff6a00" : (isDarkMode ? "#94a3b8" : "#64748b"),
                          fontWeight: noteStyle === "visual" ? "800" : "600",
                          fontSize: "13.5px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        Visual Stories
                      </button>
                      <button
                        onClick={() => setNoteStyle("interactive")}
                        style={{
                          padding: "8px 20px",
                          borderRadius: "12px",
                          border: "none",
                          background: noteStyle === "interactive" ? (isDarkMode ? "rgba(255, 106, 0, 0.15)" : "#ffedd5") : "transparent",
                          color: noteStyle === "interactive" ? "#ff6a00" : (isDarkMode ? "#94a3b8" : "#64748b"),
                          fontWeight: noteStyle === "interactive" ? "800" : "600",
                          fontSize: "13.5px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        Story Mode
                      </button>
                    </div>

                    <button
                      onClick={handleGenerateNotes}
                      style={{
                        padding: "15px 32px",
                        borderRadius: "14px",
                        border: "none",
                        background: "linear-gradient(135deg, #ff5a00, #ff8700)",
                        color: "#ffffff",
                        fontWeight: "900",
                        fontSize: "14.5px",
                        cursor: "pointer",
                        boxShadow: "0 6px 20px rgba(255, 90, 0, 0.35)",
                        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(255, 90, 0, 0.55)";
                        e.currentTarget.style.filter = "brightness(1.05)";
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 90, 0, 0.35)";
                        e.currentTarget.style.filter = "none";
                      }}
                    >
                      Make Notes
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 2. QUIZ TAB */}
            {activeTab === "quiz" && (
              <div style={{ height: "100%" }}>
                
                {/* 2a. Locked State (Progress < 90) */}
                {progress < 90 && (
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    minHeight: "350px",
                    textAlign: "center"
                  }}>
                    <div style={{
                      fontSize: "64px",
                      marginBottom: "20px",
                      color: isDarkMode ? "#475569" : "#94a3b8"
                    }}>
                      <Lock size={56} />
                    </div>
                    <h3 style={{ fontSize: "18px", fontWeight: "900", marginBottom: "8px" }}>
                      Quest Quiz Locked
                    </h3>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px", maxWidth: "300px", lineHeight: "1.5" }}>
                      You must watch at least 90% of the training video to unlock the Level Up Quiz. Watch, study, and return!
                    </p>
                    <div style={{
                      fontSize: "16px",
                      fontWeight: "800",
                      color: "#ff6a00",
                      padding: "8px 20px",
                      borderRadius: "20px",
                      background: "rgba(255, 106, 0, 0.08)",
                      border: "1.5px solid rgba(255, 106, 0, 0.2)"
                    }}>
                      Watch Progress: {Math.round(progress)}% / 90%
                    </div>
                  </div>
                )}

                {/* 2b. Unlocked but Not Started (Progress >= 90) */}
                {progress >= 90 && quizState === "not_started" && (
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    minHeight: "350px",
                    textAlign: "center"
                  }}>
                    <div style={{
                      fontSize: "64px",
                      marginBottom: "20px",
                      color: "#10b981",
                      animation: "pulse 1.5s infinite"
                    }} className="unlocked-pulse">
                      <Unlock size={56} />
                    </div>
                    <h3 style={{ fontSize: "18px", fontWeight: "900", marginBottom: "8px" }}>
                      Quest Quiz Available!
                    </h3>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "28px", maxWidth: "340px", lineHeight: "1.5" }}>
                      You have watched enough content. Enter the quiz arena, test your comprehension, and earn Solo XP to level up your rank!
                    </p>
                    <button
                      onClick={handleStartQuiz}
                      disabled={!isQuizReady}
                      style={{
                        padding: "16px 36px",
                        borderRadius: "14px",
                        border: "none",
                        background: "linear-gradient(135deg, #10b981, #059669)",
                        color: "#ffffff",
                        fontWeight: "900",
                        fontSize: "14.5px",
                        cursor: isQuizReady ? "pointer" : "not-allowed",
                        boxShadow: isQuizReady ? "0 6px 20px rgba(16,185,129,0.35)" : "none",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                        opacity: isQuizReady ? 1 : 0.5
                      }}
                      onMouseOver={e => {
                        if (!isQuizReady) return;
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(16,185,129,0.55)";
                        e.currentTarget.style.filter = "brightness(1.05)";
                      }}
                      onMouseOut={e => {
                        if (!isQuizReady) return;
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(16,185,129,0.35)";
                        e.currentTarget.style.filter = "none";
                      }}
                    >
                      {isQuizReady ? "START PRACTICE PHASE" : "GENERATING QUIZ..."}
                    </button>
                  </div>
                )}

                {/* 2c. Fetching/Loading Quiz */}
                {quizState === "loading" && (
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    minHeight: "350px",
                    textAlign: "center"
                  }}>
                    <div style={{
                      width: "50px", height: "50px",
                      borderRadius: "50%",
                      border: "3px solid #e2e8f0",
                      borderTopColor: "#10b981",
                      animation: "graceRotate 1s linear infinite",
                      marginBottom: "20px"
                    }} />
                    <h3 style={{ fontSize: "16px", fontWeight: "800" }}>
                      Constructing Quiz Arena...
                    </h3>
                    <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "6px" }}>
                      Gemini is generating comprehension questions from the video transcript...
                    </p>
                  </div>
                )}

                {/* 2d. Active Quiz Mode */}
                {quizState === "active" && questions.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    
                    {/* Progress header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexShrink: 0 }}>
                      <span style={{ fontSize: "12px", fontWeight: "900", color: "#10b981", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                        QUESTION {currentQIdx + 1} OF {questions.length}
                      </span>
                      <span style={{ fontSize: "11.5px", color: "#ff6a00", fontWeight: "900", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.5px" }}>
                        {questions[currentQIdx].type === "coding" ? "CODING WORKSTATION" : "CONCEPTUAL CHECK"}
                      </span>
                    </div>

                    {false ? (
                      /* LeetCode splitscreen coding sandbox */
                      <div style={{ display: "flex", flex: 1, overflow: "hidden", gap: "24px", minHeight: "450px" }}>
                        
                        {/* Left Half: Problem details & Test Cases */}
                        <div style={{
                          width: "50%",
                          background: isDarkMode ? "rgba(15, 10, 5, 0.4)" : "#ffffff",
                          borderRight: isDarkMode ? "1px solid rgba(255, 106, 0, 0.15)" : "1px solid #cbd5e1",
                          paddingRight: "20px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "18px",
                          overflowY: "auto"
                        }} className="custom-scrollbar">
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                              <h2 style={{ fontSize: "20px", fontWeight: "900", fontFamily: "'Outfit', sans-serif" }}>
                                {questions[currentQIdx].title}
                              </h2>
                              <span style={{
                                fontSize: "11px",
                                fontWeight: "800",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                textTransform: "uppercase",
                                background: questions[currentQIdx].difficulty === "Easy" ? "rgba(16, 185, 129, 0.15)" : questions[currentQIdx].difficulty === "Hard" ? "rgba(239, 68, 68, 0.15)" : "rgba(245, 158, 11, 0.15)",
                                color: questions[currentQIdx].difficulty === "Easy" ? "#10b981" : questions[currentQIdx].difficulty === "Hard" ? "#ef4444" : "#f59e0b"
                              }}>
                                {questions[currentQIdx].difficulty}
                              </span>
                            </div>
                            
                            <div 
                              style={{ fontSize: "14px", lineHeight: "1.6", textAlign: "left", opacity: 0.9 }}
                              dangerouslySetInnerHTML={{ __html: parseMarkdownToHTML(questions[currentQIdx].question) }}
                            />
                          </div>

                          {/* Test Cases Panel */}
                          <div style={{ marginTop: "12px" }}>
                            <h3 style={{ fontSize: "14px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px", color: isDarkMode ? "#ffb300" : "#ea580c", marginBottom: "10px" }}>
                              Test Cases
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                              {questions[currentQIdx].testCases.map((tc, tcIdx) => {
                                const result = testResults ? testResults[tcIdx] : null;
                                return (
                                  <div key={tcIdx} style={{
                                    padding: "12px",
                                    borderRadius: "8px",
                                    background: isDarkMode ? "rgba(255, 255, 255, 0.02)" : "#f8fafc",
                                    border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid #cbd5e1",
                                    fontSize: "12.5px"
                                  }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                                      <span style={{ fontWeight: "700", color: "var(--text-muted)" }}>Case {tcIdx + 1}</span>
                                      {result && (
                                        <span style={{ fontWeight: "800", color: result.passed ? "#10b981" : "#ef4444" }}>
                                          {result.passed ? "Passed" : "Failed"}
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontFamily: "monospace" }}>
                                      <div><span style={{ color: "#a78bfa" }}>Input:</span> {tc.input}</div>
                                      <div><span style={{ color: "#38bdf8" }}>Expected:</span> {JSON.stringify(result ? result.expected : tc.expected)}</div>
                                      {result && !result.passed && (
                                        <div style={{ color: "#f87171" }}><span style={{ color: "#f87171" }}>Got:</span> {JSON.stringify(result.got)}</div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Right Half: Monospace Code Editor & Controls */}
                        <div style={{
                          width: "50%",
                          display: "flex",
                          flexDirection: "column",
                          gap: "16px"
                        }}>
                          <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "260px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", fontSize: "11px", color: "var(--text-muted)", fontWeight: "700" }}>
                              <span>JAVASCRIPT EDITOR</span>
                              <span>solve(input)</span>
                            </div>
                            
                            <textarea
                              value={currentCode}
                              onChange={(e) => setCurrentCode(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Tab') {
                                  e.preventDefault();
                                  const { selectionStart, selectionEnd, value } = e.target;
                                  const newValue = value.substring(0, selectionStart) + "  " + value.substring(selectionEnd);
                                  setCurrentCode(newValue);
                                  setTimeout(() => {
                                    e.target.selectionStart = e.target.selectionEnd = selectionStart + 2;
                                  }, 0);
                                }
                              }}
                              placeholder="Write your code here..."
                              style={{
                                width: "100%",
                                flex: 1,
                                backgroundColor: "#090d16",
                                color: "#38bdf8",
                                fontFamily: "'Fira Code', 'Courier New', monospace",
                                fontSize: "13.5px",
                                lineHeight: "1.6",
                                padding: "16px",
                                border: "1px solid rgba(255, 106, 0, 0.3)",
                                borderRadius: "12px",
                                outline: "none",
                                resize: "none"
                              }}
                            />
                          </div>

                          {/* Control Buttons */}
                          <div style={{ display: "flex", gap: "12px" }}>
                            <button
                              onClick={handleRunCode}
                              style={{
                                flex: 1,
                                padding: "12px",
                                borderRadius: "10px",
                                border: "1.5px solid #ff6a00",
                                background: "transparent",
                                color: "#ff6a00",
                                fontWeight: "800",
                                cursor: "pointer",
                                transition: "all 0.2s",
                                clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)"
                              }}
                              onMouseOver={e => e.currentTarget.style.background = "rgba(255, 106, 0, 0.08)"}
                              onMouseOut={e => e.currentTarget.style.background = "transparent"}
                            >
                              ▶ Run Code
                            </button>
                            <button
                              onClick={handleSubmitCode}
                              style={{
                                flex: 1,
                                padding: "12px",
                                borderRadius: "10px",
                                border: "none",
                                background: "linear-gradient(135deg, #10b981, #059669)",
                                color: "#ffffff",
                                fontWeight: "900",
                                cursor: "pointer",
                                transition: "all 0.2s",
                                clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)"
                              }}
                              onMouseOver={e => e.currentTarget.style.filter = "brightness(1.1)"}
                              onMouseOut={e => e.currentTarget.style.filter = "none"}
                            >
                              Submit Solution
                            </button>
                          </div>

                          {/* Console / Feedback Box */}
                          <div style={{
                            height: "100px",
                            backgroundColor: isDarkMode ? "#1e293b" : "#f1f5f9",
                            border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid #cbd5e1",
                            borderRadius: "10px",
                            padding: "12px",
                            fontSize: "12.5px",
                            fontFamily: "monospace",
                            overflowY: "auto",
                            textAlign: "left"
                          }} className="custom-scrollbar">
                            <div style={{ color: "var(--text-muted)", fontWeight: "700", marginBottom: "4px" }}>Console Output:</div>
                            {consoleError ? (
                              <div style={{ color: "#f87171" }}>{consoleError}</div>
                            ) : testResults && testResults.every(r => r.passed) ? (
                              <div style={{ color: "#34d399" }}>All test cases passed! Submit your solution to proceed.</div>
                            ) : testResults ? (
                              <div style={{ color: "#fb7185" }}>Output mismatch. Some test cases failed.</div>
                            ) : (
                              <div style={{ color: "var(--text-muted)" }}>Write code and click 'Run Code' or 'Submit Solution' to test.</div>
                            )}
                          </div>

                          {/* Next Question Navigation */}
                          {gradedAnswers[currentQIdx] === "correct" && (
                            <button
                              onClick={handleNextQ}
                              style={{
                                padding: "14px",
                                borderRadius: "12px",
                                border: "none",
                                background: "linear-gradient(135deg, #ffd700, #ff8c00)",
                                color: "#0f172a",
                                fontWeight: "900",
                                cursor: "pointer",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px"
                              }}
                            >
                              {currentQIdx < questions.length - 1 ? "Next Challenge →" : "Claim Victory & Complete Quiz"}
                            </button>
                          )}
                        </div>

                      </div>
                    ) : (
                      /* Standard MCQ Layout */
                      <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
                        
                        <div>
                          {/* Question card */}
                          <div style={{
                            background: isDarkMode ? "#1e293b" : "#f8fafc",
                            border: isDarkMode ? "1px solid rgba(255,255,255,0.06)" : "1px solid #e2e8f0",
                            borderRadius: "16px",
                            padding: "24px",
                            marginBottom: "24px",
                            lineHeight: "1.5",
                            fontSize: "15.5px",
                            fontWeight: "750"
                          }}>
                            {questions[currentQIdx].question}
                          </div>

                          {/* Options Grid */}
                          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {questions[currentQIdx].options.map((opt, optIdx) => {
                              const isSelected = selectedAnswers[currentQIdx] === optIdx;
                              const correctIdx = questions[currentQIdx].answerIndex;
                              const wasGraded = gradedAnswers[currentQIdx] !== null;

                              let btnBg = isDarkMode ? "rgba(255,255,255,0.03)" : "#ffffff";
                              let btnBorder = isDarkMode ? "1.5px solid rgba(255,255,255,0.08)" : "1.5px solid #cbd5e1";
                              let btnColor = "var(--text-light)";

                              if (wasGraded) {
                                if (optIdx === correctIdx) {
                                  // Correct answer glow
                                  btnBg = "rgba(16,185,129,0.12)";
                                  btnBorder = "1.5px solid #10b981";
                                  btnColor = "#10b981";
                                } else if (isSelected) {
                                  // Incorrect selected answer red glow
                                  btnBg = "rgba(239, 68, 68, 0.12)";
                                  btnBorder = "1.5px solid #ef4444";
                                  btnColor = "#ef4444";
                                } else {
                                  btnBg = isDarkMode ? "rgba(255,255,255,0.01)" : "#f8fafc";
                                  btnBorder = isDarkMode ? "1.5px solid rgba(255,255,255,0.03)" : "1.5px solid #e2e8f0";
                                  btnColor = "var(--text-muted)";
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  disabled={wasGraded}
                                  onClick={() => handleSelectOption(optIdx)}
                                  style={{
                                    width: "100%",
                                    padding: "16px 20px",
                                    borderRadius: "12px",
                                    background: btnBg,
                                    border: btnBorder,
                                    color: btnColor,
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    textAlign: "left",
                                    cursor: wasGraded ? "default" : "pointer",
                                    transition: "all 0.15s",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px"
                                  }}
                                  onMouseOver={e => {
                                    if (!wasGraded) {
                                      e.currentTarget.style.borderColor = "#10b981";
                                      e.currentTarget.style.background = isDarkMode ? "rgba(16,185,129,0.06)" : "#f0fdf4";
                                    }
                                  }}
                                  onMouseOut={e => {
                                    if (!wasGraded) {
                                      e.currentTarget.style.borderColor = isDarkMode ? "rgba(255,255,255,0.08)" : "#cbd5e1";
                                      e.currentTarget.style.background = btnBg;
                                    }
                                  }}
                                >
                                  <span style={{
                                    width: "24px", height: "24px",
                                    borderRadius: "50%",
                                    background: isSelected ? "#10b981" : (isDarkMode ? "rgba(255,255,255,0.06)" : "#f1f5f9"),
                                    border: "1px solid #cbd5e1",
                                    color: isSelected ? "#fff" : "var(--text-muted)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "11px", fontWeight: "900", flexShrink: 0
                                  }}>
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span>{opt}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Bottom Action (Next Q / Submit) */}
                        {gradedAnswers[currentQIdx] !== null && (
                          <div style={{ marginTop: "24px" }}>
                            <button
                              onClick={handleNextQ}
                              style={{
                                width: "100%",
                                padding: "16px",
                                borderRadius: "12px",
                                border: "none",
                                background: "linear-gradient(135deg, #10b981, #059669)",
                                color: "#ffffff",
                                fontWeight: "800",
                                fontSize: "14.5px",
                                cursor: "pointer",
                                boxShadow: "0 6px 18px rgba(16,185,129,0.25)",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px"
                              }}
                            >
                              {currentQIdx < questions.length - 1 ? "Next Question →" : "Submit Quiz & Score"}
                            </button>
                          </div>
                        )}

                      </div>
                    )}

                  </div>
                )}

                {/* 2e. Completed State (Victory) */}
                {quizState === "completed" && (
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    minHeight: "350px",
                    textAlign: "center"
                  }}>
                    <div style={{
                      fontSize: "72px",
                      marginBottom: "16px",
                      animation: "emblemPulse 2.5s infinite"
                    }}>
                      <Trophy size={64} color="#ffd700" />
                    </div>
                    <h2 style={{ fontSize: "24px", fontWeight: "950", color: "#10b981", margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "1px" }}>
                      Quiz Completed!
                    </h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "32px" }}>
                      Your performance has been evaluated by the master registry.
                    </p>

                    {/* Stats Score Box */}
                    <div style={{
                      background: isDarkMode ? "#1e293b" : "#f8fafc",
                      border: isDarkMode ? "1px solid rgba(255,255,255,0.06)" : "1px solid #e2e8f0",
                      borderRadius: "16px",
                      padding: "24px 32px",
                      display: "flex",
                      gap: "36px",
                      marginBottom: "36px"
                    }}>
                      <div>
                        <div style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px" }}>COMPREHENSION</div>
                        <div style={{ fontSize: "28px", fontWeight: "950", color: "#10b981", marginTop: "4px" }}>
                          {quizScore} / {questions.length}
                        </div>
                      </div>
                      <div style={{ borderLeft: "1px solid #cbd5e1" }} />
                      <div>
                        <div style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px" }}>XP REWARDED</div>
                        <div style={{ fontSize: "28px", fontWeight: "950", color: "#ffb300", marginTop: "4px" }}>
                          +{earnedXp} XP
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleClaimXpAndExit}
                      style={{
                        padding: "16px 48px",
                        borderRadius: "12px",
                        border: "none",
                        background: "linear-gradient(135deg, #ffd700, #ff8c00)",
                        color: "#0f172a",
                        fontWeight: "900",
                        fontSize: "15px",
                        cursor: "pointer",
                        boxShadow: "0 8px 24px rgba(255,179,0,0.35)",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={e => e.currentTarget.style.transform = "scale(1.02)"}
                      onMouseOut={e => e.currentTarget.style.transform = "none"}
                    >
                      Claim XP & Exit Arena
                    </button>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </div>

      {/* ═══ REGENERATE NOTE STYLE MODAL ═══ */}
      {isRegenModalOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px"
        }}>
          <div style={{
            background: isDarkMode ? "#1e1e24" : "#ffffff",
            border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid #e2e8f0",
            borderRadius: "20px",
            width: "100%",
            maxWidth: "480px",
            padding: "32px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.35)",
            boxSizing: "border-box",
            position: "relative"
          }}>
            <h3 style={{
              margin: "0 0 12px 0",
              fontSize: "20px",
              fontWeight: "900",
              color: isDarkMode ? "#ffb300" : "#ea580c",
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: "0.5px"
            }}>
              REGENERATE STUDY NOTES
            </h3>
            
            <p style={{
              margin: "0 0 24px 0",
              fontSize: "14px",
              lineHeight: "1.6",
              color: isDarkMode ? "#94a3b8" : "#475569"
            }}>
              Choose the study guide format you want to generate. This will completely overwrite your current notes and quiz for this milestone.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
              {/* Basic Option */}
              <div 
                onClick={() => setTempRegenStyle("basic")}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border: tempRegenStyle === "basic" 
                    ? "2px solid #ff6a00" 
                    : (isDarkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0"),
                  background: tempRegenStyle === "basic"
                    ? (isDarkMode ? "rgba(255,106,0,0.1)" : "#fff7ed")
                    : (isDarkMode ? "rgba(255,255,255,0.02)" : "#f8fafc"),
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <div style={{ fontWeight: "700", fontSize: "14.5px", color: isDarkMode ? "#f8fafc" : "#0f172a", marginBottom: "4px" }}>
                  Standard Notes
                </div>
                <div style={{ fontSize: "12px", color: isDarkMode ? "#94a3b8" : "#64748b" }}>
                  Exhaustive, traditional study guide layout with definitions and exercises.
                </div>
              </div>

              {/* Smart Option */}
              <div 
                onClick={() => setTempRegenStyle("smart")}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border: tempRegenStyle === "smart" 
                    ? "2px solid #ff6a00" 
                    : (isDarkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0"),
                  background: tempRegenStyle === "smart"
                    ? (isDarkMode ? "rgba(255,106,0,0.1)" : "#fff7ed")
                    : (isDarkMode ? "rgba(255,255,255,0.02)" : "#f8fafc"),
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <div style={{ fontWeight: "700", fontSize: "14.5px", color: isDarkMode ? "#f8fafc" : "#0f172a", marginBottom: "4px" }}>
                  Smart Notes *
                </div>
                <div style={{ fontSize: "12px", color: isDarkMode ? "#94a3b8" : "#64748b" }}>
                  AI-driven study layout with conceptual, practical, and interview-relevant parts.
                </div>
              </div>

              {/* Visual Option */}
              <div 
                onClick={() => setTempRegenStyle("visual")}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border: tempRegenStyle === "visual" 
                    ? "2px solid #ff6a00" 
                    : (isDarkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0"),
                  background: tempRegenStyle === "visual"
                    ? (isDarkMode ? "rgba(255,106,0,0.1)" : "#fff7ed")
                    : (isDarkMode ? "rgba(255,255,255,0.02)" : "#f8fafc"),
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <div style={{ fontWeight: "700", fontSize: "14.5px", color: isDarkMode ? "#f8fafc" : "#0f172a", marginBottom: "4px" }}>
                  Visual Stories
                </div>
                <div style={{ fontSize: "12px", color: isDarkMode ? "#94a3b8" : "#64748b" }}>
                  Prioritizes diagrams, Mermaid charts, flowcharts, comparisons, and visual story layouts.
                </div>
              </div>

              {/* Story Mode Option */}
              <div 
                onClick={() => setTempRegenStyle("interactive")}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border: tempRegenStyle === "interactive" 
                    ? "2px solid #ff6a00" 
                    : (isDarkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0"),
                  background: tempRegenStyle === "interactive"
                    ? (isDarkMode ? "rgba(255,106,0,0.1)" : "#fff7ed")
                    : (isDarkMode ? "rgba(255,255,255,0.02)" : "#f8fafc"),
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <div style={{ fontWeight: "700", fontSize: "14.5px", color: isDarkMode ? "#f8fafc" : "#0f172a", marginBottom: "4px" }}>
                  Story Mode
                </div>
                <div style={{ fontSize: "12px", color: isDarkMode ? "#94a3b8" : "#64748b" }}>
                  Step-by-step interactive disclosure, quick quizzes, dynamic pipelines, and code comparisons.
                </div>
              </div>
            </div>

            {/* Warning Alert */}
            <div style={{
              background: isDarkMode ? "rgba(239, 68, 68, 0.15)" : "#fef2f2",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              borderRadius: "10px",
              padding: "12px",
              color: isDarkMode ? "#f87171" : "#dc2626",
              fontSize: "12.5px",
              lineHeight: "1.5",
              marginBottom: "24px",
              fontWeight: "600"
            }}>
              [!]️ Warning: Your existing notes and multiple-choice questions for this video will be permanently replaced.
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setIsRegenModalOpen(false)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: isDarkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e2e8f0",
                  background: "transparent",
                  color: isDarkMode ? "#cbd5e1" : "#475569",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  sound.playClockTick();
                  trackTelemetry({
                    eventType: "PATHFINDER_REGENERATED",
                    roadmapId: savedRoadmap?._id || savedRoadmap?.id,
                    topic: savedRoadmap?.topic || topic,
                    videoId: video.id,
                    metadata: { fromStyle: noteStyle, toStyle: tempRegenStyle }
                  });
                  setNoteStyle(tempRegenStyle);
                  setIsRegenModalOpen(false);
                  setTimeout(() => {
                    handleGenerateNotes(false);
                  }, 100);
                }}
                style={{
                  padding: "10px 24px",
                  borderRadius: "8px",
                  border: "none",
                  background: "linear-gradient(135deg, #ff6a00, #ee5d00)",
                  color: "#ffffff",
                  fontWeight: "900",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(255,106,0,0.25)",
                  transition: "all 0.2s"
                }}
              >
                Regenerate Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ RECHARGE OVERLAY ═══ */}
      {isRecharging && (
        <RechargeOverlay
          onComplete={handleRechargeComplete}
          isDarkMode={isDarkMode}
        />
      )}

    </div>
  );
}

const StudyNotesContent = memo(({ notes, isDarkMode, isFocusMode = false }) => {
  const sanitizeCode = (rawCode) => {
    let code = rawCode.trim();

    // 1. Convert space-separated single dashes connecting nodes (e.g. "B - E" or "B - F") to standard flowchart links "-->"
    code = code.replace(/\b([a-zA-Z0-9_-]+)\s+-\s+([a-zA-Z0-9_-]+)\b/g, "$1 --> $2");

    // 2. Safely normalize long multi-dash arrows (e.g. --->, ---->, ----->) to standard arrows
    code = code.replace(/-{3,}>/g, "-->");
    code = code.replace(/-{2,}>/g, "-->");
    code = code.replace(/={3,}>/g, "==>");
    code = code.replace(/={2,}>/g, "==>");
    code = code.replace(/->/g, "-->");
    code = code.replace(/=>/g, "==>");
    code = code.replace(/[\u2192\u2794\u279c\u27a1]/g, "-->");

    // Convert invalid link text patterns: "A -- "text" B" or "A -- text B" (without arrows) to valid Mermaid "A -->|text| B"
    code = code.replace(/\b([a-zA-Z0-9_-]+)\s+--\s+"([^"]+)"\s+([a-zA-Z0-9_-]+)\b/g, "$1 -->|$2| $3");
    code = code.replace(/\b([a-zA-Z0-9_-]+)\s+--\s+([^"\->\n]+?)\s+([a-zA-Z0-9_-]+)\b/g, (match, n1, text, n2) => {
      const cleanText = text.trim().replace(/\s+/g, " ");
      return `${n1} -->|${cleanText}| ${n2}`;
    });

    // Merge dangling link text/comments into the node label itself
    code = code.replace(/\b([a-zA-Z0-9_-]+)([\(\[\{])\s*"([\s\S]*?)"\s*([\)\}\]])\s+--\s+"([^"\n]+)"/g, (match, nodeName, openBrack, label, closeBrack, desc) => {
      const cleanLabel = label.trim();
      const cleanDesc = desc.trim();
      return `${nodeName}${openBrack}"${cleanLabel}<br/><b>(${cleanDesc})</b>"${closeBrack}`;
    });
    code = code.replace(/\b([a-zA-Z0-9_-]+)([\(\[\{])\s*"([\s\S]*?)"\s*([\)\}\]])\s+--\s+([^"\-\n]+)/g, (match, nodeName, openBrack, label, closeBrack, desc) => {
      const cleanLabel = label.trim();
      const cleanDesc = desc.trim();
      if (cleanDesc === "" || cleanDesc.includes("subgraph") || cleanDesc.includes("end") || cleanDesc.includes("style")) return match;
      return `${nodeName}${openBrack}"${cleanLabel}<br/><b>(${cleanDesc})</b>"${closeBrack}`;
    });

    // 3. Sanitize double quotes, spaces inside brackets, and HTML tags nested inside node brackets (handles multi-line declarations)
    code = code.replace(/([a-zA-Z0-9_-]+)([\(\[\{])\s*"([\s\S]*?)"\s*([\)\}\]])/g, (match, nodeName, openBrack, content, closeBrack) => {
      const sanitizedContent = content
        .replace(/"/g, "'")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return `${nodeName}${openBrack}"${sanitizedContent}"${closeBrack}`;
    });

    // Process line-by-line for line-level fixes (splitting side-by-side nodes, extra graphs)
    const lines = code.split("\n");
    let hasFirstGraph = false;
    const processedLines = lines.map(line => {
      let cleanedLine = line;

      // 4. Split side-by-side node definitions on the same line
      cleanedLine = cleanedLine.replace(/(\"[^\"]*\")\s+([a-zA-Z0-9_-]+)([\(\[\{]\")/g, '$1;\n$2$3');
      cleanedLine = cleanedLine.replace(/([\)\}\]])\s+([a-zA-Z0-9_-]+)([\(\[\{])/g, '$1;\n$2$3');

      // 5. Clean up redundant graph declarations (e.g. "style M2 fill:...;graph TD")
      const graphRegex = /\b(graph|flowchart)\s+(TD|LR|TB|BT|RL)\b/gi;
      if (graphRegex.test(cleanedLine)) {
        if (!hasFirstGraph) {
          hasFirstGraph = true;
        } else {
          cleanedLine = cleanedLine.replace(graphRegex, "");
        }
      }

      return cleanedLine;
    });

    return processedLines.join("\n");
  };

  useEffect(() => {
    if (typeof window !== "undefined" && notes && notes.includes("```mermaid")) {
      const renderMermaid = async () => {
        if (!window.mermaid) return;
        try {
          window.mermaid.initialize({
            startOnLoad: false,
            theme: isDarkMode ? "dark" : "default",
            securityLevel: "loose",
            fontFamily: "var(--font-sans)",
            useMaxWidth: false,
            flowchart: { useMaxWidth: false, htmlLabels: true },
            sequence: { useMaxWidth: false },
            gantt: { useMaxWidth: false }
          });

          let retries = 0;
          const attemptRender = async () => {
            const elements = document.querySelectorAll(".mermaid");
            const uncompiled = Array.from(elements).filter(el => !el.querySelector("svg") && !el.querySelector(".mermaid-error-box"));
            
            if (uncompiled.length === 0) {
              if (retries < 6) {
                retries++;
                setTimeout(attemptRender, 100);
              }
              return;
            }

            for (let i = 0; i < uncompiled.length; i++) {
              const el = uncompiled[i];
              const code = sanitizeCode(el.textContent);
              const id = `mermaid-svg-${Date.now()}-${i}`;
              try {
                const { svg } = await window.mermaid.render(id, code);
                el.innerHTML = svg;
              } catch (err) {
                console.error("Failed to render mermaid diagram:", err);
                const errEl = document.getElementById(id);
                if (errEl) errEl.remove();
                const bindEl = document.getElementById(`d${id}`);
                if (bindEl) bindEl.remove();
                
                el.innerHTML = `
                  <div class="mermaid-error-box" style="
                    background: ${isDarkMode ? 'rgba(239, 68, 68, 0.05)' : '#fef2f2'};
                    border: 1px solid ${isDarkMode ? 'rgba(239, 68, 68, 0.2)' : '#fec2c2'};
                    border-radius: 12px;
                    padding: 20px;
                    text-align: left;
                    font-family: var(--font-sans);
                    max-width: 600px;
                    margin: 0 auto;
                  ">
                    <div style="display: flex; align-items: center; gap: 8px; color: ${isDarkMode ? '#f87171' : '#dc2626'}; font-weight: 800; font-size: 14.5px; margin-bottom: 8px;">
                      Unable to Parse Diagram Syntax
                    </div>
                    <div style="font-size: 12.5px; color: ${isDarkMode ? '#94a3b8' : '#475569'}; line-height: 1.5; margin-bottom: 12px;">
                      The AI generated diagram contains a syntax mix-up (e.g. sequence format inside a flowchart). Click the <strong>Regenerate</strong> button at the top right to try generating again.
                    </div>
                    <details style="cursor: pointer;">
                      <summary style="font-size: 12px; font-weight: 700; color: ${isDarkMode ? '#64748b' : '#94a3b8'}; outline: none;">
                        View Raw Source Code
                      </summary>
                      <pre style="
                        margin-top: 8px;
                        padding: 12px;
                        border-radius: 8px;
                        background: ${isDarkMode ? '#0d1321' : '#f8fafc'};
                        color: ${isDarkMode ? '#e2e8f0' : '#0f172a'};
                        font-size: 12px;
                        font-family: monospace;
                        overflow-x: auto;
                        white-space: pre-wrap;
                        text-align: left;
                      ">${code}</pre>
                    </details>
                  </div>
                `;
              }
            }
          };

          await attemptRender();
        } catch (err) {
          console.error("Mermaid execution failed:", err);
        }
      };

      if (window.mermaid) {
        renderMermaid();
      } else {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
        script.async = true;
        script.onload = async () => {
          try {
            renderMermaid();
          } catch (err) {
            console.error("Mermaid script onload run failed:", err);
          }
        };
        document.body.appendChild(script);
      }
    }
  }, [notes, isDarkMode, isFocusMode]);

  return (
    <div 
      className={`study-notes-document ${isDarkMode ? "notes-dark" : "notes-light"} ${isFocusMode ? "focus-mode" : ""}`}
      style={{ lineHeight: "1.8", fontSize: "15px", textAlign: "left" }} 
      dangerouslySetInnerHTML={{ __html: parseMarkdownToHTML(notes) }} 
    />
  );
});
