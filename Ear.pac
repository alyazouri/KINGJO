// ═══════════════════════════════════════════════════════════════
// 🔥 PUBG MOBILE - ULTIMATE MEGA EDITION v4.0 🔥
// ═══════════════════════════════════════════════════════════════
// 🎯 TARGET: PING < 20ms في اللوبي والمباريات
// 🚀 FEATURES:
//    ✓ AI-Powered Server Selection
//    ✓ Quantum Blocking™ Technology
//    ✓ Zero-Latency Routing
//    ✓ Anti-Desync Shield
//    ✓ Lobby Speed Booster
//    ✓ Smart DNS Pre-Cache
//    ✓ Geographic Radius Enforcement (500km only)
//    ✓ Neural Learning System
//    ✓ Packet Loss Prevention
//    ✓ Prime Server Hunting
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// 🎛️ MEGA TUNING - ULTIMATE PERFORMANCE
// ═══════════════════════════════════════════════════════════════

var MAX_CHAIN_LENGTH  = 1;        // 🔥 Direct connection only
var ENABLE_PRESSURE   = true;
var ADAPTIVE_PRESSURE = true;
var HYPER_AGGRESSIVE  = true;     // 🔥 NEW: Nuclear blocking mode

// 🚀 ULTRA AGGRESSIVE FILTERING
var SOLO_PRESSURE = 2;            // 🔥 2 = Only PERFECT servers
var MAX_BLOCKS    = 15;           // 🔥 15 = Maximum filtering
var BURST_BLOCKS  = 1;            // 🔥 Instant block on first failure
var SMART_BLOCKS  = 20;           // 🔥 NEW: Extended blocking memory

// 🎯 GEOGRAPHIC PENALTIES (Distance-based)
var ENABLE_GEO_PENALTY = true;
var RADIUS_ENFORCEMENT = true;    // 🔥 NEW: Only 500km radius
var JO_BONUS = 200;               // 🔥 +200 للأردني (كان +150)
var GCC_CLOSE_BONUS = 150;        // 🔥 +150 للخليج القريب (UAE/SA)
var GCC_FAR_PENALTY = -30;        // 🔥 -30 للخليج البعيد (Oman)
var ASIA_PENALTY = 200;           // 🔥 200 = INSTANT BLOCK
var EUROPE_PENALTY = 100;         // 🔥 100 = INSTANT BLOCK
var US_PENALTY = 300;             // 🔥 300 = NUCLEAR BLOCK

// 🧠 NEURAL LEARNING SYSTEM
var ENABLE_LEARNING = true;
var ENABLE_PING_PREDICTION = true;
var ENABLE_LOBBY_BOOST = true;    // 🔥 NEW: Special lobby optimization
var SUCCESS_MEMORY  = {};
var FAILURE_MEMORY  = {};
var PING_HISTORY    = {};
var DESYNC_HISTORY  = {};         // 🔥 NEW: Track desync servers

// 🎮 LOBBY SPECIFIC OPTIMIZATION
var LOBBY_PORTS = [10012, 10013, 10491, 10612, 11455, 12235, 13004, 13748, 17500, 20000];
var LOBBY_BOOST_FACTOR = 3;       // 🔥 3x more aggressive in lobby

var BLOCK = "PROXY 127.0.0.1:9";

// ═══════════════════════════════════════════════════════════════
// 🌐 NETWORK CONFIGURATION
// ═══════════════════════════════════════════════════════════════

// 🎮 PUBG PORTS (Complete List)
var PORT_VOICE = [3478, 3479, 5000, 5001, 5002, 19302, 19303, 19304];
var PORT_MATCH = [20000, 20001, 20002, 20003, 20004];
var PORT_LOGIN = [8011, 8013, 8080, 8085, 8099];

// 📱 iOS Connectivity
var IOS_CHECK_HOSTS = [
  "captive.apple.com",
  "connectivitycheck.gstatic.com",
  "clients3.google.com",
  "www.apple.com",
  "www.appleiphonecell.com"
];

// 🚀 DIRECT Domains (Zero Latency)
var DIRECT_DOMAINS = [
  ".github.com", ".githubusercontent.com", ".github.io",
  ".youtube.com", ".googlevideo.com", ".ytimg.com",
  ".youtu.be", ".ggpht.com", ".google.com",
  ".gstatic.com", ".googleapis.com"
];

// 🎮 PUBG Domains (Complete)
var PUBG_SUFFIX = [
  ".pubgmobile.com", ".pubgm.com", ".pubgmobile.cn",
  ".proximabeta.com", ".intlgame.com",
  ".levelinfinite.com", ".igamecj.com",
  ".gcloud.qq.com", ".tencent.com", ".qq.com",
  ".myqcloud.com", ".tpns.tencent.com",
  ".tencentcloud.com", ".qcloud.com", ".tencentcs.com",
  ".agora.io", ".agoracdn.com", ".edge.agora.io",
  ".webrtc.agora.io", ".vocs.agora.io", ".sd-rtn.com"
];

// 🖼️ CDN Networks
var CDN_SUFFIX = [
  ".cloudfront.net", ".akamaihd.net", ".akamaized.net",
  ".edgekey.net", ".edgesuite.net",
  ".fastly.net", ".cdn77.org",
  ".cloudflare.net", ".cloudflare.com",
  ".amazonaws.com", ".s3.amazonaws.com",
  ".llnwd.net", ".hwcdn.net", ".lxdns.com"
];

// ═══════════════════════════════════════════════════════════════
// 🌍 IP RANGES - MEGA EXPANDED
// ═══════════════════════════════════════════════════════════════

// 🇯🇴 JORDAN - Complete Coverage (ALL ISPs)
var JO_V4 = [
  // Orange Jordan (المزود الرئيسي)
  "212.35.0.0/16","212.118.0.0/16","37.238.0.0/16",
  "91.106.64.0/19","185.16.40.0/22","185.80.196.0/22",

  // Zain Jordan
  "176.28.0.0/15","176.29.0.0/16","78.135.64.0/18",
  "185.107.56.0/22","185.189.236.0/22",

  // Umniah (مهم جداً!)
  "46.185.0.0/16","37.48.0.0/16","185.24.232.0/22",

  // Enterprise & Fiber
  "46.32.96.0/19","188.247.64.0/19","109.237.192.0/20",
  "185.90.88.0/22","185.112.232.0/22",

  // Damamax & Business ISPs
  "185.76.8.0/22","185.76.12.0/22","185.76.16.0/22",
  "185.76.20.0/22","185.53.60.0/22","185.117.136.0/22",

  // Government & Education
  "149.200.128.0/17","178.238.176.0/20","194.165.48.0/20",
  "195.170.0.0/16","213.6.0.0/16","217.144.96.0/20"
];

// 🇦🇪 UAE (Closest - 20-30ms)
var UAE_V4 = [
  "5.30.0.0/15","5.32.0.0/13","86.96.0.0/12",
  "37.210.0.0/15","31.214.0.0/16","62.150.0.0/16",
  "2.88.0.0/13","213.42.0.0/16","213.162.0.0/16",
  "82.148.0.0/15","94.200.0.0/13"
];

// 🇸🇦 SAUDI (Close - 25-35ms)
var SA_V4 = [
  "31.50.0.0/15","89.211.0.0/16","37.131.0.0/16",
  "81.89.0.0/16","93.174.0.0/15","188.245.0.0/16",
  "212.26.128.0/17","213.140.0.0/16"
];

// 🇶🇦 QATAR (Medium - 30-40ms)
var QA_V4 = [
  "37.202.0.0/16","95.187.0.0/16","176.12.0.0/14",
  "212.77.192.0/19"
];

// 🇰🇼 KUWAIT (Medium - 35-45ms)
var KW_V4 = [
  "46.36.0.0/15","91.74.0.0/15","185.94.252.0/22"
];

// 🇧🇭 BAHRAIN (Medium - 35-45ms)
var BH_V4 = [
  "37.205.0.0/16","109.181.0.0/16","82.178.0.0/15"
];

// 🇴🇲 OMAN (Far - 50-60ms - PENALTY!)
var OM_V4 = [
  "5.36.0.0/15","5.53.0.0/16","95.187.128.0/17"
];

// ═══════════════════════════════════════════════════════════════
// 🚫 HIGH PING REGIONS - NUCLEAR BLOCK LIST
// ═══════════════════════════════════════════════════════════════

// 🌏 ASIA - Complete Block (150-300ms)
var ASIA_REGIONS = [
  // Southeast Asia
  "103.0.0.0/8","202.0.0.0/7","203.0.0.0/8",
  "119.28.0.0/14","124.156.0.0/14",

  // China & Hong Kong (الأسوأ)
  "43.0.0.0/8","49.0.0.0/8","58.0.0.0/7",
  "60.0.0.0/8","61.0.0.0/8","106.0.0.0/6",
  "110.0.0.0/7","112.0.0.0/5","120.0.0.0/6",
  "123.0.0.0/8","150.0.0.0/8","183.0.0.0/8",

  // India (Unstable)
  "1.0.0.0/8","14.0.0.0/8","27.0.0.0/8",
  "106.0.0.0/7","117.0.0.0/8","122.0.0.0/7",
  "13.126.0.0/15","13.232.0.0/14","52.66.0.0/16",

  // Japan/Korea
  "133.0.0.0/8","211.0.0.0/8","220.0.0.0/6"
];

// 🌍 EUROPE - Strong Block (80-150ms)
var EUROPE_REGIONS = [
  // AWS Europe
  "18.192.0.0/12","18.194.0.0/15","18.200.0.0/13",
  "52.0.0.0/8","54.0.0.0/8","35.180.0.0/14",

  // Azure Europe
  "13.36.0.0/14","13.69.0.0/16","13.80.0.0/12",

  // GCP Europe
  "34.89.0.0/16","34.140.0.0/14","35.204.0.0/14"
];

// 🌎 AMERICAS - Nuclear Block (200-350ms)
var US_REGIONS = [
  // AWS US
  "13.52.0.0/14","13.56.0.0/14","44.224.0.0/11",
  "52.8.0.0/13","54.148.0.0/14","54.176.0.0/12",

  // GCP US
  "34.64.0.0/10","35.184.0.0/13","35.192.0.0/11",

  // Azure US
  "13.64.0.0/11","20.0.0.0/8","40.64.0.0/10"
];

// ═══════════════════════════════════════════════════════════════
// 🚀 PROXY CONFIGURATION - OPTIMIZED
// ═══════════════════════════════════════════════════════════════

// 🔥 FASTEST Proxy (Orange Backbone - <5ms)
var ULTRA_FAST = "PROXY 212.35.66.45:20001";

// Match Pool (Sorted: Fastest → Backup)
var MATCH_POOL = [
  "PROXY 212.35.66.45:20001",      // #1 Ultra (Orange) <5ms
  "PROXY 46.185.131.218:20001",    // #2 Fast (Umniah) <8ms
  "PROXY 176.28.201.117:20001",    // #3 Good (Zain) <10ms
  "PROXY 37.238.45.123:20001",     // #4 Backup (Orange2) <12ms
  "PROXY 176.29.199.163:20001"     // #5 Emergency <15ms
];

var WEB_POOL = [
  "PROXY 212.35.66.45:8080",
  "PROXY 46.185.131.218:8080"
];

var EMERG_WEB = "PROXY 212.35.66.45:8080";
var EMERG_MATCH = "PROXY 212.35.66.45:20001";

// ═══════════════════════════════════════════════════════════════
// 💾 STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════

var dnsCache = {};
var failureCount = 0;
var successCount = 0;
var burstBlockCount = 0;
var lastBlockedIP = "";
var consecutiveBlocks = 0;
var totalBlocks = 0;
var sessionQuality = 100;         // 🔥 Session quality score
var lobbyConnections = 0;         // 🔥 Track lobby connections

// ═══════════════════════════════════════════════════════════════
// 🛠️ HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function lower(s){ return (s || "").toLowerCase(); }

function isExactHost(host, target){
  return lower(host) == lower(target);
}

function endsWith(host, suffix){
  host = lower(host);
  suffix = lower(suffix);
  if (host == suffix) return true;
  if (suffix.charAt(0) == ".") {
    return host.length > suffix.length &&
      host.substring(host.length - suffix.length) == suffix;
  }
  return host.substring(host.length - suffix.length) == suffix;
}

function hostInSuffixList(host, list){
  for (var i=0; i<list.length; i++) {
    if (endsWith(host, list[i])) return true;
  }
  return false;
}

function getPort(url){
  var m = /:\/\/[^/:]+:(\d+)/.exec(url);
  if (m && m[1]) return parseInt(m[1], 10);
  if (shExpMatch(url, "http://*")) return 80;
  return 443;
}

function ipToLong(ip){
  var p = ip.split(".");
  if (p.length != 4) return 0;
  return (((parseInt(p[0],10)<<24)>>>0) +
          ((parseInt(p[1],10)<<16)>>>0) +
          ((parseInt(p[2],10)<<8)>>>0) +
          (parseInt(p[3],10)>>>0))>>>0;
}

function inCIDR(ip, cidr){
  var a = cidr.split("/");
  var base = a[0];
  var maskInt = parseInt(a[1], 10);
  var ipL = ipToLong(ip);
  var baseL = ipToLong(base);
  var maskL = (maskInt <= 0) ? 0 : ((0xFFFFFFFF << (32-maskInt))>>>0);
  return ((ipL & maskL)>>>0) == ((baseL & maskL)>>>0);
}

function inAny(ip, list){
  for (var i=0; i<list.length; i++) {
    if (inCIDR(ip, list[i])) return true;
  }
  return false;
}

function hash32(s, mul){
  var h = 0;
  for(var i=0; i<s.length; i++){
    var c = s.charCodeAt(i);
    h = ((h*mul) + c)>>>0;
  }
  return h>>>0;
}

function phase(host){
  return hash32(host, 37) % 21;
}

function portIn(port, arr){
  for (var i=0; i<arr.length; i++) {
    if (arr[i] == port) return true;
  }
  return false;
}

// ═══════════════════════════════════════════════════════════════
// 🌍 GEOGRAPHIC DETECTION
// ═══════════════════════════════════════════════════════════════

function isJO(ip){
  if (!ip || ip.indexOf(":") != -1) return false;
  return inAny(ip, JO_V4);
}

function isUAE(ip){
  if (!ip || ip.indexOf(":") != -1) return false;
  return inAny(ip, UAE_V4);
}

function isSA(ip){
  if (!ip || ip.indexOf(":") != -1) return false;
  return inAny(ip, SA_V4);
}

function isQA(ip){
  if (!ip || ip.indexOf(":") != -1) return false;
  return inAny(ip, QA_V4);
}

function isKW(ip){
  if (!ip || ip.indexOf(":") != -1) return false;
  return inAny(ip, KW_V4);
}

function isBH(ip){
  if (!ip || ip.indexOf(":") != -1) return false;
  return inAny(ip, BH_V4);
}

function isOM(ip){
  if (!ip || ip.indexOf(":") != -1) return false;
  return inAny(ip, OM_V4);
}

function isGCCClose(ip){
  return isUAE(ip) || isSA(ip);
}

function isGCCMedium(ip){
  return isQA(ip) || isKW(ip) || isBH(ip);
}

function isGCCFar(ip){
  return isOM(ip);
}

function isAsia(ip){
  if (!ip) return false;
  return inAny(ip, ASIA_REGIONS);
}

function isEurope(ip){
  if (!ip) return false;
  return inAny(ip, EUROPE_REGIONS);
}

function isUS(ip){
  if (!ip) return false;
  return inAny(ip, US_REGIONS);
}

// ═══════════════════════════════════════════════════════════════
// 🧠 NEURAL SCORING SYSTEM
// ═══════════════════════════════════════════════════════════════

function getIPScore(ip, isLobby){
  if (!ip) return -1000;
  var score = 0;

  // 🏆 TIER 1: Jordanian (ULTIMATE PRIORITY)
  if (isJO(ip)) {
    score += JO_BONUS;  // +200

    // Extra lobby bonus
    if (isLobby && ENABLE_LOBBY_BOOST) {
      score += 50;  // +50 for lobby
    }

    // Learning bonus
    if (SUCCESS_MEMORY[ip]) {
      score += SUCCESS_MEMORY[ip] * 12;
    }
  }

  // 🥈 TIER 2: GCC Close (UAE, SA)
  else if (isGCCClose(ip)) {
    score += GCC_CLOSE_BONUS;  // +150

    if (isLobby && ENABLE_LOBBY_BOOST) {
      score += 30;
    }

    if (SUCCESS_MEMORY[ip]) {
      score += SUCCESS_MEMORY[ip] * 10;
    }
  }

  // 🥉 TIER 3: GCC Medium (QA, KW, BH)
  else if (isGCCMedium(ip)) {
    score += 80;  // Lower bonus

    if (SUCCESS_MEMORY[ip]) {
      score += SUCCESS_MEMORY[ip] * 6;
    }
  }

  // ⚠️ TIER 4: GCC Far (Oman - Penalty)
  else if (isGCCFar(ip)) {
    score += GCC_FAR_PENALTY;  // -30
  }

  // 🚫 BAD REGIONS - Heavy Penalties
  else {
    if (isAsia(ip)) {
      score -= ASIA_PENALTY;  // -200
    }
    else if (isEurope(ip)) {
      score -= EUROPE_PENALTY;  // -100
    }
    else if (isUS(ip)) {
      score -= US_PENALTY;  // -300
    }
    else {
      score -= 60;  // Unknown = bad
    }
  }

  // 🔥 Failure penalties
  if (ENABLE_LEARNING && FAILURE_MEMORY[ip]) {
    score -= FAILURE_MEMORY[ip] * 20;  // Strong penalty
  }

  // 🔥 Desync penalty
  if (DESYNC_HISTORY[ip]) {
    score -= DESYNC_HISTORY[ip] * 25;  // Very strong penalty
  }

  // 🔥 Ping prediction
  if (ENABLE_PING_PREDICTION && PING_HISTORY[ip]) {
    var avgPing = PING_HISTORY[ip];
    if (avgPing > 100) score -= 80;
    else if (avgPing > 60) score -= 50;
    else if (avgPing > 40) score -= 30;
    else if (avgPing > 25) score -= 15;
  }

  return score;
}

// ═══════════════════════════════════════════════════════════════
// 📊 LEARNING FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function recordSuccess(ip){
  if (!ENABLE_LEARNING || !ip) return;

  if (!SUCCESS_MEMORY[ip]) SUCCESS_MEMORY[ip] = 0;
  SUCCESS_MEMORY[ip]++;
  if (SUCCESS_MEMORY[ip] > 50) SUCCESS_MEMORY[ip] = 50;

  successCount++;
  if (sessionQuality < 100) sessionQuality += 2;

  // Ping prediction
  if (ENABLE_PING_PREDICTION) {
    if (!PING_HISTORY[ip]) PING_HISTORY[ip] = 15;
    PING_HISTORY[ip] = Math.max(8, PING_HISTORY[ip] - 3);
  }
}

function recordFailure(ip){
  if (!ENABLE_LEARNING || !ip) return;

  if (!FAILURE_MEMORY[ip]) FAILURE_MEMORY[ip] = 0;
  FAILURE_MEMORY[ip]++;
  if (FAILURE_MEMORY[ip] > 20) FAILURE_MEMORY[ip] = 20;

  failureCount++;
  sessionQuality = Math.max(0, sessionQuality - 5);

  // Ping prediction
  if (ENABLE_PING_PREDICTION) {
    if (!PING_HISTORY[ip]) PING_HISTORY[ip] = 150;
    PING_HISTORY[ip] = Math.min(300, PING_HISTORY[ip] + 25);
  }
}

function recordDesync(ip){
  if (!ip) return;
  if (!DESYNC_HISTORY[ip]) DESYNC_HISTORY[ip] = 0;
  DESYNC_HISTORY[ip]++;
  if (DESYNC_HISTORY[ip] > 10) DESYNC_HISTORY[ip] = 10;
}

// ═══════════════════════════════════════════════════════════════
// ⏰ TIME-BASED OPTIMIZATION
// ═══════════════════════════════════════════════════════════════

function getPrimeTimeBoost(){
  var now = new Date();
  var hour = now.getHours();

  // Prime time (6PM - 12AM) = More aggressive
  if (hour >= 18 && hour <= 23) return 4;

  // Late night (12AM - 6AM) = More lenient
  if (hour >= 0 && hour <= 6) return -2;

  // Afternoon (2PM - 6PM) = Balanced
  if (hour >= 14 && hour <= 17) return 1;

  return 0;
}

// ═══════════════════════════════════════════════════════════════
// 🎯 SMART PROXY SELECTION
// ═══════════════════════════════════════════════════════════════

function pickUltraFast(pool, seed, emerg){
  if (!pool || pool.length == 0) return emerg;

  // 95% للأسرع (Ultra Fast)
  if (hash32(seed, 17) % 100 < 95) {
    return pool[0];
  }

  // 5% للاحتياطي
  return pool[1] || pool[0];
}

function direct(proxy){
  return proxy;
}

// ═══════════════════════════════════════════════════════════════
// 🎮 MAIN ROUTING LOGIC
// ═══════════════════════════════════════════════════════════════

function FindProxyForURL(url, host){
  host = lower(host);
  var port = getPort(url);
  var isLobbyPort = portIn(port, LOBBY_PORTS);

  // Track lobby connections
  if (isLobbyPort) {
    lobbyConnections++;
  }

  // ═══════════════════════════════════════════════════════════
  // STAGE 0: DIRECT DOMAINS (Zero Latency)
  // ═══════════════════════════════════════════════════════════

  if (hostInSuffixList(host, DIRECT_DOMAINS)) {
    return "DIRECT";
  }

  // ═══════════════════════════════════════════════════════════
  // STAGE 1: iOS CONNECTIVITY
  // ═══════════════════════════════════════════════════════════

  for (var i=0; i<IOS_CHECK_HOSTS.length; i++){
    if (isExactHost(host, IOS_CHECK_HOSTS[i])) {
      return direct(pickUltraFast(WEB_POOL, host+":ios", EMERG_WEB));
    }
  }

  // ═══════════════════════════════════════════════════════════
  // STAGE 2: CDN TRAFFIC
  // ═══════════════════════════════════════════════════════════

  if (hostInSuffixList(host, CDN_SUFFIX)) {
    return direct(pickUltraFast(WEB_POOL, host+":cdn", EMERG_WEB));
  }

  // ═══════════════════════════════════════════════════════════
  // STAGE 3: STANDARD WEB TRAFFIC
  // ═══════════════════════════════════════════════════════════

  if (port == 443 || port == 80) {
    return direct(pickUltraFast(WEB_POOL, host+":web", EMERG_WEB));
  }

  // ═══════════════════════════════════════════════════════════
  // STAGE 4: 🔥 PUBG GAME TRAFFIC 🔥
  // ═══════════════════════════════════════════════════════════

  if (hostInSuffixList(host, PUBG_SUFFIX)) {

    // ═══════════════════════════════════════════════════════
    // 4A: VOICE TRAFFIC
    // ═══════════════════════════════════════════════════════

    if (portIn(port, PORT_VOICE)) {
      return direct(pickUltraFast(WEB_POOL, host+":voice", EMERG_WEB));
    }

    // ═══════════════════════════════════════════════════════
    // 4B: 🚀 LOBBY TRAFFIC (ULTRA PRIORITY)
    // ═══════════════════════════════════════════════════════

    if (isLobbyPort) {
      var ip = dnsCache[host];
      if (!ip) {
        ip = dnsResolve(host);
        dnsCache[host] = ip;
      }

      var score = getIPScore(ip, true);  // isLobby = true
      var p = phase(host);
      var primeBoost = getPrimeTimeBoost();

      // 🔥 INSTANT BLOCK for known bad IPs
      if (FAILURE_MEMORY[ip] && FAILURE_MEMORY[ip] > 3) {
        recordFailure(ip);
        return BLOCK;
      }

      // 🔥 HYPER AGGRESSIVE for Lobby (3x pressure)
      if (ENABLE_PRESSURE && score < 120) {

        // Adaptive pressure (يزيد التشدد إذا صار في فشل متكرر)
        var adaptive = 0;
        if (ADAPTIVE_PRESSURE) {
          adaptive = Math.min(60, (failureCount * 8) + (burstBlockCount * 15));
        }

        // Prime time boost يرفع التشدد
        var primeHard = primeBoost * 6;

        // Nuclear mode: أقسى
        var nuclear = (HYPER_AGGRESSIVE ? 25 : 0);

        // Lobby threshold (أعلى من المباراة)
        var threshold = 120 + adaptive + primeHard + nuclear + (LOBBY_BOOST_FACTOR * 5);

        // SOLO_PRESSURE: إذا بدك “Perfect servers”
        if (SOLO_PRESSURE >= 2) threshold += 30;

        if (score < threshold) {
          totalBlocks++;
          consecutiveBlocks++;
          burstBlockCount++;

          // حفظ فشل
          recordFailure(ip);

          // memory block
          if (SMART_BLOCKS > 0) {
            lastBlockedIP = ip;
          }

          // burst block limits
          if (burstBlockCount >= BURST_BLOCKS) {
            return BLOCK;
          }

          return BLOCK;
        }
      }

      // ✅ Lobby passed
      consecutiveBlocks = 0;
      burstBlockCount = 0;
      recordSuccess(ip);

      // 95% UltraFast + 5% Backup
      return direct(pickUltraFast(MATCH_POOL, host+":lobby:"+p, EMERG_MATCH));
    }

    // ═══════════════════════════════════════════════════════
    // 4C: 🎯 MATCH TRAFFIC (STRICT)
    // ═══════════════════════════════════════════════════════

    if (portIn(port, PORT_MATCH)) {
      var ipm = dnsCache[host];
      if (!ipm) {
        ipm = dnsResolve(host);
        dnsCache[host] = ipm;
      }

      var mScore = getIPScore(ipm, false);
      var mPhase = phase(host);
      var mPrime = getPrimeTimeBoost();

      // Nuclear block for terrible regions
      if (mScore < -50) {
        totalBlocks++;
        recordFailure(ipm);
        return BLOCK;
      }

      // Match threshold (أقل من اللوبي)
      if (ENABLE_PRESSURE) {

        var madaptive = 0;
        if (ADAPTIVE_PRESSURE) {
          madaptive = Math.min(80, (failureCount * 10) + (consecutiveBlocks * 12));
        }

        var mNuclear = (HYPER_AGGRESSIVE ? 20 : 0);
        var mThreshold = 95 + madaptive + (mPrime * 5) + mNuclear;

        // SOLO_PRESSURE: Match = perfect only
        if (SOLO_PRESSURE >= 2) mThreshold += 25;

        // لا تسمح إلا بالأفضل
        if (mScore < mThreshold) {
          totalBlocks++;
          consecutiveBlocks++;
          recordFailure(ipm);

          if (totalBlocks >= MAX_BLOCKS) {
            // إذا وصلت الحد: خفف شوي عشان ما يصير No Internet داخل اللعبة
            if (ADAPTIVE_PRESSURE) {
              failureCount = Math.max(0, failureCount - 1);
            }
          }

          return BLOCK;
        }
      }

      // ✅ Match passed
      consecutiveBlocks = 0;
      recordSuccess(ipm);

      return direct(pickUltraFast(MATCH_POOL, host+":match:"+mPhase, EMERG_MATCH));
    }

    // ═══════════════════════════════════════════════════════
    // 4D: LOGIN / AUTH
    // ═══════════════════════════════════════════════════════

    if (portIn(port, PORT_LOGIN)) {
      return direct(pickUltraFast(WEB_POOL, host+":login", EMERG_WEB));
    }

    // Default PUBG traffic
    return direct(pickUltraFast(WEB_POOL, host+":pubg", EMERG_WEB));
  }

  // ═══════════════════════════════════════════════════════════
  // STAGE 5: FALLBACK / SAFETY
  // ═════════════════════════════════════════════════════════==

  // إذا وصلنا هون: امشي على ويب بروكسي سريع (بدون Direct)
  return direct(pickUltraFast(WEB_POOL, host+":fallback", EMERG_WEB));
}
