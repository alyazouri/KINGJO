// ===================================================
//  PUBG Mobile – JO ULTRA PAC (NO DIRECT) — FINAL STABLE
//  تحسين دعم الأردن + تقليل الحظر الخاطئ + توسيع استثناءات
// ===================================================

// ================== PROXIES (JO ONLY) ==================
var PROXY_MATCH  = "PROXY 212.35.66.45:20004";   
var PROXY_FALL   = "PROXY 46.185.131.218:20001"; 
var PROXY_LOBBY  = "PROXY 212.35.66.45:9030";     
var BLOCK        = "PROXY 0.0.0.0:0";            

var CHAIN_MATCH = PROXY_MATCH + "; " + PROXY_FALL;
var CHAIN_LOBBY = PROXY_LOBBY + "; " + PROXY_FALL;

// ================== PORT LOGIC ==================
var PORT_MATCH  = [20004, 20005, 20010, 20100, 20101, 20200];
var PORT_LOBBY  = [443, 80];
var PORT_UPDATE = [80];

// ================== JO PURE IPv4 ==================
var JO_V4 = [
  "46.185.128.0/17",   // Zain
  "213.139.64.0/18",   // Orange
  "213.140.0.0/17",    // Zain
  "37.202.64.0/18",    // Umniah
  "46.32.96.0/19",
  "82.212.64.0/18",
  "79.134.128.0/19",
  "77.245.0.0/20",
  "185.101.112.0/22",  // Damamax/Vtel
  "193.188.64.0/18",   // Mada
  "5.44.32.0/19"       // Additional Zain/Orange ranges
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

function getPort(url) {
  var m = url.match(/^[a-zA-Z]+:\/\/[^\/:]+:(\d+)\//);
  if (m && m[1]) return parseInt(m[1], 10);
  if (url.substring(0, 6).toLowerCase() === "https:") return 443;
  if (url.substring(0, 5).toLowerCase() === "http:")  return 80;
  return 443;
}

// ================== DNS CACHE ==================
var DNS_TTL_MS = 30000;
var _dnsCache = {};

function cachedResolve(host) {
  var now = (new Date()).getTime();
  var e = _dnsCache[host];
  if (e && (now - e.t) < DNS_TTL_MS) return e.ip;

  var ip = dnsResolve(host);
  if (ip) _dnsCache[host] = { ip: ip, t: now };
  return ip;
}

// ================== SMART BLOCK ==================
var MATCH_BLOCK_TRIES = 5;
var MATCH_WINDOW_MS   = 30000;
var _matchTry = {};

function shouldBlockMatch(key) {
  var now = (new Date()).getTime();
  var e = _matchTry[key];
  if (!e || (now - e.t) > MATCH_WINDOW_MS) {
    _matchTry[key] = { n: 1, t: now };
    return true;
  }
  e.n += 1;
  e.t = now;
  return (e.n <= MATCH_BLOCK_TRIES);
}

// ================== الاستثناءات (DIRECT) ==================
function isExceptionApp(host) {
  // شاهد
  if (dnsDomainIs(host, "shahid.mbc.net") ||
      dnsDomainIs(host, "shahid.net") ||
      shExpMatch(host, "*.shahid.mbc.net") ||
      shExpMatch(host, "*.shahid.net")) {
    return true;
  }

  // يوتيوب
  if (dnsDomainIs(host, "youtube.com") ||
      dnsDomainIs(host, "googlevideo.com") ||
      dnsDomainIs(host, "ytimg.com") ||
      shExpMatch(host, "*.youtube.com") ||
      shExpMatch(host, "*.googlevideo.com") ||
      shExpMatch(host, "*.ytimg.com")) {
    return true;
  }

  // تيكتوك
  if (dnsDomainIs(host, "tiktok.com") ||
      dnsDomainIs(host, "tiktokv.com") ||
      dnsDomainIs(host, "ttlivecdn.com") ||
      shExpMatch(host, "*.tiktok.com") ||
      shExpMatch(host, "*.tiktokv.com") ||
      shExpMatch(host, "*.ttlivecdn.com") ||
      shExpMatch(host, "*.byteoversea.com")) {
    return true;
  }

  return false;
}

// ================== MAIN ==================
function FindProxyForURL(url, host) {
  if (isExceptionApp(host)) return "DIRECT";

  // احتفظ بـ GitHub للبقاء على PAC نفسه
  if (dnsDomainIs(host, "github.com") ||
      dnsDomainIs(host, "raw.githubusercontent.com")) {
    return CHAIN_LOBBY;
  }

  var port = getPort(url);
  var ip = cachedResolve(host);
  if (!ip) return CHAIN_LOBBY;

  // MATCH
  if (inList(port, PORT_MATCH)) {
    if (isJO(ip)) {
      return CHAIN_MATCH;
    } else {
      var key = ip + ":" + port;
      if (shouldBlockMatch(key)) return BLOCK;
      return CHAIN_MATCH;
    }
  }

  // LOBBY
  if (inList(port, PORT_LOBBY)) {
    if (isJO(ip)) return CHAIN_LOBBY;
    return PROXY_FALL;
  }

  // UPDATE / CDN
  if (inList(port, PORT_UPDATE)) return PROXY_FALL;

  // DEFAULT
  return PROXY_FALL;
}
