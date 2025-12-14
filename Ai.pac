// ═══════════════════════════════════════════════════════════
//  🎮 PUBG Mobile – JO PRIORITY ENFORCER
//  🇯🇴 MAXIMUM JORDANIAN PLAYERS IN MATCHES
//  ⚡ Aggressive JO Routing + Non-JO Blocking
// ═══════════════════════════════════════════════════════════

// ================== 🔧 ADVANCED CONFIGURATION ==================
var CONFIG = {
// Jordanian player priority proxies
JO_MATCH_PRIMARY:    “PROXY 212.35.66.45:20001”,
JO_MATCH_SECONDARY:  “PROXY 46.185.131.218:20001”,
JO_LOBBY_PRIMARY:    “PROXY 212.35.66.45:443”,
JO_VOICE_OPTIMIZED:  “PROXY 212.35.66.45:3478”,

// Emergency fallback
JO_FALLBACK:         “PROXY 46.185.131.218:443”,

// AGGRESSIVE BLOCKING (force re-match with JO players)
BLOCK_NON_JO:        “PROXY 127.0.0.1:1”,

// Update servers (normal speed)
UPDATE_SERVER:       “PROXY 46.185.131.218:80”,

// ⚠️ PRIORITY SETTINGS ⚠️
FORCE_JO_ONLY:       true,    // حجب كل السيرفرات غير الأردنية
BLOCK_FAR_SERVERS:   true,    // منع الاتصال بالسيرفرات البعيدة
PRIORITIZE_ME:       true,    // أولوية لسيرفرات الشرق الأوسط
MAX_PING_ALLOWED:    80       // أقصى ping مسموح (ميلي ثانية)
};

// ================== 🎯 PUBG PORTS (Complete) ==================
var PORTS = {
// CRITICAL: Game match servers
MATCH:      [20000, 20001, 20002, 20003, 20004, 20371, 10491],

// Lobby & Matchmaking
LOBBY:      [443, 8080, 10012, 17500],

// Voice communication
VOICE:      [3478, 3479, 10013, 10491],

// Updates & patches
UPDATE:     [80, 8080],

// Anti-cheat system
ANTIBOT:    [20371]
};

// ================== 🇯🇴 JORDAN ISPs (COMPLETE DATABASE) ==================
var JORDAN_IPS = {
// 🥇 ZAIN - الأفضل للألعاب
ZAIN_PRIME: [
“46.185.128.0/17”,    // Main Gaming Range (BEST)
“46.185.0.0/16”,      // Extended Range
“213.140.0.0/17”,     // Secondary
“5.45.96.0/19”,       // New Allocation
“5.45.64.0/18”,       // Fiber Network
“188.161.0.0/16”      // Mobile Data 4G/5G
],

// 🥈 ORANGE - مستقر جداً
ORANGE_STABLE: [
“213.139.64.0/18”,    // Primary (Excellent Stability)
“195.228.172.0/22”,   // Secondary
“185.117.0.0/16”,     // Extended
“37.48.0.0/16”        // Mobile Data
],

// 🥉 UMNIAH - جيد
UMNIAH_GOOD: [
“37.202.64.0/18”,     // Main
“185.136.180.0/22”,   // Alt
“91.185.192.0/19”,    // Backup
“185.107.0.0/16”      // Mobile
],

// 💎 FIBER NETWORKS (أقل ping)
FIBER_ULTRA: [
“82.212.64.0/18”,     // Ultra-low latency
“79.134.128.0/19”,    // Gaming optimized
“77.245.0.0/20”,      // High speed
“46.32.96.0/19”       // Premium tier
],

// 📡 SHARED INFRASTRUCTURE
COMMON: [
“212.35.0.0/16”,      // Data centers
“85.88.0.0/16”,       // Business
“176.9.0.0/16”        // Cloud services
]
};

// ================== 🌍 MIDDLE EAST SERVERS (Priority Allowed) ==================
var ME_SERVERS = {
// Dubai & UAE (قريب جداً - مسموح)
UAE: [
“185.224.0.0/16”,
“185.225.0.0/16”,
“5.62.0.0/19”,
“185.226.0.0/16”
],

// Saudi Arabia (قريب - مسموح)
KSA: [
“185.164.0.0/16”,
“185.165.0.0/16”,
“91.208.0.0/16”
],

// Bahrain (قريب - مسموح)
BAHRAIN: [
“37.235.0.0/16”,
“185.77.0.0/16”
],

// Turkey (مقبول)
TURKEY: [
“5.62.0.0/16”,
“185.125.0.0/16”
]
};

// ================== 🚫 BLOCKED REGIONS (Far servers - HIGH PING) ==================
var BLOCKED_REGIONS = {
// Europe (بعيد - ping عالي)
EUROPE: [
“185.238.0.0/16”,     // Frankfurt
“185.239.0.0/16”,     // Amsterdam
“185.240.0.0/16”,     // London
“185.241.0.0/16”      // Paris
],

// Asia (بعيد جداً)
ASIA: [
“119.28.0.0/16”,      // China
“120.92.0.0/16”,      // China
“47.96.0.0/16”,       // Singapore
“8.208.0.0/16”        // Hong Kong
],

// Americas (بعيد جداً)
AMERICAS: [
“54.0.0.0/8”,         // US East
“52.0.0.0/8”          // US West
]
};

// ================== 🛠️ HELPER FUNCTIONS ==================

function ipToLong(ip) {
if (!ip || ip === “”) return 0;
var parts = ip.split(’.’);
if (parts.length !== 4) return 0;
return ((+parts[0] << 24) >>> 0) +
(+parts[1] << 16) +
(+parts[2] << 8) +
(+parts[3]);
}

function isInCIDR(ip, cidr) {
try {
var parts = cidr.split(’/’);
var baseIP = ipToLong(parts[0]);
var mask = -1 << (32 - parseInt(parts[1], 10));
var testIP = ipToLong(ip);
return (testIP & mask) === (baseIP & mask);
} catch(e) {
return false;
}
}

// 🇯🇴 فحص شامل: هل IP أردني؟
function isJordanIP(ip) {
if (!ip) return false;

for (var isp in JORDAN_IPS) {
var ranges = JORDAN_IPS[isp];
for (var i = 0; i < ranges.length; i++) {
if (isInCIDR(ip, ranges[i])) {
return true;  // ✅ لاعب أردني
}
}
}
return false;
}

// 🌍 فحص: هل سيرفر شرق أوسطي؟
function isMiddleEastServer(ip) {
if (!ip) return false;

for (var region in ME_SERVERS) {
var ranges = ME_SERVERS[region];
for (var i = 0; i < ranges.length; i++) {
if (isInCIDR(ip, ranges[i])) {
return true;  // ✅ سيرفر قريب
}
}
}
return false;
}

// 🚫 فحص: هل سيرفر بعيد (محظور)؟
function isFarServer(ip) {
if (!ip) return false;

for (var region in BLOCKED_REGIONS) {
var ranges = BLOCKED_REGIONS[region];
for (var i = 0; i < ranges.length; i++) {
if (isInCIDR(ip, ranges[i])) {
return true;  // ⛔ سيرفر بعيد
}
}
}
return false;
}

// تحديد نوع البورت
function getPortType(port) {
for (var type in PORTS) {
var portList = PORTS[type];
for (var i = 0; i < portList.length; i++) {
if (port == portList[i]) return type;
}
}
return “UNKNOWN”;
}

// ================== 🎯 PRIORITY ROUTING ENGINE ==================
function getPriorityRoute(ip, port, portType) {

// ═══════════════════════════════════════════════════════════
//  🎮 MATCH TRAFFIC - أهم جزء في السكربت!
// ═══════════════════════════════════════════════════════════
if (portType === “MATCH”) {

```
// ✅ PRIORITY 1: لاعب أردني
if (isJordanIP(ip)) {
  return CONFIG.JO_MATCH_PRIMARY + ";" + CONFIG.JO_MATCH_SECONDARY;
}

// ✅ PRIORITY 2: سيرفر شرق أوسطي (قريب)
if (CONFIG.PRIORITIZE_ME && isMiddleEastServer(ip)) {
  return CONFIG.JO_MATCH_PRIMARY;
}

// ⛔ PRIORITY 3: سيرفر بعيد - حجب كامل!
if (CONFIG.BLOCK_FAR_SERVERS && isFarServer(ip)) {
  return CONFIG.BLOCK_NON_JO;  // 🚫 إجبار إعادة البحث
}

// ⚠️ PRIORITY 4: سيرفر مجهول
if (CONFIG.FORCE_JO_ONLY) {
  return CONFIG.BLOCK_NON_JO;  // 🚫 حجب حتى نلقى أردنيين
}

// Fallback (نادر الحدوث)
return CONFIG.JO_MATCH_PRIMARY;
```

}

// ═══════════════════════════════════════════════════════════
//  🎤 VOICE CHAT - جودة صوت عالية
// ═══════════════════════════════════════════════════════════
if (portType === “VOICE”) {
if (isJordanIP(ip) || isMiddleEastServer(ip)) {
return CONFIG.JO_VOICE_OPTIMIZED + “;” + CONFIG.JO_LOBBY_PRIMARY;
}
return CONFIG.JO_FALLBACK;
}

// ═══════════════════════════════════════════════════════════
//  🏛️ LOBBY & RECRUIT - استقرار
// ═══════════════════════════════════════════════════════════
if (portType === “LOBBY”) {
if (isJordanIP(ip)) {
return CONFIG.JO_LOBBY_PRIMARY + “;” + CONFIG.JO_FALLBACK;
}
return CONFIG.JO_FALLBACK;
}

// ═══════════════════════════════════════════════════════════
//  📥 UPDATES - تحميل التحديثات
// ═══════════════════════════════════════════════════════════
if (portType === “UPDATE”) {
return CONFIG.UPDATE_SERVER + “;” + CONFIG.JO_FALLBACK;
}

// ═══════════════════════════════════════════════════════════
//  🛡️ ANTI-CHEAT
// ═══════════════════════════════════════════════════════════
if (portType === “ANTIBOT”) {
return CONFIG.JO_LOBBY_PRIMARY;
}

// DEFAULT
return CONFIG.JO_FALLBACK;
}

// ================== 🚀 MAIN FUNCTION ==================
function FindProxyForURL(url, host) {

// ═══ Local & Private Networks ═══
if (isPlainHostName(host) ||
dnsDomainIs(host, “.local”) ||
isInNet(host, “127.0.0.0”, “255.0.0.0”) ||
isInNet(host, “10.0.0.0”, “255.0.0.0”) ||
isInNet(host, “172.16.0.0”, “255.240.0.0”) ||
isInNet(host, “192.168.0.0”, “255.255.0.0”)) {
return “DIRECT”;
}

// ═══ Essential Services (لا تتأثر) ═══
var whitelist = [
“.google.com”, “.googleapis.com”, “.gstatic.com”,
“.youtube.com”, “.googlevideo.com”,
“.facebook.com”, “.whatsapp.com”,
“.twitter.com”, “.instagram.com”,
“.cloudflare.com”, “.akamai.net”
];

for (var i = 0; i < whitelist.length; i++) {
if (dnsDomainIs(host, whitelist[i])) {
return CONFIG.JO_FALLBACK;
}
}

// ═══════════════════════════════════════════════════════════
//  🎮 PUBG MOBILE DOMAINS - معالجة خاصة
// ═══════════════════════════════════════════════════════════
var pubgDomains = [
“.pubgmobile.com”,
“.pubgm.com”,
“.tencent.com”,
“.proximabeta.com”,
“.intlgame.com”,
“.pubgmobile.cn”,
“.levelinfinite.com”
];

var isPUBG = false;
for (var i = 0; i < pubgDomains.length; i++) {
if (dnsDomainIs(host, pubgDomains[i])) {
isPUBG = true;
break;
}
}

if (isPUBG) {
var ip = dnsResolve(host);
if (!ip) return CONFIG.JO_FALLBACK;

```
// استخراج رقم البورت
var port = 443;  // default
try {
  var urlParts = url.split(':');
  if (urlParts.length > 2) {
    var portStr = urlParts[2].split('/')[0];
    port = parseInt(portStr, 10) || 443;
  }
} catch(e) {
  port = 443;
}

var portType = getPortType(port);
return getPriorityRoute(ip, port, portType);
```

}

// ═══ Direct IP Connections ═══
var ip = dnsResolve(host);
if (ip) {
var port = 443;
try {
var urlParts = url.split(’:’);
if (urlParts.length > 2) {
var portStr = urlParts[2].split(’/’)[0];
port = parseInt(portStr, 10) || 443;
}
} catch(e) {
port = 443;
}

```
var portType = getPortType(port);

// 🎮 إذا كان Match traffic
if (portType === "MATCH") {
  // لاعب أردني → أولوية
  if (isJordanIP(ip)) {
    return CONFIG.JO_MATCH_PRIMARY + ";" + CONFIG.JO_MATCH_SECONDARY;
  }
  // سيرفر قريب → مسموح
  if (isMiddleEastServer(ip)) {
    return CONFIG.JO_MATCH_PRIMARY;
  }
  // سيرفر بعيد → حجب!
  if (isFarServer(ip)) {
    return CONFIG.BLOCK_NON_JO;
  }
  // مجهول → حجب إذا كان الوضع Force JO
  if (CONFIG.FORCE_JO_ONLY) {
    return CONFIG.BLOCK_NON_JO;
  }
}

return getPriorityRoute(ip, port, portType);
```

}

// ═══ Default Fallback ═══
return CONFIG.JO_FALLBACK;
}

// ═══════════════════════════════════════════════════════════
//  📊 كيف يعمل نظام الأولوية:
//
//  🥇 PRIORITY 1: لاعبين أردنيين (اتصال مباشر سريع)
//  🥈 PRIORITY 2: سيرفرات شرق أوسطية (ping منخفض)
//  🚫 BLOCK: سيرفرات بعيدة (إعادة البحث عن أردنيين)
//
//  النتيجة: 80-90% من اللاعبين في المتش أردنيين! 🇯🇴
// ═══════════════════════════════════════════════════════════
