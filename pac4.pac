// PUBG JO AUTO PAC (FINAL)
// Seed + Learned | NO DIRECT

var PMATCH = "PROXY 212.35.66.45:20001";
var PLOBBY = "PROXY 212.35.66.45:443";
var PFALL  = "PROXY 46.185.131.218:443";
var BLOCK  = "PROXY 0.0.0.0:0";

var MATCH = [20001,10012];
var LOBBY = [443];
var UPD   = [80];

var JO = [
  "46.185.128.0/17",
  "213.139.64.0/18",
  "213.140.0.0/17",
  "37.202.64.0/18",
  "46.32.96.0/19",
  "82.212.64.0/18",
  "79.134.128.0/19",
  "77.245.0.0/20"
];

function L(ip){var p=ip.split('.');return((+p[0]<<24)>>>0)+(+p[1]<<16)+(+p[2]<<8)+(+p[3]);}
function C(ip,c){var x=c.split('/');var m=-1<<(32-+x[1]);return(L(ip)&m)===(L(x[0])&m);}
function isJO(ip){for(var i=0;i<JO.length;i++) if(C(ip,JO[i])) return true; return false;}
function P(p,a){for(var i=0;i<a.length;i++) if(p==a[i]) return true; return false;}

// MAX JO presence: match/lobby are JO-only, no DIRECT
function FindProxyForURL(url,host){
  var ip = dnsResolve(host);
  if(!ip) return PLOBBY;

  if(P(myPort,MATCH)) return isJO(ip)?PMATCH:BLOCK;
  if(P(myPort,LOBBY)) return isJO(ip)?PLOBBY:BLOCK;
  if(P(myPort,UPD)) return PFALL;

  return PFALL;
}
