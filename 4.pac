// ===================================================
//  PUBG Mobile — JO HARDCORE PAC (MAX JO PLAYERS)
//  Strategy: 1 MATCH proxy + HARD BLOCK non-JO
// ===================================================

// ===== Proxies =====
var MATCH_PROXY  = "PROXY 46.32.102.152:20001"; // ONLY
var LOBBY_PROXY  = "PROXY 46.32.102.152:443; PROXY 82.212.126.46:443";
var UPDATE_PROXY = "PROXY 46.32.102.152:8080";
var BLOCK        = "PROXY 0.0.0.0:0";

// ===== Ports =====
var PORT_MATCH  = [20001];
var PORT_LOBBY  = [443];
var PORT_UPDATE = [80];

// ===== JO IPv4 =====
var JO_V4 = [
  "46.185.128.0/17","213.139.64.0/18","213.140.0.0/17","37.202.64.0/18",
  "46.32.96.0/19","82.212.64.0/18","79.134.128.0/19","77.245.0.0/20"
];

// ===== Helpers =====
function ipToLong(ip){var p=ip.split('.');return((+p[0]<<24)>>>0)+(+p[1]<<16)+(+p[2]<<8)+(+p[3]);}
function isInCIDR(ip,c){var a=c.split('/'),b=ipToLong(a[0]),m=(-1<<(32-parseInt(a[1])));return (ipToLong(ip)&m)===(b&m);}
function isJO(ip){for(var i=0;i<JO_V4.length;i++) if(isInCIDR(ip,JO_V4[i])) return true; return false;}
function inList(x,a){for(var i=0;i<a.length;i++) if(x==a[i]) return true; return false;}
function getPort(url){var m=url.match(/^[a-zA-Z]+:\/\/[^\/:]+:(\d+)\//); if(m&&m[1]) return parseInt(m[1],10);
  if(url.substring(0,6)=="https:") return 443; return 80;}

// ===== Main =====
function FindProxyForURL(url, host) {
  // exceptions still via proxy (no direct)
  if (dnsDomainIs(host,"youtube.com")||dnsDomainIs(host,"googlevideo.com")||
      dnsDomainIs(host,"github.com")||dnsDomainIs(host,"raw.githubusercontent.com"))
    return LOBBY_PROXY;

  var port=getPort(url), ip=dnsResolve(host);
  if(!ip) return LOBBY_PROXY;

  // MATCH: JO only, otherwise HARD BLOCK
  if(inList(port,PORT_MATCH)) {
    if(isJO(ip)) return MATCH_PROXY;
    return BLOCK;
  }

  // LOBBY / RECRUIT
  if(inList(port,PORT_LOBBY)) {
    if(isJO(ip)) return LOBBY_PROXY;
    return UPDATE_PROXY; // still JO
  }

  // UPDATES
  if(inList(port,PORT_UPDATE)) return UPDATE_PROXY;

  return UPDATE_PROXY; // NO DIRECT
}
