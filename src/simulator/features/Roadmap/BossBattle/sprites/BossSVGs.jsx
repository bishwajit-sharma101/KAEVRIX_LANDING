export function PixelCallbackDemonSVG({ isHurt }) {
  return (
    <svg width="100" height="100" viewBox="0 0 32 32" style={{ imageRendering: "pixelated", overflow: "visible", filter: isHurt ? "drop-shadow(0 0 25px #c8102e) brightness(1.8)" : "drop-shadow(0 0 15px rgba(168,85,247,0.4))" }}>
      <defs>
        <filter id="demonGlow">
          <feGaussianBlur stdDeviation="1" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Flapping Wings */}
      <g className="pixel-boss-wings">
        <path d="M 12,12 Q 2,2 1,14 Q 5,16 11,15 Z" fill="#2d004d" />
        <path d="M 11,13 Q 4,5 3,13 Q 6,15 10,14 Z" fill="#ff007f" opacity="0.8" />
        <path d="M 20,12 Q 30,2 31,14 Q 27,16 21,15 Z" fill="#2d004d" />
        <path d="M 21,13 Q 28,5 29,13 Q 26,15 22,14 Z" fill="#ff007f" opacity="0.8" />
      </g>

      {/* Legs & Tail */}
      <g>
        <path d="M 16,22 Q 13,29 9,29 Q 12,31 16,27 Q 20,31 23,29 Q 19,29 16,22 Z" fill="#1a0033" />
        <rect x="11" y="27" width="2" height="2" fill="#ff007f" />
        <rect x="19" y="27" width="2" height="2" fill="#ff007f" />
      </g>

      {/* Torso */}
      <g>
        <rect x="11" y="12" width="10" height="11" fill="#1a0033" rx="1" />
        <rect x="12" y="13" width="8" height="9" fill="#2d004d" />
        <polygon points="16,14 18,17 16,20 14,17" fill="#ff007f" style={{ animation: "pulseOpacity 1.5s infinite alternate" }} />
      </g>

      {/* Horned Head */}
      <g>
        <rect x="12" y="5" width="8" height="8" fill="#1a0033" rx="1" />
        <rect x="13" y="8" width="1.5" height="1" fill="#ff007f" />
        <rect x="17.5" y="8" width="1.5" height="1" fill="#ff007f" />
        <path d="M 12,5 Q 9,0 8,3 L 11,6 Z" fill="#ff007f" />
        <path d="M 20,5 Q 23,0 24,3 L 21,6 Z" fill="#ff007f" />
      </g>

      {/* Trident Weapon */}
      <g className="pixel-boss-weapon" style={{ transformOrigin: "12px 17px" }}>
        <line x1="8" y1="26" x2="15" y2="10" stroke="#111827" strokeWidth="1.5" />
        <path d="M 13,12 L 18,5 L 14,11 L 16,9 Z" fill="#ff007f" filter="url(#demonGlow)" />
        <path d="M 14,11 L 11,7 L 13,12 Z" fill="#ff007f" filter="url(#demonGlow)" />
        <path d="M 13,12 L 15,10" stroke="#ffffff" strokeWidth="1" />
      </g>
    </svg>
  );
}

export function PixelScopeWardenSVG({ isHurt }) {
  return (
    <svg width="100" height="100" viewBox="0 0 32 32" style={{ imageRendering: "pixelated", overflow: "visible", filter: isHurt ? "drop-shadow(0 0 25px #c8102e) brightness(1.8)" : "drop-shadow(0 0 15px rgba(56,189,248,0.4))" }}>
      <defs>
        <filter id="wardenGlow">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Floating Shards (Lexical scopes orbiting) */}
      <g className="pixel-boss-shards">
        <rect x="4" y="6" width="2" height="2" fill="#38bdf8" filter="url(#wardenGlow)" style={{ animation: "pixelIdle 2s infinite alternate" }} />
        <rect x="26" y="8" width="2" height="2" fill="#38bdf8" filter="url(#wardenGlow)" style={{ animation: "pixelIdle 2.5s infinite alternate-reverse" }} />
        <rect x="6" y="22" width="2" height="2" fill="#38bdf8" filter="url(#wardenGlow)" style={{ animation: "pixelIdle 1.8s infinite alternate" }} />
      </g>

      {/* Robes */}
      <g>
        <path d="M 11,14 L 21,14 L 25,28 L 7,28 Z" fill="#0f172a" />
        <path d="M 13,14 L 19,14 L 22,28 L 10,28 Z" fill="#1e293b" />
        <path d="M 15,14 L 17,14 L 18,28 L 14,28 Z" fill="#38bdf8" opacity="0.6" />
      </g>

      {/* Pauldrons (Silver/Ice) */}
      <g>
        <rect x="9" y="13" width="4" height="3" fill="#cbd5e1" rx="1" />
        <rect x="19" y="13" width="4" height="3" fill="#cbd5e1" rx="1" />
      </g>

      {/* Hooded Head */}
      <g>
        <rect x="12" y="5" width="8" height="9" fill="#0f172a" rx="1" />
        <rect x="13" y="6" width="6" height="7" fill="#020617" />
        <rect x="14" y="8.5" width="1" height="1" fill="#38bdf8" filter="url(#wardenGlow)" />
        <rect x="17" y="8.5" width="1" height="1" fill="#38bdf8" filter="url(#wardenGlow)" />
      </g>

      {/* Lexical Crystal Staff */}
      <g className="pixel-boss-weapon" style={{ transformOrigin: "23px 20px" }}>
        <rect x="22" y="6" width="2" height="23" fill="#64748b" />
        <circle cx="23" cy="4" r="2.5" fill="#38bdf8" filter="url(#wardenGlow)" />
        <circle cx="23" cy="4" r="1" fill="#ffffff" />
        <path d="M 20,4 C 20,2 26,2 26,4 C 26,6 20,6 20,4 Z" fill="none" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="1 1" />
      </g>
    </svg>
  );
}

export function PixelDOMDestroyerSVG({ isHurt }) {
  return (
    <svg width="100" height="100" viewBox="0 0 32 32" style={{ imageRendering: "pixelated", overflow: "visible", filter: isHurt ? "drop-shadow(0 0 25px #c8102e) brightness(1.8)" : "drop-shadow(0 0 15px rgba(34,197,94,0.4))" }}>
      <defs>
        <filter id="domGlow">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Segmented Spider-Like Legs */}
      <g className="pixel-boss-legs">
        <path d="M 10,16 L 3,18 L 1,28" stroke="#14532d" strokeWidth="1.5" fill="none" />
        <path d="M 10,19 L 4,22 L 3,29" stroke="#14532d" strokeWidth="1.5" fill="none" />
        <path d="M 22,16 L 29,18 L 31,28" stroke="#14532d" strokeWidth="1.5" fill="none" />
        <path d="M 22,19 L 28,22 L 29,29" stroke="#14532d" strokeWidth="1.5" fill="none" />
      </g>

      {/* Glitchy Matrix Torso */}
      <g>
        <rect x="9" y="11" width="14" height="11" fill="#022c22" rx="1" />
        <rect x="10" y="12" width="12" height="9" fill="#064e3b" />
        <rect x="13" y="14" width="2" height="2" fill="#10b981" style={{ animation: "pulseOpacity 0.8s infinite alternate" }} />
        <rect x="17" y="16" width="2" height="2" fill="#06b6d4" style={{ animation: "pulseOpacity 1.2s infinite alternate" }} />
        <rect x="15" y="13" width="1.5" height="1.5" fill="#10b981" />
      </g>

      {/* Mechanical Glitch Head */}
      <g>
        <rect x="12" y="4" width="8" height="7" fill="#022c22" rx="1" />
        <rect x="13" y="5" width="6" height="5" fill="#10b981" />
        <rect x="14" y="6" width="1" height="1" fill="#ffffff" />
        <rect x="17" y="6" width="1" height="1" fill="#ffffff" />
        <rect x="15.5" y="8" width="1" height="1" fill="#06b6d4" />
      </g>

      {/* Energy Slicers */}
      <g className="pixel-boss-weapon" style={{ transformOrigin: "12px 18px" }}>
        <path d="M 7,16 L 1,12" stroke="#10b981" strokeWidth="2" filter="url(#domGlow)" />
        <path d="M 25,16 L 31,12" stroke="#10b981" strokeWidth="2" filter="url(#domGlow)" />
      </g>
    </svg>
  );
}

export function PixelSyntaxSentinelSVG({ isHurt }) {
  return (
    <svg width="100" height="100" viewBox="0 0 32 32" style={{ imageRendering: "pixelated", overflow: "visible", filter: isHurt ? "drop-shadow(0 0 25px #c8102e) brightness(1.8)" : "drop-shadow(0 0 15px rgba(234,88,12,0.4))" }}>
      <defs>
        <filter id="sentinelGlow">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer Rotating Gears */}
      <g className="pixel-boss-gears" style={{ transformOrigin: "16px 16px" }}>
        <circle cx="16" cy="16" r="13" fill="none" stroke="#7c2d12" strokeWidth="1" strokeDasharray="3 5" />
        <circle cx="16" cy="16" r="15" fill="none" stroke="#ea580c" strokeWidth="0.5" strokeDasharray="6 8" />
      </g>

      {/* Floating Rune Shards */}
      <g>
        <rect x="15" y="1" width="2" height="2" fill="#ea580c" filter="url(#sentinelGlow)" style={{ animation: "pixelIdle 1.5s infinite alternate" }} />
        <rect x="15" y="29" width="2" height="2" fill="#ea580c" filter="url(#sentinelGlow)" style={{ animation: "pixelIdle 1.5s infinite alternate-reverse" }} />
      </g>

      {/* Main Runic Core Orb */}
      <g>
        <circle cx="16" cy="16" r="8" fill="#431407" />
        <circle cx="16" cy="16" r="7" fill="#9a3412" />
        <circle cx="16" cy="16" r="5" fill="#ea580c" />
        <rect x="14" y="14" width="4" height="1" fill="#ff6a00" />
        <rect x="15" y="17" width="2" height="1" fill="#ff6a00" />
      </g>

      {/* Central Laser Eye */}
      <g>
        <circle cx="16" cy="16" r="2.5" fill="#ffffff" filter="url(#sentinelGlow)" />
        <circle cx="16" cy="16" r="1" fill="#00e5ff" />
      </g>
    </svg>
  );
}

export function PixelGarbageCollectorSVG({ isHurt }) {
  return (
    <svg width="100" height="100" viewBox="0 0 32 32" style={{ imageRendering: "pixelated", overflow: "visible", filter: isHurt ? "drop-shadow(0 0 25px #c8102e) brightness(1.8)" : "drop-shadow(0 0 15px rgba(239,68,68,0.4))" }}>
      <defs>
        <filter id="garbageGlow">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Exhaust Pipes & Smoke */}
      <g className="pixel-boss-vents">
        <rect x="8" y="6" width="2" height="4" fill="#27272a" />
        <circle cx="7" cy="4" r="1.5" fill="#71717a" opacity="0.6" style={{ animation: "pixelIdle 1.2s infinite alternate" }} />
        <rect x="22" y="6" width="2" height="4" fill="#27272a" />
        <circle cx="25" cy="3" r="2" fill="#71717a" opacity="0.6" style={{ animation: "pixelIdle 1.4s infinite alternate-reverse" }} />
      </g>

      {/* Legs & Platform */}
      <g>
        <rect x="11" y="24" width="4" height="4" fill="#18181b" />
        <rect x="17" y="24" width="4" height="4" fill="#18181b" />
        <rect x="9" y="27" width="14" height="2" fill="#991b1b" />
      </g>

      {/* Rusted Bulky Torso */}
      <g>
        <rect x="8" y="10" width="16" height="14" fill="#18181b" rx="1" />
        <rect x="9" y="11" width="14" height="12" fill="#27272a" />
        <rect x="10" y="12" width="2" height="2" fill="#7c2d12" />
        <rect x="20" y="18" width="2" height="2" fill="#7c2d12" />
        <rect x="11" y="20" width="3" height="1" fill="#7c2d12" />
        <rect x="14" y="14" width="4" height="4" fill="#7f1d1d" />
        <rect x="15" y="15" width="2" height="2" fill="#ea580c" style={{ animation: "pulseOpacity 1s infinite alternate" }} />
      </g>

      {/* Head */}
      <g>
        <rect x="13" y="6" width="6" height="5" fill="#18181b" />
        <rect x="14" y="8" width="4" height="1" fill="#ef4444" filter="url(#garbageGlow)" />
      </g>

      {/* Massive Trash Hook */}
      <g className="pixel-boss-weapon" style={{ transformOrigin: "9px 15px" }}>
        <rect x="4" y="12" width="2" height="9" fill="#18181b" />
        <path d="M 2,21 Q 2,27 8,27 L 8,24 Q 4,24 4,21 Z" fill="#7c2d12" />
        <rect x="7" y="27" width="1" height="2" fill="#22c55e" style={{ animation: "pulseOpacity 1.5s infinite alternate" }} />
      </g>
    </svg>
  );
}
