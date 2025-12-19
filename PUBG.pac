// JO PAC (NO DIRECT) — PUBG Enhanced 2025-12-19
// - NO DIRECT (ever)
// - PUBG-aware routing (Lobby/Match/Recruit/CDN/Updates)
// - Prefer SOCKS5 (1080) for MATCH when available
// - If no proxies => BLOCK

var DISCOVERED_PROXIES = [
  "212.118.1.27:8080","212.118.1.20:8080","212.118.1.19:8080","212.118.1.26:8080","212.118.1.24:8080",
  "212.118.1.22:8080","212.118.1.18:8080","212.118.1.94:1080","212.118.1.243:8080","212.118.2.91:8080",
  "212.118.4.130:8080","212.118.4.187:8080","212.118.7.93:1080","212.118.7.91:1080","212.118.7.147:8080"
];

var BLOCK = "PROXY 0.0.0.0:0";

// ===================== PUBG HOST PATTERNS =====================
// ملاحظة: PUBG بتستخدم Tencent/IGame/GCloud + CDN كثييير، فحاط لك مجموعة واسعة
var PUBG_HOST_KEYWORDS = [
  "pubg", "pubgmobile", "igame", "tencent", "gcloud", "proximabeta", "levelinfinite"
];

var PUBG_MATCH_HOST_HINTS = [
  "gcloudcs", "igame", "msdk", "game", "match", "gateway", "lobby", "recruit"
];

var PUBG_CDN_HOST_HINTS = [
  "cdn", "download", "patch", "update", "assets", "resource", "akamai", "cloudfront", "fastly"
];

// ===================== PORT LOGIC (best-effort) =====================
// PAC ما بيعرف UDP، لكن بنحاول نقرأ البورت من الـ URL لو موجود
var MATCH_PORTS = [20001, 10012, 5000, 9999, 20002, 20005];
var LOBBY_PORTS = [443, 80];
var DNS_PORTS   = [53];

// ===================== HELPERS =====================
function _lower(s){ return (s||"").toLowerCase(); }

function _endsWith(host, suffix){
  host = _lower(host); suffix = _lower(suffix);
  return host.length >= suffix.length && host.substring(host.length - suffix.length) === suffix;
}

function _containsAny(h, arr){
  h = _lower(h);
  for (var i=0;i<arr.length;i++){
    if (h.indexOf(_lower(arr[i])) !== -1) return true;
  }
  return false;
}

// Wildcard-ish match using keywords + common suffixes
function isPUBGHost(host){
  var h = _lower(host);

  // Fast keyword hit
  if (_containsAny(h, PUBG_HOST_KEYWORDS)) return true;

  // Common Tencent / PUBG related domains
  if (_endsWith(h, ".tencent.com")) return true;
  if (_endsWith(h, ".tencent-cloud.com")) return true;
  if (_endsWith(h, ".qq.com")) return true;
  if (_endsWith(h, ".gcloudcs.com")) return true;
  if (_endsWith(h, ".gcloud.com")) return true;
  if (_endsWith(h, ".igamecj.com")) return true;
  if (_endsWith(h, ".proximabeta.com")) return true;
  if (_endsWith(h, ".levelinfinite.com")) return true;

  return false;
}

function getPortFromURL(url){
  // يحاول يقرأ :PORT من الرابط (إن وُجد)
  // أمثلة: https://host:443/path  |  http://host:8080/
  try{
    var u = url;
    var schemeIdx = u.indexOf("://");
    if (schemeIdx !== -1) u = u.substring(schemeIdx + 3);
    // strip path
    var slashIdx = u.indexOf("/");
    if (slashIdx !== -1) u = u.substring(0, slashIdx);
    // now u = host[:port]
    var colonIdx = u.lastIndexOf(":");
    if (colonIdx !== -1){
      var p = parseInt(u.substring(colonIdx + 1), 10);
      if (!isNaN(p) && p > 0 && p < 65536) return p;
    }
  }catch(e){}
  return -1;
}

function portInList(p, arr){
  for (var i=0;i<arr.length;i++){
    if (p === arr[i]) return true;
  }
  return false;
}

function isSocksPort(port){ return port === 1080; }

// Build chain with optional preference: socks-first or http-first
function buildProxyChain(preferSocksFirst){
  if (!DISCOVERED_PROXIES || DISCOVERED_PROXIES.length === 0) return BLOCK;

  var socks = [];
  var http  = [];

  for (var i=0;i<DISCOVERED_PROXIES.length;i++){
    var hp = DISCOVERED_PROXIES[i];
    var colon = hp.lastIndexOf(":");
    var port = (colon !== -1) ? parseInt(hp.substring(colon+1),10) : -1;

    if (isSocksPort(port)) socks.push("SOCKS5 " + hp);
    else http.push("PROXY " + hp);
  }

  var out = [];
  if (preferSocksFirst){
    for (var a=0;a<socks.length;a++) out.push(socks[a]);
    for (var b=0;b<http.length;b++)  out.push(http[b]);
  } else {
    for (var c=0;c<http.length;c++)  out.push(http[c]);
    for (var d=0;d<socks.length;d++) out.push(socks[d]);
  }

  // NO DIRECT at the end
  if (out.length === 0) return BLOCK;

  // join with ; 
  var chain = out[0];
  for (var k=1;k<out.length;k++) chain += "; " + out[k];
  return chain;
}

// Decide PUBG class: MATCH vs LOBBY vs CDN/UPDATES (heuristic)
function pubgClass(url, host){
  var h = _lower(host);
  var p = getPortFromURL(url);

  // Port-based strongest signal (if present)
  if (p !== -1){
    if (portInList(p, MATCH_PORTS)) return "MATCH";
    if (portInList(p, LOBBY_PORTS)) return "LOBBY";
    if (portInList(p, DNS_PORTS))   return "DNS";
  }

  // Host hint fallback
  if (_containsAny(h, PUBG_CDN_HOST_HINTS)) return "CDN";
  if (_containsAny(h, PUBG_MATCH_HOST_HINTS)) return "MATCH";

  // Default
  return "LOBBY";
}

// ===================== MAIN =====================
function FindProxyForURL(url, host) {
  if (!DISCOVERED_PROXIES || DISCOVERED_PROXIES.length === 0) return BLOCK;

  // PUBG traffic (wide match)
  if (isPUBGHost(host)) {
    var cls = pubgClass(url, host);

    // MATCH: socks-first (if any 1080 موجود)
    if (cls === "MATCH") return buildProxyChain(true);

    // CDN/UPDATES/LOBBY: http-first (عادةً أنسب للتنزيل/https)
    return buildProxyChain(false);
  }

  // Everything else: still NO DIRECT (حسب شرطك)
  return buildProxyChain(false);
}
