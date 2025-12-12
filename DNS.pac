// ===================================================
//  PUBG Mobile – JO ULTRA PAC (NO DIRECT)
//  MATCH / LOBBY / RECRUIT with Smart JO Fallback
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

// ================== JO PURE IPv4 ==================
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

// ================== HELPERS ==================
function ipToLong(ip) {
  var p = ip.split('.');
  return ((+p[0]<<24)>>>0) + (+p[1]<<16) + (+p[2]<<8) + (+p[3]);
}

function isInCIDR(ip, cidr) {
  var parts = cidr.split('/');
  var base = ipToLong(parts[0]);
  var mask = -1 << (32 - parseInt(parts[1], 10));
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

// ================== MAIN ==================
function FindProxyForURL(url, host) {

  // استثناءات ضرورية (لا تؤثر على PUBG)
  if (dnsDomainIs(host, "youtube.com") ||
      dnsDomainIs(host, "googlevideo.com") ||
      dnsDomainIs(host, "github.com") ||
      dnsDomainIs(host, "raw.githubusercontent.com")) {
    return PROXY_LOBBY;
  }

  var ip = dnsResolve(host);
  if (!ip) return PROXY_LOBBY;

  // ===== MATCH (أهم جزء) =====
  if (portMatch(myPort, PORT_MATCH)) {
    if (isJO(ip)) {
      return PROXY_PRIMARY;
    } else {
      // إجبار PUBG يعيد البحث حتى يلقط JO
      return BLOCK;
    }
  }

  // ===== RECRUIT / LOBBY =====
  if (portMatch(myPort, PORT_LOBBY)) {
    if (isJO(ip)) {
      return PROXY_LOBBY;
    } else {
      return PROXY_SECOND;
    }
  }

  // ===== UPDATES =====
  if (portMatch(myPort, PORT_UPDATE)) {
    return PROXY_SECOND;
  }

  // ===== DEFAULT (NO DIRECT) =====
  return PROXY_SECOND;
}
