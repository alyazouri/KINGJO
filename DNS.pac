// ===================================================
//  PUBG Mobile – JO ULTRA PAC (NO DIRECT) — PING STABLE EDITION
//  - Fix port detection (no myPort in PAC)
//  - DNS cache to reduce jitter
//  - Smart BLOCK for MATCH (block few tries then fallback to keep session stable)
// ===================================================

// ================== PROXIES (JO ONLY) ==================
var PROXY_MATCH  = "PROXY 212.35.66.45:20001";   // MATCH primary
var PROXY_FALL   = "PROXY 46.185.131.218:20002"; // fallback
var PROXY_LOBBY  = "PROXY 212.35.66.45:10000";     // lobby/recruit safer than 10000 غالباً
var BLOCK        = "PROXY 0.0.0.0:0";            // hard block (forces re-search)

// If you want multi-try fallback chaining (better stability):
// (PAC tries left-to-right)
var CHAIN_MATCH = PROXY_MATCH + "; " + PROXY_FALL;
var CHAIN_LOBBY = PROXY_LOBBY + "; " + PROXY_FALL;

// ================== PORT LOGIC ==================
var PORT_MATCH  = [20001];
var PORT_LOBBY  = [443];
var PORT_UPDATE = [80];

// ================== JO PURE IPv4 (as you provided) ==================
var JO_V4 = [
  "46.185.128.0/17",   // Zain (BEST)
  "213.139.64.0/18",   // Orange
  "213.140.0.0/17",    // Zain
  "37.202.64.0/18",    // Umniah
  "46.32.96.0/19",
  "82.212.64.0/18",
  "79.134.128.0/19",
  "77.245.0.0/20"
];

// ================== FAST CIDR PRECOMP ==================
var _CIDR = null;

function ipToLong(ip) {
  var p = ip.split('.');
  return ((+p[0]<<24)>>>0) + ((+p[1]<<16)>>>0) + ((+p[2]<<8)>>>0) + (+p[3]>>>0);
}

function buildCIDR() {
  var out = [];
  for (var i = 0; i < JO_V4.length; i++) {
    var parts = JO_V4[i].split('/');
    var base = ipToLong(parts[0]);
    var bits = parseInt(parts[1], 10);
    var mask = (bits === 0) ? 0 : ((-1 << (32 - bits)) >>> 0);
    out.push({ base: base, mask: mask });
  }
  return out;
}

function isJO(ip) {
  if (!_CIDR) _CIDR = buildCIDR();
  var x = ipToLong(ip);
  for (var i = 0; i < _CIDR.length; i++) {
    var c = _CIDR[i];
    if ((x & c.mask) === (c.base & c.mask)) return true;
  }
  return false;
}

function inList(port, list) {
  for (var i = 0; i < list.length; i++) if (port == list[i]) return true;
  return false;
}

// ================== PORT EXTRACT (FIX) ==================
function getPort(url) {
  // If URL contains explicit :port
  var m = url.match(/^[a-zA-Z]+:\/\/[^\/:]+:(\d+)\//);
  if (m && m[1]) return parseInt(m[1], 10);

  // Fallback based on scheme
  if (url.substring(0, 6).toLowerCase() === "https:") return 443;
  if (url.substring(0, 5).toLowerCase() === "http:")  return 80;

  // Unknown -> assume 443 (safer for most PUBG traffic)
  return 443;
}

// ================== DNS CACHE (REDUCE JITTER) ==================
var DNS_TTL_MS = 30000; // 30s cache
var _dnsCache = {};     // host -> {ip, t}

function cachedResolve(host) {
  var now = (new Date()).getTime();
  var e = _dnsCache[host];
  if (e && (now - e.t) < DNS_TTL_MS) return e.ip;

  var ip = dnsResolve(host);
  if (ip) _dnsCache[host] = { ip: ip, t: now };
  return ip;
}

// ================== SMART BLOCK (STABILITY) ==================
// Block non-JO match only for first N attempts per destination,
// then fallback to proxy so the game doesn't hang.
var MATCH_BLOCK_TRIES = 3;
var MATCH_WINDOW_MS   = 20000; // 20s window
var _matchTry = {};            // key -> {n, t}

function shouldBlockMatch(key) {
  var now = (new Date()).getTime();
  var e = _matchTry[key];
  if (!e || (now - e.t) > MATCH_WINDOW_MS) {
    _matchTry[key] = { n: 1, t: now };
    return true; // first try -> block
  }
  e.n += 1;
  e.t = now;
  return (e.n <= MATCH_BLOCK_TRIES);
}

// ================== MAIN ==================
function FindProxyForURL(url, host) {

  // Keep these routed (NO DIRECT) but not important for PUBG latency
  if (dnsDomainIs(host, "youtube.com") ||
      dnsDomainIs(host, "googlevideo.com") ||
      dnsDomainIs(host, "github.com") ||
      dnsDomainIs(host, "raw.githubusercontent.com")) {
    return CHAIN_LOBBY;
  }

  var port = getPort(url);

  // Resolve IP (cached)
  var ip = cachedResolve(host);
  if (!ip) return CHAIN_LOBBY;

  // ===== MATCH =====
  if (inList(port, PORT_MATCH)) {
    if (isJO(ip)) {
      return CHAIN_MATCH;
    } else {
      // Smart block few times then fallback to keep ping stable/session alive
      var key = ip + ":" + port;
      if (shouldBlockMatch(key)) return BLOCK;
      return CHAIN_MATCH;
    }
  }

  // ===== LOBBY / RECRUIT =====
  if (inList(port, PORT_LOBBY)) {
    if (isJO(ip)) return CHAIN_LOBBY;
    return PROXY_FALL;
  }

  // ===== UPDATES / CDN =====
  if (inList(port, PORT_UPDATE)) {
    return PROXY_FALL;
  }

  // ===== DEFAULT (NO DIRECT) =====
  return PROXY_FALL;
}
