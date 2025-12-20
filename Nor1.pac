// ===================================================
//  PUBG Mobile – JO EXTREME++ (MAXIMUM PRESSURE)
//  - IP-based Jordan enforcement (most accurate)
//  - MATCH 20001 ONLY
//  - No DIRECT (except GitHub + YouTube)
// ===================================================

// ===== DIRECT ALLOW =====
var DIRECT_ALLOW = [
  ".github.com",".githubusercontent.com",".raw.githubusercontent.com",
  ".youtube.com",".googlevideo.com",".ytimg.com","youtu.be"
];

// ===== SOFTBLOCK =====
var BLOCK = "PROXY 127.0.0.1:9";

// ===== PORTS =====
var PORT_MATCH = [20001];
var PORT_LOBBY = [443,8080,17500,18081];
var PORT_VOICE = [3478,3479,5000,5001,5002];
var PORT_UPD   = [80,7080];

// ===== PUBG DOMAINS =====
var PUBG_DOMAINS = [
  ".pubgmobile.com",".pubgm.com",".proximabeta.com",".intlgame.com",
  ".levelinfinite.com",".igamecj.com",".gcloud.qq.com",".tencent.com",
  ".myqcloud.com",".tpns.tencent.com",".cloudfront.net",".akamaihd.net",
  ".agora.io",".agoracdn.com",".edge.agora.io",".qq.com"
];

// ===== JO IP RANGES (CRITICAL) =====
var JO_IP_RANGES = [
  "212.35.0.0/16","212.118.0.0/16",
  "176.28.0.0/15","176.29.0.0/16",
  "188.247.64.0/19","109.237.192.0/20",
  "178.238.176.0/20","149.200.128.0/17",
  "46.185.0.0/16","46.32.96.0/19",
  "213.139.0.0/16","194.165.0.0/16",
  "62.150.0.0/16","85.158.0.0/16",
  "77.245.0.0/20"
];

// ===== MATCH POOL (JO ONLY – 20001) =====
var MATCH_POOL = [
  "PROXY 176.28.201.117:20001",
  "PROXY 176.29.199.163:20001",
  "PROXY 109.237.205.83:20001",
  "PROXY 188.247.94.198:20001",
  "PROXY 176.29.176.134:20001",
  "PROXY 176.29.200.102:20001",
  "PROXY 212.35.66.45:20001"
];

// ===== LOBBY POOL =====
var LOBBY_POOL = [
  "PROXY 212.118.4.36:443",
  "PROXY 212.35.66.67:443",
  "PROXY 176.29.210.173:443",
  "PROXY 213.139.57.20:443",
  "PROXY 212.35.72.10:443"
];

var EMERG = "PROXY 212.35.66.45:8080";

// ===== HELPERS =====
function isDomainIn(h,a){h=h.toLowerCase();for(var i=0;i<a.length;i++)if(dnsDomainIs(h,a[i]))return true;return false;}
function getPort(u){var m=u.match(/:(\d+)\//);return m?parseInt(m[1],10):443;}
function portIn(p,a){for(var i=0;i<a.length;i++)if(p===a[i])return true;return false;}
function ipToLong(ip){var p=ip.split(".");if(p.length!==4)return 0;return((+p[0]<<24)>>>0)+(+p[1]<<16)+(+p[2]<<8)+(+p[3]);}
function inCIDR(ip,c){var a=c.split("/"),b=ipToLong(a[0]),m=parseInt(a[1],10);var k=m===0?0:(-1<<(32-m));return((ipToLong(ip)&k)===(b&k));}
function isJordanIP(ip){for(var i=0;i<JO_IP_RANGES.length;i++)if(inCIDR(ip,JO_IP_RANGES[i]))return true;return false;}
function pick(p,s){var n=p.length,x=0;for(var i=0;i<s.length;i++)x=(x*33+s.charCodeAt(i))>>>0;return p[x%n];}
function chain(p,s){return pick(p,s+"A")+"; "+pick(p,s+"B")+"; "+EMERG;}
function phase(host){var x=0;for(var i=0;i<host.length;i++)x=(x*37+host.charCodeAt(i))>>>0;return x%21;}

// ===== CORE =====
function FindProxyForURL(url, host){

  if (isDomainIn(host, DIRECT_ALLOW)) return "DIRECT";

  var port = getPort(url);

  if (isDomainIn(host, PUBG_DOMAINS)){
    var ip = dnsResolve(host);
    var isJO = (ip && isJordanIP(ip));
    var p = phase(host);

    if (portIn(port, PORT_VOICE))
      return chain(LOBBY_POOL, host+":v");

    // ===== EXTREME++ GATE =====
    if (!isJO && port === 20001){
      if (p <= 17) return BLOCK;                 // 85% hard pressure
      if (p <= 18) return chain(MATCH_POOL, host+":force"); // JO-only
      if (p <= 19) return chain(MATCH_POOL, host+":fb");    // fallback
      // p == 20 => open (anti-hang)
    }

    if (port === 20001)
      return chain(MATCH_POOL, host+":m");

    if (portIn(port, PORT_LOBBY))
      return chain(LOBBY_POOL, host+":l");

    if (portIn(port, PORT_UPD))
      return chain(LOBBY_POOL, host+":u");

    return chain(MATCH_POOL, host+":d");
  }

  return chain(LOBBY_POOL, host+":g");
}
