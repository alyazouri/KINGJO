// ===================================================
//  PUBG Mobile – JO ULTRA PAC (NO DIRECT) — FINAL FIXED
//  Tuned ONLY to OPEN ports on 212.35.66.45
// ===================================================

// ================== PROXIES ==================
var PROXY_MATCH = "PROXY 212.35.66.45:20001";
var PROXY_FALL1 = "PROXY 212.35.66.45:20002";
var PROXY_FALL2 = "PROXY 212.35.66.45:20005";
var PROXY_LOBBY = "PROXY 212.35.66.45:11000";
var BLOCK       = "PROXY 0.0.0.0:0";

// Proxy chains (NO DIRECT)
var CHAIN_MATCH = PROXY_MATCH + "; " + PROXY_FALL1 + "; " + PROXY_FALL2;
var CHAIN_LOBBY = PROXY_LOBBY + "; " + PROXY_FALL1;

// ================== PORT LOGIC ==================
var PORT_MATCH  = [20001,20002,20005];
var PORT_LOBBY  = [443];
var PORT_UPDATE = [80];

// ================== JO IPv4 ==================
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

// ================== HELPERS ==================
function ipToLong(ip){
  var p=ip.split('.');
  return ((+p[0]<<24)>>>0)+((+p[1]<<16)>>>0)+((+p[2]<<8)>>>0)+(+p[3]>>>0);
}
function isJO(ip){
  var x=ipToLong(ip);
  for(var i=0;i<JO_V4.length;i++){
    var c=JO_V4[i].split('/');
    var b=ipToLong(c[0]);
    var m=(-1<<(32-parseInt(c[1])))>>>0;
    if((x&m)===(b&m)) return true;
  }
  return false;
}
function getPort(url){
  var m=url.match(/^[a-zA-Z]+:\/\/[^\/:]+:(\d+)\//);
  if(m&&m[1]) return parseInt(m[1],10);
  if(url.substring(0,6)==="https:") return 443;
  if(url.substring(0,5)==="http:") return 80;
  return 443;
}

// ================== MAIN ==================
function FindProxyForURL(url, host){

  // لازم DIRECT فقط لهذول عشان ما يطلع No Internet
  if (dnsDomainIs(host,"raw.githubusercontent.com") ||
      dnsDomainIs(host,"github.com") ||
      dnsDomainIs(host,"captive.apple.com") ||
      dnsDomainIs(host,"apple.com")) {
    return "DIRECT";
  }

  var port=getPort(url);
  var ip=dnsResolve(host);
  if(!ip) return CHAIN_LOBBY;

  // ===== MATCH =====
  if (port>=20001 && port<=20005){
    if(isJO(ip)) return CHAIN_MATCH;
    return BLOCK; // JO-STRICT
  }

  // ===== LOBBY / RECRUIT =====
  if (port==443){
    if(isJO(ip)) return CHAIN_LOBBY;
    return BLOCK;
  }

  // ===== UPDATES =====
  if (port==80) return PROXY_FALL1;

  return PROXY_FALL1;
}
