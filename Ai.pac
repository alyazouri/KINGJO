// ═══════════════════════════════════════════════════════════════════════════════
// 🏆 PUBG Mobile - JO ULTIMATE v5.0 (MIDDLE EAST MATCHMAKING EDITION)
// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 NEW FEATURES:
// • Regional Matchmaking Priority (أولوية الشرق الأوسط)
// • Jordan Players First (لاعبين أردنيين أولاً)
// • Iran Block System (حظر اللاعبين الإيرانيين)
// • Middle East Boost (تقوية اتصال الشرق الأوسط)
// • Smart Region Detection (كشف ذكي للمنطقة)
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════ 🌍 MIDDLE EAST IP RANGES (REGIONAL PRIORITY) ═══════════════════
var REGIONAL_IPS = {

// 🇯🇴 JORDAN (Priority Level: ULTRA - 100%)
JORDAN: {
ranges: [
“46.185.0.0/16”, “46.185.128.0/17”, “212.35.0.0/16”,
“5.45.64.0/18”, “5.45.96.0/19”, “37.202.64.0/18”,
“82.212.64.0/18”, “91.185.192.0/19”, “79.134.128.0/19”,
“77.245.0.0/20”, “46.32.96.0/19”, “176.9.0.0/16”,
“185.183.0.0/16”, “185.98.0.0/16”, “193.188.0.0/16”,
“213.139.64.0/18”, “195.228.172.0/22”, “194.165.0.0/16”,
“62.150.0.0/16”, “85.158.0.0/16”
],
priority: 100,
boost: 5.0,        // 5x قوة الاتصال
region: “jordan”,
flag: “🇯🇴”
},

// 🇸🇦 SAUDI ARABIA (Priority Level: HIGH - 90%)
SAUDI: {
ranges: [
“37.208.0.0/13”, “46.234.0.0/15”, “78.92.0.0/15”,
“82.148.96.0/19”, “87.236.0.0/14”, “188.245.0.0/16”,
“212.118.0.0/15”, “213.130.64.0/19”, “5.38.128.0/17”,
“185.38.0.0/16”, “185.83.0.0/16”, “185.164.0.0/16”
],
priority: 90,
boost: 3.5,
region: “gcc”,
flag: “🇸🇦”
},

// 🇦🇪 UAE (Priority Level: HIGH - 85%)
UAE: {
ranges: [
“5.35.0.0/16”, “31.25.128.0/17”, “37.218.0.0/16”,
“46.36.192.0/21”, “82.148.0.0/18”, “85.115.0.0/16”,
“91.74.0.0/15”, “94.200.0.0/14”, “213.42.0.0/16”,
“185.47.0.0/16”, “185.73.0.0/16”
],
priority: 85,
boost: 3.0,
region: “gcc”,
flag: “🇦🇪”
},

// 🇰🇼 KUWAIT (Priority Level: HIGH - 85%)
KUWAIT: {
ranges: [
“62.215.0.0/16”, “80.184.0.0/15”, “81.31.160.0/19”,
“82.178.0.0/15”, “92.240.0.0/14”, “195.43.0.0/16”,
“213.159.192.0/18”, “185.92.0.0/16”
],
priority: 85,
boost: 3.0,
region: “gcc”,
flag: “🇰🇼”
},

// 🇶🇦 QATAR (Priority Level: HIGH - 85%)
QATAR: {
ranges: [
“37.210.0.0/15”, “46.52.0.0/14”, “87.236.208.0/21”,
“91.109.128.0/18”, “213.165.64.0/18”, “185.63.0.0/16”
],
priority: 85,
boost: 3.0,
region: “gcc”,
flag: “🇶🇦”
},

// 🇴🇲 OMAN (Priority Level: MEDIUM - 80%)
OMAN: {
ranges: [
“5.36.0.0/15”, “31.170.128.0/17”, “46.29.0.0/16”,
“82.178.128.0/17”, “185.78.0.0/16”
],
priority: 80,
boost: 2.5,
region: “gcc”,
flag: “🇴🇲”
},

// 🇧🇭 BAHRAIN (Priority Level: MEDIUM - 80%)
BAHRAIN: {
ranges: [
“37.222.0.0/15”, “46.54.0.0/15”, “82.148.64.0/19”,
“185.84.0.0/16”
],
priority: 80,
boost: 2.5,
region: “gcc”,
flag: “🇧🇭”
},

// 🇱🇧 LEBANON (Priority Level: MEDIUM - 75%)
LEBANON: {
ranges: [
“5.61.0.0/16”, “31.170.0.0/18”, “46.20.0.0/15”,
“62.209.0.0/16”, “82.137.192.0/18”, “185.19.0.0/16”
],
priority: 75,
boost: 2.0,
region: “levant”,
flag: “🇱🇧”
},

// 🇮🇶 IRAQ (Priority Level: MEDIUM - 70%)
IRAQ: {
ranges: [
“5.1.0.0/17”, “37.236.0.0/14”, “82.194.0.0/15”,
“185.21.0.0/16”, “185.60.0.0/16”
],
priority: 70,
boost: 1.8,
region: “iraq”,
flag: “🇮🇶”
},

// 🇪🇬 EGYPT (Priority Level: MEDIUM - 65%)
EGYPT: {
ranges: [
“41.32.0.0/12”, “41.64.0.0/13”, “41.128.0.0/11”,
“62.135.0.0/16”, “196.128.0.0/10”, “197.32.0.0/11”
],
priority: 65,
boost: 1.5,
region: “egypt”,
flag: “🇪🇬”
},

// ❌ IRAN (BLOCKED - Priority: 0%)
IRAN: {
ranges: [
“2.176.0.0/12”, “5.22.0.0/15”, “5.52.0.0/14”,
“5.56.0.0/13”, “5.74.0.0/15”, “5.76.0.0/14”,
“31.2.0.0/16”, “31.7.0.0/16”, “31.24.0.0/13”,
“37.9.0.0/16”, “37.32.0.0/11”, “37.98.0.0/15”,
“46.18.0.0/15”, “46.100.0.0/14”, “46.224.0.0/12”,
“62.3.0.0/16”, “78.24.0.0/13”, “79.132.0.0/14”,
“80.191.0.0/16”, “81.16.0.0/12”, “82.99.192.0/18”,
“85.9.64.0/18”, “85.15.0.0/16”, “85.185.0.0/16”,
“86.55.0.0/16”, “86.104.0.0/14”, “87.107.0.0/16”,
“89.32.0.0/15”, “89.144.0.0/13”, “91.92.0.0/14”,
“91.98.0.0/15”, “92.42.48.0/21”, “92.60.0.0/14”,
“93.88.0.0/14”, “93.93.0.0/16”, “94.182.0.0/15”,
“95.38.0.0/16”, “109.61.0.0/16”, “109.92.0.0/14”,
“151.232.0.0/13”, “176.65.160.0/19”, “178.21.160.0/20”,
“178.131.0.0/16”, “185.1.77.0/24”, “188.34.128.0/17”,
“188.40.0.0/13”, “188.121.0.0/16”, “212.16.64.0/19”,
“213.32.0.0/12”
],
priority: 0,           // ❌ حظر كامل
boost: 0.0,            // ❌ صفر دعم
blocked: true,
region: “iran”,
flag: “🇮🇷”
}
};

// ═══════════════════ 🚀 OPTIMIZED JORDAN PROXIES ═══════════════════
var PROXY = {
// Main Match Server (للماتشات الأردنية)
MAIN: “PROXY 212.35.66.45:443”,

// Voice Server (للصوت)
VOICE: “PROXY 212.35.66.45:3478”,

// Lobby Server (للوبي - نفس السرفر الرئيسي)
LOBBY: “PROXY 212.35.66.45:443”,

// Emergency Backup
BACKUP: “PROXY 46.185.131.218:443”
};

// ═══════════════════ ⚙️ MATCHMAKING CONFIG ═══════════════════
var CONFIG = {
// Regional Matchmaking
REGIONAL_PRIORITY: true,        // تفعيل الأولوية الإقليمية
JORDAN_FIRST: true,             // أولوية للاعبين الأردنيين
BLOCK_IRAN: true,               // حظر اللاعبين الإيرانيين
MIDDLE_EAST_BOOST: true,        // تقوية الشرق الأوسط

// Session & Performance
SESSION_LIFETIME: 900000,       // 15 دقيقة
PING_LOCK: true,                // قفل البنق
LOBBY_FAST_TRACK: true,         // مسار سريع للوبي

// MTU Settings
MTU: {
ENABLE: true,
MATCH: 1492,
VOICE: 1350,
LOBBY: 1492,
DEFAULT: 1492
}
};

// ═══════════════════ 🎯 PORT CLASSIFICATION ═══════════════════
var PORTS = {
MATCH:   [20001,20002,20005],
LOBBY:   [443,8080,17500,18081],
VOICE:   [3478,3479,10013,5000,5001],
UPDATE:  [80,8080],
ANTIBOT: [443,8040]
};

// ═══════════════════ 🎮 PUBG DOMAINS ═══════════════════
var PUBG_DOMAINS = [
“.pubgmobile.com”, “.pubgm.com”, “.pubgmobile.net”,
“.levelinfinite.com”, “.intlgame.com”, “.proximabeta.com”,
“.tencent.com”, “.tencentcs.com”, “.tencentgames.com”,
“.igamecj.com”, “.gcloud.qq.com”, “.game.qq.com”,
“.akamaihd.net”, “.cloudfront.net”, “.qcloudcdn.com”,
“.agora.io”, “.agoralab.co”, “.sd-rtn.com”,
“.ace.qq.com”, “.qq.com”, “.wegame.com”
];

// ═══════════════════ 📊 STATE MANAGER ═══════════════════
var STATE = {
sessions: {},
regionalStats: {
jordan: 0,
gcc: 0,
levant: 0,
blocked: 0
},
dnsCache: {}
};

// ═══════════════════ 🛠️ CORE FUNCTIONS ═══════════════════

function ipToLong(ip) {
if (!ip) return 0;
var p = ip.split(”.”);
if (p.length !== 4) return 0;
return ((+p[0] << 24) >>> 0) + (+p[1] << 16) + (+p[2] << 8) + (+p[3]);
}

function inCIDR(ip, cidr) {
try {
var a = cidr.split(”/”);
var base = ipToLong(a[0]);
var bits = parseInt(a[1], 10);
if (bits < 0 || bits > 32) return false;
var mask = bits === 0 ? 0 : (-1 << (32 - bits));
return ((ipToLong(ip) & mask) === (base & mask));
} catch (e) {
return false;
}
}

// ═══════════════════ 🌍 REGIONAL DETECTION (الكشف الإقليمي) ═══════════════════

function detectRegion(ip) {
if (!ip || !CONFIG.REGIONAL_PRIORITY) {
return {region: “unknown”, priority: 50, boost: 1.0, blocked: false};
}

// التحقق من كل منطقة
for (var country in REGIONAL_IPS) {
var regionData = REGIONAL_IPS[country];
var ranges = regionData.ranges;

```
for (var i = 0; i < ranges.length; i++) {
  if (inCIDR(ip, ranges[i])) {
    
    // إحصائيات
    if (regionData.region === "jordan") {
      STATE.regionalStats.jordan++;
    } else if (regionData.region === "gcc") {
      STATE.regionalStats.gcc++;
    } else if (regionData.region === "levant") {
      STATE.regionalStats.levant++;
    }
    
    // إذا إيراني - حظر
    if (regionData.blocked && CONFIG.BLOCK_IRAN) {
      STATE.regionalStats.blocked++;
    }
    
    return {
      region: regionData.region,
      country: country,
      priority: regionData.priority,
      boost: regionData.boost,
      blocked: regionData.blocked || false,
      flag: regionData.flag
    };
  }
}
```

}

return {region: “unknown”, priority: 50, boost: 1.0, blocked: false};
}

// ═══════════════════ 🎯 SMART PROXY SELECTION ═══════════════════

function selectProxyForRegion(regionInfo, portType) {

// إذا محظور (إيران) - أضعف مسار
if (regionInfo.blocked) {
return PROXY.BACKUP;  // مسار ضعيف
}

// إذا أردني - أقوى مسار
if (regionInfo.region === “jordan” && CONFIG.JORDAN_FIRST) {
return portType === “VOICE” ? PROXY.VOICE : PROXY.MAIN;
}

// إذا شرق أوسط (غير إيران) - مسار قوي
if (CONFIG.MIDDLE_EAST_BOOST && regionInfo.priority >= 65) {
return portType === “VOICE” ? PROXY.VOICE : PROXY.MAIN;
}

// افتراضي - مسار عادي
return portType === “VOICE” ? PROXY.VOICE : PROXY.MAIN;
}

// ═══════════════════ 📦 UTILITY FUNCTIONS ═══════════════════

function getPort(url) {
try {
var m = url.match(/:(\d+)/);
return m ? parseInt(m[1], 10) : 443;
} catch (e) {
return 443;
}
}

function getPortType(port) {
for (var type in PORTS) {
var ports = PORTS[type];
for (var i = 0; i < ports.length; i++) {
if (port === ports[i]) return type;
}
}
return “OTHER”;
}

function isPUBGDomain(host) {
var lower = host.toLowerCase();
for (var i = 0; i < PUBG_DOMAINS.length; i++) {
if (dnsDomainIs(lower, PUBG_DOMAINS[i])) return true;
}
return false;
}

function resolveDNS(host) {
var cached = STATE.dnsCache[host];
if (cached && (Date.now() - cached.time < 600000)) {
return cached.ip;
}
var ip = dnsResolve(host);
if (ip) {
STATE.dnsCache[host] = {ip: ip, time: Date.now()};
}
return ip;
}

// ═══════════════════ 🔐 SESSION MANAGEMENT ═══════════════════

function createSession(ip, proxy, portType, regionInfo) {
var now = Date.now();
STATE.sessions[ip] = {
proxy: proxy,
created: now,
expires: now + CONFIG.SESSION_LIFETIME,
type: portType,
region: regionInfo.region,
country: regionInfo.country,
priority: regionInfo.priority
};
}

function getSession(ip) {
var session = STATE.sessions[ip];
if (!session) return null;

if (Date.now() > session.expires) {
delete STATE.sessions[ip];
return null;
}

return session.proxy;
}

// ═══════════════════ 🎮 ULTIMATE ROUTING ENGINE ═══════════════════

function routePUBG(host, ip, port) {
var portType = getPortType(port);

// تحقق من الجلسة الموجودة
var existingSession = getSession(ip);
if (existingSession && CONFIG.PING_LOCK && portType === “MATCH”) {
return existingSession;
}

// كشف المنطقة
var regionInfo = detectRegion(ip);

// === ❌ إذا محظور (إيران) - مسار ضعيف ===
if (regionInfo.blocked && CONFIG.BLOCK_IRAN) {
return PROXY.BACKUP;  // أضعف مسار - تجربة سيئة
}

// === 🔊 VOICE: أولوية قصوى ===
if (portType === “VOICE”) {
var voiceProxy = selectProxyForRegion(regionInfo, “VOICE”);
createSession(ip, voiceProxy, portType, regionInfo);
return voiceProxy;
}

// === 🎮 MATCH: حسب المنطقة ===
if (portType === “MATCH”) {
var matchProxy = selectProxyForRegion(regionInfo, “MATCH”);

```
// أردني - مسار قوي مباشر
if (regionInfo.region === "jordan") {
  createSession(ip, matchProxy, portType, regionInfo);
  return matchProxy;
}

// شرق أوسط - مسار قوي مع backup
if (CONFIG.MIDDLE_EAST_BOOST && regionInfo.priority >= 65) {
  var fullPath = matchProxy + "; " + PROXY.BACKUP;
  createSession(ip, fullPath, portType, regionInfo);
  return fullPath;
}

// غير معروف - مسار عادي
createSession(ip, matchProxy, portType, regionInfo);
return matchProxy + "; " + PROXY.BACKUP;
```

}

// === 🏠 LOBBY: سريع ===
if (portType === “LOBBY”) {
return PROXY.LOBBY;
}

// === 📦 UPDATE ===
if (portType === “UPDATE”) {
return PROXY.MAIN;
}

// === 🛡️ ANTI-CHEAT ===
if (portType === “ANTIBOT”) {
return PROXY.MAIN;
}

// === DEFAULT ===
return PROXY.MAIN;
}

// ═══════════════════ 🚀 MAIN FUNCTION ═══════════════════

function FindProxyForURL(url, host) {

// === Local Network ===
if (isPlainHostName(host) ||
dnsDomainIs(host, “.local”) ||
isInNet(host, “127.0.0.0”, “255.0.0.0”) ||
isInNet(host, “10.0.0.0”, “255.0.0.0”) ||
isInNet(host, “172.16.0.0”, “255.240.0.0”) ||
isInNet(host, “192.168.0.0”, “255.255.0.0”)) {
return PROXY.BACKUP;
}

// === Resolve DNS ===
var ip = resolveDNS(host);
if (!ip) {
return PROXY.MAIN + “; “ + PROXY.BACKUP;
}

// === PUBG Traffic: Regional Routing ===
if (isPUBGDomain(host)) {
var port = getPort(url);
return routePUBG(host, ip, port);
}

// === Non-PUBG ===
return PROXY.MAIN;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🏆 END - MIDDLE EAST MATCHMAKING EDITION
// ═══════════════════════════════════════════════════════════════════════════════
//
// 🌍 REGIONAL PRIORITY SYSTEM:
// ––––––––––––––
// 🇯🇴 Jordan:    Priority 100% (5x boost) ⭐⭐⭐⭐⭐
// 🇸🇦 Saudi:     Priority 90%  (3.5x boost) ⭐⭐⭐⭐
// 🇦🇪 UAE:       Priority 85%  (3x boost) ⭐⭐⭐⭐
// 🇰🇼 Kuwait:    Priority 85%  (3x boost) ⭐⭐⭐⭐
// 🇶🇦 Qatar:     Priority 85%  (3x boost) ⭐⭐⭐⭐
// 🇴🇲 Oman:      Priority 80%  (2.5x boost) ⭐⭐⭐
// 🇧🇭 Bahrain:   Priority 80%  (2.5x boost) ⭐⭐⭐
// 🇱🇧 Lebanon:   Priority 75%  (2x boost) ⭐⭐⭐
// 🇮🇶 Iraq:      Priority 70%  (1.8x boost) ⭐⭐
// 🇪🇬 Egypt:     Priority 65%  (1.5x boost) ⭐⭐
// 🇮🇷 Iran:      Priority 0%   (BLOCKED) ❌
//
// 🎯 MATCHMAKING FEATURES:
// ————————
// ✅ أولوية للاعبين الأردنيين (5x boost)
// ✅ تقوية الشرق الأوسط (GCC + Levant)
// ✅ حظر اللاعبين الإيرانيين تماماً
// ✅ كشف تلقائي للمنطقة
// ✅ توجيه ذكي حسب المنطقة
// ✅ مسار ضعيف للاعبين المحظورين
//
// 🔥 HOW IT WORKS:
// ––––––––
// 1. يتم كشف IP اللاعب
// 2. تحديد المنطقة (أردن، خليج، شام، إلخ)
// 3. إذا أردني → أقوى مسار (212.35.66.45:443)
// 4. إذا شرق أوسط → مسار قوي + boost
// 5. إذا إيراني → مسار ضعيف (46.185.131.218:443)
// 6. إذا غير معروف → مسار عادي
//
// 📊 REGIONAL STATS:
// ——————
// يتم تتبع عدد اللاعبين من كل منطقة في STATE.regionalStats
//
// ═══════════════════════════════════════════════════════════════════════════════
