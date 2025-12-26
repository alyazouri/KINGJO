// ============================================================================
// PUBG MOBILE - JO HYPER + OPTIMIZED MERGED PAC (FINAL v2 - PORT SPLIT)
// - DIRECT فقط: GitHub / YouTube
// - MATCH: port 20001 only (hard focus)
// - LOBBY/HTTPS/API: 443 (+80)
// - DNS cache TTL + Decision cache
// - Session pinning + Smart failover
// ============================================================================

// ===================== PROXIES =====================
var PROXY_JO_MAIN = "PROXY 212.35.66.45:20001";
var PROXY_JO_ALT  = "PROXY 46.185.131.218:20001";
var DIRECT        = "DIRECT";

// ===================== PORT POLICY =====================
var PORT_MATCH_ONLY = 20001;
var PORT_LOBBY_LIST = { "443": 1, "80": 1 };

// ===================== PUBG DOMAIN SCOPE =====================
var PUBG_DOMAINS = [
  "pubgmobile.com",
  "pubgm.com",
  "proximabeta.com",
  "igamecj.com",
  "tencent.com",
  "gcloudsdk.com",
  "qcloud.com",
  "qq.com",
  "tencentgcloud.com",
  "myqcloud.com"
];

var MM_DOMAINS = [
  "igamecj.com",
  "gcloudsdk.com",
  "proximabeta.com"
];

// ===================== DIRECT EXCEPTIONS (GitHub/YouTube فقط) =====================
var DIRECT_DOMAINS = [
  "github.com",
  "raw.githubusercontent.com",
  "githubusercontent.com",
  "youtube.com",
  "googlevideo.com",
  "ytimg.com",
  "ggpht.com"
];

// ===================== HYPER HINTS =====================
var MATCH_HINTS = ["match", "matchmaking", "mm", "lobby", "room", "queue", "recruit", "team", "squad"];
var VOICE_HINTS = ["voice", "rtc", "audio", "voip", "webrtc", "gvoice", "call", "mic", "speaker"];
var GAME_HINTS  = ["game", "battle", "combat", "pvp", "server", "sync", "state", "pos", "move", "action", "hit", "fire"];
var CDN_HINTS   = ["cdn", "static", "download", "patch", "update", "updater", "resource", "assets", "apk", "obb", "img", "image", "res"];

// ===================== TELEMETRY/ADS =====================
var TELEMETRY_HINT_DOMAINS = [
  "appsflyer.com",
  "adjust.com",
  "branch.io",
  "doubleclick.net",
  "googlesyndication.com",
  "firebaseio.com",
  "crashlytics.com",
  "sentry.io",
  "datadoghq.com",
  "analytics.google.com",
  "googletagmanager.com"
];

// ===================== CIDR LISTS (JO IPv4) =====================
var JO_V4_CIDR = [
  "5.45.128.0/20","37.17.192.0/20","37.123.64.0/19","37.202.64.0/18","37.220.112.0/20",
  "46.23.112.0/20","46.32.96.0/19","46.185.128.0/17","46.248.192.0/19","77.245.0.0/20",
  "79.173.192.0/18","80.90.160.0/20","82.212.64.0/18","86.108.0.0/17","91.186.224.0/19",
  "92.253.0.0/17","94.249.0.0/17","149.200.128.0/17","176.28.128.0/17","176.29.0.0/16",
  "188.247.64.0/19","212.34.0.0/19","212.35.64.0/19","212.118.0.0/19","213.139.32.0/19",
  "213.186.160.0/19","217.23.32.0/20"
];

// ===================== CONFIGURATION =====================
var CONFIG = {
  SESSION_LIFETIME: 900000,   // 15 min pin
  FAILOVER_SMART: true,       // flip each session
  CACHE_SIZE: 300,
  DNS_CACHE_TTL: 600000,      // 10 min
  DECISION_TTL: 180000        // 3 min
};

// ============================================================================
// HELPERS
// ============================================================================

function _now() { return (new Date()).getTime(); }

function _ipToLong(ip) {
  var p = ip.split(".");
  if (p.length !== 4) return -1;
  var a = parseInt(p[0], 10), b = parseInt(p[1], 10), c = parseInt(p[2], 10), d = parseInt(p[3], 10);
  if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) return -1;
  return ((a << 24) >>> 0) + ((b << 16) >>> 0) + ((c << 8) >>> 0) + (d >>> 0);
}

function _cidrMatch(ip, cidr) {
  var parts = cidr.split("/");
  if (parts.length !== 2) return false;
  var base = _ipToLong(parts[0]);
  var bits = parseInt(parts[1], 10);
  var x = _ipToLong(ip);
  if (base < 0 || x < 0 || isNaN(bits)) return false;
  var mask = bits === 0 ? 0 : (0xFFFFFFFF << (32 - bits)) >>> 0;
  return ((x & mask) >>> 0) === ((base & mask) >>> 0);
}

function _inCidrs(ip, list) {
  for (var i = 0; i < list.length; i++) {
    if (_cidrMatch(ip, list[i])) return true;
  }
  return false;
}

function _endsWith(host, dom) {
  host = (host || "").toLowerCase();
  dom = (dom || "").toLowerCase();
  return host === dom ||
    (host.length > dom.length && host.substring(host.length - dom.length - 1) === "." + dom);
}

function _inDomainList(host, list) {
  for (var i = 0; i < list.length; i++) {
    if (_endsWith(host, list[i])) return true;
  }
  return false;
}

function _strHasAny(s, list) {
  s = String(s || "").toLowerCase();
  for (var i = 0; i < list.length; i++) {
    if (s.indexOf(list[i]) >= 0) return true;
  }
  return false;
}

// Robust port extraction
function _getPort(url, host) {
  // 1) host may include :port in some clients
  var h = String(host || "");
  var hp = h.lastIndexOf(":");
  if (hp > -1) {
    var maybe = h.substring(hp + 1);
    if (maybe && maybe.length <= 5) {
      var pn = parseInt(maybe, 10);
      if (!isNaN(pn) && pn > 0 && pn < 65536) return pn;
    }
  }

  // 2) parse from url like scheme://host:port/
  var u = String(url || "");
  var m = u.match(/^[a-zA-Z]+:\/\/[^\/:]+:(\d+)\//);
  if (m && m[1]) {
    var p1 = parseInt(m[1], 10);
    if (!isNaN(p1)) return p1;
  }

  // 3) default by scheme
  if (u.indexOf("https:") === 0) return 443;
  if (u.indexOf("http:") === 0) return 80;

  // 4) unknown -> assume 443 (most app traffic)
  return 443;
}

// ============================================================================
// SOFT STATE CACHE (DNS + Decision)
// ============================================================================

var _cache = {};      // key -> {v, t}
var _cacheKeys = [];

function _cacheSet(k, v) {
  if (!_cache[k]) {
    _cacheKeys.push(k);
    if (_cacheKeys.length > CONFIG.CACHE_SIZE) {
      var old = _cacheKeys.shift();
      if (old) delete _cache[old];
    }
  }
  _cache[k] = { v: v, t: _now() };
}

function _cacheGet(k, ttl) {
  var o = _cache[k];
  if (!o) return null;
  if ((_now() - o.t) > ttl) { delete _cache[k]; return null; }
  return o.v;
}

function _dnsResolveCached(host) {
  var k = "dns:" + host;
  var v = _cacheGet(k, CONFIG.DNS_CACHE_TTL);
  if (v !== null && v !== undefined) return v;
  var ip = dnsResolve(host);
  _cacheSet(k, ip || "");
  return ip || "";
}

function _sessionId() {
  var life = CONFIG.SESSION_LIFETIME || 900000;
  return Math.floor(_now() / life);
}

// Session pinned chain (stable NAT/path)
function _joChainPinned() {
  var sid = _sessionId();
  if (CONFIG.FAILOVER_SMART && (sid % 2) === 1) {
    return PROXY_JO_ALT + "; " + PROXY_JO_MAIN;
  }
  return PROXY_JO_MAIN + "; " + PROXY_JO_ALT;
}

// MATCH chain (always MAIN first, stronger focus)
function _joChainMatch() {
  return PROXY_JO_MAIN + "; " + PROXY_JO_ALT;
}

// LOBBY/HTTPS chain (pinned for stability)
function _joChainLobby() {
  return _joChainPinned();
}

// ============================================================================
// TRAFFIC CLASSIFIER
// ============================================================================

function _classify(url, host) {
  host = (host || "").toLowerCase();
  url  = String(url || "").toLowerCase();

  var isPUBG = _inDomainList(host, PUBG_DOMAINS);
  var isMM   = _inDomainList(host, MM_DOMAINS);
  var isTEL  = _inDomainList(host, TELEMETRY_HINT_DOMAINS);

  var isVOICE = _strHasAny(host, VOICE_HINTS) || _strHasAny(url, VOICE_HINTS);
  var isGAME  = _strHasAny(host, GAME_HINTS)  || _strHasAny(url, GAME_HINTS);
  var isMATCH = _strHasAny(host, MATCH_HINTS) || _strHasAny(url, MATCH_HINTS);
  var isCDN   = _strHasAny(host, CDN_HINTS)   || _strHasAny(url, CDN_HINTS);

  if (isMM || isMATCH) return "MATCH";
  if (isVOICE)         return "VOICE";
  if (isGAME)          return "GAME";
  if (isCDN)           return "CDN";
  if (isTEL)           return "TEL";
  if (isPUBG)          return "PUBG";
  return "OTHER";
}

// ============================================================================
// MAIN
// ============================================================================

function FindProxyForURL(url, host) {
  host = (host || "").toLowerCase();

  // DIRECT فقط GitHub/YouTube
  if (_inDomainList(host, DIRECT_DOMAINS)) {
    return DIRECT;
  }

  // Decision cache
  var dk = "d:" + host + "|" + String(url || "");
  var dv = _cacheGet(dk, CONFIG.DECISION_TTL);
  if (dv) return dv;

  // Resolve + GEO
  var ip = _dnsResolveCached(host);
  var isJO = ip && _inCidrs(ip, JO_V4_CIDR);

  // Classify + Port split
  var kind = _classify(url, host);
  var port = _getPort(url, host);

  var out;

  // (A) MATCH = 20001 ONLY (hard focus)
  if (port === PORT_MATCH_ONLY) {
    // إذا PUBG-related أو حتى JO IP => MATCH chain
    if (isJO || kind === "MATCH" || kind === "GAME" || kind === "VOICE" || kind === "PUBG") {
      out = _joChainMatch();
    } else {
      // حتى لو مش PUBG، خليه ثابت
      out = _joChainMatch();
    }
  }
  // (B) Lobby/HTTPS/API = 443/80
  else if (PORT_LOBBY_LIST[String(port)]) {
    // إذا PUBG أو JO => lobby chain pinned
    if (isJO || kind !== "OTHER") out = _joChainLobby();
    else out = _joChainPinned();
  }
  // (C) Other ports
  else {
    // keep stable path
    if (isJO || kind !== "OTHER") out = _joChainPinned();
    else out = _joChainPinned();
  }

  _cacheSet(dk, out);
  return out;
}
