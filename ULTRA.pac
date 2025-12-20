// PUBG JO ULTRA PAC (NO DIRECT) — FINAL
var PROXY_MATCH = "PROXY 212.35.66.45:20001";
var PROXY_FALL1 = "PROXY 212.35.66.45:20002";
var PROXY_FALL2 = "PROXY 212.35.66.45:20005";
var PROXY_LOBBY = "PROXY 212.35.66.45:11000";
var BLOCK       = "PROXY 0.0.0.0:0";

var CHAIN_MATCH = PROXY_MATCH + "; " + PROXY_FALL1 + "; " + PROXY_FALL2;
var CHAIN_LOBBY = PROXY_LOBBY + "; " + PROXY_FALL1 + "; " + PROXY_FALL2;

var JO_V4 = [
  "46.185.128.0/17",
  "213.139.64.0/18",
  "213.140.0.0/17",
  "37.202.64.0/18",
  "46.32.96.0/19",
  "82.212.64.0/18",
  "79.134.128.0/19",
  "77.245.0.0/20"
];

function ipToLong(ip){var p=ip.split('.');return((+p[0]<<24)>>>0)+((+p[1]<<16)>>>0)+((+p[2]<<8)>>>0)+(+p[3]>>>0);}
function isJO(ip){
  var x=ipToLong(ip);
  for(var i=0;i<JO_V4.length;i++){
    var c=JO_V4[i].split('/'); var b=ipToLong(c[0]);
    var m=(-1<<(32-parseInt(c[1],10)))>>>0;
    if((x&m)===(b&m)) return true;
  }
  return false;
}
function getPort(url){
  var m=url.match(/^[a-zA-Z]+:\/\/[^\/:]+:(\d+)\//);
  if(m&&m[1]) return parseInt(m[1],10);
  if(url.substring(0,6).toLowerCase()==="https:") return 443;
  if(url.substring(0,5).toLowerCase()==="http:")  return 80;
  return 443;
}

function FindProxyForURL(url, host){

  // DIRECT only: YouTube + GitHub
  if (dnsDomainIs(host,"youtube.com") || dnsDomainIs(host,"googlevideo.com") ||
      dnsDomainIs(host,"github.com") || dnsDomainIs(host,"raw.githubusercontent.com")) {
    return "DIRECT";
  }

  // PUBG images only (NO DIRECT) via JO proxy
  if (shExpMatch(host,"*avatar*") || shExpMatch(host,"*profile*") ||
      shExpMatch(host,"*cdn*pubg*") || shExpMatch(host,"*tencent*img*") ||
      shExpMatch(host,"*img*pubg*") || shExpMatch(host,"*gamecdn*") ||
      shExpMatch(host,"*static*pubg*")) {
    return CHAIN_LOBBY;
  }

  var port = getPort(url);
  var ip = dnsResolve(host);
  if(!ip) return CHAIN_LOBBY;

  // MATCH (JO only)
  if (port >= 20001 && port <= 20005) {
    if (isJO(ip)) return CHAIN_MATCH;
    return BLOCK;
  }

  // LOBBY / RECRUIT (JO only on 443)
  if (port == 443) {
    if (isJO(ip)) return CHAIN_LOBBY;
    return BLOCK;
  }

  // UPDATES
  if (port == 80) return PROXY_FALL1;

  // DEFAULT (NO DIRECT)
  return PROXY_FALL1;
}
