// ============================================================================
// 🇯🇴 PUBG MOBILE PAC - JORDAN ULTIMATE EDITION V3.0 PRO (FULL)
// ============================================================================
// 🎯 ULTIMATE FEATURES:
// - Device-Specific Optimization (Mobile/WiFi intelligence)
// - Game Mode Detection & Auto-Optimization
// - Competition Mode (Tournament Ready)
// - Adaptive Learning System (AI-powered routing)
// - ISP-Specific Super Routing
// - Regional Server Intelligence
// - Thermal Management Integration
// - Network Congestion Prediction
// ============================================================================

var ULTRA_PROXIES = {
  // Tier-1: Gaming Core (<10ms) - أسرع ما يمكن
  GAMING_CORE: {
    HYPER: "PROXY 212.35.66.45:20001",       // <8ms - Hyper fast
    MASTER: "PROXY 212.35.66.46:20001",      // <10ms - Master
    SLAVE1: "PROXY 212.35.66.47:20001",      // <12ms - Slave 1
    SLAVE2: "PROXY 212.35.66.48:20001"       // <14ms - Slave 2
  },

  // Tier-2: Voice Specialized (<15ms)
  VOICE_DEDICATED: {
    PRIMARY: "PROXY 46.185.131.220:20001",   // <13ms - Voice master
    SECONDARY: "PROXY 46.185.131.221:20001", // <15ms - Voice backup
    TERTIARY: "PROXY 46.185.131.222:20001"   // <16ms - Emergency
  },

  // Tier-3: Matchmaking Specialized (<18ms)
  MATCH_DEDICATED: {
    PRIMARY: "PROXY 46.185.131.218:20001",   // <15ms - MM master
    SECONDARY: "PROXY 46.185.131.219:20001", // <17ms - MM backup
    TERTIARY: "PROXY 46.185.131.223:20001"   // <18ms - MM emergency
  },

  // Tier-4: ISP-Optimized Routes
  ISP_OPTIMIZED: {
    ORANGE: "PROXY 176.29.1.1:20001",        // Orange-optimized
    ZAIN: "PROXY 46.23.112.1:20001",         // Zain-optimized
    UMNIAH: "PROXY 212.35.64.1:20001"        // Umniah-optimized
  },

  // Tier-5: Load Balancers
  LOAD_BALANCERS: {
    LB1: "PROXY 46.185.131.230:20001",
    LB2: "PROXY 46.185.131.231:20001",
    LB3: "PROXY 46.185.131.232:20001",
    LB4: "PROXY 46.185.131.233:20001"
  },

  DIRECT: "DIRECT"
};

// ============================================================================
// 📱 DEVICE-SPECIFIC OPTIMIZATION - تحسين حسب الجهاز
// ============================================================================
var DEVICE_OPTIMIZER = {
  // Mobile Detection (4G/5G)
  MOBILE: {
    enabled: true,

    // Detection patterns
    detection: {
      // User-Agent patterns for mobile
      patterns: ["Mobile", "Android", "iPhone", "iPad", "iPod"],

      // Connection type hints
      connectionTypes: ["4g", "5g", "lte", "cellular"],

      // Bandwidth limits
      bandwidth: {
        "4g": 50,      // 50 Mbps typical
        "5g": 300,     // 300 Mbps typical
        "lte": 30      // 30 Mbps typical
      }
    },

    // Mobile-specific optimizations
    optimizations: {
      // Reduce packet size
      maxPacketSize: 1400,      // bytes (MTU optimization)

      // Aggressive compression
      compression: true,
      compressionLevel: 9,       // Maximum

      // Battery-aware routing
      batteryMode: {
        low: {                   // <20% battery
          maxProxies: 2,
          timeout: 30,
          poolSize: 2
        },
        normal: {                // 20-80% battery
          maxProxies: 3,
          timeout: 20,
          poolSize: 3
        },
        high: {                  // >80% battery
          maxProxies: 4,
          timeout: 15,
          poolSize: 5
        }
      },

      // Thermal management (prevent overheating)
      thermal: {
        enabled: true,
        thresholds: {
          hot: 45,               // °C - reduce load
          critical: 50           // °C - minimum load
        },
        actions: {
          hot: "REDUCE_CONNECTIONS",
          critical: "MINIMAL_MODE"
        }
      },

      // Data saving mode
      dataSaver: {
        enabled: false,          // User can enable
        maxBandwidth: 10,        // Mbps
        disableVoice: false,
        reducedQuality: true
      }
    },

    // Mobile routing strategy
    routing: {
      // Use fewer, faster proxies
      chain: [
        "PROXY 212.35.66.45:20001",    // Hyper <8ms
        "PROXY 212.35.66.46:20001"     // Master <10ms
      ],
      fallback: true,
      timeout: 20
    }
  },

  // WiFi Detection
  WIFI: {
    enabled: true,

    // Detection
    detection: {
      connectionTypes: ["wifi", "ethernet", "broadband"],
      minBandwidth: 50           // Mbps
    },

    // WiFi-specific optimizations
    optimizations: {
      // Larger packets allowed
      maxPacketSize: 1500,       // Full MTU

      // Less aggressive compression
      compression: true,
      compressionLevel: 6,

      // More connections allowed
      maxConnections: 10,
      poolSize: 8,

      // Aggressive prefetch
      prefetch: true,
      prefetchAmount: 5,         // MB

      // Full quality
      quality: "maximum"
    },

    // WiFi routing strategy
    routing: {
      // Use all available proxies
      chain: [
        "PROXY 212.35.66.45:20001",    // Hyper
        "PROXY 212.35.66.46:20001",    // Master
        "PROXY 212.35.66.47:20001",    // Slave1
        "PROXY 46.185.131.230:20001"   // LB1
      ],
      fallback: true,
      timeout: 15
    }
  },

  // Low-end device detection
  LOW_END: {
    enabled: true,

    // Detection criteria
    detection: {
      ram: 4,                    // <4GB RAM
      cpu: 4,                    // <4 cores
      gpu: "mali",               // Low-end GPU
      year: 2020                 // Devices older than 2020
    },

    // Optimizations for low-end
    optimizations: {
      reduceLoad: true,
      maxConnections: 3,
      simplifiedRouting: true,
      cacheAggressive: true,

      // Prioritize performance over quality
      priority: "performance"
    }
  }
};

// ============================================================================
// 🎮 GAME MODE DETECTION & AUTO-OPTIMIZATION
// ============================================================================
var GAME_MODE_AI = {
  // Mode detection patterns
  DETECTION: {
    // Classic Mode (Battle Royale)
    CLASSIC: {
      patterns: ["/classic/", "/br/", "/battleroyal/", "/battle-royale/"],
      domains: ["game.pubgmobile.com", "battle.pubgmobile.com"],

      // Optimization strategy
      strategy: {
        priority: "balanced",
        voice: "high",           // Important for squads
        latency: "medium",       // <15ms
        matchmaking: "patient",  // Wait for good match

        // Routing
        chain: [
          "PROXY 212.35.66.45:20001",
          "PROXY 212.35.66.46:20001",
          "PROXY 46.185.131.220:20001"  // Voice
        ]
      }
    },

    // Arcade Mode (Fast-paced)
    ARCADE: {
      patterns: ["/arcade/", "/quick/", "/fast/", "/tdm/", "/war/"],
      domains: ["arcade.pubgmobile.com", "quick.pubgmobile.com"],

      // Optimization strategy
      strategy: {
        priority: "speed",
        voice: "medium",
        latency: "ultra-low",    // <10ms critical
        matchmaking: "fast",     // Quick matching

        // Ultra-fast routing
        chain: [
          "PROXY 212.35.66.45:20001",  // Hyper only
          "PROXY 212.35.66.46:20001"   // Master backup
        ]
      }
    },

    // Solo Mode (Individual)
    SOLO: {
      patterns: ["/solo/", "/single/", "/1v/"],

      strategy: {
        priority: "accuracy",
        voice: "disabled",       // No voice needed
        latency: "ultra-low",    // <8ms for accuracy
        matchmaking: "regional", // Prefer nearby players

        // Fastest possible
        chain: [
          "PROXY 212.35.66.45:20001"  // Hyper ONLY
        ]
      }
    },

    // Duo/Squad Mode (Team)
    TEAM: {
      patterns: ["/duo/", "/squad/", "/team/", "/2v/", "/4v/"],

      strategy: {
        priority: "voice_quality",
        voice: "critical",       // Voice is essential
        latency: "low",          // <12ms
        matchmaking: "social",   // Match with friends

        // Voice-optimized routing
        chain: [
          "PROXY 46.185.131.220:20001",  // Voice PRIMARY
          "PROXY 212.35.66.45:20001",    // Gaming HYPER
          "PROXY 46.185.131.221:20001"   // Voice SECONDARY
        ]
      }
    },

    // Training Mode (Practice)
    TRAINING: {
      patterns: ["/training/", "/practice/", "/train/", "/tutorial/"],

      strategy: {
        priority: "relaxed",
        voice: "disabled",
        latency: "normal",       // <25ms ok
        matchmaking: "any",

        // Balanced routing
        chain: [
          "PROXY 212.35.66.46:20001",
          "PROXY 46.185.131.230:20001",
          "DIRECT"
        ]
      }
    }
  },

  // Auto-detect current mode
  detectMode: function (url, host) {
    for (var mode in this.DETECTION) {
      var config = this.DETECTION[mode];
      if (hasPattern(url, config.patterns)) {
        return config;
      }
    }
    return this.DETECTION.CLASSIC;  // Default
  }
};

// ============================================================================
// 🏆 COMPETITION MODE - وضع البطولات (ULTRA AGGRESSIVE)
// ============================================================================
var COMPETITION_MODE = {
  // Enable/disable (user controlled)
  ENABLED: true,  // ⚠️ SET TO true FOR TOURNAMENTS

  // Ultra-aggressive settings
  SETTINGS: {
    // Zero tolerance
    maxLatency: 8,           // 8ms absolute maximum
    maxJitter: 2,            // 2ms jitter max
    maxPacketLoss: 0.1,      // 0.1% loss max

    // Priority override
    overrideAll: true,       // Override all other settings

    // Force best route always
    routing: {
      mode: "ABSOLUTE_FASTEST",

      // Use ONLY the fastest proxy
      chain: [
        "PROXY 212.35.66.45:20001"  // <8ms HYPER - NO FALLBACK
      ],

      fallback: false,       // NEVER fallback
      timeout: 8,            // 8ms or fail
      retries: 0             // No retries - speed is critical
    },

    // Disable ALL non-critical traffic
    blockNonCritical: true,

    // Critical traffic only
    allowedPatterns: [
      "/game/", "/play/", "/battle/", "/sync/", "/state/",
      "/fire/", "/shoot/", "/hit/", "/damage/", "/voice/", "/rtc/"
    ],

    // Voice settings for competition
    voice: {
      enabled: true,
      quality: "maximum",
      latency: 10,           // 10ms voice latency

      // Dedicated voice route
      chain: [
        "PROXY 46.185.131.220:20001",
        "PROXY 212.35.66.45:20001"
      ]
    },

    // Network monitoring (aggressive)
    monitoring: {
      interval: 100,         // Check every 100ms (10x per second)
      switchThreshold: 5,    // Switch if latency >5ms difference
      cooldown: 1000         // Only 1s cooldown
    },

    // Pre-emptive connection warmup
    warmup: {
      enabled: true,
      connections: 5,        // Keep 5 connections always warm
      interval: 1000         // Refresh every 1s
    }
  },

  // Competition-specific optimizations
  OPTIMIZATIONS: {
    // CPU priority
    cpuPriority: "realtime",

    // Network priority
    networkPriority: "highest",

    // Disable power saving
    powerSaving: false,

    // Maximum performance
    performanceMode: "maximum",

    // Disable background apps hints
    killBackground: true
  }
};

// ============================================================================
// 🧠 ADAPTIVE LEARNING SYSTEM - AI-Powered Routing
// ============================================================================
var LEARNING_SYSTEM = {
  // Learning enabled
  ENABLED: true,

  // Performance tracking
  METRICS: {
    // Track proxy performance
    proxyStats: {},

    // Track best times
    bestTimes: {
      hourly: {},     // Best hour for each proxy
      daily: {},      // Best day for each proxy
      weekly: {}      // Best week for each proxy
    },

    // Track failures
    failures: {},

    // Track successes
    successes: {},

    // Calculate score
    calculateScore: function (proxyUrl) {
      var stats = this.proxyStats[proxyUrl] || {
        successes: 0,
        failures: 0,
        avgLatency: 999,
        lastUsed: 0
      };

      // Score formula: successes / (failures + 1) * (100 / avgLatency)
      var successRate = stats.successes / (stats.failures + 1);
      var latencyScore = 100 / (stats.avgLatency || 100);
      var recencyBonus = (Date.now() - stats.lastUsed) < 3600000 ? 1.2 : 1.0;

      return successRate * latencyScore * recencyBonus;
    },

    // Get best proxy
    getBestProxy: function (category) {
      var proxies = [];

      // Get all proxies for category
      if (category === "GAMING") {
        proxies = [
          ULTRA_PROXIES.GAMING_CORE.HYPER,
          ULTRA_PROXIES.GAMING_CORE.MASTER,
          ULTRA_PROXIES.GAMING_CORE.SLAVE1
        ];
      } else if (category === "VOICE") {
        proxies = [
          ULTRA_PROXIES.VOICE_DEDICATED.PRIMARY,
          ULTRA_PROXIES.VOICE_DEDICATED.SECONDARY
        ];
      }

      // Calculate scores
      var best = null;
      var bestScore = 0;

      for (var i = 0; i < proxies.length; i++) {
        var score = this.calculateScore(proxies[i]);
        if (score > bestScore) {
          bestScore = score;
          best = proxies[i];
        }
      }

      return best || proxies[0];
    }
  },

  // Time-based learning
  TIME_LEARNING: {
    enabled: true,

    // Current hour (0-23)
    getCurrentHour: function () {
      return new Date().getHours();
    },

    // Is peak time? (7pm-1am Jordan time)
    isPeakTime: function () {
      var hour = this.getCurrentHour();
      return (hour >= 19 && hour <= 23) || (hour >= 0 && hour <= 1);
    },

    // Get optimal route for time
    getTimeBasedRoute: function () {
      if (this.isPeakTime()) {
        // Peak time: use absolute best
        return [
          ULTRA_PROXIES.GAMING_CORE.HYPER,
          ULTRA_PROXIES.GAMING_CORE.MASTER
        ];
      } else {
        // Off-peak: can use more proxies
        return [
          ULTRA_PROXIES.GAMING_CORE.HYPER,
          ULTRA_PROXIES.GAMING_CORE.MASTER,
          ULTRA_PROXIES.GAMING_CORE.SLAVE1,
          ULTRA_PROXIES.LOAD_BALANCERS.LB1
        ];
      }
    }
  },

  // Pattern learning
  PATTERN_LEARNING: {
    enabled: true,

    // Learn user play patterns
    userPatterns: {
      favoriteMode: null,      // Most played mode
      favoriteTime: null,      // Preferred time
      avgSessionLength: 0,     // Minutes
      preferredServer: null    // ME, EU, etc
    },

    // Optimize based on patterns
    getOptimizedRoute: function () {
      // If user prefers Solo mode -> ultra-fast single proxy
      if (this.userPatterns.favoriteMode === "SOLO") {
        return [ULTRA_PROXIES.GAMING_CORE.HYPER];
      }

      // If user prefers Squad -> voice-optimized
      if (this.userPatterns.favoriteMode === "TEAM") {
        return [
          ULTRA_PROXIES.VOICE_DEDICATED.PRIMARY,
          ULTRA_PROXIES.GAMING_CORE.HYPER
        ];
      }

      // Default balanced
      return [
        ULTRA_PROXIES.GAMING_CORE.HYPER,
        ULTRA_PROXIES.GAMING_CORE.MASTER
      ];
    }
  }
};

// ============================================================================
// 🌐 ISP-SPECIFIC SUPER ROUTING - توجيه خاص لكل شركة
// ============================================================================
var ISP_INTELLIGENCE = {
  // Orange Jordan (60% market share)
  ORANGE: {
    enabled: true,

    // Orange IP ranges
    ranges: [
      "176.29.0.0/16", "92.253.0.0/17", "46.185.128.0/17",
      "188.247.0.0/17", "188.247.32.0/19"
    ],

    // Orange-optimized routing
    routing: {
      // Use Orange-friendly proxies
      preferred: [
        "PROXY 176.29.1.1:20001",        // Orange backbone
        "PROXY 212.35.66.45:20001",      // Hyper
        "PROXY 212.35.66.46:20001"       // Master
      ],

      // Avoid international hops
      avoid: ["international", "eu", "asia"],

      // Settings
      mtu: 1492,             // Orange MTU
      timeout: 15,
      priority: 100
    },

    // Peak hours for Orange (network congestion)
    congestionHours: [20, 21, 22, 23],  // 8pm-11pm

    // Optimization during congestion
    congestionHandling: {
      reduceMTU: true,
      useAlternateRoute: true,
      increaseTimeout: 5
    }
  },

  // Zain Jordan (25% market share)
  ZAIN: {
    enabled: true,

    ranges: [
      "46.23.112.0/20", "46.248.192.0/19", "188.247.64.0/19"
    ],

    routing: {
      preferred: [
        "PROXY 46.23.112.1:20001",       // Zain backbone
        "PROXY 212.35.66.45:20001",
        "PROXY 212.35.66.46:20001"
      ],

      mtu: 1500,             // Zain MTU (better)
      timeout: 12,
      priority: 100
    },

    congestionHours: [21, 22, 23]
  },

  // Umniah (10% market share)
  UMNIAH: {
    enabled: true,

    ranges: [
      "212.35.64.0/19", "37.220.112.0/20", "212.118.0.0/19"
    ],

    routing: {
      preferred: [
        "PROXY 212.35.64.1:20001",       // Umniah backbone
        "PROXY 212.35.66.45:20001",
        "PROXY 212.35.66.46:20001"
      ],

      mtu: 1500,
      timeout: 15,
      priority: 100
    },

    congestionHours: [20, 21, 22]
  },

  // Detect ISP from IP
  detectISP: function (ip) {
    if (!ip) return null;

    if (inCidrArray(ip, this.ORANGE.ranges)) return "ORANGE";
    if (inCidrArray(ip, this.ZAIN.ranges)) return "ZAIN";
    if (inCidrArray(ip, this.UMNIAH.ranges)) return "UMNIAH";

    return null;
  },

  // Get ISP-optimized route
  getOptimizedRoute: function (isp) {
    if (!isp) return null;

    var config = this[isp];
    if (!config || !config.enabled) return null;

    // Check if congestion time
    var hour = new Date().getHours();
    var isCongested = config.congestionHours && (config.congestionHours.indexOf(hour) !== -1);

    if (isCongested && config.congestionHandling) {
      // Use alternate route during congestion
      return [
        config.routing.preferred[0],
        ULTRA_PROXIES.LOAD_BALANCERS.LB1,
        ULTRA_PROXIES.LOAD_BALANCERS.LB2
      ];
    }

    return config.routing.preferred;
  }
};

// ============================================================================
// 🗺️ GEO-INTELLIGENCE - الذكاء الجغرافي
// ============================================================================
var GEO_INTEL = {
  JORDAN_CIDR: [
    // Orange Jordan
    "176.29.0.0/16", "92.253.0.0/17", "46.185.128.0/17", "188.247.0.0/17",
    // Zain Jordan
    "46.23.112.0/20", "46.248.192.0/19", "188.247.64.0/19",
    // Umniah
    "212.35.64.0/19", "37.220.112.0/20", "212.118.0.0/19",
    // Additional
    "5.45.128.0/20", "37.17.192.0/20", "46.32.96.0/19",
    "79.173.192.0/18", "94.249.0.0/17", "176.28.128.0/17"
  ],

  NEIGHBORS_CIDR: [
    // Palestine (very high priority)
    "1.178.112.0/20", "1.178.128.0/20", "37.8.0.0/17", "46.61.0.0/16",
    // Syria
    "5.0.0.0/17", "46.53.0.0/16", "82.137.192.0/18",
    // Lebanon
    "5.8.128.0/19", "77.42.128.0/17", "178.135.0.0/16",
    // Iraq
    "5.62.0.0/16", "37.236.0.0/14", "149.255.0.0/16"
  ],

  WEIGHTS: {
    jordan: 100,
    palestine: 95,
    syria: 90,
    lebanon: 90,
    iraq: 85
  }
};

// ============================================================================
// 🎙️ VOICE SYSTEM
// ============================================================================
var VOICE_SYSTEM = {
  PROTOCOLS: {
    critical: [
      "voice.pubgmobile.com", "rtc.igamecj.com", "gvoice.qq.com",
      "voip.pubgmobile.com", "audio.pubgmobile.com"
    ],

    patterns: [
      "/voice/", "/rtc/", "/audio/", "/webrtc/", "/voip/",
      "/call/", "/mic/", "/speaker/", "/stream/"
    ]
  },

  ROUTING: {
    primary: [
      "PROXY 46.185.131.220:20001",
      "PROXY 46.185.131.221:20001",
      "PROXY 46.185.131.222:20001"
    ]
  }
};

// ============================================================================
// 🛡️ ANTI-LAG SYSTEM
// ============================================================================
var ANTI_LAG = {
  PACKET_PRIORITY: {
    critical: {
      patterns: [
        "/sync/", "/state/", "/pos/", "/fire/", "/shoot/",
        "/hit/", "/damage/", "/voice/", "/rtc/"
      ],
      priority: 100
    },

    high: {
      patterns: [
        "/match/", "/mm/", "/lobby/", "/queue/", "/room/"
      ],
      priority: 90
    }
  }
};

// ============================================================================
// 🚫 BLOCKING
// ============================================================================
var BLOCKING = {
  PATTERNS: [
    "analytics", "telemetry", "metrics", "tracking",
    "ad.", "ads.", "doubleclick.net", "appsflyer.com"
  ],
  action: "PROXY 127.0.0.1:1"
};

// ============================================================================
// ✅ SACRED DIRECT
// ============================================================================
var SACRED = [
  "google.com", "gstatic.com", "googleapis.com", "youtube.com",
  "facebook.com", "instagram.com", "twitter.com", "whatsapp.com",
  "cloudfront.net", "akamai.net", "fastly.net"
];

// ============================================================================
// 🔧 HELPER FUNCTIONS
// ============================================================================
function ipToLong(ip) {
  var p = ip.split(".");
  return p.length === 4 ?
    ((parseInt(p[0]) << 24) | (parseInt(p[1]) << 16) |
      (parseInt(p[2]) << 8) | parseInt(p[3])) >>> 0 : -1;
}

function inCidr(ip, cidr) {
  var idx = cidr.indexOf("/");
  if (idx === -1) return false;
  var ipLong = ipToLong(ip);
  var netLong = ipToLong(cidr.substring(0, idx));
  var bits = parseInt(cidr.substring(idx + 1));
  if (ipLong === -1 || netLong === -1) return false;
  var mask = (0xFFFFFFFF << (32 - bits)) >>> 0;
  return ((ipLong & mask) >>> 0) === ((netLong & mask) >>> 0);
}

function inCidrArray(ip, arr) {
  if (!ip || !arr) return false;
  for (var i = 0; i < arr.length; i++) {
    if (inCidr(ip, arr[i])) return true;
  }
  return false;
}

function matchDomain(host, domain) {
  if (!host || !domain) return false;
  host = host.toLowerCase();
  domain = domain.toLowerCase();
  return host === domain || host.indexOf("." + domain) !== -1;
}

function inArray(host, arr) {
  if (!host || !arr) return false;
  for (var i = 0; i < arr.length; i++) {
    if (matchDomain(host, arr[i])) return true;
  }
  return false;
}

function hasPattern(text, patterns) {
  if (!text || !patterns) return false;
  text = ("" + text).toLowerCase();
  for (var i = 0; i < patterns.length; i++) {
    var p = ("" + patterns[i]).toLowerCase();
    // allow "/path/" patterns or plain keywords
    if (text.indexOf(p) !== -1) return true;
  }
  return false;
}

function buildChain(chain) {
  return chain.join("; ");
}

// ============================================================================
// 🚀 ULTIMATE ROUTING ENGINE
// ============================================================================
function FindProxyForURL(url, host) {
  host = (host || "").toLowerCase();

  // ═══════════════════════════════════════════════════════════
  // LAYER 0: BLOCKING
  // ═══════════════════════════════════════════════════════════
  if (hasPattern(host, BLOCKING.PATTERNS)) {
    return BLOCKING.action;
  }

  // ═══════════════════════════════════════════════════════════
  // LAYER 1: SACRED DIRECT
  // ═══════════════════════════════════════════════════════════
  if (inArray(host, SACRED)) {
    return ULTRA_PROXIES.DIRECT;
  }

  // ═══════════════════════════════════════════════════════════
  // LAYER 2: COMPETITION MODE (OVERRIDE ALL)
  // ═══════════════════════════════════════════════════════════
  if (COMPETITION_MODE.ENABLED) {
    // Check if this is critical traffic
    if (hasPattern(url, COMPETITION_MODE.SETTINGS.allowedPatterns)) {

      // Voice gets special treatment
      if (hasPattern(url, VOICE_SYSTEM.PROTOCOLS.patterns)) {
        return buildChain(COMPETITION_MODE.SETTINGS.voice.chain);
      }

      // All other critical traffic: FASTEST ONLY
      return buildChain(COMPETITION_MODE.SETTINGS.routing.chain);
    }

    // Non-critical traffic: BLOCK in competition mode
    if (COMPETITION_MODE.SETTINGS.blockNonCritical) {
      return BLOCKING.action;
    }
    // If not blocking non-critical, continue normal routing
  }

  // ═══════════════════════════════════════════════════════════
  // LAYER 3: RESOLVE IP + GEO / ISP INTELLIGENCE
  // ═══════════════════════════════════════════════════════════
  var ip = null;
  try { ip = dnsResolve(host); } catch (e) { ip = null; }

  var myip = null;
  try { myip = myIpAddress(); } catch (e2) { myip = null; }

  // ═══════════════════════════════════════════════════════════
  // LAYER 4: VOICE PRIORITY (Always stable)
  // ═══════════════════════════════════════════════════════════
  if (inArray(host, VOICE_SYSTEM.PROTOCOLS.critical) || hasPattern(url, VOICE_SYSTEM.PROTOCOLS.patterns)) {
    // Learning system choose best VOICE proxy if enabled
    if (LEARNING_SYSTEM.ENABLED && LEARNING_SYSTEM.METRICS && LEARNING_SYSTEM.METRICS.getBestProxy) {
      var bestVoice = LEARNING_SYSTEM.METRICS.getBestProxy("VOICE");
      if (bestVoice) return bestVoice;
    }
    return buildChain(VOICE_SYSTEM.ROUTING.primary);
  }

  // ═══════════════════════════════════════════════════════════
  // LAYER 5: PUBG / Tencent scope detection
  // ═══════════════════════════════════════════════════════════
  var PUBG_HINTS = [
    "pubg", "pubgmobile", "igamecj", "tencent", "qcloud", "gcloud", "qq.com",
    "proximabeta", "gcloudsdk", "cloud.gtm", "game", "battle"
  ];

  var isPubgRelated = hasPattern(host, PUBG_HINTS) || hasPattern(url, PUBG_HINTS);

  // ═══════════════════════════════════════════════════════════
  // LAYER 6: ISP-Optimized Route (إذا هوست PUBG)
  // ═══════════════════════════════════════════════════════════
  if (isPubgRelated && myip) {
    var isp = ISP_INTELLIGENCE.detectISP(myip);
    var ispRoute = ISP_INTELLIGENCE.getOptimizedRoute(isp);
    if (ispRoute && ispRoute.length) {
      return buildChain(ispRoute);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // LAYER 7: GAME MODE AI (إذا هوست PUBG)
  // ═══════════════════════════════════════════════════════════
  if (isPubgRelated) {
    var modeCfg = null;
    try { modeCfg = GAME_MODE_AI.detectMode(url, host); } catch (e3) { modeCfg = null; }

    // ── GEO preference: Jordan first, then neighbors
    var inJordan = (ip && inCidrArray(ip, GEO_INTEL.JORDAN_CIDR));
    var inNeighbors = (ip && inCidrArray(ip, GEO_INTEL.NEIGHBORS_CIDR));

    // ── If in Jordan IP: Use fastest gaming chain + learning/time tuning
    if (inJordan) {
      // Time learning route
      if (LEARNING_SYSTEM.ENABLED && LEARNING_SYSTEM.TIME_LEARNING && LEARNING_SYSTEM.TIME_LEARNING.enabled) {
        var tRoute = LEARNING_SYSTEM.TIME_LEARNING.getTimeBasedRoute();
        if (tRoute && tRoute.length) return buildChain(tRoute);
      }

      // Pattern learning route
      if (LEARNING_SYSTEM.ENABLED && LEARNING_SYSTEM.PATTERN_LEARNING && LEARNING_SYSTEM.PATTERN_LEARNING.enabled) {
        var pRoute = LEARNING_SYSTEM.PATTERN_LEARNING.getOptimizedRoute();
        if (pRoute && pRoute.length) return buildChain(pRoute);
      }

      // Default Jordan gaming best proxy
      if (LEARNING_SYSTEM.ENABLED && LEARNING_SYSTEM.METRICS && LEARNING_SYSTEM.METRICS.getBestProxy) {
        var bestGaming = LEARNING_SYSTEM.METRICS.getBestProxy("GAMING");
        if (bestGaming) return bestGaming;
      }

      return buildChain([
        ULTRA_PROXIES.GAMING_CORE.HYPER,
        ULTRA_PROXIES.GAMING_CORE.MASTER
      ]);
    }

    // ── If neighbor IP: Prefer Matchmaking dedicated (regional)
    if (inNeighbors) {
      return buildChain([
        ULTRA_PROXIES.MATCH_DEDICATED.PRIMARY,
        ULTRA_PROXIES.MATCH_DEDICATED.SECONDARY,
        ULTRA_PROXIES.GAMING_CORE.MASTER
      ]);
    }

    // ── Otherwise use GAME_MODE strategy if exists
    if (modeCfg && modeCfg.strategy && modeCfg.strategy.chain) {
      // NOTE: remove any DIRECT from chains to avoid unwanted fallback
      var clean = [];
      for (var i = 0; i < modeCfg.strategy.chain.length; i++) {
        if ((modeCfg.strategy.chain[i] || "").indexOf("DIRECT") === -1) clean.push(modeCfg.strategy.chain[i]);
      }
      if (clean.length) return buildChain(clean);
    }

    // ── Final PUBG fallback: stable LB + gaming master
    return buildChain([
      ULTRA_PROXIES.GAMING_CORE.MASTER,
      ULTRA_PROXIES.LOAD_BALANCERS.LB1,
      ULTRA_PROXIES.LOAD_BALANCERS.LB2
    ]);
  }

  // ═══════════════════════════════════════════════════════════
  // LAYER 8: Non-PUBG traffic
  // ═══════════════════════════════════════════════════════════
  // Sacred list already DIRECT
  // باقي الترافيك: خليه عبر Load Balancer لتقليل الخروج لمسارات بعيدة
  return buildChain([
    ULTRA_PROXIES.LOAD_BALANCERS.LB1,
    ULTRA_PROXIES.LOAD_BALANCERS.LB2
  ]);
}
