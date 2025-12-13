// ===================================================
// PUBG Mobile – JO ULTRA PAC (NO DIRECT)
// MATCH / LOBBY / RECRUIT with Smart JO Fallback
// + LOBBY/RECRUIT: rotates preferred JO range every 10 seconds
// ===================================================

// ================== PROXIES (JO ONLY) ==================
var PROXY_PRIMARY = "PROXY 212.35.66.45:20001";  // PUBG MATCH
var PROXY_SECOND  = "PROXY 46.185.131.218:443";  // JO fallback
var PROXY_LOBBY   = "PROXY 212.35.66.45:443";    // Lobby / Recruit
var BLOCK         = "PROXY 0.0.0.0:0";           // Hard block (forces re-search)

// ================== PUBG PORT LOGIC ==================
var PORT_MATCH  = [20001];
var PORT_LOBBY  = [443];
var PORT_UPDATE = [80];

// ================== JO PURE IPv4 ==================
var JO_V4 = [
  "46.185.128.0/17", // Zain (BEST)
  "213.139.64.0/18", // Orange
  "213.140.0.0/17",  // Zain
  "37.202.64.0/18",  // Umniah
  "46.32.96.0/19",
  "82.212.64.0/18",
  "79.134.128.0/19",
  "77.245.0.0/20"
];

// ================== ROTATION CONTROL ==================
// كل كم ثانية يتبدّل "النطاق المفضل" للـ LOBBY/RECRUIT
var ROTATE_SECONDS = 10;

// إذا true: أي LOBBY/RECRUIT مش داخل النطاق المفضل الحالي = BLOCK (يعيد البحث)
// إذا false: غير المفضل يروح PROXY_SECOND (أخف، بس أقل إجبار)
var HARD_RECRUIT = true;

// ================== HELPERS ==================
function ipToLong(ip) {
  var p = ip.split('.');
  return (((+p[0] << 24) >>> 0) + ((+p[1] << 16) >>> 0) + ((+p[2] << 8) >>> 0) + (+p[3] >>> 0)) >>> 0;
}

function maskFromBits(bits) {
  bits = parseInt(bits, 10);
  if (bits <= 0) return 0 >>> 0;
  if (bits >= 32) return 0xFFFFFFFF >>> 0;
  return (0xFFFFFFFF << (32 - bits)) >>> 0;
}

function isInCIDR(ip, cidr) {
  var parts = cidr.split('/');
  var base = ipToLong(parts[0]);
  var mask = maskFromBits(parts[1]);
  return ((ipToLong(ip) & mask) >>> 0) === ((base & mask) >>> 0);
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

// يعطيك النطاق "المفضل" الحالي حسب الوقت (يتغير كل ROTATE_SECONDS)
function preferredLobbyCIDR() {
  var slot = Math.floor((new Date()).getTime() / (ROTATE_SECONDS * 1000));
  var idx  = slot % JO_V4.length;
  return JO_V4[idx];
}

// ================== MAIN ==================
function FindProxyForURL(url, host) {

  // استثناءات (زي ملفك) — بدون DIRECT
  if (dnsDomainIs(host, "youtube.com") || dnsDomainIs(host, "googlevideo.com") ||
      dnsDomainIs(host, "github.com") || dnsDomainIs(host, "raw.githubusercontent.com")) {
    return PROXY_LOBBY;
  }

  var ip = dnsResolve(host);
  if (!ip) return PROXY_LOBBY;

  // ===== MATCH (أهم جزء) =====
  if (portMatch(myPort, PORT_MATCH)) {
    if (isJO(ip)) return PROXY_PRIMARY;
    return BLOCK; // يجبر إعادة البحث لماتش JO
  }

  // ===== RECRUIT / LOBBY =====
  if (portMatch(myPort, PORT_LOBBY)) {
    // كل 10 ثواني بنفضل CIDR مختلف
    var pref = preferredLobbyCIDR();

    if (isInCIDR(ip, pref)) {
      return PROXY_LOBBY; // هذا هو "النطاق المختار" الحالي
    }

    // إذا مش داخل النطاق المختار:
    if (HARD_RECRUIT) return BLOCK;     // إجبار إعادة البحث
    return PROXY_SECOND;               // أخف (بدون قطع مستمر)
  }

  // ===== UPDATES =====
  if (portMatch(myPort, PORT_UPDATE)) {
    return PROXY_SECOND;
  }

  // ===== DEFAULT (NO DIRECT) =====
  return PROXY_SECOND;
}
