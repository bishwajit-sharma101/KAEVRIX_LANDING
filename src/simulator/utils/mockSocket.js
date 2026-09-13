"use client";

import { MOCK_CURATED_VIDEOS, MOCK_LEADERBOARD } from "./mockInterceptor";

export function createMockSocket() {
  const listeners = new Map();
  let pendingTimers = [];

  const trigger = (event, payload) => {
    const callbacks = listeners.get(event) || [];
    callbacks.forEach(cb => {
      try { cb(payload); } catch (e) { console.error(`[MockSocket Error in ${event}]:`, e); }
    });
  };

  const clearTimers = () => {
    pendingTimers.forEach(t => clearTimeout(t));
    pendingTimers = [];
  };

  return {
    id: "mock_socket_demo_" + Math.random().toString(36).substring(7),
    connected: true,
    username: "TuringScholar",
    on(event, callback) {
      if (!listeners.has(event)) {
        listeners.set(event, []);
      }
      listeners.get(event).push(callback);
      return this;
    },
    off(event, callback) {
      if (!listeners.has(event)) return this;
      if (!callback) {
        listeners.delete(event);
      } else {
        const arr = listeners.get(event).filter(cb => cb !== callback);
        listeners.set(event, arr);
      }
      return this;
    },
    emit(event, data) {
      // 1. Live Chat
      if (event === "send_chat_message") {
        const t = setTimeout(() => {
          const echoMsg = {
            id: "msg_" + Date.now(),
            sender: data?.receiver || "CyberRonin",
            receiver: "TuringScholar",
            content: "Great duel! Keep pushing your code momentum.",
            timestamp: new Date().toISOString()
          };
          trigger("receive_chat_message", echoMsg);
        }, 800);
        pendingTimers.push(t);
        return this;
      }

      // 2. Arena Matchmaking Queue
      if (event === "join_queue") {
        clearTimers();
        const userName = data?.username || "TuringScholar";
        const userAvatar = data?.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=TuringScholar&backgroundColor=transparent";
        
        // Find video or fallback
        const video = MOCK_CURATED_VIDEOS.find(v => v.id === data?.videoId) || MOCK_CURATED_VIDEOS[0];
        
        // Opponent pool: pick a top rival
        const rivals = [
          { username: "QuantumLeap", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=QuantumLeap&backgroundColor=transparent", level: 88, class: "streamsniper" },
          { username: "NeonValkyrie", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=NeonValkyrie&backgroundColor=transparent", level: 81, class: "glitchmancer" },
          { username: "CyberRonin", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=CyberRonin&backgroundColor=transparent", level: 74, class: "speedrunner" }
        ];
        const opponent = rivals[Math.floor(Math.random() * rivals.length)];

        const roomObj = {
          id: "arena_room_" + Date.now(),
          players: [
            { username: userName, avatar: userAvatar, level: 42, score: 0 },
            { username: opponent.username, avatar: opponent.avatar, level: opponent.level, score: 0, isBot: true }
          ],
          video: {
            id: video.id,
            title: video.title,
            channel: video.channel || video.channelTitle,
            category: video.category || "Algorithms",
            duration: video.duration || 360,
            thumbnail: video.thumbnail,
            questions: video.questions || [],
            inVideoQuestions: video.inVideoQuestions || []
          },
          generatingQuiz: false
        };

        // Match found after 1.2 seconds
        const t1 = setTimeout(() => {
          trigger("match_found", { roomId: roomObj.id, room: roomObj });

          // Start countdown ticks
          const tTick3 = setTimeout(() => trigger("countdown_tick", { count: 3 }), 1000);
          const tTick2 = setTimeout(() => trigger("countdown_tick", { count: 2 }), 2000);
          const tTick1 = setTimeout(() => trigger("countdown_tick", { count: 1 }), 3000);
          
          // Game play start
          const tStart = setTimeout(() => {
            trigger("game_play", {});

            // Simulate opponent progress over time
            const tProg1 = setTimeout(() => trigger("opponent_progress", { progress: 25 }), 3000);
            const tProg2 = setTimeout(() => trigger("opponent_progress", { progress: 55 }), 6000);
            const tProg3 = setTimeout(() => trigger("opponent_progress", { progress: 85 }), 9000);
            const tProg4 = setTimeout(() => {
              trigger("opponent_progress", { progress: 100 });
              trigger("opponent_waiting_quiz", { username: opponent.username });
            }, 12000);

            pendingTimers.push(tProg1, tProg2, tProg3, tProg4);
          }, 4000);

          pendingTimers.push(tTick3, tTick2, tTick1, tStart);
        }, 1200);

        pendingTimers.push(t1);
        return this;
      }

      // 3. Cancel Matchmaking
      if (event === "leave_queue") {
        clearTimers();
        return this;
      }

      // 3.5 Player Ready in Lobby
      if (event === "player_ready") {
        const tStart = setTimeout(() => {
          trigger("countdown_tick", { count: 3 });
          setTimeout(() => trigger("countdown_tick", { count: 2 }), 1000);
          setTimeout(() => trigger("countdown_tick", { count: 1 }), 2000);
          setTimeout(() => trigger("game_play", {}), 3000);
        }, 500);
        pendingTimers.push(tStart);
        return this;
      }

      // 4. Video Finished
      if (event === "video_finished") {
        const t = setTimeout(() => {
          trigger("opponent_waiting_quiz", { username: "QuantumLeap" });
        }, 1500);
        pendingTimers.push(t);
        return this;
      }

      // 5. Quiz Submission & Game Over
      if (event === "submit_answers" || event === "submit_quiz") {
        const userName = data?.username || this.username || "TuringScholar";
        const answers = data?.answers || [];
        const watchProgress = data?.watchProgress || 100;
        
        let correctCount = 0;
        if (Array.isArray(answers) && answers.length > 0) {
          answers.forEach(a => {
            if (a !== null && a >= 0) correctCount++;
          });
        }
        if (correctCount === 0) correctCount = 3; // Default realistic battle score

        const score = 100 + (correctCount * 70) + Math.round(watchProgress * 0.5);
        const opponentScore = Math.max(80, score - 30 + Math.floor(Math.random() * 50));
        const userWon = score >= opponentScore;

        const results = {
          draw: score === opponentScore,
          winner: userWon ? { username: userName, score } : { username: "QuantumLeap", score: opponentScore },
          loser: userWon ? { username: "QuantumLeap", score: opponentScore } : { username: userName, score },
          players: [
            {
              username: userName,
              score,
              correctCount,
              watchProgress,
              multiplier: 1.2,
              submitTimeSec: 22
            },
            {
              username: "QuantumLeap",
              score: opponentScore,
              correctCount: Math.max(1, correctCount - (userWon ? 1 : 0)),
              watchProgress: 100,
              multiplier: 1.0,
              submitTimeSec: 28
            }
          ]
        };

        const finalRoom = {
          players: [
            { username: userName, xpGained: userWon ? 180 : 60, leveledUp: false, totalXp: 3630, level: 42, score },
            { username: "QuantumLeap", xpGained: userWon ? 40 : 180, leveledUp: false, totalXp: 15860, level: 88, score: opponentScore }
          ]
        };

        const t = setTimeout(() => {
          trigger("game_over", {
            results,
            room: finalRoom,
            leaderboard: MOCK_LEADERBOARD
          });
        }, 600);
        pendingTimers.push(t);
        return this;
      }

      return this;
    },
    disconnect() {
      clearTimers();
      listeners.clear();
      this.connected = false;
    }
  };
}
