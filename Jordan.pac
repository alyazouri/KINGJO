// ===================================================
// PUBG MOBILE – JO STABLE MATCH PAC (FINAL)
// Focus: LOW PING + LOCAL PLAYERS + NO EUROPE
// ===================================================

// ====== PROXIES (JO ONLY – ثابتة) ======
var PROXY_MATCH = "PROXY 212.35.66.45:20004";
var PROXY_LOBBY = "PROXY 212.35.66.45:9030";
var PROXY_SAFE  = "PROXY 46.185.131.218:20001";
var BLOCK       = "PROXY 0.0.0.0:0";

// ====== CHAINS ======
var CHAIN_MATCH = PROXY_MATCH + "; " + PROXY_SAFE;
var CHAIN_LOBBY = PROXY_LOBBY + "; " + PROXY_SAFE;

// ====== PORTS ======
var PORT_MATCH = [20004,20005];
var PORT_LOBBY = [443];
var PORT_HTTP  = [80];

// ====== JO IPv4 ONLY ======
var JO_V4 = [
  "46.185.128.0/17",
  "82.212.64.0/18",
  "37.202.64.0/18",
  "213.139.64.0/18",
  "79.134.128.0/19",
  "77.245.0.0/20"
];

// ====== CIDR ======
function ipToLong(ip){
  var p=ip.split('.');
  return ((+p[0]<<24)>>>0)+((+p[1]<<16)>>>0)+((+p[2]<<8)>>>0)+(+p[3]>>>0);
}
var CIDR=null;
function isJO(ip){
  if(!CIDR){
    CIDR=[];
    for(var i=0;i<JO_V4.length;i++){
      var s=JO_V4[i].split('/');
      CIDR.push({
        b:ipToLong(s[0]),
        m:(-1<<(32-parseInt(s[1])))>>>0
      });
    }
  }
  var x=ipToLong(ip);
  for(var j=0;j<CIDR.length;j++)
    if((x&CIDR[j].m)===(CIDR[j].b&CIDR[j].m)) return true;
  return false;
}

// ====== DNS CACHE ======
var DNS={},TTL=30000;
function resolve(host){
  var t=Date.now();
  if(DNS[host] && (t-DNS[host].t)<TTL) return DNS[host].ip;
  var ip=dnsResolve(host);
  if(ip) DNS[host]={ip:ip,t:t};
  return ip;
}

// ====== PORT DETECT ======
function getPort(url){
  var m=url.match(/:(\d+)\//);
  if(m) return +m[1];
  if(url.indexOf("https:")===0) return 443;
  return 80;
}

// ====== SMART BLOCK (EUROPE REJECT) ======
var TRIES={},MAX_TRY=2,WIN=15000;
function blockTry(k){
  var n=Date.now();
  if(!TRIES[k] || n-TRIES[k].t>WIN){
    TRIES[k]={n:1,t:n}; return true;
  }
  TRIES[k].n++; TRIES[k].t=n;
  return TRIES[k].n<=MAX_TRY;
}

// ====== MAIN ======
function FindProxyForURL(url, host){
  var port=getPort(url);
  var ip=resolve(host);
  if(!ip) return CHAIN_LOBBY;

  // MATCH
  if(PORT_MATCH.indexOf(port)!==-1){
    if(isJO(ip)) return CHAIN_MATCH;
    if(blockTry(ip+":"+port)) return BLOCK;
    return CHAIN_MATCH;
  }

  // LOBBY
  if(PORT_LOBBY.indexOf(port)!==-1){
    return isJO(ip) ? CHAIN_LOBBY : PROXY_SAFE;
  }

  // CDN / UPDATE
  if(PORT_HTTP.indexOf(port)!==-1) return PROXY_SAFE;

  return PROXY_SAFE;
}
