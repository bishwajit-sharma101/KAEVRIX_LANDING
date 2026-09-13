"use client";
import { HIGH_QUALITY_NOTE_1, HIGH_QUALITY_NOTE_2 } from "./studyNotesData";

export const MOCK_USER_PROFILE = {
  username: "TuringScholar",
  avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=TuringScholar&backgroundColor=transparent",
  selectedClass: "sigmagrinder",
  xp: 3450,
  level: 42,
  wins: 28,
  losses: 4,
  skills: [
    { name: "Frontend Architecture", xp: 1200, tier: "Master" },
    { name: "Asynchronous JavaScript", xp: 950, tier: "Expert" },
    { name: "State Management", xp: 800, tier: "Adept" },
    { name: "System Optimization", xp: 500, tier: "Adept" }
  ],
  cosmetics: {
    banner: "",
    avatarFrame: "",
    profileEffect: ""
  }
};

export const MOCK_APP_ROADMAP = {
  topic: "Full-Stack Web Architecture & Scalable Systems",
  goal: "Master Scalable Full-Stack Engineering",
  summary: "Comprehensive bespoke curriculum for high-performance software architecture.",
  totalVideosEstimated: 48,
  totalEstimatedHours: 18,
  version: 3,
  level1: {
    title: "Foundations",
    milestones: [
      {
        id: "m1",
        title: "Execution Context & Call Stack",
        description: "Master runtime execution context creation, lexical scope binding, and call stack evaluation.",
        searchQuery: "JavaScript Execution Context Call Stack tutorial",
        estimatedMinutes: 45,
        xpReward: 60,
        status: "completed",
        keyPoints: [
          "Creation phase vs Execution phase",
          "Scope chaining and lexical environment",
          "Call stack push/pop evaluation order"
        ],
        studyNotes: "### Execution Context & Call Stack\n\nJavaScript operates in two distinct phases:\n1. Creation Phase (Memory Allocation)\n2. Execution Phase (Line-by-line runtime)"
      },
      {
        id: "m2",
        title: "Closures & Memory Encapsulation",
        description: "Harness inner functions retaining outer lexical environments to construct private state.",
        searchQuery: "JavaScript Closures tutorial depth",
        estimatedMinutes: 50,
        xpReward: 80,
        status: "completed",
        keyPoints: [
          "Lexical environment retention after function returns",
          "Encapsulation and memoization patterns",
          "Avoiding memory leaks in long-lived closures"
        ],
        studyNotes: "### Closures\n\nA closure is the combination of a function bundled together with references to its surrounding state."
      },
      {
        id: "m3",
        title: "Prototype Inheritance & Object Models",
        description: "Master prototype delegation, __proto__, Object.create, and V8 hidden class shape transitions.",
        searchQuery: "JavaScript Prototype Inheritance V8 hidden classes",
        estimatedMinutes: 50,
        xpReward: 80,
        status: "completed",
        keyPoints: [
          "Prototype chain lookup delegation",
          "Hidden classes and inline caching in V8",
          "Object.create vs constructor prototypes"
        ],
        studyNotes: "### Prototype Chain\n\nObjects delegate property lookups upward through their prototype chain until null is reached."
      },
      {
        id: "m4",
        title: "Event Loop & Microtask Orchestration",
        description: "Demystify task queues, microtask priority, Promises, and the browser rendering pipeline.",
        searchQuery: "JavaScript Event Loop Microtasks tutorial",
        estimatedMinutes: 60,
        xpReward: 100,
        status: "completed",
        keyPoints: [
          "Microtask Queue vs Macrotask Queue",
          "Call stack starvation and rendering ticks",
          "Async/await syntactic sugar under the hood"
        ],
        studyNotes: "### The Event Loop\n\nMicrotasks are always drained completely before any macrotask runs."
      },
      {
        id: "m5",
        title: "Memory Lifecycle & Garbage Collection",
        description: "Mark-and-sweep GC algorithms, heap allocation graphs, and memory leak profiling.",
        searchQuery: "JavaScript Garbage Collection Memory Leaks Profiling",
        estimatedMinutes: 45,
        xpReward: 90,
        status: "active",
        keyPoints: [
          "Generational Garbage Collection (Young vs Old gen)",
          "Detached DOM tree memory leaks",
          "Chrome DevTools heap allocation timelines"
        ],
        studyNotes: "### Garbage Collection\n\nV8 uses a generational mark-and-sweep collector with Scavenge cycles for rapid memory recycling."
      },
      {
        id: "m6",
        title: "Asynchronous Streams & Reactive Patterns",
        description: "Generators, async iterables, readable/writable streams, and backpressure handling.",
        searchQuery: "Node.js Streams Backpressure Async Generators",
        estimatedMinutes: 55,
        xpReward: 100,
        status: "locked",
        keyPoints: [
          "Node.js Stream pipeline & highWaterMark",
          "Async iterators with for-await-of",
          "Backpressure flow control"
        ]
      },
      {
        id: "m7",
        title: "TypeScript Type System & Advanced Generics",
        description: "Conditional types, template literal types, distributive unions, and inferred return typing.",
        searchQuery: "TypeScript Advanced Generics Conditional Types",
        estimatedMinutes: 60,
        xpReward: 110,
        status: "locked",
        keyPoints: [
          "Conditional types with infer keyword",
          "Template literal string manipulation",
          "Mapped types and key remapping"
        ]
      },
      {
        id: "m8",
        title: "Syntax Sentinel (Boss Battle)",
        description: "Level 1 Capstone: Defeat the guardian of foundational runtime mechanics in turn-based combat.",
        searchQuery: "JavaScript Closures Scope Quiz",
        estimatedMinutes: 30,
        xpReward: 250,
        status: "locked"
      }
    ]
  },
  level2: {
    title: "Systems & Frameworks",
    milestones: [
      {
        id: "m9",
        title: "React Concurrent Mode & Fiber Reconciliation",
        description: "Virtual DOM diffing, lane priority scheduling, and interruptible rendering.",
        searchQuery: "React Fiber reconciliation concurrent mode tutorial",
        estimatedMinutes: 65,
        xpReward: 120,
        status: "locked",
        keyPoints: [
          "Reconciliation vs Rendering phases",
          "Fiber node linked lists and alternate trees",
          "Lane priority bitmasks"
        ]
      },
      {
        id: "m10",
        title: "Server-Side Rendering & Hydration Architecture",
        description: "Streaming SSR, React Server Components (RSC), selective hydration, and boundary suspense.",
        searchQuery: "React Server Components Streaming SSR Hydration",
        estimatedMinutes: 60,
        xpReward: 130,
        status: "locked",
        keyPoints: [
          "HTML stream pipelining",
          "Client/Server component boundary serialization",
          "Progressive hydration and selective resume"
        ]
      },
      {
        id: "m11",
        title: "State Machines & Predictable State Trees",
        description: "Finite state automata, hierarchical statecharts, and atomic store subscriptions.",
        searchQuery: "XState Finite State Machines React State Management",
        estimatedMinutes: 50,
        xpReward: 120,
        status: "locked",
        keyPoints: [
          "Eliminating impossible UI states with FSM",
          "Context, guards, and transition actions",
          "Subscribed selectors for fine-grained re-renders"
        ]
      },
      {
        id: "m12",
        title: "Network Protocols: HTTP/3, QUIC & WebSockets",
        description: "Multiplexing, head-of-line blocking avoidance, full-duplex socket frames, and connection migration.",
        searchQuery: "HTTP3 QUIC protocol WebSockets deep dive",
        estimatedMinutes: 65,
        xpReward: 140,
        status: "locked",
        keyPoints: [
          "UDP-based QUIC transport vs TCP handshake overhead",
          "0-RTT connection establishment",
          "WebSocket framing and heartbeat pings"
        ]
      },
      {
        id: "m13",
        title: "Database Query Optimization & Indexing Engines",
        description: "B-Trees, LSM-Trees, EXPLAIN ANALYZE execution plans, and composite indexing strategies.",
        searchQuery: "PostgreSQL Indexing B-Tree Query Optimization EXPLAIN",
        estimatedMinutes: 70,
        xpReward: 140,
        status: "locked",
        keyPoints: [
          "B-Tree index traversal and leaf scans",
          "Index only scans vs sequential heap scans",
          "Mitigating N+1 queries with dataloader batches"
        ]
      },
      {
        id: "m14",
        title: "Distributed Caching & Invalidation Patterns",
        description: "Cache stampede mitigation, Redis cluster topologies, and write-through persistence.",
        searchQuery: "Redis distributed caching pipelines system design",
        estimatedMinutes: 65,
        xpReward: 150,
        status: "locked",
        keyPoints: [
          "Cache stampede mitigation using mutex locks",
          "Redis pipeline latency reduction",
          "Cache invalidation patterns (Write-Through vs Cache-Aside)"
        ]
      },
      {
        id: "m15",
        title: "API Gateway Design & Resilient Routing",
        description: "Reverse proxies, rate limiting with token buckets, circuit breaking, and retry budgets.",
        searchQuery: "API Gateway Rate Limiting Token Bucket Circuit Breaker",
        estimatedMinutes: 55,
        xpReward: 140,
        status: "locked",
        keyPoints: [
          "Token bucket and sliding window rate limiters",
          "Circuit breaker state thresholds (Closed, Open, Half-Open)",
          "Idempotency keys on mutating endpoints"
        ]
      },
      {
        id: "m16",
        title: "Containerization & Cloud Native Packaging",
        description: "Multi-stage Docker builds, OCI images, layer caching, and lightweight runtimes.",
        searchQuery: "Docker Multi-stage Builds Containerization Best Practices",
        estimatedMinutes: 50,
        xpReward: 150,
        status: "locked",
        keyPoints: [
          "Multi-stage build pipelines for minimal attack surfaces",
          "Docker layer cache optimization",
          "Cgroups and namespace isolation"
        ]
      },
      {
        id: "m17",
        title: "Framework Overlord (Boss Battle)",
        description: "Level 2 Capstone: Overcome the multi-tier architectural boss battle across frontend and backend systems.",
        searchQuery: "React Fiber Architecture System Design Quiz",
        estimatedMinutes: 40,
        xpReward: 350,
        status: "locked"
      }
    ]
  },
  level3: {
    title: "Architecture & Mastery",
    milestones: [
      {
        id: "m18",
        title: "Microservices & Event-Driven Topologies",
        description: "Kafka/RabbitMQ message brokers, event sourcing, Saga distributed transactions, and idempotency.",
        searchQuery: "Event Driven Architecture Kafka Saga Pattern Microservices",
        estimatedMinutes: 75,
        xpReward: 180,
        status: "locked",
        keyPoints: [
          "Choreography vs Orchestration in Saga workflows",
          "Kafka partition keys and consumer group offsets",
          "Dead letter queues and reconciliation jobs"
        ]
      },
      {
        id: "m19",
        title: "High-Availability Data Partitioning & Sharding",
        description: "Consistent hashing rings, multi-region replication lag, quorum reads, and CAP theorem trade-offs.",
        searchQuery: "Database Sharding Consistent Hashing CAP Theorem",
        estimatedMinutes: 80,
        xpReward: 200,
        status: "locked",
        keyPoints: [
          "Consistent hashing with virtual nodes",
          "Master-replica failover and split-brain resolution",
          "Read repair and anti-entropy with Merkle trees"
        ]
      },
      {
        id: "m20",
        title: "Zero-Trust Security & Identity Infrastructure",
        description: "OAuth2.1 / OIDC PKCE handshakes, JWT rotation, asymmetric cryptographic keys, and mTLS.",
        searchQuery: "OAuth2 OIDC PKCE Zero Trust Security Architecture",
        estimatedMinutes: 70,
        xpReward: 180,
        status: "locked",
        keyPoints: [
          "Authorization Code flow with PKCE",
          "Asymmetric RS256 token verification via JWKS",
          "Mutual TLS between internal service meshes"
        ]
      },
      {
        id: "m21",
        title: "Observability, Distributed Tracing & Chaos Engineering",
        description: "OpenTelemetry spans, Prometheus metrics collectors, SLA/SLO budgets, and fault injection drills.",
        searchQuery: "OpenTelemetry Distributed Tracing Prometheus Chaos Engineering",
        estimatedMinutes: 75,
        xpReward: 200,
        status: "locked",
        keyPoints: [
          "Distributed context propagation with W3C Trace Context",
          "RED (Rate, Errors, Duration) metric instrumentation",
          "Chaos experiments for automated self-healing validation"
        ]
      },
      {
        id: "m22",
        title: "The Apex Architect (Supreme Capstone Battle)",
        description: "Final Master Trial: Prove your enterprise architectural supremacy in the ultimate system design arena.",
        searchQuery: "Distributed Systems High Scale Architecture Capstone",
        estimatedMinutes: 50,
        xpReward: 500,
        status: "locked"
      }
    ]
  }
};

export const MOCK_CURATED_VIDEOS = [
  {
    id: "Fd9EyG3J62U",
    videoId: "Fd9EyG3J62U",
    title: "How JavaScript Works: Under The Hood",
    channel: "ByteSize Tech",
    channelTitle: "ByteSize Tech",
    category: "Algorithms",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600",
    duration: 360,
    questions: [
      {
        question: "What manages function invocation order in JavaScript?",
        options: ["Call Stack (LIFO)", "Task Queue (FIFO)", "Web Audio Buffer", "Render Pipeline"],
        answerIndex: 0
      },
      {
        question: "Where are variables retained by closures allocated in memory?",
        options: ["CPU Cache", "Heap Memory", "Disk Swap", "Index Buffer"],
        answerIndex: 1
      },
      {
        question: "Which queue executes immediately after the current synchronous frame clears?",
        options: ["Macrotask Queue", "Microtask Queue", "Worker Pool", "Garbage Collector"],
        answerIndex: 1
      }
    ],
    inVideoQuestions: [
      {
        timestamp: 45,
        question: "Is the JavaScript call stack single-threaded or multi-threaded by default?",
        options: ["Single-threaded", "Multi-threaded", "Distributed"],
        answerIndex: 0
      }
    ]
  },
  {
    id: "FU4GQnz8L68",
    videoId: "FU4GQnz8L68",
    title: "System Design: Distributed Rate Limiting at Scale",
    channel: "System Design School",
    channelTitle: "System Design School",
    category: "System Design",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600",
    duration: 420,
    questions: [
      {
        question: "Which algorithm prevents burst traffic while allowing average steady rate?",
        options: ["Token Bucket", "Fixed Window Counter", "Round Robin", "Random Early Detection"],
        answerIndex: 0
      },
      {
        question: "What distributed datastore is most commonly used for sub-millisecond rate limiter state?",
        options: ["Redis Cluster", "PostgreSQL", "Apache Cassandra", "AWS S3 Glacier"],
        answerIndex: 0
      },
      {
        question: "What HTTP status code represents rate limit exhaustion?",
        options: ["403 Forbidden", "429 Too Many Requests", "503 Service Unavailable", "418 I'm a Teapot"],
        answerIndex: 1
      }
    ],
    inVideoQuestions: [
      {
        timestamp: 60,
        question: "What problem does the sliding window log have under massive traffic?",
        options: ["High memory footprint", "Loss of precision", "Cannot scale across CPUs"],
        answerIndex: 0
      }
    ]
  },
  {
    id: "8aGhZQkoFbQ",
    videoId: "8aGhZQkoFbQ",
    title: "Event Loop, Microtasks & Macrotasks Explained",
    channel: "Fireship Arena",
    channelTitle: "Fireship Arena",
    category: "Performance",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600",
    duration: 310,
    questions: [
      {
        question: "Which task type has higher priority: Promise.then or setTimeout(..., 0)?",
        options: ["Promise.then (Microtask)", "setTimeout (Macrotask)", "They have equal priority", "Depends on OS scheduler"],
        answerIndex: 0
      },
      {
        question: "When does the browser render UI changes during the event loop cycle?",
        options: ["Between event loop turns, after microtasks drain", "Synchronously on every variable assignment", "Only when requestIdleCallback fires", "Randomly every 100ms"],
        answerIndex: 0
      }
    ],
    inVideoQuestions: [
      {
        timestamp: 50,
        question: "Can an infinite microtask loop starve the browser rendering thread?",
        options: ["Yes, completely hangs rendering", "No, browsers cap microtasks", "Only in Firefox"],
        answerIndex: 0
      }
    ]
  },
  {
    id: "T8TZQ6k4SLE",
    videoId: "T8TZQ6k4SLE",
    title: "React Server Components & Next.js Architecture",
    channel: "Frontend Masters",
    channelTitle: "Frontend Masters",
    category: "Frontend",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600",
    duration: 480,
    questions: [
      {
        question: "Do React Server Components ship JavaScript bundle code to the browser?",
        options: ["No, only HTML and serialized payload", "Yes, entire component JS", "Only if client requests it", "Only in development mode"],
        answerIndex: 0
      },
      {
        question: "What directive marks a component boundary for client-side interactivity?",
        options: ["'use client'", "'use interactive'", "'use dom'", "'client side'"],
        answerIndex: 0
      }
    ],
    inVideoQuestions: [
      {
        timestamp: 75,
        question: "Can Server Components directly query backend databases securely?",
        options: ["Yes, code never leaks to client", "No, requires REST API", "Only via GraphQL"],
        answerIndex: 0
      }
    ]
  },
  {
    id: "s7v_0P_u9kY",
    videoId: "s7v_0P_u9kY",
    title: "Linux Kernel Networking: Zero-Copy & eBPF Deep Dive",
    channel: "Kernel Command",
    channelTitle: "Kernel Command",
    category: "Kernel",
    thumbnail: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600",
    duration: 540,
    questions: [
      {
        question: "What syscall transfers data between file descriptors without user space copying?",
        options: ["sendfile()", "read() then write()", "fork()", "select()"],
        answerIndex: 0
      },
      {
        question: "What safety mechanism guarantees eBPF programs cannot crash the Linux kernel?",
        options: ["In-kernel Static Verifier", "Hardware Watchdog", "Linux Sandbox container", "SELinux policy"],
        answerIndex: 0
      }
    ]
  },
  {
    id: "5k_3q8Z3nF8",
    videoId: "5k_3q8Z3nF8",
    title: "WebSockets vs HTTP/3 vs gRPC Protocol Showdown",
    channel: "Protocol Engine",
    channelTitle: "Protocol Engine",
    category: "Networking",
    thumbnail: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600",
    duration: 390,
    questions: [
      {
        question: "Which transport protocol does HTTP/3 operate on to eliminate head-of-line blocking?",
        options: ["QUIC (UDP)", "TCP with TLS 1.3", "SCTP", "Raw IP Datagrams"],
        answerIndex: 0
      },
      {
        question: "What serialization format is standard for gRPC Remote Procedure Calls?",
        options: ["Protocol Buffers (Protobuf)", "JSON schema", "MessagePack", "XML SOAP"],
        answerIndex: 0
      }
    ]
  },
  {
    id: "-qNSXK7sWW4",
    videoId: "-qNSXK7sWW4",
    title: "Database Indexing, B-Trees & LSM Trees In Depth",
    channel: "Data Engine HQ",
    channelTitle: "Data Engine HQ",
    category: "Database",
    thumbnail: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600",
    duration: 450,
    questions: [
      {
        question: "Why are B+ Trees preferred over Binary Search Trees for on-disk database indexes?",
        options: ["High fanout minimizes slow disk I/O page reads", "Simpler to balance in RAM", "Always uses less storage space", "Requires no concurrency locking"],
        answerIndex: 0
      },
      {
        question: "Which tree structure optimizes write-heavy workloads using append-only logs?",
        options: ["LSM Tree (Log-Structured Merge-tree)", "B-Tree", "Red-Black Tree", "AVL Tree"],
        answerIndex: 0
      }
    ]
  },
  {
    id: "x9Jpx_M8yq4",
    videoId: "x9Jpx_M8yq4",
    title: "Memory Leaks, V8 Heap Profiling & GC Optimization",
    channel: "Performance Lab",
    channelTitle: "Performance Lab",
    category: "Performance",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
    duration: 380,
    questions: [
      {
        question: "What V8 garbage collection algorithm sweeps and compacts long-lived objects?",
        options: ["Major GC (Mark-Sweep-Compact)", "Minor GC (Scavenger)", "Reference Counter", "Stop-the-World Pager"],
        answerIndex: 0
      },
      {
        question: "What causes unintentional memory leaks in single-page web applications?",
        options: ["Forgotten event listeners & closure references", "Using const instead of var", "Overriding Math.random()", "Too many CSS media queries"],
        answerIndex: 0
      }
    ]
  }
];

export const SUBTOPIC_VIDEOS = {
  garbage_collection: [
    {
      id: "v8-gc-01",
      videoId: "v8-gc-01",
      title: "Generational Garbage Collection: Young vs Old Generation Deep Dive",
      channel: "V8 Internals & Compilers",
      channelTitle: "V8 Internals & Compilers",
      category: "Core Tutorial",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600",
      duration: 380,
      questions: [
        {
          question: "What algorithm does V8's Scavenger use to rapidly collect young-generation memory?",
          options: ["Cheney's Copying Algorithm (Semi-Space)", "Reference Counting", "Manual Free List", "Mark-Sweep-Compact"],
          answerIndex: 0
        },
        {
          question: "When does an object in V8 get promoted from Young Generation to Old Generation?",
          options: ["After surviving two scavenge cycles", "Immediately upon allocation", "When it exceeds 10MB", "Only when browser restarts"],
          answerIndex: 0
        }
      ]
    },
    {
      id: "v8-gc-02",
      videoId: "v8-gc-02",
      title: "V8 Scavenger (Minor GC) vs Major GC: Mark-Sweep, Compact & Concurrent Sweeping",
      channel: "Node.js Core Diagnostics",
      channelTitle: "Node.js Core Diagnostics",
      category: "Core Tutorial",
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
      duration: 430,
      questions: [
        {
          question: "Why does Major GC take significantly longer than Scavenger (Minor GC)?",
          options: ["It must traverse and mark the entire pointer graph in old space", "It runs on a separate CPU thread without memory access", "It deletes all active closures", "It recompiles JavaScript bytecode"],
          answerIndex: 0
        }
      ]
    },
    {
      id: "v8-gc-03",
      videoId: "v8-gc-03",
      title: "Chrome DevTools Heap Timelines: Catching Detached DOM & GC Spikes",
      channel: "Performance Lab",
      channelTitle: "Performance Lab",
      category: "Pro Tips",
      thumbnail: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600",
      duration: 490,
      questions: [
        {
          question: "What causes a detached DOM tree to remain retained in memory?",
          options: ["A JavaScript variable or listener still references a child node", "CSS animation running indefinitely", "HTML5 audio element in background", "Excessive localStorage keys"],
          answerIndex: 0
        }
      ]
    },
    {
      id: "v8-gc-04",
      videoId: "v8-gc-04",
      title: "WeakRef, FinalizationRegistry & Surviving Generation Shifts in V8",
      channel: "Advanced JS Architecture",
      channelTitle: "Advanced JS Architecture",
      category: "Conceptual Deep Dives",
      thumbnail: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600",
      duration: 360,
      questions: [
        {
          question: "What is the primary danger of relying on FinalizationRegistry for critical cleanup?",
          options: ["GC timing is non-deterministic and cleanup callbacks are never guaranteed to run promptly", "It blocks the main thread", "It only works in Node.js", "It triggers memory corruption"],
          answerIndex: 0
        }
      ]
    },
    {
      id: "v8-gc-05",
      videoId: "v8-gc-05",
      title: "Eliminating GC Pauses & Stop-the-World Jank in High-Throughput Node Services",
      channel: "Systems Engineering HQ",
      channelTitle: "Systems Engineering HQ",
      category: "Hacks & Tricks",
      thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600",
      duration: 470,
      questions: [
        {
          question: "Which V8 flag enables incremental marking to break down stop-the-world pauses?",
          options: ["--harmony / Incremental Marking (enabled by default)", "--no-gc", "--expose-gc", "--max-old-space-size=0"],
          answerIndex: 0
        }
      ]
    }
  ]
};

export const MOCK_LEADERBOARD = [
  {
    username: "AdaLovelace",
    xp: 18450,
    level: 94,
    class: "brainiac",
    selectedClass: "brainiac",
    rank: "Legendary Scholar",
    wins: 112,
    losses: 9,
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=AdaLovelace&backgroundColor=transparent",
    globalRank: 1,
    cosmetics: { banner: "none", avatarFrame: "pixel-crown", profileEffect: "pixel-retro" },
    skills: [
      { name: "Algorithmic Computation", xp: 4850, tier: "Legend" },
      { name: "Compiler Theory & Grammars", xp: 4120, tier: "Legend" },
      { name: "Analytical Engine Logic", xp: 3600, tier: "Master" },
      { name: "Recursive Combinatorics", xp: 2950, tier: "Master" }
    ]
  },
  {
    username: "QuantumLeap",
    xp: 15820,
    level: 88,
    class: "streamsniper",
    selectedClass: "streamsniper",
    rank: "Kernel Commander",
    wins: 96,
    losses: 14,
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=QuantumLeap&backgroundColor=transparent",
    globalRank: 2,
    cosmetics: { banner: "https://images.unsplash.com/photo-1620802051772-52055660890c?w=800", avatarFrame: "kawaii-clouds", profileEffect: "magical-girl" },
    skills: [
      { name: "Quantum Cryptography", xp: 4100, tier: "Legend" },
      { name: "Zero-Copy Linux Networking", xp: 3450, tier: "Master" },
      { name: "Distributed Raft Consensus", xp: 2890, tier: "Master" },
      { name: "eBPF Kernel Probing", xp: 2300, tier: "Expert" }
    ]
  },
  {
    username: "NeonValkyrie",
    xp: 13400,
    level: 81,
    class: "glitchmancer",
    selectedClass: "glitchmancer",
    rank: "System Architect",
    wins: 84,
    losses: 12,
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=NeonValkyrie&backgroundColor=transparent",
    globalRank: 3,
    cosmetics: { banner: "none", avatarFrame: "rage-aura", profileEffect: "rage" },
    skills: [
      { name: "WebGL Fragment Shaders", xp: 3800, tier: "Legend" },
      { name: "Binary Disassembly & Hex", xp: 3150, tier: "Master" },
      { name: "Real-Time WebSocket Fabric", xp: 2600, tier: "Master" },
      { name: "Memory Corruption Defense", xp: 1980, tier: "Expert" }
    ]
  },
  {
    username: "CyberRonin",
    xp: 11650,
    level: 74,
    class: "speedrunner",
    selectedClass: "speedrunner",
    rank: "V8 Blade Master",
    wins: 76,
    losses: 19,
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=CyberRonin&backgroundColor=transparent",
    globalRank: 4,
    cosmetics: { banner: "", avatarFrame: "", profileEffect: "" },
    skills: [
      { name: "Event Loop Latency Tuning", xp: 3300, tier: "Master" },
      { name: "V8 Bytecode Optimization", xp: 2750, tier: "Master" },
      { name: "High-Throughput Coroutines", xp: 2150, tier: "Expert" },
      { name: "Micro-benchmarking", xp: 1600, tier: "Expert" }
    ]
  },
  {
    username: "KernelPanic",
    xp: 9920,
    level: 68,
    class: "sigmagrinder",
    selectedClass: "sigmagrinder",
    rank: "Pipeline Marshal",
    wins: 65,
    losses: 21,
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=KernelPanic&backgroundColor=transparent",
    globalRank: 5,
    cosmetics: { banner: "", avatarFrame: "", profileEffect: "" },
    skills: [
      { name: "POSIX Multithreading", xp: 2950, tier: "Master" },
      { name: "Memory Paging & MMU", xp: 2400, tier: "Expert" },
      { name: "Cache Line Alignment", xp: 1850, tier: "Expert" },
      { name: "Syscall Interception", xp: 1350, tier: "Adept" }
    ]
  },
  {
    username: "ByteSamurai",
    xp: 8740,
    level: 63,
    class: "sigmagrinder",
    selectedClass: "sigmagrinder",
    rank: "Async Operative",
    wins: 58,
    losses: 16,
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ByteSamurai&backgroundColor=transparent",
    globalRank: 6,
    cosmetics: { banner: "", avatarFrame: "", profileEffect: "" },
    skills: [
      { name: "Lock-Free Ring Buffers", xp: 2650, tier: "Master" },
      { name: "SIMD Vector Instructions", xp: 2150, tier: "Expert" },
      { name: "gRPC Streaming Protocols", xp: 1620, tier: "Expert" },
      { name: "B-Tree Database Internals", xp: 1180, tier: "Adept" }
    ]
  },
  {
    username: "ZeroDay",
    xp: 7450,
    level: 57,
    class: "vibechecker",
    selectedClass: "vibechecker",
    rank: "Microtask Specialist",
    wins: 51,
    losses: 22,
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ZeroDay&backgroundColor=transparent",
    globalRank: 7,
    cosmetics: { banner: "", avatarFrame: "", profileEffect: "" },
    skills: [
      { name: "Web Application Pen-Testing", xp: 2350, tier: "Expert" },
      { name: "Zero Trust Architecture", xp: 1820, tier: "Expert" },
      { name: "OAuth2 & JWT Mechanics", xp: 1450, tier: "Adept" },
      { name: "CSRF & XSS Mitigation", xp: 980, tier: "Adept" }
    ]
  },
  {
    username: "PixelKnight",
    xp: 6830,
    level: 52,
    class: "doomscroller",
    selectedClass: "doomscroller",
    rank: "Video Inspector",
    wins: 47,
    losses: 19,
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=PixelKnight&backgroundColor=transparent",
    globalRank: 8,
    cosmetics: { banner: "", avatarFrame: "", profileEffect: "" },
    skills: [
      { name: "Canvas 2D Rendering Engine", xp: 2150, tier: "Expert" },
      { name: "GPU Compositing Pipelines", xp: 1680, tier: "Expert" },
      { name: "Sprite Sheet Atlas Packing", xp: 1220, tier: "Adept" },
      { name: "60 FPS Render Loop Health", xp: 820, tier: "Novice" }
    ]
  },
  {
    username: "SynapseGhost",
    xp: 5980,
    level: 48,
    class: "glitchmancer",
    selectedClass: "glitchmancer",
    rank: "Neural Phantom",
    wins: 42,
    losses: 17,
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=SynapseGhost&backgroundColor=transparent",
    globalRank: 9,
    cosmetics: { banner: "", avatarFrame: "", profileEffect: "" },
    skills: [
      { name: "Neural Network Inference", xp: 1950, tier: "Expert" },
      { name: "Tensor Core Matrix Ops", xp: 1520, tier: "Adept" },
      { name: "Multi-Head Attention Layers", xp: 1140, tier: "Adept" },
      { name: "Vector Embeddings & Search", xp: 760, tier: "Novice" }
    ]
  },
  {
    username: "TuringScholar",
    xp: 3450,
    level: 42,
    class: "sigmagrinder",
    selectedClass: "sigmagrinder",
    rank: "Turing Scholar",
    wins: 28,
    losses: 4,
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=TuringScholar&backgroundColor=transparent",
    globalRank: 10,
    cosmetics: { banner: "", avatarFrame: "", profileEffect: "" },
    skills: [
      { name: "Frontend Architecture", xp: 1200, tier: "Master" },
      { name: "Asynchronous JavaScript", xp: 950, tier: "Expert" },
      { name: "State Management", xp: 800, tier: "Adept" },
      { name: "System Optimization", xp: 500, tier: "Adept" }
    ]
  },
  {
    username: "NullPointer",
    xp: 3120,
    level: 39,
    class: "edgelord",
    selectedClass: "edgelord",
    rank: "Syntax Striker",
    wins: 26,
    losses: 18,
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=NullPointer&backgroundColor=transparent",
    globalRank: 11,
    cosmetics: { banner: "", avatarFrame: "", profileEffect: "" },
    skills: [
      { name: "Pointer Arithmetic & Offsets", xp: 1650, tier: "Expert" },
      { name: "Memory Leak Diagnostics", xp: 1300, tier: "Adept" },
      { name: "Stack Trace Unwinding", xp: 980, tier: "Adept" },
      { name: "Segfault Post-Mortem", xp: 620, tier: "Novice" }
    ]
  },
  {
    username: "StackOverflow",
    xp: 2890,
    level: 36,
    class: "gachaaddict",
    selectedClass: "gachaaddict",
    rank: "Buffer Sentinel",
    wins: 23,
    losses: 16,
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=StackOverflow&backgroundColor=transparent",
    globalRank: 12,
    cosmetics: { banner: "", avatarFrame: "", profileEffect: "" },
    skills: [
      { name: "Call Stack Profiling", xp: 1550, tier: "Expert" },
      { name: "Recursion Depth Control", xp: 1200, tier: "Adept" },
      { name: "V8 Heap Snapshot Diffs", xp: 850, tier: "Adept" },
      { name: "Garbage Collection Tracing", xp: 540, tier: "Novice" }
    ]
  },
  {
    username: "HexOverlord",
    xp: 2650,
    level: 33,
    class: "brainiac",
    selectedClass: "brainiac",
    rank: "Byte Alchemist",
    wins: 21,
    losses: 14,
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=HexOverlord&backgroundColor=transparent",
    globalRank: 13,
    cosmetics: { banner: "", avatarFrame: "", profileEffect: "" },
    skills: [
      { name: "Hexadecimal Decompilation", xp: 1450, tier: "Adept" },
      { name: "Endianness & Byte Swapping", xp: 1100, tier: "Adept" },
      { name: "IEEE 754 Floating Point", xp: 800, tier: "Novice" },
      { name: "Bitwise Mask Operations", xp: 510, tier: "Novice" }
    ]
  },
  {
    username: "BitDrifter",
    xp: 2340,
    level: 30,
    class: "speedrunner",
    selectedClass: "speedrunner",
    rank: "Packet Courier",
    wins: 19,
    losses: 15,
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=BitDrifter&backgroundColor=transparent",
    globalRank: 14,
    cosmetics: { banner: "", avatarFrame: "", profileEffect: "" },
    skills: [
      { name: "TCP Sliding Window Tuning", xp: 1350, tier: "Adept" },
      { name: "Packet Congestion Avoidance", xp: 1020, tier: "Adept" },
      { name: "UDP Datagram Streaming", xp: 760, tier: "Novice" },
      { name: "Network Jitter Buffering", xp: 480, tier: "Novice" }
    ]
  },
  {
    username: "VaporWave",
    xp: 2100,
    level: 28,
    class: "vibechecker",
    selectedClass: "vibechecker",
    rank: "Resonance Warden",
    wins: 18,
    losses: 16,
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=VaporWave&backgroundColor=transparent",
    globalRank: 15,
    cosmetics: { banner: "", avatarFrame: "", profileEffect: "" },
    skills: [
      { name: "Web Audio API Synthesis", xp: 1250, tier: "Adept" },
      { name: "Audio Buffer FFT Analysis", xp: 950, tier: "Adept" },
      { name: "Oscillator Node Modeling", xp: 700, tier: "Novice" },
      { name: "Biquad Filter Modulation", xp: 450, tier: "Novice" }
    ]
  },
  {
    username: "GlitchHop",
    xp: 1890,
    level: 25,
    class: "glitchmancer",
    selectedClass: "glitchmancer",
    rank: "Frequency Hacker",
    wins: 16,
    losses: 13,
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=GlitchHop&backgroundColor=transparent",
    globalRank: 16,
    cosmetics: { banner: "", avatarFrame: "", profileEffect: "" },
    skills: [
      { name: "AST Node Mutation", xp: 1150, tier: "Adept" },
      { name: "WebAssembly Emscripten", xp: 880, tier: "Adept" },
      { name: "Source Map Rehydration", xp: 640, tier: "Novice" },
      { name: "Dynamic Bytecode Eval", xp: 410, tier: "Novice" }
    ]
  },
  {
    username: "CryptoMonk",
    xp: 1650,
    level: 23,
    class: "sigmagrinder",
    selectedClass: "sigmagrinder",
    rank: "Cipher Ascetic",
    wins: 15,
    losses: 12,
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=CryptoMonk&backgroundColor=transparent",
    globalRank: 17,
    cosmetics: { banner: "", avatarFrame: "", profileEffect: "" },
    skills: [
      { name: "SHA-256 Merkle Verification", xp: 1050, tier: "Adept" },
      { name: "Elliptic Curve Math", xp: 820, tier: "Adept" },
      { name: "Constant-Time Comparison", xp: 590, tier: "Novice" },
      { name: "Cryptographic Entropy", xp: 380, tier: "Novice" }
    ]
  },
  {
    username: "ShadowThread",
    xp: 1420,
    level: 21,
    class: "streamsniper",
    selectedClass: "streamsniper",
    rank: "Daemon Stalker",
    wins: 13,
    losses: 11,
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ShadowThread&backgroundColor=transparent",
    globalRank: 18,
    cosmetics: { banner: "", avatarFrame: "", profileEffect: "" },
    skills: [
      { name: "Linux Daemon Lifecycle", xp: 950, tier: "Adept" },
      { name: "Zombie Process Reaping", xp: 740, tier: "Novice" },
      { name: "Named Pipes & UNIX Sockets", xp: 520, tier: "Novice" },
      { name: "IPC Shared Memory", xp: 340, tier: "Novice" }
    ]
  },
  {
    username: "EchoProtocol",
    xp: 1240,
    level: 19,
    class: "npc",
    selectedClass: "npc",
    rank: "Recursive Echo",
    wins: 12,
    losses: 14,
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=EchoProtocol&backgroundColor=transparent",
    globalRank: 19,
    cosmetics: { banner: "", avatarFrame: "", profileEffect: "" },
    skills: [
      { name: "WebSocket Subprotocols", xp: 850, tier: "Adept" },
      { name: "Exponential Reconnect Backoff", xp: 660, tier: "Novice" },
      { name: "Ping/Pong Heartbeat Loops", xp: 470, tier: "Novice" },
      { name: "Binary Frame Masking", xp: 300, tier: "Novice" }
    ]
  },
  {
    username: "RubyRedux",
    xp: 1080,
    level: 17,
    class: "edgelord",
    selectedClass: "edgelord",
    rank: "State Disruptor",
    wins: 11,
    losses: 10,
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=RubyRedux&backgroundColor=transparent",
    globalRank: 20,
    cosmetics: { banner: "", avatarFrame: "", profileEffect: "" },
    skills: [
      { name: "Immutable Structural Sharing", xp: 780, tier: "Novice" },
      { name: "Middleware Pipeline Action", xp: 590, tier: "Novice" },
      { name: "Time-Travel State Diffing", xp: 420, tier: "Novice" },
      { name: "Pure Reducer Composition", xp: 270, tier: "Novice" }
    ]
  },
  {
    username: "ArcadeSam",
    xp: 920,
    level: 15,
    class: "gachaaddict",
    selectedClass: "gachaaddict",
    rank: "Token Hoarder",
    wins: 9,
    losses: 12,
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ArcadeSam&backgroundColor=transparent",
    globalRank: 21,
    cosmetics: { banner: "", avatarFrame: "", profileEffect: "" },
    skills: [
      { name: "AABB Collision Detection", xp: 700, tier: "Novice" },
      { name: "Gamepad API Polling", xp: 530, tier: "Novice" },
      { name: "Audio Sprite Playback", xp: 370, tier: "Novice" },
      { name: "Tilemap Matrix Traversal", xp: 240, tier: "Novice" }
    ]
  },
  {
    username: "LazyCompiler",
    xp: 780,
    level: 14,
    class: "doomscroller",
    selectedClass: "doomscroller",
    rank: "JIT Slacker",
    wins: 8,
    losses: 11,
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=LazyCompiler&backgroundColor=transparent",
    globalRank: 22,
    cosmetics: { banner: "", avatarFrame: "", profileEffect: "" },
    skills: [
      { name: "Rollup Tree Shaking", xp: 620, tier: "Novice" },
      { name: "ESM Dynamic Import Graphs", xp: 460, tier: "Novice" },
      { name: "Dead Code Elimination", xp: 320, tier: "Novice" },
      { name: "Chunk Splitting Strategy", xp: 210, tier: "Novice" }
    ]
  },
  {
    username: "BinaryBlaze",
    xp: 640,
    level: 12,
    class: "speedrunner",
    selectedClass: "speedrunner",
    rank: "Overclocked Spark",
    wins: 7,
    losses: 9,
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=BinaryBlaze&backgroundColor=transparent",
    globalRank: 23,
    cosmetics: { banner: "", avatarFrame: "", profileEffect: "" },
    skills: [
      { name: "Bitwise Shifts & Rotation", xp: 540, tier: "Novice" },
      { name: "Two's Complement Arithmetic", xp: 390, tier: "Novice" },
      { name: "Hamming Weight Counting", xp: 270, tier: "Novice" },
      { name: "Binary XOR Swapping", xp: 180, tier: "Novice" }
    ]
  },
  {
    username: "KronoShift",
    xp: 510,
    level: 10,
    class: "brainiac",
    selectedClass: "brainiac",
    rank: "Temporal Debugger",
    wins: 5,
    losses: 8,
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=KronoShift&backgroundColor=transparent",
    globalRank: 24,
    cosmetics: { banner: "", avatarFrame: "", profileEffect: "" },
    skills: [
      { name: "Performance.now() Timers", xp: 450, tier: "Novice" },
      { name: "Microtask Queue Order", xp: 320, tier: "Novice" },
      { name: "Throttle & Debounce Decorators", xp: 220, tier: "Novice" },
      { name: "RequestIdleCallback Usage", xp: 140, tier: "Novice" }
    ]
  },
  {
    username: "RookieNova",
    xp: 320,
    level: 7,
    class: "npc",
    selectedClass: "npc",
    rank: "Binge Cadet",
    wins: 3,
    losses: 7,
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=RookieNova&backgroundColor=transparent",
    globalRank: 25,
    cosmetics: { banner: "", avatarFrame: "", profileEffect: "" },
    skills: [
      { name: "HTML5 Semantic Structure", xp: 320, tier: "Novice" },
      { name: "CSS Box Model Calculation", xp: 220, tier: "Novice" },
      { name: "DOM QuerySelectors", xp: 150, tier: "Novice" },
      { name: "Console Log Debugging", xp: 90, tier: "Novice" }
    ]
  }
];

let originalFetch = null;

export function installMockInterceptor() {
  if (typeof window === "undefined") return;
  if (originalFetch) return; // Already installed

  originalFetch = window.fetch;

  window.fetch = async function (input, init = {}) {
    const url = typeof input === "string" ? input : input?.url || "";

    // Intercept all /api/ endpoints to supply instant high-quality dummy responses
    if (url.includes("/api/")) {
      const pathname = url.split("?")[0];

      // 1. Feature Gates (Unlock Arena / Clash)
      if (pathname.endsWith("/api/config/features")) {
        return new Response(JSON.stringify({
          CLASH_DISABLED: false,
          PATHFINDER_DISABLED: false,
          CHRONOS_DISABLED: false,
          HISTORY_DISABLED: false,
          COMMUNITY_DISABLED: false,
          RANKINGS_DISABLED: false,
          PROFILE_DISABLED: false
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      // 2. Auth Verify & Login
      if (pathname.endsWith("/api/auth/verify") || pathname.endsWith("/api/auth/login")) {
        return new Response(JSON.stringify({
          token: "kaevrix_demo_token_2026",
          user: MOCK_USER_PROFILE
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      // 3. Auth Refresh
      if (pathname.endsWith("/api/auth/refresh")) {
        return new Response(JSON.stringify({
          token: "kaevrix_demo_token_2026"
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      // 4. Curated Videos
      if (pathname.endsWith("/api/curated-videos")) {
        const pool = [...(SUBTOPIC_VIDEOS?.garbage_collection || []), ...MOCK_CURATED_VIDEOS];
        return new Response(JSON.stringify(pool), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      // 5. Leaderboard
      if (pathname.endsWith("/api/leaderboard")) {
        return new Response(JSON.stringify(MOCK_LEADERBOARD), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      // 6. Pathfinder generate & jobs
      if (pathname.endsWith("/api/pathfinder/generate")) {
        return new Response(JSON.stringify({
          jobId: "demo_job_123"
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      if (pathname.includes("/api/jobs/")) {
        return new Response(JSON.stringify({
          status: "completed",
          result: MOCK_APP_ROADMAP
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      // 7. Study notes
      if (pathname.endsWith("/api/pathfinder/study-notes")) {
        let noteContent = HIGH_QUALITY_NOTE_1;
        try {
          if (init?.body) {
            const parsed = typeof init.body === "string" ? JSON.parse(init.body) : init.body;
            const contextText = `${parsed.videoTitle || ""} ${parsed.topic || ""} ${parsed.milestone?.title || ""}`.toLowerCase();
            if (contextText.includes("closure") || contextText.includes("memory") || contextText.includes("encapsulation")) {
              noteContent = HIGH_QUALITY_NOTE_2;
            } else {
              noteContent = HIGH_QUALITY_NOTE_1;
            }
          }
        } catch (e) {}

        return new Response(JSON.stringify({
          notes: noteContent
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      // 8. Quiz generate
      if (pathname.endsWith("/api/quiz/generate")) {
        return new Response(JSON.stringify({
          questions: [
            {
              question: "What data structure models synchronous JavaScript function calls?",
              options: ["Call Stack (LIFO)", "Message Queue (FIFO)", "Hash Map", "Binary Search Tree"],
              answerIndex: 0,
              timestamp: 30
            },
            {
              question: "Which queue executes immediately after the active synchronous stack clears?",
              options: ["Macrotask Queue", "Microtask Queue (Promises)", "Rendering Pipeline", "Garbage Collection Queue"],
              answerIndex: 1,
              timestamp: 120
            }
          ]
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      // 9. Community discover & friends
      if (pathname.includes("/api/community/friends")) {
        return new Response(JSON.stringify({ friends: [], incomingRequests: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }

      if (pathname.includes("/api/community/discover")) {
        const urlObj = new URL(url, "http://localhost:3000");
        const filter = (urlObj.searchParams.get("filter") || "").toLowerCase().trim();
        const players = MOCK_LEADERBOARD;
        const result = filter ? players.filter(p => p.username.toLowerCase().includes(filter)) : players;
        return new Response(JSON.stringify(result), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      // 10. Chat messages
      if (pathname.includes("/api/chat/messages/")) {
        return new Response(JSON.stringify([
          { id: "1", sender: "CyberRonin", receiver: "TuringScholar", content: "Did you clear the Syntax Sentinel boss yet?", timestamp: new Date(Date.now() - 300000).toISOString() },
          { id: "2", sender: "TuringScholar", receiver: "CyberRonin", content: "Working through the lexical scope milestones right now!", timestamp: new Date(Date.now() - 120000).toISOString() }
        ]), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      // 10.5 Profile cosmetics update
      if (pathname.includes("/api/profile/cosmetics") && init?.method === "POST") {
        try {
          const body = typeof init.body === "string" ? JSON.parse(init.body) : {};
          if (body.profileEffect !== undefined || body.avatarFrame !== undefined || body.banner !== undefined) {
            MOCK_USER_PROFILE.cosmetics = {
              banner: body.banner !== undefined ? body.banner : (MOCK_USER_PROFILE.cosmetics?.banner || ""),
              avatarFrame: body.avatarFrame !== undefined ? body.avatarFrame : (MOCK_USER_PROFILE.cosmetics?.avatarFrame || ""),
              profileEffect: body.profileEffect !== undefined ? body.profileEffect : (MOCK_USER_PROFILE.cosmetics?.profileEffect || "")
            };
          }
        } catch (e) {}
        return new Response(JSON.stringify({ success: true, cosmetics: MOCK_USER_PROFILE.cosmetics }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }

      // 11. Profile
      if (pathname.includes("/api/profile/")) {
        const rawTarget = pathname.split("/").pop();
        const targetUsername = decodeURIComponent(rawTarget || "");
        if (targetUsername === "cosmetics") {
          return new Response(JSON.stringify({ success: true, cosmetics: MOCK_USER_PROFILE.cosmetics }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }
        
        // If current user
        if (targetUsername.toLowerCase() === "turingscholar") {
          return new Response(JSON.stringify({
            ...MOCK_USER_PROFILE,
            globalRank: 10
          }), { status: 200, headers: { "Content-Type": "application/json" } });
        }

        const foundIndex = MOCK_LEADERBOARD.findIndex(p => p.username.toLowerCase() === targetUsername.toLowerCase());
        if (foundIndex !== -1) {
          const found = MOCK_LEADERBOARD[foundIndex];
          return new Response(JSON.stringify({
            username: found.username,
            level: found.level,
            xp: found.xp,
            wins: found.wins,
            losses: found.losses,
            selectedClass: found.selectedClass || found.class,
            avatar: found.avatar,
            rank: found.rank,
            globalRank: found.globalRank || foundIndex + 1,
            cosmetics: found.cosmetics || { banner: "", avatarFrame: "", profileEffect: "" },
            skills: found.skills || []
          }), { status: 200, headers: { "Content-Type": "application/json" } });
        }
        const profile = MOCK_USER_PROFILE;
        return new Response(JSON.stringify(profile), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      // 12. Search endpoint
      if (pathname.endsWith("/api/search")) {
        const urlObj = new URL(url, "http://localhost:3000");
        const q = (urlObj.searchParams.get("q") || "").toLowerCase().trim();
        
        // If searching for garbage collection / generational memory topics
        const isGarbageTopic = q.includes("garbage") || 
                               q.includes("generation") || 
                               q.includes("young") || 
                               q.includes("old gen") || 
                               q.includes("memory") || 
                               q.includes("lifecycle") || 
                               q.includes("v8") || 
                               q.includes("scavenger") || 
                               q.includes("heap");

        if (isGarbageTopic && SUBTOPIC_VIDEOS?.garbage_collection) {
          return new Response(JSON.stringify(SUBTOPIC_VIDEOS.garbage_collection), { 
            status: 200, 
            headers: { "Content-Type": "application/json" } 
          });
        }

        const allAvailable = [...(SUBTOPIC_VIDEOS?.garbage_collection || []), ...MOCK_CURATED_VIDEOS];
        const matches = q
          ? allAvailable.filter(v => 
              v.title.toLowerCase().includes(q) || 
              v.category?.toLowerCase().includes(q) || 
              v.channel?.toLowerCase().includes(q)
            )
          : allAvailable;
        const result = matches.length > 0 ? matches : (SUBTOPIC_VIDEOS?.garbage_collection || MOCK_CURATED_VIDEOS);
        return new Response(JSON.stringify(result), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      // 13. Personalized Feed
      if (pathname.endsWith("/api/personalized-feed")) {
        const feedVideos = [...(SUBTOPIC_VIDEOS?.garbage_collection || []), ...MOCK_CURATED_VIDEOS];
        return new Response(JSON.stringify({
          videos: feedVideos
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      // 14. Solo XP Reward
      if (pathname.endsWith("/api/solo-xp")) {
        let earned = 50;
        try {
          const body = typeof init?.body === "string" ? JSON.parse(init.body) : {};
          earned = body.xpEarned || 50;
        } catch(e) {}
        MOCK_USER_PROFILE.xp += earned;
        return new Response(JSON.stringify({
          success: true,
          xp: MOCK_USER_PROFILE.xp,
          level: MOCK_USER_PROFILE.level,
          leveledUp: false
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      // Fallback 200 JSON
      return new Response(JSON.stringify({ status: "ok", success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    return originalFetch(input, init);
  };
}

export function uninstallMockInterceptor() {
  if (originalFetch && typeof window !== "undefined") {
    window.fetch = originalFetch;
    originalFetch = null;
  }
}
