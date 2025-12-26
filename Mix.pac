// ============================================================================
//  PUBG – JO-FIRST MATCHMAKING + HIGH STABILITY (SINGLE FINAL PAC)
//  Goals (كلهم شغالين تلقائياً بدون Modes):
//   1) Matchmaking أردني "أولوية قصوى" + ثبات عالي (NAT/path ثابت قدر الإمكان)
//   2) إذا فشل JO -> نسمح للجوار (SA/LB/PS/KW/UAE) بدل أوروبا/بعيد (DIRECT مُقيّد)
//   3) CDN/Updates DIRECT لتقليل التقطيع
//   4) YouTube + GitHub + Shahid DIRECT
//   5) Telemetry/ads/trace قدر الإمكان داخل مسار PUBG (ما يطلع لمسارات بعيدة)
//
//  NOTE: PAC يتحكم بطلبات HTTP/HTTPS فقط. حركة UDP الخام للعبة قد لا تمر حسب أداة البروكسي.
// ============================================================================

// ===================== PROXIES (ثابتة لتثبيت الـ NAT/path) =====================
var PROXY_JO_MAIN = "PROXY 212.35.66.45:20001";   // JO primary (matchmaking/match)
var PROXY_JO_ALT  = "PROXY 46.185.131.218:20001"; // JO secondary (fallback داخل الأردن)
var DIRECT = "DIRECT";

// ===================== PUBG DOMAIN SCOPE (شامل قدر الإمكان) =====================
// (عدّل/زِد إذا عندك لستة أدق من تحليل الدومينات)
var PUBG_DOMAINS = [
  "pubgmobile.com",
  "proximabeta.com",
  "igamecj.com",
  "tencent.com",
  "gcloudsdk.com",
  "qcloud.com",
  "qq.com"
];

// دومينات غالباً Auth/Matchmaking/Session (نخليها JO-only قدر الإمكان)
var MM_DOMAINS = [
  "igamecj.com",
  "gcloudsdk.com",
  "proximabeta.com"
];

// ===================== DIRECT EXCEPTIONS (لا تلمسهم) =====================
var DIRECT_DOMAINS = [
  "github.com",
  "raw.githubusercontent.com",
  "youtube.com",
  "googlevideo.com",
  "ytimg.com",
  "shahid.net",
  "shahid.mbc.net"
];

// ===================== CDN/UPDATES (DIRECT لتخفيف الضغط) =====================
var CDN_HINTS = [
  "cdn", "static", "download", "patch", "update", "updater", "resource", "assets", "apk", "obb"
];

// ===================== “NOISE/TELEMETRY/ADS/TRACE” (خليها داخل المسار) =====================
// الفكرة: كثير SDKs تتصل بهيك دومينات. إحنا ما بنعملها DIRECT، نخليها تمشي مع JO chain
// (إلا إذا كانت ضمن DIRECT_DOMAINS فوق).
var TELEMETRY_HINT_DOMAINS = [
  "appsflyer.com",
  "adjust.com",
  "branch.io",
  "doubleclick.net",
  "googlesyndication.com",
  "firebaseio.com",
  "crashlytics.com",
  "sentry.io",
  "datadoghq.com"
];

// ===================== CIDR LISTS =====================
// --- JO (Jordan) major blocks (tight-ish & practical for “JO-first path”) ---
var JO_V4_CIDR = [
  "5.45.128.0/20",
  "37.17.192.0/20",
  "37.123.64.0/19",
  "37.202.64.0/18",
  "37.220.112.0/20",
  "46.23.112.0/20",
  "46.32.96.0/19",
  "46.185.128.0/17",
  "46.248.192.0/19",
  "77.245.0.0/20",
  "79.173.192.0/18",
  "80.90.160.0/20",
  "82.212.64.0/18",
  "86.108.0.0/17",
  "91.186.224.0/19",
  "92.253.0.0/17",
  "94.249.0.0/17",
  "149.200.128.0/17",
  "176.28.128.0/17",
  "176.29.0.0/16",
  "188.247.64.0/19",
  "212.34.0.0/19",
  "212.35.64.0/19",
  "212.118.0.0/19",
  "213.139.32.0/19",
  "213.186.160.0/19",
  "217.23.32.0/20"
];

// --- NEAR COUNTRIES (Fallback DIRECT مُقيّد) ---
// السعودية (SA)
var SA_V4_CIDR = [
  "2.88.0.0/14",
  "5.41.0.0/16",
  "5.82.0.0/16",
  "5.108.0.0/14",
  "31.166.0.0/15"
];

// الكويت (KW)
var KW_V4_CIDR = [
  "31.203.0.0/16",
  "31.214.0.0/17",
  "37.36.0.0/14",
  "37.231.0.0/16"
];

// الإمارات (UAE)
var AE_V4_CIDR = [
  "2.48.0.0/14",
  "5.30.0.0/15",
  "5.32.0.0/17",
  "5.107.0.0/16",
  "5.192.0.0/15"
];

// لبنان (LB)
var LB_V4_CIDR = [
  "5.8.128.0/19",
  "77.42.128.0/17",
  "77.110.64.0/18"
];

// فلسطين (PS)
var PS_V4_CIDR = [
  "1.178.112.0/20",
  "1.178.128.0/20",
  "24.42.64.0/18",
  "37.8.0.0/17"
];

// تجميع فallback للجوار
var NEAR_V4_CIDR = SA_V4_CIDR.concat(KW_V4_CIDR, AE_V4_CIDR, LB_V4_CIDR, PS_V4_CIDR);

// ============================================================================
// Helpers (IPv4 CIDR match)
// ============================================================================
function _ipToLong(ip) {
  var p = ip.split(".");
  if (p.length !== 4) return -1;
  var a = parseInt(p[0],10), b = parseInt(p[1],10), c = parseInt(p[2],10), d = parseInt(p[3],10);
  if (isNaN(a)||isNaN(b)||isNaN(c)||isNaN(d)) return -1;
  return ((a<<24)>>>0) + ((b<<16)>>>0) + ((c<<8)>>>0) + (d>>>0);
}
function _cidrMatch(ip, cidr) {
  var parts = cidr.split("/");
  if (parts.length !== 2) return false;
  var base = _ipToLong(parts[0]);
  var bits = parseInt(parts[1],10);
  var x = _ipToLong(ip);
  if (base < 0 || x < 0 || isNaN(bits)) return false;
  var mask = bits === 0 ? 0 : (0xFFFFFFFF << (32 - bits)) >>> 0;
  return ((x & mask) >>> 0) === ((base & mask) >>> 0);
}
function _inCidrs(ip, list) {
  for (var i=0;i<list.length;i++) if (_cidrMatch(ip, list[i])) return true;
  return false;
}

function _endsWith(host, dom) {
  host = (host||"").toLowerCase();
  dom  = (dom||"").toLowerCase();
  return host === dom || (host.length > dom.length && host.substring(host.length - dom.length - 1) === "." + dom);
}
function _inDomainList(host, list) {
  for (var i=0;i<list.length;i++) if (_endsWith(host, list[i])) return true;
  return false;
}
function _urlHasAny(url, list) {
  url = String(url||"").toLowerCase();
  for (var i=0;i<list.length;i++) if (url.indexOf(list[i]) >= 0) return true;
  return false;
}

// ============================================================================
// Core Routing Logic
// ============================================================================
function FindProxyForURL(url, host) {
  host = (host||"").toLowerCase();

  // (0) استثناءات DIRECT
  if (_inDomainList(host, DIRECT_DOMAINS)) return DIRECT;

  // (1) CDN/Updates DIRECT (حتى ما يزيد jitter/lag)
  // الفكرة: خلي ملفات التحديث/التحميل Direct، وخلي matchmaking/gamepath على بروكسي الأردن.
  if (_urlHasAny(url, CDN_HINTS)) return DIRECT;

  // (2) حل IP (لـ CIDR logic)
  // ملاحظة: dnsResolve قد يرجع null أحياناً، ساعتها نعتمد على الدومين.
  var ip = dnsResolve(host);

  var isJO = (ip && _inCidrs(ip, JO_V4_CIDR));
  var isNEAR = (ip && _inCidrs(ip, NEAR_V4_CIDR));

  var isPUBG = _inDomainList(host, PUBG_DOMAINS);
  var isMM   = _inDomainList(host, MM_DOMAINS);

  // (3) “Matchmaking أردني بيور أولاً”
  // - لو هو matchmaking domain => نحاول JO فقط (بدون DIRECT افتراضياً) لزيادة احتمالية JO حتى لو أخذ وقت.
  // - لكن: إذا الـ IP طلع ضمن دول الجوار، نسمح DIRECT كـ fallback جوار (بدل ما يروح بعيد).
  if (isMM || isJO) {
    // جوّا الأردن: JO chain فقط (NAT/path ثابت)
    // ترتيب ثابت = يقل التقطيع
    return PROXY_JO_MAIN + "; " + PROXY_JO_ALT + (isNEAR ? ("; " + DIRECT) : "");
  }

  // (4) أي شيء PUBG عام (لعبة/SDK/telemetry/trace) => يمشي على JO chain
  // الهدف: ما يطلع لمسارات بعيدة (قدر الإمكان)
  if (isPUBG || _inDomainList(host, TELEMETRY_HINT_DOMAINS)) {
    // إذا كان الوجهة من الجوار (حسب الـ IP) نسمح DIRECT كخطة ثانية
    // وإلا نخليها داخل JO chain لتثبيت المسار
    return PROXY_JO_MAIN + "; " + PROXY_JO_ALT + (isNEAR ? ("; " + DIRECT) : "");
  }

  // (5) باقي الإنترنت: DIRECT (حتى ما تكسر الشبكة)
  return DIRECT;
}
