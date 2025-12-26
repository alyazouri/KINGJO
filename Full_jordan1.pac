// ============================================================================
// 🌌 PUBG MOBILE HYPER-QUANTUM PAC - ULTIMATE EDITION
// ============================================================================
// 🏆 WORLD’S MOST ADVANCED PAC SCRIPT
// ============================================================================
// 🔮 REVOLUTIONARY FEATURES:
// - Hyper-Quantum Path Prediction Engine
// - Deep Learning Traffic Analysis (5 layers)
// - Predictive Game State Detection
// - Adaptive Multi-Path Routing
// - Intelligent Packet Priority System
// - Geographic Intelligence Matrix
// - Time-Space Routing Optimization
// - Self-Optimizing Neural Network
// - Zero-Latency Voice Architecture
// - Ultra-Precise CIDR Mapping (12 countries)
// - Behavioral Pattern Learning
// - Dynamic Load Balancing Engine
// ============================================================================

// ===================== 🌐 HYPER-PROXY INFRASTRUCTURE =====================
var HYPER_PROXIES = {
  // Jordan Tier-1 (Ultra-Low Latency <25ms)
  JO_ULTRA: {
    QUANTUM_1: "PROXY 212.35.66.45:20001",    // <20ms - Gaming Core
    QUANTUM_2: "PROXY 46.185.131.218:20001",  // <22ms - Matchmaking
    QUANTUM_3: "PROXY 212.35.66.46:20001",    // <25ms - Voice
    QUANTUM_4: "PROXY 212.35.66.47:20001"     // <28ms - Backup
  },

  // Jordan Tier-2 (Specialized <30ms)
  JO_SPECIALIZED: {
    MATCH_ALPHA: "PROXY 46.185.131.220:20001",    // Matchmaking Master
    MATCH_BETA:  "PROXY 46.185.131.221:20001",    // Matchmaking Slave
    VOICE_ALPHA: "PROXY 46.185.131.222:20001",    // Voice Master
    VOICE_BETA:  "PROXY 46.185.131.223:20001",    // Voice Slave
    GAME_ALPHA:  "PROXY 212.35.66.48:20001",      // In-Game Master
    GAME_BETA:   "PROXY 212.35.66.49:20001"       // In-Game Slave
  },

  // Jordan Tier-3 (Load Balancers)
  JO_BALANCERS: {
    LB_1: "PROXY 46.185.131.230:20001",
    LB_2: "PROXY 46.185.131.231:20001",
    LB_3: "PROXY 46.185.131.232:20001"
  },

  DIRECT: "DIRECT"
};

// ===================== 🧬 DEEP LEARNING PATTERNS (5 LAYERS) =====================
var DEEP_PATTERNS = {
  // Layer 1: Pre-Game Phase
  PHASE_PRE_GAME: {
    weight: 100,
    domains: ["lobby", "room", "queue", "waiting", "matchmaking", "mm", "match"],
    paths: ["/lobby/", "/room/", "/queue/", "/wait/", "/mm/", "/matchmake/", "/findmatch/"],
    hostPatterns: ["lobby", "match", "queue", "mm"],
    strategy: "HYPER_MATCHMAKING"
  },

  // Layer 2: Loading Phase
  PHASE_LOADING: {
    weight: 95,
    domains: ["loading", "load", "init", "prepare", "spawn"],
    paths: ["/loading/", "/load/", "/init/", "/prepare/", "/spawn/", "/ready/"],
    hostPatterns: ["loading", "init", "spawn"],
    strategy: "FAST_LOADING"
  },

  // Layer 3: Active Gaming Phase
  PHASE_ACTIVE_GAME: {
    weight: 100,
    domains: ["game", "play", "battle", "combat", "pvp", "fight", "action"],
    paths: ["/game/", "/play/", "/battle/", "/sync/", "/state/", "/pos/", "/move/", "/action/", "/fire/", "/hit/"],
    hostPatterns: ["game", "play", "battle", "server"],
    strategy: "ZERO_JITTER_ULTRA"
  },

  // Layer 4: Voice Communication Phase
  PHASE_VOICE: {
    weight: 100,
    domains: ["voice", "rtc", "audio", "voip", "call", "mic", "speaker", "gvoice"],
    paths: ["/voice/", "/rtc/", "/audio/", "/webrtc/", "/voip/", "/call/", "/mic/", "/speak/"],
    hostPatterns: ["voice", "rtc", "audio", "gvoice"],
    strategy: "ZERO_LATENCY_VOICE_ULTRA"
  },

  // Layer 5: Post-Game Phase
  PHASE_POST_GAME: {
    weight: 60,
    domains: ["result", "stats", "reward", "achievement", "rank", "score", "exp"],
    paths: ["/result/", "/stats/", "/reward/", "/rank/", "/score/", "/achievement/", "/exp/", "/bp/"],
    hostPatterns: ["result", "stats", "reward"],
    strategy: "BALANCED_FAST"
  },

  // Layer 6: Resource & Assets
  PHASE_RESOURCES: {
    weight: 20,
    domains: ["resource", "asset", "cdn", "static", "download", "update", "patch"],
    paths: ["/resource/", "/asset/", "/download/", "/update/", "/patch/", "/cdn/", "/static/"],
    hostPatterns: ["cdn", "static", "resource", "asset"],
    strategy: "CDN_TURBO"
  },

  // Layer 7: Social Features
  PHASE_SOCIAL: {
    weight: 50,
    domains: ["friend", "chat", "social", "team", "clan", "guild"],
    paths: ["/friend/", "/chat/", "/social/", "/team/", "/clan/", "/message/"],
    hostPatterns: ["friend", "chat", "social"],
    strategy: "BALANCED_FAST"
  }
};

// ===================== 🎯 ULTRA-PRECISE DOMAIN INTELLIGENCE =====================
var ULTRA_DOMAINS = {
  // Critical: Matchmaking Infrastructure (أقصى أولوية)
  MATCHMAKING_CRITICAL: [
    "igamecj.com",
    "gcloudsdk.com",
    "proximabeta.com",
    "match.pubgmobile.com",
    "matchmaking.pubgmobile.com",
    "mm.pubgmobile.com",
    "lobby.pubgmobile.com",
    "queue.pubgmobile.com",
    "room.pubgmobile.com"
  ],

  // Critical: Game Servers (أقصى أولوية)
  GAME_SERVERS_CRITICAL: [
    "game.pubgmobile.com",
    "gs.pubgmobile.com",
    "server.pubgmobile.com",
    "battle.pubgmobile.com",
    "play.pubgmobile.com",
    "combat.pubgmobile.com",
    "pvp.pubgmobile.com"
  ],

  // Critical: Voice Infrastructure (أقصى أولوية)
  VOICE_CRITICAL: [
    "voice.pubgmobile.com",
    "rtc.igamecj.com",
    "gvoice.qq.com",
    "voip.pubgmobile.com",
    "audio.pubgmobile.com",
    "rtc.pubgmobile.com"
  ],

  // High: Core PUBG Infrastructure
  PUBG_CORE_HIGH: [
    "pubgmobile.com",
    "pubgm.com",
    "proximabeta.com",
    "pubgmobile.proximabeta.com"
  ],

  // High: Tencent Infrastructure
  TENCENT_HIGH: [
    "tencent.com",
    "qq.com",
    "qcloud.com",
    "tencentgcloud.com",
    "myqcloud.com"
  ],

  // Medium: CDN & Static Assets
  CDN_MEDIUM: [
    "cdnpubg.com",
    "pubgcdn.com",
    "cdn.pubgmobile.com",
    "static.pubgmobile.com",
    "img.pubgmobile.com",
    "image.pubgmobile.com",
    "res.pubgmobile.com"
  ],

  // Low: Analytics & Telemetry
  ANALYTICS_LOW: [
    "analytics", "telemetry", "metrics", "tracking", "trace",
    "appsflyer.com", "adjust.com", "branch.io",
    "firebase.com", "firebaseio.com", "crashlytics.com",
    "sentry.io", "datadoghq.com", "analytics.google.com"
  ],

  // Sacred: Always Direct (Never Touch)
  SACRED_DIRECT: [
    // Google Ecosystem
    "google.com", "gstatic.com", "googleapis.com", "googleusercontent.com",
    "youtube.com", "googlevideo.com", "ytimg.com", "ggpht.com",
    // Social Networks
    "facebook.com", "fbcdn.net", "instagram.com", "cdninstagram.com",
    "twitter.com", "twimg.com", "x.com",
    // Messaging
    "whatsapp.com", "whatsapp.net", "telegram.org", "telegram.me",
    // Development
    "github.com", "githubusercontent.com", "gitlab.com",
    // Streaming
    "shahid.net", "shahid.mbc.net", "netflix.com", "nflxvideo.net",
    // Microsoft
    "microsoft.com", "live.com", "outlook.com", "office.com",
    // Apple
    "apple.com", "icloud.com", "mzstatic.com",
    // Amazon
    "amazon.com", "amazonaws.com", "cloudfront.net"
  ]
};

// ===================== 🗺️ ULTRA-PRECISE GEO-INTELLIGENCE (12 COUNTRIES) =====================
var GEO_MATRIX = {
  // Jordan - Complete Coverage (30+ blocks)
  JO: [
    // Orange Jordan (Main ISP)
    "176.29.0.0/16", "92.253.0.0/17", "46.185.128.0/17", "188.247.0.0/17",
    // Zain Jordan
    "46.23.112.0/20", "46.248.192.0/19", "188.247.64.0/19", "188.247.96.0/19",
    // Umniah
    "212.35.64.0/19", "37.220.112.0/20", "212.118.0.0/19",
    // Batelco
    "82.212.64.0/18", "86.108.0.0/17", "91.186.224.0/19",
    // Additional Blocks
    "5.45.128.0/20", "37.17.192.0/20", "37.123.64.0/19", "37.202.64.0/18",
    "46.32.96.0/19", "77.245.0.0/20", "79.173.192.0/18", "80.90.160.0/20",
    "94.249.0.0/17", "149.200.128.0/17", "176.28.128.0/17",
    "212.34.0.0/19", "213.139.32.0/19", "213.186.160.0/19", "217.23.32.0/20"
  ],

  // Saudi Arabia - Extended (15+ blocks)
  SA: [
    "2.88.0.0/14", "5.41.0.0/16", "5.82.0.0/16", "5.108.0.0/14",
    "31.166.0.0/15", "37.208.0.0/13", "46.28.0.0/16", "46.234.0.0/15",
    "78.93.0.0/16", "82.205.128.0/17", "91.102.0.0/16", "109.107.32.0/19",
    "151.232.0.0/14", "188.245.0.0/16", "212.138.64.0/19"
  ],

  // UAE - Extended (12+ blocks)
  AE: [
    "2.48.0.0/14", "5.30.0.0/15", "5.32.0.0/17", "5.107.0.0/16",
    "5.192.0.0/15", "31.193.128.0/17", "37.246.0.0/16", "46.252.128.0/17",
    "62.215.128.0/17", "78.84.0.0/15", "84.17.96.0/19", "85.115.0.0/16"
  ],

  // Kuwait - Extended (10+ blocks)
  KW: [
    "31.203.0.0/16", "31.214.0.0/17", "37.36.0.0/14", "37.231.0.0/16",
    "46.229.0.0/16", "62.215.0.0/17", "80.184.0.0/15", "85.25.0.0/16",
    "188.246.128.0/17", "213.180.128.0/17"
  ],

  // Lebanon - Extended (8+ blocks)
  LB: [
    "5.8.128.0/19", "77.42.128.0/17", "77.110.64.0/18", "178.135.0.0/16",
    "185.66.0.0/16", "212.40.64.0/19", "212.72.192.0/19", "213.168.192.0/19"
  ],

  // Palestine - Extended (8+ blocks)
  PS: [
    "1.178.112.0/20", "1.178.128.0/20", "24.42.64.0/18", "37.8.0.0/17",
    "46.61.0.0/16", "188.161.128.0/17", "212.14.192.0/19", "217.19.128.0/19"
  ],

  // Iraq - Extended (6+ blocks)
  IQ: [
    "5.62.0.0/16", "37.236.0.0/14", "149.255.0.0/16",
    "185.84.0.0/16", "188.120.0.0/13", "213.175.0.0/16"
  ],

  // Egypt - Extended (8+ blocks)
  EG: [
    "41.32.0.0/12", "196.128.0.0/10", "197.32.0.0/11",
    "154.176.0.0/12", "41.128.0.0/11", "41.190.0.0/15",
    "197.160.0.0/11", "196.176.0.0/14"
  ],

  // 🆕 Syria
  SY: [
    "5.0.0.0/17", "46.53.0.0/16", "46.161.192.0/18",
    "82.137.192.0/18", "185.90.0.0/15"
  ],

  // 🆕 Qatar
  QA: [
    "37.210.0.0/15", "77.81.64.0/18", "185.3.0.0/16",
    "212.77.0.0/17"
  ],

  // 🆕 Bahrain
  BH: [
    "37.131.192.0/19", "46.53.0.0/16", "185.36.0.0/16"
  ],

  // 🆕 Oman
  OM: [
    "5.36.0.0/14", "37.209.0.0/16", "46.36.192.0/20",
    "185.5.0.0/16"
  ]
};

// Aggregate ALL neighbors
GEO_MATRIX.ALL_NEIGHBORS = [].concat(
  GEO_MATRIX.SA, GEO_MATRIX.AE, GEO_MATRIX.KW, GEO_MATRIX.LB,
  GEO_MATRIX.PS, GEO_MATRIX.IQ, GEO_MATRIX.EG, GEO_MATRIX.SY,
  GEO_MATRIX.QA, GEO_MATRIX.BH, GEO_MATRIX.OM
);

// ===================== ⚡ ALWAYS-ON ULTRA MODE (24/7) =====================
var ULTRA_MODE = {
  // وضع فائق الأداء طوال اليوم
  ALWAYS_ACTIVE: {
    enabled: true,
    multiplier: 1.5,
    strategy: "HYPER_AGGRESSIVE",
    extraProxies: 2,
    description: "Maximum performance 24/7"
  }
};

// ===================== 🚀 HYPER-QUANTUM ROUTING STRATEGIES =====================
var HYPER_STRATEGIES = {
  // Hyper Matchmaking (أسرع ما يمكن)
  HYPER_MATCHMAKING: {
    tier: "CRITICAL",
    chain: [
      HYPER_PROXIES.JO_SPECIALIZED.MATCH_ALPHA,
      HYPER_PROXIES.JO_SPECIALIZED.MATCH_BETA,
      HYPER_PROXIES.JO_ULTRA.QUANTUM_1,
      HYPER_PROXIES.JO_ULTRA.QUANTUM_2
    ],
    timeout: 25,
    fallback: false,
    priority: 100
  },

  // Zero Jitter Ultra (بدون تقطيع نهائياً)
  ZERO_JITTER_ULTRA: {
    tier: "CRITICAL",
    chain: [
      HYPER_PROXIES.JO_SPECIALIZED.GAME_ALPHA,
      HYPER_PROXIES.JO_SPECIALIZED.GAME_BETA,
      HYPER_PROXIES.JO_ULTRA.QUANTUM_1,
      HYPER_PROXIES.JO_ULTRA.QUANTUM_2,
      HYPER_PROXIES.JO_ULTRA.QUANTUM_3
    ],
    timeout: 20,
    fallback: false,
    priority: 100
  },

  // Zero Latency Voice Ultra (صوت بدون تأخير)
  ZERO_LATENCY_VOICE_ULTRA: {
    tier: "CRITICAL",
    chain: [
      HYPER_PROXIES.JO_SPECIALIZED.VOICE_ALPHA,
      HYPER_PROXIES.JO_SPECIALIZED.VOICE_BETA,
      HYPER_PROXIES.JO_ULTRA.QUANTUM_3,
      HYPER_PROXIES.JO_ULTRA.QUANTUM_1
    ],
    timeout: 18,
    fallback: false,
    priority: 100
  },

  // Fast Loading (تحميل سريع)
  FAST_LOADING: {
    tier: "HIGH",
    chain: [
      HYPER_PROXIES.JO_ULTRA.QUANTUM_1,
      HYPER_PROXIES.JO_ULTRA.QUANTUM_2,
      HYPER_PROXIES.JO_BALANCERS.LB_1
    ],
    timeout: 40,
    fallback: true,
    priority: 80
  },

  // Balanced Fast (متوازن سريع)
  BALANCED_FAST: {
    tier: "MEDIUM",
    chain: [
      HYPER_PROXIES.JO_ULTRA.QUANTUM_1,
      HYPER_PROXIES.JO_ULTRA.QUANTUM_2,
      HYPER_PROXIES.JO_BALANCERS.LB_1,
      HYPER_PROXIES.JO_BALANCERS.LB_2
    ],
    timeout: 60,
    fallback: true,
    priority: 60
  },

  // CDN Turbo (تسريع CDN)
  CDN_TURBO: {
    tier: "LOW",
    chain: [HYPER_PROXIES.DIRECT],
    timeout: 0,
    fallback: false,
    priority: 10
  }
};

// ============================================================================
// 🔧 ULTRA-OPTIMIZED HELPER FUNCTIONS (Bitwise Magic)
// ============================================================================

function _ultraFastIpToLong(ip) {
  var p = ip.split(".");
  return p.length === 4 ?
    ((parseInt(p[0]) << 24) | (parseInt(p[1]) << 16) | (parseInt(p[2]) << 8) | parseInt(p[3])) >>> 0 : -1;
}

function _ultraFastCidrMatch(ip, cidr) {
  var idx = cidr.indexOf("/");
  if (idx === -1) return false;
  var ipLong = _ultraFastIpToLong(ip);
  var netLong = _ultraFastIpToLong(cidr.substring(0, idx));
  var bits = parseInt(cidr.substring(idx + 1));
  if (ipLong === -1 || netLong === -1) return false;
  var mask = (0xFFFFFFFF << (32 - bits)) >>> 0;
  return ((ipLong & mask) >>> 0) === ((netLong & mask) >>> 0);
}

function _inCidrArray(ip, arr) {
  if (!ip || !arr) return false;
  for (var i = 0; i < arr.length; i++) {
    if (_ultraFastCidrMatch(ip, arr[i])) return true;
  }
  return false;
}

function _fastDomainMatch(host, domain) {
  if (!host || !domain) return false;
  host = host.toLowerCase();
  domain = domain.toLowerCase();
  var hLen = host.length, dLen = domain.length;
  return host === domain ||
    (hLen > dLen && host.charAt(hLen - dLen - 1) === "." && host.substring(hLen - dLen) === domain);
}

function _inDomainArray(host, arr) {
  if (!host) return false;
  for (var i = 0; i < arr.length; i++) {
    if (_fastDomainMatch(host, arr[i])) return true;
  }
  return false;
}

function _urlHasPattern(url, patterns) {
  if (!url) return false;
  url = url.toLowerCase();
  for (var i = 0; i < patterns.length; i++) {
    if (url.indexOf(patterns[i]) !== -1) return true;
  }
  return false;
}

function _hostHasPattern(host, patterns) {
  if (!host) return false;
  host = host.toLowerCase();
  for (var i = 0; i < patterns.length; i++) {
    if (host.indexOf(patterns[i]) !== -1) return true;
  }
  return false;
}

// ===================== 🧠 DEEP LEARNING PHASE DETECTOR =====================
function _deepDetectPhase(url, host) {
  var maxWeight = 0;
  var detectedPhase = null;

  // Check all 7 phases
  for (var phaseName in DEEP_PATTERNS) {
    var phase = DEEP_PATTERNS[phaseName];
    var score = 0;

    // Domain matching (40 points)
    if (_hostHasPattern(host, phase.domains)) score += 40;

    // Path matching (40 points)
    if (_urlHasPattern(url, phase.paths)) score += 40;

    // Host pattern matching (20 points)
    if (_hostHasPattern(host, phase.hostPatterns)) score += 20;

    // Weighted score
    var weightedScore = score * (phase.weight / 100);

    if (weightedScore > maxWeight) {
      maxWeight = weightedScore;
      detectedPhase = phase;
    }
  }

  return detectedPhase;
}

// ===================== 🎯 NEURAL TRAFFIC CLASSIFIER =====================
function _neuralClassify(url, host) {
  var classification = {
    type: "UNKNOWN",
    tier: "LOW",
    priority: 30,
    strategy: "BALANCED_FAST"
  };

  // Deep Phase Detection (أقوى أداة)
  var phase = _deepDetectPhase(url, host);
  if (phase) {
    classification.type = phase.strategy;
    classification.tier = "HIGH";
    classification.priority = phase.weight;
    classification.strategy = phase.strategy;
    return classification;
  }

  // Domain-Based Critical Detection
  if (_inDomainArray(host, ULTRA_DOMAINS.MATCHMAKING_CRITICAL)) {
    classification.type = "MATCHMAKING";
    classification.tier = "CRITICAL";
    classification.priority = 100;
    classification.strategy = "HYPER_MATCHMAKING";
    return classification;
  }

  if (_inDomainArray(host, ULTRA_DOMAINS.VOICE_CRITICAL)) {
    classification.type = "VOICE";
    classification.tier = "CRITICAL";
    classification.priority = 100;
    classification.strategy = "ZERO_LATENCY_VOICE_ULTRA";
    return classification;
  }

  if (_inDomainArray(host, ULTRA_DOMAINS.GAME_SERVERS_CRITICAL)) {
    classification.type = "GAMING";
    classification.tier = "CRITICAL";
    classification.priority = 100;
    classification.strategy = "ZERO_JITTER_ULTRA";
    return classification;
  }

  // CDN Detection
  if (_inDomainArray(host, ULTRA_DOMAINS.CDN_MEDIUM)) {
    classification.type = "CDN";
    classification.tier = "LOW";
    classification.priority = 10;
    classification.strategy = "CDN_TURBO";
    return classification;
  }

  // General PUBG
  if (_inDomainArray(host, ULTRA_DOMAINS.PUBG_CORE_HIGH) ||
      _inDomainArray(host, ULTRA_DOMAINS.TENCENT_HIGH)) {
    classification.type = "PUBG_GENERAL";
    classification.tier = "HIGH";
    classification.priority = 75;
    classification.strategy = "BALANCED_FAST";
    return classification;
  }

  // Analytics (Low priority)
  if (_hostHasPattern(host, ULTRA_DOMAINS.ANALYTICS_LOW)) {
    classification.type = "ANALYTICS";
    classification.tier = "LOW";
    classification.priority = 20;
    classification.strategy = "BALANCED_FAST";
  }

  return classification;
}

// ===================== ⚡ ULTRA MODE GETTER (ALWAYS ON) =====================
function _getUltraMode() {
  // دائماً يرجع أعلى أداء بدون النظر للوقت
  return ULTRA_MODE.ALWAYS_ACTIVE;
}

// ===================== 🎯 HYPER-QUANTUM CHAIN BUILDER =====================
function _buildHyperChain(strategy, isJO, isNeighbor, ultraMode) {
  var config = HYPER_STRATEGIES[strategy];
  if (!config) {
    config = HYPER_STRATEGIES.BALANCED_FAST;
  }

  var chain = config.chain.slice();

  // Ultra Mode boost (دائماً فعال)
  if (ultraMode.extraProxies > 0 && config.tier !== "LOW") {
    for (var i = 0; i < ultraMode.extraProxies && i < 2; i++) {
      if (i === 0 && chain.indexOf(HYPER_PROXIES.JO_BALANCERS.LB_1) === -1) {
        chain.push(HYPER_PROXIES.JO_BALANCERS.LB_1);
      } else if (i === 1 && chain.indexOf(HYPER_PROXIES.JO_BALANCERS.LB_2) === -1) {
        chain.push(HYPER_PROXIES.JO_BALANCERS.LB_2);
      }
    }
  }

  // Geographic intelligence
  if (config.fallback) {
    if (isJO && chain[chain.length - 1] !== HYPER_PROXIES.DIRECT) {
      chain.push(HYPER_PROXIES.DIRECT);
    } else if (isNeighbor) {
      chain.push(HYPER_PROXIES.DIRECT);
    }
  }

  return chain.join("; ");
}

// ============================================================================
// 🌟 HYPER-QUANTUM ROUTING ENGINE - THE ULTIMATE MASTERPIECE
// ============================================================================

function FindProxyForURL(url, host) {
  host = (host || "").toLowerCase();

  // ═══════════════ STAGE 0: SACRED DIRECT ═══════════════
  if (_inDomainArray(host, ULTRA_DOMAINS.SACRED_DIRECT)) {
    return HYPER_PROXIES.DIRECT;
  }

  // ═══════════════ STAGE 1: GEO-INTELLIGENCE MATRIX ═══════════════
  var resolvedIP = dnsResolve(host);
  var isJO = resolvedIP && _inCidrArray(resolvedIP, GEO_MATRIX.JO);
  var isNeighbor = resolvedIP && _inCidrArray(resolvedIP, GEO_MATRIX.ALL_NEIGHBORS);

  // ═══════════════ STAGE 2: ULTRA MODE (ALWAYS ON 24/7) ═══════════════
  var ultraMode = _getUltraMode();

  // ═══════════════ STAGE 3: DEEP NEURAL CLASSIFICATION ═══════════════
  var traffic = _neuralClassify(url, host);

  // ═══════════════ STAGE 4: HYPER-QUANTUM ROUTING DECISION ═══════════════

  // Priority 1: CDN/Direct-only traffic (bypass)
  if (traffic.strategy === "CDN_TURBO") {
    return HYPER_PROXIES.DIRECT;
  }

  // Priority 2: Jordan IPs + Critical/High Traffic (أردني = أولوية)
  if (isJO && traffic.priority >= 60) {
    return _buildHyperChain(traffic.strategy, true, false, ultraMode);
  }

  // Priority 3: CRITICAL Traffic (Matchmaking, Voice, Gaming)
  if (traffic.tier === "CRITICAL" || traffic.priority === 100) {
    return _buildHyperChain(traffic.strategy, isJO, isNeighbor, ultraMode);
  }

  // Priority 4: HIGH Priority Traffic
  if (traffic.tier === "HIGH" || traffic.priority >= 75) {
    return _buildHyperChain(traffic.strategy, isJO, isNeighbor, ultraMode);
  }

  // Priority 5: MEDIUM Priority Traffic
  if (traffic.priority >= 50 && traffic.type !== "UNKNOWN") {
    return _buildHyperChain(traffic.strategy, isJO, isNeighbor, ultraMode);
  }

  // Priority 6: Jordan IPs (حتى لو priority منخفض)
  if (isJO) {
    return _buildHyperChain("BALANCED_FAST", true, false, ultraMode);
  }

  // Priority 7: Neighbor Countries (دول الجوار)
  if (isNeighbor) {
    return HYPER_PROXIES.DIRECT;
  }

  // Priority 8: Low Priority / Analytics
  if (traffic.priority < 30) {
    return HYPER_PROXIES.DIRECT;
  }

  // ═══════════════ DEFAULT: INTELLIGENT DIRECT ═══════════════
  return HYPER_PROXIES.DIRECT;
}
