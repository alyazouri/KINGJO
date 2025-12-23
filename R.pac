// ===================================================
// PUBG Mobile – JO > GCC Priority (NO DIRECT / iOS-SAFE)
// - NO DIRECT anywhere
// - Pressure/BLOCK only on MATCH:20001 when target is NOT JO/GCC
// - Lobby images/CDN fixed: never block 443, route via LOBBY_POOL
// - iOS connectivity checks routed via LOBBY_POOL (no DIRECT)
// ===================================================

// ===== OPTIONS =====
var ENABLE_PRESSURE   = true;
var ADAPTIVE_PRESSURE = true;
var PRESSURE_LEVEL    = 16;   // 0..20 (زيده لو بدك ضغط أقوى)
var MAX_CHAIN_LENGTH  = 3;    // 1..5

// ===== BLOCK (soft) =====
var BLOCK = "PROXY 127.0.0.1:9";

// ===== PORTS =====
var PORT_MATCH = [20001];
var PORT_LOBBY = [443, 80, 8080, 8443, 17500, 18081];
var PORT_VOICE = [3478, 3479, 5000, 5001, 5002, 19302, 19303];

// ===== IMPORTANT DOMAINS =====
// iOS "No Internet" checks (we route them through LOBBY proxies, not DIRECT)
var IOS_CHECK_HOSTS = [
  "captive.apple.com",
  "connectivitycheck.gstatic.com",
  "clients3.google.com",
  "www.apple.com"
];

// PUBG + CDN + Images (لوبي/صور/ثيمات)
var PUBG_SUFFIX = [
  ".pubgmobile.com", ".pubgm.com", ".proximabeta.com", ".intlgame.com",
  ".levelinfinite.com", ".igamecj.com",
  ".gcloud.qq.com", ".tencent.com", ".qq.com",
  ".myqcloud.com", ".tpns.tencent.com",
  ".tencentcloud.com", ".qcloud.com",
  ".cloudfront.net", ".akamaihd.net",
  ".agora.io", ".agoracdn.com", ".edge.agora.io", ".webrtc.agora.io"
];

// ===== JO + GCC CIDRs =====
// JO (كما عندك)
var JO_V4 = [
  "212.35.0.0/16","212.118.0.0/16","176.28.0.0/15","176.29.0.0/16",
  "46.185.0.0/16","46.32.96.0/19","188.247.64.0/19","109.237.192.0/20",
  "185.76.8.0/22","185.76.12.0/22","185.76.16.0/22","185.76.20.0/22",
  "149.200.128.0/17","178.238.176.0/20"
];

// GCC (قائمة “عملية” كبداية — إذا عندك Prefixes أدق من مزودين الخليج ابعثهم أدمجهم فورًا)
var GCC_V4 = [
  // Saudi (نماذج شائعة/كبيرة)
  "2.88.0.0/13", "5.42.224.0/19", "31.50.0.0/15", "78.93.0.0/16",
  // UAE
  "5.30.0.0/15", "31.215.0.0/16", "86.96.0.0/12",
  // Qatar
  "37.210.0.0/15", "89.211.0.0/16",
  // Kuwait
  "31.214.0.0/16", "62.150.0.0/16",
  // Bahrain / Oman (نماذج)
  "37.131.0.0/16", "81.89.0.0/16"
];

// ===== PROXY POOLS =====
// لازم تكون HTTP Proxy (CONNECT) فعلياً
var MATCH_POOL = [
  "PROXY 212.35.66.45:20001",
  "PROXY 46.185.131.218:20001",
  "PROXY 176.28.201.117:20001",
  "PROXY 176.29.199.163:20001",
  "PROXY 109.237.205.83:20001"
];

var LOBBY_POOL = [
  "PROXY 212.35.66.45:443",
  "PROXY 46.185.131.218:443",
  "PROXY 212.35.66.45:8080"
];

var EMERG = "PROXY 212.35.66.45:8080";

// ===== STATE =====
var dnsCache = {};
var failureCount = 0;

// ===== HELPERS (ES3) =====
function lower(s){ return (s || "").toLowerCase(); }

function isExactHost(host, target){
  return lower(host) == lower(target);
}

function endsWith(host, suffix){
  host = lower(host);
  suffix = lower(suffix);
  if (host == suffix) return true;
  if (suffix.charAt(0) == ".") {
    return host.length > suffix.length && host.substring(host.length - suffix.length) == suffix;
  }
  return host.substring(host.length - suffix.length) == suffix;
}

function hostInSuffixList(host, list){
  var i;
  for (i = 0; i < list.length; i++){
    if (endsWith(host, list[i])) return true;
  }
  return false;
}

function getPort(url){
  var m = /:\/\/[^\/:]+:(\d+)/.exec(url);
  if (m && m[1]) return parseInt(m[1], 10);
  if (shExpMatch(url, "http://*")) return 80;
  return 443;
}

function portIn(port, arr){
  var i;
  for (i = 0; i < arr.length; i++){
    if (arr[i] == port) return true;
  }
  return false;
}

function ipToLong(ip){
  var p = ip.split(".");
  if (p.length != 4) return 0;
  return (((parseInt(p[0],10) << 24) >>> 0) +
          ((parseInt(p[1],10) << 16) >>> 0) +
          ((parseInt(p[2],10) <<  8) >>> 0) +
          ( parseInt(p[3],10)        >>> 0)) >>> 0;
}

function inCIDR(ip, cidr){
  var parts = cidr.split("/");
  var base = parts[0];
  var maskInt = parseInt(parts[1], 10);
  var ipL = ipToLong(ip);
  var baseL = ipToLong(base);
  var maskL;
  if (maskInt <= 0) maskL = 0;
  else maskL = (0xFFFFFFFF << (32 - maskInt)) >>> 0;
  return ((ipL & maskL) >>> 0) == ((baseL & maskL) >>> 0);
}

function inAny(ip, list){
  var i;
  for (i = 0; i < list.length; i++){
    if (inCIDR(ip, list[i])) return true;
  }
  return false;
}

function isJOorGCC(ip){
  if (!ip) return false;
  if (ip.indexOf(":") != -1) return false; // iOS PAC غالباً IPv4
  if (inAny(ip, JO_V4)) return true;
  if (inAny(ip, GCC_V4)) return true;
  return false;
}

function hash32(s, mul){
  var h = 0, i, c;
  for (i = 0; i < s.length; i++){
    c = s.charCodeAt(i);
    h = ((h * mul) + c) >>> 0;
  }
  return h >>> 0;
}

function pick(pool, seed){
  if (!pool || pool.length == 0) return EMERG;
  var idx = hash32(seed, 31) % pool.length;
  return pool[idx];
}

function smartChain(pool, seed){
  var chain = "";
  var i, p;
  var len = MAX_CHAIN_LENGTH;
  if (len < 1) len = 1;
  if (len > 5) len = 5;

  for (i = 0; i < len; i++){
    p = pick(pool, seed + ":" + i);
    chain += p + "; ";
  }
  chain += EMERG;
  return chain; // NO DIRECT
}

function phase(host){
  return hash32(host, 37) % 21;
}

// ===== CORE =====
function FindProxyForURL(url, host) {
  host = lower(host);
  var port = getPort(url);

  // 0) iOS connectivity checks -> route via lobby proxies (NO DIRECT)
  var i;
  for (i = 0; i < IOS_CHECK_HOSTS.length; i++){
    if (isExactHost(host, IOS_CHECK_HOSTS[i])) {
      return smartChain(LOBBY_POOL, host + ":ios");
    }
  }

  // 1) PUBG domains routing (includes CDN/images)
  if (hostInSuffixList(host, PUBG_SUFFIX)) {

    // Voice/RTC -> lobby pool
    if (portIn(port, PORT_VOICE)) {
      return smartChain(LOBBY_POOL, host + ":voice");
    }

    // Lobby / images / updates must NEVER be blocked
    if (port == 443 || port == 80 || portIn(port, PORT_LOBBY)) {
      return smartChain(LOBBY_POOL, host + ":lobby");
    }

    // Match logic on 20001 only
    if (port == 20001) {
      var ip = dnsCache[host];
      if (!ip) { ip = dnsResolve(host); dnsCache[host] = ip; }

      var good = isJOorGCC(ip);
      var p = phase(host);

      if (!good && ENABLE_PRESSURE) {
        var cur = PRESSURE_LEVEL;
        if (ADAPTIVE_PRESSURE) {
          cur = PRESSURE_LEVEL + Math.floor(failureCount / 8);
          if (cur > 20) cur = 20;
        }

        if (p <= cur) { failureCount++; return BLOCK; } // push re-search
      }

      if (failureCount > 0) failureCount--;
      return smartChain(MATCH_POOL, host + ":match");
    }

    // Any other PUBG traffic
    return smartChain(LOBBY_POOL, host + ":pubg");
  }

  // 2) Non-PUBG: keep internet working through lobby proxies (NO DIRECT)
  return smartChain(LOBBY_POOL, host + ":all");
}
