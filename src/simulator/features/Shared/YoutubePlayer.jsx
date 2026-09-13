import { useEffect, useRef } from "react";
import { trackTelemetry } from "../../utils/telemetry.js";

export function getCleanYoutubeId(rawId) {
  if (!rawId) return "x9Jpx_M8yq4";
  const str = String(rawId).trim();
  
  // Check if it's already an 11-character YouTube video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
    return str;
  }
  
  // Check if it's a URL
  const urlMatch = str.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (urlMatch && urlMatch[1]) {
    return urlMatch[1];
  }

  // Common mock ID mappings to guarantee 100% valid playback
  const fallbackMap = {
    "v8-gc-01": "x9Jpx_M8yq4",
    "v8-gc-02": "8aGhZQkoFbQ",
    "v8-gc-03": "Fd9EyG3J62U",
    "v8-gc-04": "FU4GQnz8L68",
    "v8-gc-05": "s7v_0P_u9kY"
  };
  if (fallbackMap[str]) {
    return fallbackMap[str];
  }

  return "x9Jpx_M8yq4";
}

export default function YoutubePlayer({ videoId, onProgress, onFinished, isFrozen, playbackRate = 1 }) {
  const cleanVideoId = getCleanYoutubeId(videoId);
  const playerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const containerId = "youtube-iframe-player";

  // Telemetry tracking refs
  const hasStartedRef = useRef(false);
  const hasOpenedRef = useRef(false);
  const lastPercentageRef = useRef(0);
  const lastTimeRef = useRef(0);

  // Use refs to keep callbacks stable so they never trigger the player recreation effect
  const onProgressRef = useRef(onProgress);
  const onFinishedRef = useRef(onFinished);
  const playbackRateRef = useRef(playbackRate);

  useEffect(() => {
    onProgressRef.current = onProgress;
    onFinishedRef.current = onFinished;
    playbackRateRef.current = playbackRate;
  });

  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.setPlaybackRate === "function") {
      try {
        playerRef.current.setPlaybackRate(playbackRate);
      } catch (e) {
        console.warn("[YT Player] Could not set playback rate:", e);
      }
    }
  }, [playbackRate]);

  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.pauseVideo === "function" && typeof playerRef.current.playVideo === "function") {
      try {
        if (isFrozen) {
          playerRef.current.pauseVideo();
        } else {
          playerRef.current.playVideo();
        }
      } catch (e) {
        console.error("Error toggling playback during freeze:", e);
      }
    }
  }, [isFrozen]);

  useEffect(() => {
    let player = null;
    let isDestroyed = false;

    // Helper to poll player time
    const startProgressTracking = (ytPlayer) => {
      stopProgressTracking();
      progressIntervalRef.current = setInterval(() => {
        if (isDestroyed) return;
        if (ytPlayer && typeof ytPlayer.getCurrentTime === "function" && typeof ytPlayer.getDuration === "function") {
          try {
            const currentTime = ytPlayer.getCurrentTime();
            const duration = ytPlayer.getDuration();
            if (duration > 0) {
              const percentage = Math.min(100, (currentTime / duration) * 100);

              // Seek detection: Check if playhead jumps significantly
              const timeDiff = currentTime - lastTimeRef.current;
              if (lastTimeRef.current > 0 && (timeDiff < -1.5 || timeDiff > 2.5)) {
                trackTelemetry({
                  eventType: "VIDEO_SEEK",
                  videoId: cleanVideoId,
                  metadata: {
                    from: lastTimeRef.current,
                    to: currentTime,
                    direction: timeDiff > 0 ? "forward" : "backward"
                  }
                });
              }

              lastPercentageRef.current = Math.round(percentage);
              lastTimeRef.current = currentTime;

              // Trigger the latest callback ref
              if (onProgressRef.current) {
                onProgressRef.current(Math.round(percentage), currentTime);
              }
            }
          } catch (e) {
            console.error("Error reading player times:", e);
          }
        }
      }, 800);
    };

    const stopProgressTracking = () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };

    // Function to initialize the player
    const initPlayer = () => {
      if (isDestroyed) return;
      const container = document.getElementById(containerId);
      if (!container) return;
      if (playerRef.current) return;
      
      try {
        player = new window.YT.Player(containerId, {
          height: "100%",
          width: "100%",
          videoId: cleanVideoId,
          playerVars: {
            autoplay: 1,      // Autoplay the video
            controls: 1,      // Show controls
            rel: 0,           // Disable related videos at the end
            modestbranding: 1,// Clean player look
            mute: 0           // Do not mute the video sound
          },
          events: {
            onReady: (event) => {
              if (isDestroyed) return;
              console.log("[YT Player] Ready and playing:", cleanVideoId);
              
              if (!hasOpenedRef.current) {
                trackTelemetry({
                  eventType: "VIDEO_OPENED",
                  videoId: cleanVideoId,
                  metadata: { playbackRate: playbackRateRef.current }
                });
                hasOpenedRef.current = true;
              }

              try {
                if (isFrozen) {
                  if (typeof event.target.pauseVideo === "function") {
                    event.target.pauseVideo();
                  }
                } else {
                  if (typeof event.target.playVideo === "function") {
                    event.target.playVideo();
                  }
                }
                // Apply initial playback rate
                if (playbackRateRef.current && playbackRateRef.current !== 1) {
                  if (typeof event.target.setPlaybackRate === "function") {
                    event.target.setPlaybackRate(playbackRateRef.current);
                  }
                }
              } catch (err) {
                console.warn("[YT Player] Autoplay failed or blocked:", err);
              }
              startProgressTracking(event.target);
            },
            onStateChange: (event) => {
              if (isDestroyed) return;

              // YT.PlayerState.PLAYING = 1
              if (event.data === window.YT.PlayerState.PLAYING) {
                const currentTime = typeof event.target.getCurrentTime === "function" ? event.target.getCurrentTime() : 0;
                if (!hasStartedRef.current) {
                  trackTelemetry({
                    eventType: "VIDEO_PLAYING",
                    videoId: cleanVideoId,
                    metadata: { startAt: currentTime, playbackRate: playbackRateRef.current }
                  });
                  hasStartedRef.current = true;
                } else {
                  trackTelemetry({
                    eventType: "VIDEO_RESUMED",
                    videoId: cleanVideoId,
                    metadata: { resumeAt: currentTime }
                  });
                }

                // If frozen, force pause
                if (isFrozen) {
                  try {
                    if (typeof event.target.pauseVideo === "function") {
                      event.target.pauseVideo();
                    }
                  } catch (e) {
                    console.warn("[YT Player] pauseVideo failed on frozen PLAYING:", e);
                  }
                } else {
                  // Re-apply playback rate just in case YouTube reset it
                  if (playbackRateRef.current) {
                    try {
                      if (typeof event.target.setPlaybackRate === "function") {
                        event.target.setPlaybackRate(playbackRateRef.current);
                      }
                    } catch (e) {
                      console.warn("[YT Player] setPlaybackRate failed on PLAYING:", e);
                    }
                  }
                  startProgressTracking(event.target);
                }
              } else {
                stopProgressTracking();
                if (event.data === window.YT.PlayerState.PAUSED) {
                  const currentTime = typeof event.target.getCurrentTime === "function" ? event.target.getCurrentTime() : 0;
                  trackTelemetry({
                    eventType: "VIDEO_PAUSED",
                    videoId: cleanVideoId,
                    metadata: { pauseAt: currentTime }
                  });
                }
              }

              // YT.PlayerState.ENDED = 0
              if (event.data === window.YT.PlayerState.ENDED) {
                stopProgressTracking();
                if (onFinishedRef.current) {
                  onFinishedRef.current();
                }
              }
            }
          }
        });
        playerRef.current = player;
      } catch (err) {
        console.warn("[YT Player] Failed to initialize YT.Player with videoId:", cleanVideoId, err);
      }
    };

    // Helper to initialize the player once API is ready
    let checkInterval = null;

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      // Ensure script tag exists
      if (typeof window !== "undefined" && !document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.body.appendChild(script);
      }

      checkInterval = setInterval(() => {
        if (isDestroyed) {
          if (checkInterval) clearInterval(checkInterval);
          return;
        }
        if (window.YT && window.YT.Player) {
          if (checkInterval) clearInterval(checkInterval);
          checkInterval = null;
          initPlayer();
        }
      }, 150);
    }

    // Unified cleanup on unmount or cleanVideoId change
    return () => {
      isDestroyed = true;
      if (checkInterval) {
        clearInterval(checkInterval);
        checkInterval = null;
      }
      stopProgressTracking();

      // Check if video is abandoned (less than 95% complete)
      if (hasStartedRef.current && lastPercentageRef.current < 95) {
        trackTelemetry({
          eventType: "VIDEO_ABANDONED",
          videoId: cleanVideoId,
          metadata: {
            lastPercentage: lastPercentageRef.current,
            lastSecond: lastTimeRef.current
          }
        });
      }
      
      if (playerRef.current) {
        try {
          if (typeof playerRef.current.destroy === "function") {
            playerRef.current.destroy();
          }
        } catch (e) {
          console.warn("[YT Player] Error during destruction:", e);
        }
        playerRef.current = null;
      }
    };
  }, [cleanVideoId]); // ONLY recreate when cleanVideoId changes!

  return (
    <div className="video-player-wrapper">
      <div id={containerId} className="video-player-iframe"></div>
    </div>
  );
}
