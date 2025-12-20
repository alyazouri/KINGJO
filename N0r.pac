// ===================================================
//  PUBG Mobile – JO STRICT MATCHMAKING PAC (CLEAN)
//  - Boost chance of Jordan lobbies by blocking NON-JO match endpoints
//  - No DIRECT for everything EXCEPT: GitHub + YouTube
// ===================================================

// ====== ALLOW DIRECT (ONLY THESE) ======
var DIRECT_ALLOW = [
  ".github.com", ".githubusercontent.com", ".raw.githubusercontent.com",
  ".youtube.com", ".googlevideo.com", ".ytimg.com", "youtu.be"
];

// ====== PROXIES (JO) ======
var P_MATCH  = "PROXY 212.35.66.45:443";
var P_LOBBY  = "PROXY 212.35.66.45:443";
var P_VOICE  = "PROXY 212.35.66.45:3478";
var P_FALL   = "PROXY 46.185.131.218:443";
var P_EMERG  = "PROXY 212.35.66.45:8080";

// “BLOCK” لفرض إعادة البحث (إذا سببلك No Internet بدّله للسطـر البديل)
var BLOCK = "PROXY 0.0.0.0:0";
// بديل ألطف أحيانًا على iOS:
// var BLOCK = "PROXY 127.0.0.1:9";

// ====== STRICT SETTINGS ======
var STRICT_JO_MATCH = true;     // يمنع NON-JO فقط للماتش/اللّوبي (يزيد أردنيين لكن قد يطوّل البحث)
var NO_DIRECT_ALL   = true;     // كل شيء بدون DIRECT (عدا GitHub/YouTube)

// ====== PORT GROUPS (TCP as PAC sees) ======
var PORT_MATCH = [20000,20001,20002,20371];
var PORT_VOICE = [3478,3479,10013,5000,5001,5002];
var PORT_LOBBY = [443,8080,17500,18081];
var PORT_UPD   = [80,7080];

// ====== PUBG DOMAINS (keep focused) ======
var PUBG_DOMAINS = [
  ".pubgmobile.com",".pubgm.com",".proximabeta.com",".intlgame.com",".levelinfinite.com",
  ".igamecj.com",".gcloud.qq.com",".tencent.com",".myqcloud.com",".tencentcs.com",
  ".tpns.tencent.com",".qcloudcdn.com",".cloudfront.net",".akamaized.net",".akamaihd.net",
  ".agora.io",".agoralab.co",".agoracdn.com",".sd-rtn.com",".edge.agora.io",
  ".ace.qq.com",".anti-cheat.qq.com",".ams.qq.com",".qq.com"
];

// ====== JO IP RANGES (IPv4) ======
var JO_IP_RANGES = [
  "46.185.0.0/16","46.185.128.0/17","212.35.0.0/16",
  "5.45.64.0/18","5.45.96.0/19","37.202.64.0/18","82.212.64.0/18",
  "91.185.192.0/19","79.134.128.0/19",
  "77.245.0.0/20","46.32.96.0/19",
  "213.139.64.0/18","195.228.172.0/22","194.165.0.0/16","62.150.0.0/16","85.158.0.0/16"
];

// ====== FAST HELPERS ======
function ipToLong(ip){
  var p = ip.split(".");
  if (p.length !== 4) return 0;
  return ((+p[0]<<24)>>>0)+(+p[1]<<16)+(+p[2]<<8)+(+p[3]);
}
function inCIDR(ip,cidr){
  var a = cidr.split("/");
  var base = ipToLong(a[0]);
  var bits = parseInt(a[1],10);
  if (bits<0||bits>32) return false;
  var mask = bits===0 ? 0 : (-1 << (32-bits));
  return ((ipToLong(ip) & mask) === (base & mask));
}
function isJordanIP(ip){
  for (var i=0;i<JO_IP_RANGES.length;i++){
    if (inCIDR(ip, JO_IP_RANGES[i])) return true;
  }
  return false;
}
function isDomainIn(host, arr){
  var h = host.toLowerCase();
  for (var i=0;i<arr.length;i++){
    if (dnsDomainIs(h, arr[i])) return true;
  }
  return false;
}
function getPort(url){
  var m = url.match(/:(\d+)\//);
  if (m) return parseInt(m[1],10);
  // https default
  return 443;
}
function portIn(port, arr){
  for (var i=0;i<arr.length;i++) if (port===arr[i]) return true;
  return false;
}

// ====== CORE ======
function FindProxyForURL(url, host) {
  // Allow DIRECT only for GitHub + YouTube
  if (isDomainIn(host, DIRECT_ALLOW)) return "DIRECT";

  // Local/LAN -> via emerg (no direct)
  if (isPlainHostName(host) || dnsDomainIs(host, ".local") ||
      isInNet(host,"127.0.0.0","255.0.0.0") ||
      isInNet(host,"10.0.0.0","255.0.0.0") ||
      isInNet(host,"172.16.0.0","255.240.0.0") ||
      isInNet(host,"192.168.0.0","255.255.0.0") ||
      isInNet(host,"169.254.0.0","255.255.0.0")) {
    return P_EMERG;
  }

  var port = getPort(url);

  // PUBG traffic
  if (isDomainIn(host, PUBG_DOMAINS)) {
    var ip = dnsResolve(host);
    if (!ip) return P_MATCH + "; " + P_FALL + "; " + P_EMERG;

    var isJO = isJordanIP(ip);

    // Voice always dedicated
    if (portIn(port, PORT_VOICE)) return P_VOICE + "; " + P_MATCH;

    // STRICT: block NON-JO only for matchmaking/lobby ports to force re-search
    if (STRICT_JO_MATCH && !isJO && (portIn(port, PORT_MATCH) || portIn(port, PORT_LOBBY))) {
      return BLOCK;
    }

    // Updates/CDN stay stable
    if (portIn(port, PORT_UPD)) return P_FALL + "; " + P_EMERG;

    // Default PUBG path
    return P_MATCH + "; " + P_FALL + "; " + P_EMERG;
  }

  // Non-PUBG: no direct (as requested)
  if (NO_DIRECT_ALL) return P_FALL + "; " + P_EMERG;

  return "DIRECT";
}
