export default function PlayerKnightSVG({ isHurt }) {
  return (
    <svg width="90" height="90" viewBox="0 0 32 32" style={{ imageRendering: "pixelated", overflow: "visible", filter: isHurt ? "drop-shadow(0 0 15px #c8102e) brightness(1.8)" : "none" }}>
      <defs>
        <filter id="playerGlow">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Cape (glowing crimson/purple, waving) */}
      <g className="pixel-player-cape">
        <path d="M 8,14 Q 3,18 2,26 Q 7,28 11,25 Q 10,19 9,14 Z" fill="#580000" />
        <path d="M 9,14 Q 5,17 4,25 Q 8,27 11,25 Q 11,20 10,14 Z" fill="#c8102e" />
        <path d="M 10,14 Q 7,17 6,23 Q 9,25 11,24 Q 11,20 10,14 Z" fill="#ff4d4d" />
      </g>
      
      {/* Legs & Boots */}
      <g className="pixel-player-legs">
        <rect x="11" y="23" width="3" height="5" fill="#2d3748" />
        <rect x="16" y="23" width="3" height="5" fill="#2d3748" />
        <rect x="10" y="26" width="4" height="2" fill="#1a202c" />
        <rect x="16" y="26" width="4" height="2" fill="#1a202c" />
      </g>

      {/* Torso & Armor */}
      <g className="pixel-player-torso">
        <rect x="10" y="13" width="10" height="11" fill="#4a5568" rx="1" />
        <rect x="11" y="14" width="8" height="9" fill="#718096" />
        {/* Chest Crest */}
        <rect x="14" y="15" width="2" height="6" fill="#c8102e" />
        <rect x="13" y="17" width="4" height="2" fill="#c8102e" />
        {/* Belt */}
        <rect x="10" y="22" width="10" height="1" fill="#111" />
        <rect x="14" y="21" width="2" height="2" fill="#e2e8f0" />
      </g>

      {/* Head & Helmet */}
      <g className="pixel-player-head">
        <rect x="11" y="5" width="8" height="9" fill="#718096" rx="1" />
        <rect x="12" y="6" width="6" height="7" fill="#a0aec0" />
        {/* Visor slit */}
        <rect x="12" y="8" width="6" height="2" fill="#1a202c" />
        {/* Glowing Eyes */}
        <rect x="13" y="8.5" width="1.5" height="1" fill="#00e5ff" style={{ animation: "pulseOpacity 1.5s infinite alternate" }} />
        <rect x="16.5" y="8.5" width="1.5" height="1" fill="#00e5ff" style={{ animation: "pulseOpacity 1.5s infinite alternate" }} />
        {/* Crest Plume */}
        <path d="M 12,5 Q 9,1 14,0 Q 17,1 16,5 Z" fill="#c8102e" />
        <path d="M 13,4 Q 11,2 14,1 Q 16,2 15,4 Z" fill="#ff4d4d" />
      </g>

      {/* Shield (Left arm / Foreground block) */}
      <g className="pixel-player-shield">
        <path d="M 7,14 h 5 v 6 l -2.5,4 l -2.5,-4 z" fill="#1a202c" />
        <path d="M 8,15 h 3 v 4 l -1.5,3 l -1.5,-3 z" fill="#4a5568" />
        <path d="M 9.5,15 v 5" stroke="#c8102e" strokeWidth="1" />
        <rect x="7" y="16" width="1" height="1" fill="#cbd5e0" />
        <rect x="12" y="16" width="1" height="1" fill="#cbd5e0" />
      </g>

      {/* Sword (Right arm, with glowing blade) */}
      <g className="pixel-player-sword" style={{ transformOrigin: "19px 18px" }}>
        <rect x="19" y="15" width="3" height="3" fill="#4a5568" />
        <rect x="21" y="11" width="2" height="8" fill="#a0aec0" transform="rotate(-20 22 15)" />
        <rect x="20" y="14" width="2" height="2" fill="#1a202c" />
        <rect x="23" y="13" width="11" height="3" fill="#e2e8f0" transform="rotate(-20 22 15)" />
        <rect x="23" y="14" width="11" height="1" fill="#ffffff" transform="rotate(-20 22 15)" />
        <rect x="23" y="12" width="12" height="5" fill="rgba(0, 229, 255, 0.45)" filter="url(#playerGlow)" transform="rotate(-20 22 15)" className="pixel-player-sword-glow" />
      </g>
    </svg>
  );
}
