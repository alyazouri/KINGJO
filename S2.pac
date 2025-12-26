// ===================================================
//  PUBG Mobile – JO ULTRA PAC (FINAL + LOW PING DNS + REGIONAL OPTIMIZED)
// ===================================================

// Custom DNS Resolver
var CUSTOM_DNS = [
  "1.1.1.1",   // Cloudflare DNS
  "8.8.8.8"    // Google DNS
];

// Try to resolve using custom DNS
function fastResolve(host) {
  for (var i = 0; i < CUSTOM_DNS.length; i++) {
    try {
      var ip = dnsResolveEx(host, CUSTOM_DNS[i]);
      if (ip) return ip;
    } catch (e) {}
  }
  return dnsResolve(host);
}

// Proxy Setup
var PROXY_MATCH  = "PROXY 212.35.66.45:20004";   
var PROXY_FALL   = "PROXY 46.185.131.218:20001"; 
var PROXY_LOBBY  = "PROXY 212.35.66.45:9030";     
var BLOCK        = "PROXY 0.0.0.0:0";            

var CHAIN_MATCH = PROXY_MATCH + "; " + PROXY_FALL;
var CHAIN_LOBBY = PROXY_LOBBY + "; " + PROXY_FALL;

// Ports
var PORT_MATCH  = [20004, 20005, 20010, 20100, 20101, 20200];
var PORT_LOBBY  = [443, 80];
var PORT_UPDATE = [80];

// JO IPv4 Expanded
var JO_V4 = [
  "46.185.128.0/17", "213.139.64.0/18", "213.140.0.0/17",
  "37.202.64.0/18", "46.32.96.0/19", "82.212.64.0/18",
  "79.134.128.0/19", "77.245.0.0/20", "185.101.112.0/22",
  "193.188.64.0/18", "5.44.32.0/19"
];

// Build CIDR
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

// Port Helpers
function inList(port, list) {
  return list.indexOf(port) !== -1;
}
function getPort(url) {
  var m = url.match(/^[a-zA-Z]+:\/\/[^\/:]+:(\d+)\//);
  if (m && m[1]) return parseInt(m[1], 10);
  if (url.indexOf("https:") === 0) return 443;
  if (url.indexOf("http:") === 0) return 80;
  return 443;
}

// DNS Cache
var DNS_TTL_MS = 30000;
var _dnsCache = {};
function cachedResolve(host) {
  var now = (new Date()).getTime();
  var e = _dnsCache[host];
  if (e && (now - e.t) < DNS_TTL_MS) return e.ip;
  var ip = fastResolve(host);
  if (ip) _dnsCache[host] = { ip: ip, t: now };
  return ip;
}

// Smart Block
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

// Exceptions (DIRECT)
function isExceptionApp(host) {
  // PUBG Mobile Domains
  if (shExpMatch(host, "*.pubgmobile.com") ||
      shExpMatch(host, "pubgmobile.com")) {
    return true;
  }
  if (shExpMatch(host, "*.tencent.com")) return true; 

  // Streaming & Social
  if (dnsDomainIs(host, "youtube.com") ||
      dnsDomainIs(host, "googlevideo.com") ||
      shExpMatch(host, "*.youtube.com") ||
      shExpMatch(host, "*.googlevideo.com")) {
    return true;
  }
  if (dnsDomainIs(host, "tiktok.com") ||
      shExpMatch(host, "*.tiktok.com")) {
    return true;
  }
  if (dnsDomainIs(host, "shahid.mbc.net") ||
      shExpMatch(host, "*.shahid.mbc.net")) {
    return true;
  }
  return false;
}

// Main
function FindProxyForURL(url, host) {
  if (isExceptionApp(host)) return "DIRECT";

  var port = getPort(url);
  var ip = cachedResolve(host);
  if (!ip) return PROXY_FALL;

  // MATCH
  if (inList(port, PORT_MATCH)) {
    if (isJO(ip)) return CHAIN_MATCH;
    var key = ip + ":" + port;
    if (shouldBlockMatch(key)) return BLOCK;
    return CHAIN_MATCH;
  }

  // LOBBY
  if (inList(port, PORT_LOBBY)) {
    if (isJO(ip)) return CHAIN_LOBBY;
    return PROXY_FALL;
  }

  // UPDATE
  if (inList(port, PORT_UPDATE)) return PROXY_FALL;

  return PROXY_FALL;
}
