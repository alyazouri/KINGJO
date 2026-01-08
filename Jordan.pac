// =====================================================
// PUBG MOBILE – JO LOCK PAC (STABLE PING + LOCAL PLAYERS)
// =====================================================

// ===== PROXIES (JO ONLY – ثابت) =====
var PROXY_MATCH = "PROXY 212.35.66.45:20004";   // Matchmaking
var PROXY_LOBBY = "PROXY 212.35.66.45:9030";    // Lobby / Recruit
var PROXY_SAFE  = "PROXY 46.185.131.218:20001"; // Fallback (JO)
var BLOCK       = "PROXY 0.0.0.0:0";            // Hard block

// ===== CHAINS =====
var MATCH_CHAIN = PROXY_MATCH + "; " + PROXY_SAFE;
var LOBBY_CHAIN = PROXY_LOBBY + "; " + PROXY_SAFE;

// ===== PORTS =====
var MATCH_PORTS = [20004,20005];
var LOBBY_PORTS = [443];

// ===== PURE JO IPv4 =====
var JO_NET = [
  "46.185.128.0/17",
  "82.212.64.0/18",
  "37.202.64.0/18",
  "213.139.64.0/18",
  "79.134.128.0/19",
  "77.245.0.0/20"
];

// ===== CIDR =====
function ip2n(ip){
  var p=ip.split('.');
  return ((+p[0]<<24)>>>0)+((+p[1]<<16)>>>0)+((+p[2]<<8)>>>0)+(+p[3]>>>0);
}
var CIDR=null;
function isJO(ip){
  if(!CIDR){
    CIDR=[];
    for(var i=0;i<JO_NET.length;i++){
      var s=JO_NET[i].split('/');
      CIDR.push({b:ip2n(s[0]),m:(-1<<(32-s[1]))>>>0});
    }
  }
  var x=ip2n(ip);
  for(var j=0;j<CIDR.length;j++)
    if((x&CIDR[j].m)===(CIDR[j].b&CIDR[j].m)) return true;
  return false;
}

// ===== DNS CACHE =====
var DNS={},TTL=30000;
function r(host){
  var t=Date.now();
  if(DNS[host] && t-DNS[host].t<TTL) return DNS[host].ip;
  var ip=dnsResolve(host);
  if(ip) DNS[host]={ip:ip,t:t};
  return ip;
}

// ===== PORT =====
function port(url){
  var m=url.match(/:(\d+)\//);
  if(m) return +m[1];
  return url.indexOf("https:")===0 ? 443 : 80;
}

// ===== SMART BLOCK (EUROPE) =====
var TRY={},MAX=2,WIN=15000;
function block(k){
  var n=Date.now();
  if(!TRY[k]||n-TRY[k].t>WIN){TRY[k]={n:1,t:n};return true;}
  TRY[k].n++;TRY[k].t=n;
  return TRY[k].n<=MAX;
}

// ===== MAIN =====
function FindProxyForURL(url, host){
  var p=port(url);
  var ip=r(host);
  if(!ip) return LOBBY_CHAIN;

  // MATCH
  if(MATCH_PORTS.indexOf(p)!==-1){
    if(isJO(ip)) return MATCH_CHAIN;
    if(block(ip+":"+p)) return BLOCK;
    return MATCH_CHAIN;
  }

  // LOBBY
  if(LOBBY_PORTS.indexOf(p)!==-1){
    return isJO(ip) ? LOBBY_CHAIN : PROXY_SAFE;
  }

  return PROXY_SAFE;
}
