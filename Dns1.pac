// ===================================================
//  PUBG Mobile – JO ULTRA PAC (NO DIRECT) — v2
//  MATCH / LOBBY / RECRUIT with Adaptive JO Retry
//  - أولاً: يفضّل/يفرض JO للماتش عبر BLOCK لإعادة البحث
//  - لاحقاً: إذا تكرر كثير → يمرر عبر بروكسي حتى ما تعلق
// ===================================================

// ================== PROXIES (JO ONLY) ==================
var PROXY_PRIMARY  = "PROXY 212.35.66.45:20001";   // PUBG MATCH
var PROXY_SECOND   = "PROXY 46.185.131.218:443";   // JO fallback
var PROXY_LOBBY    = "PROXY 212.35.66.45:443";     // Lobby / Recruit
var BLOCK          = "PROXY 0.0.0.0:0";            // Hard block (forces re-search)

// ================== PUBG PORT LOGIC ==================
var PORT_MATCH   = [20001, 10012];
var PORT_LOBBY   = [443];
var PORT_UPDATE  = [80];

// ================== JO PURE IPv4 (BEST for PUBG) ==================
var JO_V4 = [
  "46.185.128.0/18",   // Zain Core JO (أدق من /17)
  "37.202.64.0/18",    // Umniah Core JO
  "82.212.64.0/18",    // Jordan Telecom / Backbone
  "62.72.160.0/19",    // Orange Backbone (أفضل من 213.139/213.140)
  "46.32.96.0/21",     // JO DC low-latency (أدق من /19)
  "77.245.4.0/22",     // Zain Gaming/NAT (أفضل من 77.245.0.0/20)
  "79.173.192.0/18",   // Umniah Mobile JO
  "5.45.128.0/20"      // Zain JO (احتياط)
];

// ================== ADAPTIVE RETRY (SMART) ==================
// كم مرة نعمل BLOCK للماتش غير الأردني قبل ما نفتح فallback
var MATCH_BLOCK_TRIES = 6;        // ارفعها لو بدك تشدد أكثر
var MATCH_WINDOW_MS   = 22000;    // نافذة زمنية للمحاولات (22 ثانية)

var LOBBY_BLOCK_TRIES = 0;        // خليها 0 عادة (اللّوبي ما بدنا نعلّقه)
var LOBBY_WINDOW_MS   = 12000;

// كاش داخلي داخل الـ PAC
var __retry = {};

// ================== HELPERS ==================
function nowMs() { return (new Date()).getTime(); }

function ipToLong(ip) {
  var p = ip.split('.');
  return ((+p[0]<<24)>>>0) + (+p[1]<<16) + (+p[2]<<8) + (+p[3]);
}

function isInCIDR(ip, cidr) {
  var parts = cidr.split('/');
  var base = ipToLong(parts[0]);
  var bits = parseInt(parts[1], 10);
  var mask = (bits === 0) ? 0 : (-1 << (32 - bits));
  return (ipToLong(ip) & mask) === (base & mask);
}

function isJO(ip) {
  for (var i = 0; i < JO_V4.length; i++) {
    if (isInCIDR(ip, JO_V4[i])) return true;
  }
  return false;
}

function portMatch(port, list) {
  for (var i = 0; i < list.length; i++) {
    if (port == list[i]) return true;
  }
  return false;
}

// استخراج البورت الحقيقي من الـ URL (بديل myPort)
function getPort(url) {
  // إذا فيه :port صريح
  var s = url;
  var p = s.indexOf("://");
  if (p >= 0) s = s.substring(p + 3);

  // قص أي path/query
  var slash = s.indexOf("/");
  if (slash >= 0) s = s.substring(0, slash);

  // IPv6 URL bracket [..]:port (نادر في PAC هنا)
  if (s.length && s.charAt(0) === "[") {
    var rb = s.indexOf("]");
    if (rb >= 0) {
      var rest = s.substring(rb + 1);
      if (rest.length && rest.charAt(0) === ":") {
        var vp = parseInt(rest.substring(1), 10);
        if (vp > 0) return vp;
      }
    }
  }

  // host:port
  var colon = s.lastIndexOf(":");
  if (colon > 0) {
    var maybePort = parseInt(s.substring(colon + 1), 10);
    if (maybePort > 0) return maybePort;
  }

  // افتراض حسب البروتوكول
  if (shExpMatch(url, "https:*")) return 443;
  if (shExpMatch(url, "http:*"))  return 80;

  // default fallback
  return 443;
}

// منطق المحاولات الذكي: يرجع true إذا لازم نعمل BLOCK الآن
function shouldBlock(key, maxTries, windowMs) {
  if (maxTries <= 0) return false;

  var t = nowMs();
  var st = __retry[key];
  if (!st || (t - st.t0) > windowMs) {
    __retry[key] = { t0: t, n: 1 };
    return true; // أول محاولة داخل نافذة جديدة
  }

  st.n++;
  // طالما ما وصلنا حد المحاولات → BLOCK
  if (st.n <= maxTries) return true;

  // تجاوز الحد → لا بلوك (افتح فallback)
  return false;
}

// ================== MAIN ==================
function FindProxyForURL(url, host) {

  // استثناءات ضرورية — تضل عبر بروكسي (NO DIRECT)
  if (dnsDomainIs(host, "youtube.com") ||
      dnsDomainIs(host, "googlevideo.com") ||
      dnsDomainIs(host, "github.com") ||
      dnsDomainIs(host, "raw.githubusercontent.com")) {
    return PROXY_LOBBY;
  }

  var port = getPort(url);

  var ip = dnsResolve(host);
  if (!ip) return PROXY_LOBBY;

  var jo = isJO(ip);

  // ===== MATCH (أهم جزء) =====
  if (portMatch(port, PORT_MATCH)) {

    if (jo) {
      // JO MATCH → أولوية للماتش
      return PROXY_PRIMARY;
    } else {
      // مش JO → نعمل BLOCK عدة مرات عشان PUBG تعيد البحث
      // وبعدها نفتح فallback تلقائي حتى ما يعلق
      var k = "M|" + host + "|" + port;
      if (shouldBlock(k, MATCH_BLOCK_TRIES, MATCH_WINDOW_MS)) {
        return BLOCK;
      }
      // فتح fallback بعد كثرة المحاولات:
      // جرّب PROXY_PRIMARY أولاً حتى للماتش (لأنه أفضل للماتش)
      return PROXY_PRIMARY + "; " + PROXY_SECOND;
    }
  }

  // ===== RECRUIT / LOBBY =====
  if (portMatch(port, PORT_LOBBY)) {
    if (jo) {
      return PROXY_LOBBY;
    } else {
      // عادة اللّوبي ما بنعمله بلوك كثير عشان ما يصير no internet
      // لكن لو بدك تشدد: ارفع LOBBY_BLOCK_TRIES فوق
      var k2 = "L|" + host + "|" + port;
      if (shouldBlock(k2, LOBBY_BLOCK_TRIES, LOBBY_WINDOW_MS)) {
        return BLOCK;
      }
      return PROXY_SECOND;
    }
  }

  // ===== UPDATES =====
  if (portMatch(port, PORT_UPDATE)) {
    return PROXY_SECOND;
  }

  // ===== DEFAULT (NO DIRECT) =====
  return PROXY_SECOND;
}
