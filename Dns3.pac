// ===================================================
//  PUBG Mobile — JO ULTRA PAC (Umniah) — FINAL (NO IPv6)
//  GOAL: Lobby FAST + Match STRONG + NO DIRECT + Zero Diffusion
//  - IPv6 ULA (fdxx) ignored completely
//  - Uses focused JO IPv4 only
// ===================================================

// ================== PROXIES (JO ONLY) ==================
var PROXY_MATCH_PRIMARY = "PROXY 212.35.66.45:20001";
var PROXY_LOBBY_PRIMARY = "PROXY 212.35.66.45:443";
var PROXY_FALLBACK      = "PROXY 46.185.131.218:443";
var NO_DIRECT_DEFAULT   = PROXY_FALLBACK; // NO DIRECT

// ================== PORT LOGIC ==================
var PORT_MATCH  = [20001, 10012];
var PORT_LOBBY  = [443];
var PORT_UPDATE = [80];

// ================== JO PURE IPv4 (FOCUSED / LOW DIFFUSION) ==================
var JO_V4 = [
  "37.202.64.0/18",    // Umniah Core
  "79.173.192.0/18",   // Umniah Mobile
  "46.185.128.0/18",   // Zain Core (clean)
  "82.212.64.0/18",    // JO Backbone
  "46.32.96.0/21",     // JO DC (tight)
  "77.245.4.0/22",     // Gaming/NAT (tight)
  "62.72.160.0/19",    // Orange backbone (clean alt)
  "5.45.128.0/20"      // Zain backup
];

// ================== FAST EXCEPTIONS (NO DIRECT) ==================
function isFastException(host) {
  return dnsDomainIs(host, "youtube.com") ||
         dnsDomainIs(host, "googlevideo.com") ||
         dnsDomainIs(host, "github.com") ||
         dnsDomainIs(host, "raw.githubusercontent.com");
}

// ================== PORT ==================
function portMatch(port, list) {
  for (var i = 0; i < list.length; i++) if (port == list[i]) return true;
  return false;
}
function getPort(url) {
  var s = url;
  var p = s.indexOf("://");
  if (p >= 0) s = s.substring(p + 3);
  var slash = s.indexOf("/");
  if (slash >= 0) s = s.substring(0, slash);

  var colon = s.lastIndexOf(":");
  if (colon > 0) {
    var maybePort = parseInt(s.substring(colon + 1), 10);
    if (maybePort > 0) return maybePort;
  }

  if (shExpMatch(url, "https:*")) return 443;
  if (shExpMatch(url, "http:*"))  return 80;
  return 443;
}

// ================== IPv4 HELPERS ==================
function ipToLong(ip) {
  var p = ip.split(".");
  return ((+p[0] << 24) >>> 0) + (+p[1] << 16) + (+p[2] << 8) + (+p[3]);
}
function isInCIDR(ip, cidr) {
  var parts = cidr.split("/");
  var base = ipToLong(parts[0]);
  var bits = parseInt(parts[1], 10);
  var mask = (bits === 0) ? 0 : (-1 << (32 - bits));
  return (ipToLong(ip) & mask) === (base & mask);
}
function isJOv4(ip) {
  if (!ip || ip.indexOf(".") < 0) return false;
  for (var i = 0; i < JO_V4.length; i++) {
    if (isInCIDR(ip, JO_V4[i])) return true;
  }
  return false;
}

// ================== MAIN ==================
function FindProxyForURL(url, host) {

  // exceptions (still no direct)
  if (isFastException(host)) {
    return PROXY_LOBBY_PRIMARY + "; " + PROXY_FALLBACK;
  }

  var port = getPort(url);

  // Resolve (IPv4 only)
  var ip = dnsResolve(host);
  if (!ip || ip.indexOf(".") < 0) {
    // إذا ما قدر يحل IPv4 → خليه Lobby proxy (أكثر استقرار على Umniah)
    return PROXY_LOBBY_PRIMARY + "; " + PROXY_FALLBACK;
  }

  var jo = isJOv4(ip);

  // ---- LOBBY FAST ----
  if (portMatch(port, PORT_LOBBY)) {
    // سريع وثابت (بدون فلترة/بدون تعليق)
    return PROXY_LOBBY_PRIMARY + "; " + PROXY_FALLBACK;
  }

  // ---- MATCH STRONG ----
  if (portMatch(port, PORT_MATCH)) {
    // JO: primary مباشر
    if (jo) return PROXY_MATCH_PRIMARY;

    // غير JO: قوي + failover سريع بدون قطع
    return PROXY_MATCH_PRIMARY + "; " + PROXY_FALLBACK;
  }

  // ---- UPDATES ----
  if (portMatch(port, PORT_UPDATE)) {
    return PROXY_FALLBACK;
  }

  // ---- DEFAULT (NO DIRECT) ----
  return NO_DIRECT_DEFAULT;
}
