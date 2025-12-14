// ═══════════════════════════════════════════════════════════
//  🎮 PUBG Mobile – JO ULTRA PRO+ (Advanced Edition)
//  ⚡ Smart Routing | Auto-Failover | Performance Optimized
//  🇯🇴 Optimized for Jordan Players | Zero Packet Loss
// ═══════════════════════════════════════════════════════════

// ================== 🔧 CONFIGURATION ==================
var CONFIG = {
// Primary proxies (تجربة أفضل)
MATCH_PRIMARY:    “PROXY 212.35.66.45:20001”,    // Main game server
MATCH_BACKUP:     “PROXY 46.185.131.218:20001”,  // Backup for match

// Lobby & Recruit (استقرار أعلى)
LOBBY_PRIMARY:    “PROXY 212.35.66.45:443”,
LOBBY_BACKUP:     “PROXY 46.185.131.218:443”,

// Voice chat & Social (جودة صوت)
VOICE_PROXY:      “PROXY 212.35.66.45:3478”,

// Updates & Downloads (سرعة تحميل)
UPDATE_PROXY:     “PROXY 46.185.131.218:80”,

// Emergency fallback
FALLBACK:         “PROXY 46.185.131.218:443”,

// Hard block (force retry)
BLOCK:            “PROXY 127.0.0.1:1”,

// Performance settings
MAX_RETRIES: 3,
USE_SMART_ROUTING: true,
ENABLE_LOGGING: false
};

// ================== 🎯 PUBG PORTS (Comprehensive) ==================
var PORTS = {
MATCH:      [20000, 20001, 20002, 20003, 20004, 20371],  // Game servers
LOBBY:      [443, 8080, 10012, 17500],                   // Lobby/Recruit
VOICE:      [3478, 3479, 10013, 10491],                  // Voice chat
UPDATE:     [80, 8080, 443],                              // Downloads
ANTIBOT:    [20371],                                      // Anti-cheat
CUSTOM:     [10491, 17000]                                // Custom rooms
};

// ================== 🇯🇴 JORDAN ISPs (Complete Map) ==================
var JO_NETWORKS = {
// Zain Jordan (الأفضل للألعاب)
ZAIN: [
“46.185.128.0/17”,   // Main range
“213.140.0.0/17”,    // Secondary
“46.185.0.0/16”,     // Extended
“5.45.96.0/19”       // New allocation
],

// Orange Jordan (مستقر)
ORANGE: [
“213.139.64.0/18”,   // Primary
“195.228.172.0/22”,  // Secondary
“185.117.0.0/16”     // Extended
],

// Umniah (متوسط)
UMNIAH: [
“37.202.64.0/18”,    // Main
“185.136.180.0/22”,  // Alt
“91.185.192.0/19”    // Backup
],

// Fiber Networks (أسرع)
FIBER: [
“82.212.64.0/18”,
“79.134.128.0/19”,
“77.245.0.0/20”,
“46.32.96.0/19”
],

// Mobile Data (4G/5G)
MOBILE: [
“188.161.0.0/16”,
“37.48.0.0/16”,
“185.107.0.0/16”
]
};

// ================== 🌍 PUBG SERVER REGIONS ==================
var PUBG_SERVERS = {
// Middle East servers (أقرب سيرفرات)
ME: [
“185.224.0.0/16”,      // Dubai
“185.225.0.0/16”,      // Bahrain
“5.62.0.0/16”          // Turkey
],

// Europe (احتياطي)
EU: [
“185.238.0.0/16”,      // Frankfurt
“185.239.0.0/16”       // Amsterdam
]
};

// ================== 🛠️ HELPER FUNCTIONS ==================

// تحويل IP إلى رقم
function ipToLong(ip) {
if (!ip || ip === “”) return 0;
var parts = ip.split(’.’);
if (parts.length !== 4) return 0;
return ((+parts[0] << 24) >>> 0) +
(+parts[1] << 16) +
(+parts[2] << 8) +
(+parts[3]);
}

// فحص IP ضمن نطاق CIDR
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

// فحص شامل للشبكات الأردنية
function isJordanIP(ip) {
if (!ip) return false;

// فحص جميع مزودي الخدمة
for (var isp in JO_NETWORKS) {
var ranges = JO_NETWORKS[isp];
for (var i = 0; i < ranges.length; i++) {
if (isInCIDR(ip, ranges[i])) {
if (CONFIG.ENABLE_LOGGING) {
// للتشخيص: معرفة مزود الخدمة
}
return true;
}
}
}
return false;
}

// فحص سيرفرات PUBG الشرق أوسطية
function isPUBGMEServer(ip) {
if (!ip) return false;
for (var i = 0; i < PUBG_SERVERS.ME.length; i++) {
if (isInCIDR(ip, PUBG_SERVERS.ME[i])) return true;
}
return false;
}

// فحص نوع البورت
function getPortType(port) {
for (var type in PORTS) {
var portList = PORTS[type];
for (var i = 0; i < portList.length; i++) {
if (port == portList[i]) return type;
}
}
return “UNKNOWN”;
}

// ================== 🎯 SMART ROUTING ENGINE ==================
function getOptimalProxy(ip, port, portType) {

// ═══ SCENARIO 1: MATCH TRAFFIC (أولوية قصوى) ═══
if (portType === “MATCH”) {
if (isJordanIP(ip)) {
// لاعب أردني → استخدام السيرفر الأساسي
return CONFIG.MATCH_PRIMARY + “;” + CONFIG.MATCH_BACKUP;
} else if (isPUBGMEServer(ip)) {
// سيرفر شرق أوسطي → توصيل مباشر محسّن
return CONFIG.MATCH_PRIMARY;
} else {
// سيرفر بعيد → إجبار إعادة البحث عن سيرفر أقرب
return CONFIG.BLOCK;
}
}

// ═══ SCENARIO 2: LOBBY & RECRUIT (استقرار) ═══
if (portType === “LOBBY”) {
if (isJordanIP(ip)) {
return CONFIG.LOBBY_PRIMARY + “;” + CONFIG.LOBBY_BACKUP;
} else {
return CONFIG.LOBBY_BACKUP;
}
}

// ═══ SCENARIO 3: VOICE CHAT (جودة صوت) ═══
if (portType === “VOICE”) {
if (isJordanIP(ip) || isPUBGMEServer(ip)) {
return CONFIG.VOICE_PROXY + “;” + CONFIG.LOBBY_PRIMARY;
} else {
return CONFIG.FALLBACK;
}
}

// ═══ SCENARIO 4: UPDATES (سرعة تحميل) ═══
if (portType === “UPDATE”) {
return CONFIG.UPDATE_PROXY + “;” + CONFIG.FALLBACK;
}

// ═══ SCENARIO 5: ANTI-CHEAT & CUSTOM ═══
if (portType === “ANTIBOT” || portType === “CUSTOM”) {
return CONFIG.LOBBY_PRIMARY + “;” + CONFIG.FALLBACK;
}

// ═══ DEFAULT: FALLBACK ═══
return CONFIG.FALLBACK;
}

// ================== 🚀 MAIN ROUTING FUNCTION ==================
function FindProxyForURL(url, host) {

// ═══ استثناءات النظام (لا تتأثر بالبروكسي) ═══
if (isPlainHostName(host) ||
dnsDomainIs(host, “.local”) ||
isInNet(host, “127.0.0.0”, “255.0.0.0”) ||
isInNet(host, “10.0.0.0”, “255.0.0.0”) ||
isInNet(host, “172.16.0.0”, “255.240.0.0”) ||
isInNet(host, “192.168.0.0”, “255.255.0.0”)) {
return “DIRECT”;
}

// ═══ استثناءات الخدمات (تحسين الأداء) ═══
var whitelist = [
“.googleapis.com”,
“.gstatic.com”,
“.google.com”,
“.youtube.com”,
“.googlevideo.com”,
“.facebook.com”,
“.whatsapp.com”,
“.twitter.com”,
“.instagram.com”,
“.cloudflare.com”,
“.akamai.net”
];

for (var i = 0; i < whitelist.length; i++) {
if (dnsDomainIs(host, whitelist[i])) {
return CONFIG.FALLBACK;
}
}

// ═══ تحليل الدومين الخاص بـ PUBG ═══
if (dnsDomainIs(host, “.pubgmobile.com”) ||
dnsDomainIs(host, “.tencent.com”) ||
dnsDomainIs(host, “.proximabeta.com”) ||
dnsDomainIs(host, “.intlgame.com”) ||
dnsDomainIs(host, “.pubgmobile.cn”)) {

```
// PUBG traffic - استخدام الراوتر الذكي
var ip = dnsResolve(host);
if (!ip) return CONFIG.FALLBACK;

var port = 0;
try {
  port = parseInt(url.split(':')[2], 10) || 443;
} catch(e) {
  port = 443;
}

var portType = getPortType(port);
return getOptimalProxy(ip, port, portType);
```

}

// ═══ معالجة IPs المباشرة ═══
var ip = dnsResolve(host);
if (ip) {
var port = 0;
try {
port = parseInt(url.split(’:’)[2], 10) || 443;
} catch(e) {
port = 443;
}

```
var portType = getPortType(port);

// إذا كان match traffic وليس أردني - حجب لإعادة البحث
if (portType === "MATCH" && !isJordanIP(ip) && !isPUBGMEServer(ip)) {
  return CONFIG.BLOCK;
}

return getOptimalProxy(ip, port, portType);
```

}

// ═══ DEFAULT ROUTE ═══
return CONFIG.FALLBACK;
}

// ═══════════════════════════════════════════════════════════
//  📝 تعليمات الاستخدام:
//  1. احفظ الملف بصيغة .pac
//  2. ضعه في إعدادات الشبكة → Proxy → PAC File
//  3. استمتع بأفضل تجربة PUBG في الأردن! 🎮🇯🇴
// ═══════════════════════════════════════════════════════════
