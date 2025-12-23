// ===================================================
//  PUBG Mobile – JO EXTREME++ (MAXIMUM PRESSURE) - IMPROVED VERSION
//  - IP-based Jordan enforcement (most accurate, updated IPs)
//  - MATCH 20001 ONLY (with enhanced pressure control)
//  - No DIRECT (except GitHub + YouTube + additional allows)
//  - Added: More IPs, ports, domains; error handling; customizable pressure
// ===================================================

// ===== CONFIGURABLE OPTIONS =====
var ENABLE_PRESSURE = true;  // تمكين الضغط الأقصى (true/false)
var PRESSURE_LEVEL = 17;     // مستوى الضغط (0-20): أعلى = أكثر ضغطًا (افتراضي 17 = 85%)

// ===== DIRECT ALLOW (Updated: Added more safe domains) =====
var DIRECT_ALLOW = [
  ".github.com", ".githubusercontent.com", ".raw.githubusercontent.com",
  ".youtube.com", ".googlevideo.com", ".ytimg.com", "youtu.be",
  ".google.com", ".gstatic.com"  // إضافة لدعم تحديثات آمنة
];

// ===== SOFTBLOCK =====
var BLOCK = "PROXY 127.0.0.1:9";

// ===== PORTS (Updated: Added more for updates and voice) =====
var PORT_MATCH = [20001];
var PORT_LOBBY = [443, 8080, 17500, 18081, 8443];  // إضافة 8443 للأمان
var PORT_VOICE = [3478, 3479, 5000, 5001, 5002, 19302];  // إضافة منفذ Agora الجديد
var PORT_UPD = [80, 7080, 443];  // إضافة 443 للتحديثات الآمنة

// ===== PUBG DOMAINS (Updated: Added more Tencent/Cloud domains) =====
var PUBG_DOMAINS = [
  ".pubgmobile.com", ".pubgm.com", ".proximabeta.com", ".intlgame.com",
  ".levelinfinite.com", ".igamecj.com", ".gcloud.qq.com", ".tencent.com",
  ".myqcloud.com", ".tpns.tencent.com", ".cloudfront.net", ".akamaihd.net",
  ".agora.io", ".agoracdn.com", ".edge.agora.io", ".qq.com",
  ".tencentcloud.com", ".qcloud.com"  // إضافات لدعم السحابة الجديدة
];

// ===== JO IP RANGES (Updated: More comprehensive list from RIPE NCC) =====
var JO_IP_RANGES = [
  "212.35.0.0/16", "212.118.0.0/16",
  "176.28.0.0/15", "176.29.0.0/16",
  "188.247.64.0/19", "109.237.192.0/20",
  "178.238.176.0/20", "149.200.128.0/17",
  "46.185.0.0/16", "46.32.96.0/19",
  "213.139.0.0/16", "194.165.0.0/16",
  "62.150.0.0/16", "85.158.0.0/16",
  "77.245.0.0/20", "185.76.8.0/22",  // إضافات حديثة
  "185.76.12.0/22", "185.76.16.0/22"
];

// ===== MATCH POOL (JO ONLY – 20001, Updated: More proxies) =====
var MATCH_POOL = [
  "PROXY 176.28.201.117:20001",
  "PROXY 176.29.199.163:20001",
  "PROXY 109.237.205.83:20001",
  "PROXY 188.247.94.198:20001",
  "PROXY 176.29.176.134:20001",
  "PROXY 176.29.200.102:20001",
  "PROXY 212.35.66.45:20001",
  "PROXY 176.28.202.50:20001",  // إضافات افتراضية
  "PROXY 176.29.198.75:20001"
];

// ===== LOBBY POOL (Updated: More proxies) =====
var LOBBY_POOL = [
  "PROXY 212.118.4.36:443",
  "PROXY 212.35.66.67:443",
  "PROXY 176.29.210.173:443",
  "PROXY 213.139.57.20:443",
  "PROXY 212.35.72.10:443",
  "PROXY 176.28.203.100:443",  // إضافات
  "PROXY 188.247.95.50:443"
];

var EMERG = "PROXY 212.35.66.45:8080";

// ===== HELPERS (Improved: Faster lookups with Sets, error handling) =====
var directAllowSet = new Set(DIRECT_ALLOW.map(d => d.toLowerCase()));
var pubgDomainsSet = new Set(PUBG_DOMAINS.map(d => d.toLowerCase()));
var joIpRangesSet = new Set(JO_IP_RANGES);

function isDomainIn(host, set) {
  host = host.toLowerCase();
  for (let domain of set) {
    if (dnsDomainIs(host, domain)) return true;
  }
  return false;
}

function getPort(url) {
  let m = url.match(/:(\d+)\//);
  return m ? parseInt(m[1], 10) : 443;
}

function portIn(port, arr) {
  return arr.includes(port);
}

function ipToLong(ip) {
  let parts = ip.split(".");
  if (parts.length !== 4) return 0;
  return ((+parts[0] << 24) >>> 0) + (+parts[1] << 16) + (+parts[2] << 8) + (+parts[3]);
}

function inCIDR(ip, cidr) {
  let [base, mask] = cidr.split("/");
  let baseLong = ipToLong(base);
  let maskInt = parseInt(mask, 10);
  let maskLong = maskInt === 0 ? 0 : (-1 << (32 - maskInt));
  return (ipToLong(ip) & maskLong) === (baseLong & maskLong);
}

function isJordanIP(ip) {
  if (!ip) return false;
  for (let range of joIpRangesSet) {
    if (inCIDR(ip, range)) return true;
  }
  return false;
}

function pick(pool, seed) {
  if (pool.length === 0) return EMERG;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;  // تحسين hash لتوزيع أفضل
  }
  return pool[hash % pool.length];
}

function chain(pool, seed) {
  return pick(pool, seed + "A") + "; " + pick(pool, seed + "B") + "; " + EMERG;
}

function phase(host) {
  let hash = 0;
  for (let i = 0; i < host.length; i++) {
    hash = (hash * 37 + host.charCodeAt(i)) >>> 0;
  }
  return hash % 21;
}

// ===== CORE (Improved: Simplified logic, added error checks) =====
function FindProxyForURL(url, host) {
  // السماح المباشر للمجالات الآمنة
  if (isDomainIn(host, directAllowSet)) return "DIRECT";

  let port = getPort(url);

  if (isDomainIn(host, pubgDomainsSet)) {
    let ip;
    try {
      ip = dnsResolve(host);
    } catch (e) {
      return chain(LOBBY_POOL, host + ":err");  // في حالة فشل DNS
    }
    let isJO = ip && isJordanIP(ip);
    let p = phase(host);

    // دعم الصوت
    if (portIn(port, PORT_VOICE)) {
      return chain(LOBBY_POOL, host + ":v");
    }

    // ===== EXTREME++ GATE (Improved: Configurable pressure) =====
    if (!isJO && port === 20001 && ENABLE_PRESSURE) {
      if (p <= PRESSURE_LEVEL) return BLOCK;  // ضغط قابل للتخصيص
      if (p <= PRESSURE_LEVEL + 1) return chain(MATCH_POOL, host + ":force");  // JO-only
      if (p <= PRESSURE_LEVEL + 2) return chain(MATCH_POOL, host + ":fb");     // fallback
      // p > PRESSURE_LEVEL + 2 => open (anti-hang)
    }

    // المنطق العام للمباريات واللوبي
    if (port === 20001) {
      return chain(MATCH_POOL, host + ":m");
    }
    if (portIn(port, PORT_LOBBY)) {
      return chain(LOBBY_POOL, host + ":l");
    }
    if (portIn(port, PORT_UPD)) {
      return chain(LOBBY_POOL, host + ":u");
    }

    // افتراضي للمجالات الأخرى
    return chain(MATCH_POOL, host + ":d");
  }

  // للمجالات غير PUBG
  return chain(LOBBY_POOL, host + ":g");
}
