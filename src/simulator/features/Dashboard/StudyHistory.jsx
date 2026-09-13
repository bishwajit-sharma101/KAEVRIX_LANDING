import { useState, useEffect, useMemo, memo } from "react";
import * as sound from "../../utils/audio";
import { parseMarkdownToHTML } from "../../utils/markdown";
import { HIGH_QUALITY_NOTE_1, HIGH_QUALITY_NOTE_2 } from "../../utils/studyNotesData";
import { RotateCcw, Download, BookOpen, Bookmark, Video } from "lucide-react";

const getInitialHistory = () => {
  const d1Time = new Date(); d1Time.setDate(d1Time.getDate() - 2); d1Time.setHours(14, 30, 0, 0);
  const d2Time = new Date(); d2Time.setDate(d2Time.getDate() - 1); d2Time.setHours(11, 15, 0, 0);

  return [
    {
      id: "sh-1",
      topic: "Execution Context & Call Stack",
      subtopicsCovered: 3,
      timestamp: d1Time.toISOString(),
      video: {
        id: "sh-1",
        videoId: "sh-1",
        title: "JavaScript Execution Context Call Stack In-Depth",
        duration: "32:15",
        channel: "Web Architecture Mastery"
      },
      notes: HIGH_QUALITY_NOTE_1,
      questions: [
        {
          question: "What data structure models synchronous JavaScript function calls in the V8 engine?",
          options: ["Call Stack (LIFO)", "Message Queue (FIFO)", "Binary Search Tree", "Hash Map"],
          answerIndex: 0,
          explanation: "The V8 engine manages execution contexts using a single-threaded Call Stack following Last-In, First-Out (LIFO) order."
        },
        {
          question: "During which phase of the Execution Context is memory allocated for variables and functions?",
          options: ["Execution Phase", "Creation Phase (Memory Allocation)", "Garbage Collection Phase", "Event Loop Phase"],
          answerIndex: 1,
          explanation: "In the Creation Phase, the engine allocates memory for variables and functions before evaluating code."
        },
        {
          question: "What value is assigned to 'var' declarations during the Creation Phase before runtime execution?",
          options: ["null", "0", "undefined", "ReferenceError"],
          answerIndex: 2,
          explanation: "var declarations are hoisted and initialized to undefined in the Creation Phase."
        }
      ]
    },
    {
      id: "sh-2",
      topic: "Closures & Memory Encapsulation",
      subtopicsCovered: 3,
      timestamp: d2Time.toISOString(),
      video: {
        id: "sh-2",
        videoId: "sh-2",
        title: "Deep Dive into JS Closures & Memory Management",
        duration: "41:02",
        channel: "Engine Internals"
      },
      notes: HIGH_QUALITY_NOTE_2,
      questions: [
        {
          question: "Where does the V8 engine preserve closed-over lexical variables so they survive stack pops?",
          options: ["On the V8 Heap", "In the CPU L1 Cache", "In the Call Stack frame", "In LocalStorage"],
          answerIndex: 0,
          explanation: "Variables captured by closures are allocated on the V8 Heap so they outlive the execution context."
        },
        {
          question: "What architectural pattern leverages closures to cache expensive function computation results?",
          options: ["Memoization", "Prototypal Inheritance", "Event Bubbling", "Currying without memory"],
          answerIndex: 0,
          explanation: "Memoization stores computed results in a private cache object retained via closures."
        }
      ]
    }
  ];
};

export default function StudyHistory({ username, isDarkMode, onStartSoloStudy }) {
  const [historyList, setHistoryList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // Load history from localStorage on mount (ensures 2 curated items with high-quality note)
  useEffect(() => {
    try {
      const historyKey = `kaevrix_study_history_${username}`;
      const savedHistory = localStorage.getItem(historyKey);
      let itemsToUse = getInitialHistory();

      if (savedHistory) {
        let parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If legacy data has != 2 items, outdated short notes, or missing video id, migrate to the 2 high quality items
          const isLegacy = parsed.length !== 2 || 
            !parsed[0]?.video?.id || 
            !parsed[1]?.video?.id || 
            !parsed[0]?.notes || parsed[0].notes.length < 800 ||
            !parsed[1]?.notes || parsed[1].notes.length < 800;
          if (isLegacy) {
            itemsToUse = getInitialHistory();
            localStorage.setItem(historyKey, JSON.stringify(itemsToUse));
          } else {
            itemsToUse = parsed;
          }
        } else {
          localStorage.setItem(historyKey, JSON.stringify(itemsToUse));
        }
      } else {
        localStorage.setItem(historyKey, JSON.stringify(itemsToUse));
      }

      setHistoryList(itemsToUse);
      if (itemsToUse.length > 0) {
        setSelectedItem(itemsToUse[0]);
      }
    } catch (e) {
      console.error("Failed to load study history:", e);
      const fallback = getInitialHistory();
      setHistoryList(fallback);
      setSelectedItem(fallback[0]);
    }
  }, [username]);

  // Telemetry Readouts
  const stats = useMemo(() => {
    if (historyList.length === 0) return { totalTopics: 0, totalVideos: 0, lastStudyDate: "N/A" };
    const topicsSet = new Set(historyList.map(h => h.topic));
    const dates = historyList.map(h => new Date(h.timestamp));
    const latestDate = new Date(Math.max(...dates));

    return {
      totalTopics: topicsSet.size,
      totalVideos: historyList.length,
      lastStudyDate: latestDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "2-digit" })
    };
  }, [historyList]);

  // Handle PDF Print/Download for saved notes
  const handleDownloadNotes = (item) => {
    if (!item) return;
    sound.playClockTick();

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.zIndex = "-9999";
    document.body.appendChild(iframe);

    const htmlContent = parseMarkdownToHTML(item.notes);
    const doc = iframe.contentWindow.document;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${(item.video?.title || "Kaevrix_Study_Notes").replace(/[^a-z0-9]/gi, "_")} - Study Guide</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;700;900&family=Fira+Code:wght@400;500;600&display=swap');

            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
              box-sizing: border-box;
            }

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
              <div class="meta-topic">${item.topic || "JavaScript Architecture"}</div>
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
        setTimeout(doPrint, 700); // Safety fallback
      }
    } else {
      setTimeout(doPrint, 400);
    }

    iframe.contentWindow.addEventListener("afterprint", () => {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
    });
  };

  const handleItemSelect = (item) => {
    sound.playClockTick();
    setSelectedItem(item);
  };

  const handleRevisitClick = (item) => {
    if (onStartSoloStudy && item) {
      sound.playMatchFound();
      // Pass the video details structure matching standard video object, including notes & metadata
      onStartSoloStudy({
        id: item.video?.id || item.video?.videoId || item.id,
        videoId: item.video?.videoId || item.video?.id || item.id,
        title: item.video?.title || item.topic,
        channel: item.video?.channel || "Web Architecture Mastery",
        duration: item.video?.duration || "32:15",
        url: item.video?.url,
        notes: item.notes,
        topic: item.topic,
        questions: item.questions
      });
    }
  };

  return (
    <div style={{
      fontFamily: "var(--font-gamer)",
      color: "var(--text-light)",
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      width: "100%"
    }}>
      <style>{`
        @keyframes sweepLine {
          0% { left: -100%; }
          100% { left: 150%; }
        }
        .chrono-card {
          border: 1px solid ${isDarkMode ? "rgba(255,255,255,0.06)" : "#e2e8f0"};
          background: ${isDarkMode ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.005)"};
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .chrono-card:hover {
          background: ${isDarkMode ? "rgba(255, 106, 0, 0.04)" : "#fff7ed"};
          border-color: #ff6a00;
          transform: translateX(4px);
        }
        .chrono-card-active {
          border-color: #ff6a00 !important;
          background: ${isDarkMode ? "rgba(255, 106, 0, 0.08)" : "#ffedd5"} !important;
          box-shadow: 0 4px 20px rgba(255,106,0,0.08);
        }
        .chrono-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 106, 0, 0.1), transparent);
          transform: skewX(-25deg);
          transition: 0.75s;
        }
        .chrono-card:hover::after {
          animation: sweepLine 1.2s ease-in-out forwards;
        }
        .history-hud-panel {
          position: relative;
          padding: 24px;
          background: ${isDarkMode ? "rgba(255, 255, 255, 0.005)" : "rgba(0, 0, 0, 0.002)"};
          border: 1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)"};
          border-radius: 16px;
        }
        .history-corner-bracket {
          position: absolute;
          width: 10px;
          height: 10px;
          border-color: #ff6a00;
          border-style: solid;
          opacity: 0.35;
          pointer-events: none;
          transition: all 0.3s ease;
        }
        .history-hud-panel:hover .history-corner-bracket {
          opacity: 0.85;
          filter: drop-shadow(0 0 4px #ff6a00);
        }
        .hist-bracket-tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
        .hist-bracket-tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; }
        .hist-bracket-bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; }
        .hist-bracket-br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

        /* Typography for rendered markdown */
        .history-notes-document {
          font-family: 'Inter', sans-serif;
        }
        .history-notes-document h1, .history-notes-document h2, .history-notes-document h3 {
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          letter-spacing: -0.02em;
          line-height: 1.2;
          color: #ff6a00;
        }
        .history-notes-document h1 { font-size: 26px; margin: 30px 0 16px 0; border-bottom: 2px solid #ffedd5; padding-bottom: 8px; }
        .history-notes-document h2 { font-size: 20px; margin: 24px 0 12px 0; border-bottom: 1px solid rgba(255, 106, 0, 0.15); padding-bottom: 6px; }
        .history-notes-document h3 { font-size: 16px; margin: 20px 0 10px 0; }
        .history-notes-document p { font-size: 14.5px; line-height: 1.75; margin-bottom: 16px; color: ${isDarkMode ? "rgba(255,255,255,0.85)" : "#334155"}; }
        .history-notes-document code {
          font-family: 'Fira Code', 'Courier New', monospace;
          background: ${isDarkMode ? "rgba(255, 106, 0, 0.1)" : "#fff7ed"};
          color: #ff6a00;
          padding: 3px 6px;
          border-radius: 4px;
          font-size: 13.5px;
        }
        .history-notes-document pre {
          background: #0f172a;
          color: #e2e8f0;
          padding: 16px;
          border-radius: 10px;
          overflow-x: auto;
          margin: 16px 0;
          border: 1px solid #1e293b;
        }
        .history-notes-document pre code {
          background: transparent !important;
          color: inherit !important;
          padding: 0 !important;
        }
        .history-notes-document blockquote {
          border-left: 4px solid #ff6a00;
          background: ${isDarkMode ? "rgba(255,106,0,0.05)" : "#fff7ed"};
          margin: 1.5em 0;
          padding: 12px 20px;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          color: ${isDarkMode ? "#fb923c" : "#c2410c"};
        }
        .history-notes-document ul, .history-notes-document ol { padding-left: 20px; margin-bottom: 16px; }
        .history-notes-document li { margin-bottom: 6px; line-height: 1.6; color: ${isDarkMode ? "rgba(255,255,255,0.8)" : "#475569"}; }
        .tok-keyword { color: #ff7b72 !important; font-weight: 700; }
        .tok-string { color: #7ee787 !important; }
        .tok-func { color: #d2a8ff !important; font-weight: 600; }
        .tok-builtin { color: #79c0ff !important; font-weight: 600; }
        .tok-num { color: #ffa657 !important; font-weight: 600; }
        .tok-comment { color: #8b949e !important; font-style: italic; }
      `}</style>

      {/* 1. High-Tech Header Section */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        borderBottom: isDarkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
        paddingBottom: "16px",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div>
          <span style={{ 
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "11px",
            fontWeight: "900",
            color: "#ff6a00",
            letterSpacing: "2px",
            textTransform: "uppercase"
          }}>
            <BookOpen size={13} color="#ff6a00" /> QUEST ARCHIVES & STUDY CODEX
          </span>
          <h2 style={{
            fontSize: "36px",
            fontWeight: "900",
            margin: "6px 0 0 0",
            fontFamily: "var(--font-outfit)",
            letterSpacing: "-1.5px",
            background: "linear-gradient(135deg, #ff6a00, #ffb300)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: isDarkMode ? "transparent" : "#ea580c"
          }}>
            Study History
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "4px 0 0 0", fontFamily: "sans-serif" }}>
            Revisit your study decks, watch lessons, and access saved notes instantly.
          </p>
        </div>

        {/* Telemetry Stats widgets */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <div className="history-hud-panel" style={{ position: "relative", padding: "8px 16px", minWidth: "100px", borderRadius: "10px", borderStyle: "dashed" }}>
            <div className="history-corner-bracket hist-bracket-tl" />
            <div className="history-corner-bracket hist-bracket-tr" />
            <div style={{ fontSize: "9px", color: "var(--text-muted)" }}>TOPICS</div>
            <div style={{ fontSize: "18px", fontWeight: "900", color: "#ff6a00", marginTop: "2px" }}>{stats.totalTopics}</div>
          </div>
          <div className="history-hud-panel" style={{ position: "relative", padding: "8px 16px", minWidth: "100px", borderRadius: "10px", borderStyle: "dashed" }}>
            <div className="history-corner-bracket hist-bracket-tl" />
            <div className="history-corner-bracket hist-bracket-tr" />
            <div style={{ fontSize: "9px", color: "var(--text-muted)" }}>DECKS SAVED</div>
            <div style={{ fontSize: "18px", fontWeight: "900", color: "#ff6a00", marginTop: "2px" }}>{stats.totalVideos}</div>
          </div>
          <div className="history-hud-panel" style={{ position: "relative", padding: "8px 16px", minWidth: "130px", borderRadius: "10px", borderStyle: "dashed" }}>
            <div className="history-corner-bracket hist-bracket-tl" />
            <div className="history-corner-bracket hist-bracket-tr" />
            <div style={{ fontSize: "9px", color: "var(--text-muted)" }}>LAST ACTIVE</div>
            <div style={{ fontSize: "16px", fontWeight: "900", color: "var(--text-light)", marginTop: "4px" }}>{stats.lastStudyDate}</div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {historyList.length === 0 ? (
        <div className="history-hud-panel" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "64px 32px",
          textAlign: "center",
          borderRadius: "16px"
        }}>
          <div className="history-corner-bracket hist-bracket-tl" />
          <div className="history-corner-bracket hist-bracket-tr" />
          <div className="history-corner-bracket hist-bracket-bl" />
          <div className="history-corner-bracket hist-bracket-br" />
          
          <BookOpen size={42} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: "16px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "900", margin: "0 0 8px 0" }}>Quest Codex is Empty</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "13px", maxWidth: "340px", margin: "0 0 24px 0", fontFamily: "sans-serif", lineHeight: "1.5" }}>
            You haven't completed any Solo Study guides yet. Complete study videos in the Pathfinder module to compile guides.
          </p>
        </div>
      ) : (
        /* 2. Main Double-Panel HUD Layout */
        <div className="study-history-grid">
          {/* LEFT SIDEBAR: Timeline List */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            maxHeight: "650px",
            overflowY: "auto",
            paddingRight: "6px"
          }} className="custom-scrollbar">
            {historyList.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              const dateStr = new Date(item.timestamp).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric"
              });

              return (
                <div
                  key={item.id}
                  onClick={() => handleItemSelect(item)}
                  className={`chrono-card ${isSelected ? "chrono-card-active" : ""}`}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <span style={{
                      fontSize: "9px",
                      background: "rgba(255, 106, 0, 0.12)",
                      color: "#ff6a00",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      fontWeight: "900",
                      letterSpacing: "0.5px"
                    }}>
                      {item.topic && item.topic.toUpperCase().substring(0, 16)}
                    </span>
                    <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: "600" }}>
                      {dateStr}
                    </span>
                  </div>

                  <h4 style={{
                    fontSize: "13px",
                    fontWeight: "800",
                    margin: "0 0 4px 0",
                    color: isSelected ? "#ff6a00" : "var(--text-light)",
                    lineHeight: "1.4",
                    fontFamily: "var(--font-outfit)",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}>
                    {item.video.title}
                  </h4>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "var(--text-muted)", marginTop: "3px" }}>
                    <Video size={12} color="#ff6a00" /> {item.video.channel}
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT VIEWPORT: Content Detail View */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            maxHeight: "650px",
            overflowY: "auto",
            boxSizing: "border-box"
          }} className="history-detail-panel custom-scrollbar history-hud-panel">
            <div className="history-corner-bracket hist-bracket-tl" />
            <div className="history-corner-bracket hist-bracket-tr" />
            <div className="history-corner-bracket hist-bracket-bl" />
            <div className="history-corner-bracket hist-bracket-br" />

            {selectedItem ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                
                {/* Header Action toolbar */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: isDarkMode ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
                  paddingBottom: "16px",
                  flexWrap: "wrap",
                  gap: "12px"
                }}>
                  <div>
                    <span style={{ 
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "10px",
                      color: "#ff6a00",
                      fontWeight: "900",
                      letterSpacing: "1px",
                      textTransform: "uppercase"
                    }}>
                      <Bookmark size={11} color="#ff6a00" /> ACTIVE STUDY CODEX
                    </span>
                    <h3 style={{
                      fontSize: "18px",
                      fontWeight: "900",
                      margin: "4px 0 0 0",
                      fontFamily: "var(--font-outfit)",
                      color: "var(--text-light)"
                    }}>
                      {selectedItem.video.title}
                    </h3>
                  </div>

                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <button
                      onClick={() => handleRevisitClick(selectedItem)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "7px",
                        padding: "9px 18px",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #ff6a00, #ea580c)",
                        border: "none",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: "900",
                        cursor: "pointer",
                        boxShadow: "0 4px 14px rgba(255, 106, 0, 0.28)",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={e => { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                      onMouseOut={e => { e.currentTarget.style.filter = "none"; e.currentTarget.style.transform = "none"; }}
                    >
                      <RotateCcw size={14} /> Revisit Training
                    </button>
                    <button
                      onClick={() => handleDownloadNotes(selectedItem)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "7px",
                        padding: "9px 18px",
                        borderRadius: "10px",
                        background: isDarkMode ? "rgba(255,255,255,0.04)" : "#ffffff",
                        border: isDarkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid #cbd5e1",
                        color: "var(--text-light)",
                        fontSize: "12px",
                        fontWeight: "800",
                        cursor: "pointer",
                        boxShadow: isDarkMode ? "none" : "0 2px 8px rgba(0,0,0,0.04)",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={e => { e.currentTarget.style.background = isDarkMode ? "rgba(255,255,255,0.08)" : "#f8fafc"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                      onMouseOut={e => { e.currentTarget.style.background = isDarkMode ? "rgba(255,255,255,0.04)" : "#ffffff"; e.currentTarget.style.transform = "none"; }}
                    >
                      <Download size={14} color="#ff6a00" /> Download Notes (.pdf)
                    </button>
                  </div>
                </div>

                {/* Split detail: Embedded Video + Markdown text */}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  {selectedItem.video.videoId && (
                    <div style={{ maxWidth: "560px", width: "100%", margin: "0 auto" }}>
                      <iframe
                        width="100%"
                        height="315"
                        src={`https://www.youtube.com/embed/${selectedItem.video.videoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{
                          borderRadius: "16px",
                          border: "1.5px solid rgba(255, 106, 0, 0.25)",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
                        }}
                      />
                    </div>
                  )}

                  <StudyNotesContent notes={selectedItem.notes} isDarkMode={isDarkMode} />
                </div>

              </div>
            ) : (
              <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", minHeight: "350px", color: "var(--text-muted)" }}>
                Select a completed study deck from the list to view its details.
              </div>
            )}
          </div>
        </div>
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
                      [!]️ Unable to Parse Diagram Syntax
                    </div>
                    <div style="font-size: 12.5px; color: ${isDarkMode ? '#94a3b8' : '#475569'}; line-height: 1.5; margin-bottom: 12px;">
                      The AI generated diagram contains a syntax mistake. Try using the **Regenerate** option to rebuild notes for this milestone.
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
