// ===================================================
//  PUBG – JO ULTRA LOCAL (FINAL)
//  DNS:
//    213.139.57.12
//    213.139.57.100
// ===================================================

var DIRECT_OK = "DIRECT";
var BLOCK     = "PROXY 0.0.0.0:0";

// PUBG Ports
var PORT_MATCH = [20001,10012];
var PORT_LOBBY = [443];

// PUBG Domains
var PUBG_DOMAINS = [
  "pubgmobile.com",
  "proximabeta.com",
  "igamecj.com",
  "tencent.com",
  "gcloudcs.com",
  "game.qq.com"
];

// Bypass
var BYPASS_DOMAINS = ["raw.githubusercontent.com","github.com"];

// Main Jordan IPv4 blocks (optimized)
var JO_NETS = [
  ["176.29.0.0","255.255.0.0"],
  ["46.185.128.0","255.255.128.0"],
  ["37.202.64.0","255.255.192.0"],
  ["82.212.64.0","255.255.192.0"],
  ["79.173.192.0","255.255.192.0"],
  ["92.253.0.0","255.255.128.0"],
  ["94.249.0.0","255.255.128.0"],
  ["86.108.0.0","255.255.128.0"],
  ["62.72.160.0","255.255.224.0"],
  ["212.118.0.0","255.255.224.0"],
  ["213.139.32.0","255.255.224.0"]
];

// Soft-block counter
var ATT = {};
function incTry(k){ var v=ATT[k]||0; v++; ATT[k]=v; return v; }

function inList(host, arr){
  for (var i=0;i<arr.length;i++) if (dnsDomainIs(host, arr[i])) return true;
  return false;
}
function portInList(p, arr){
  for (var i=0;i<arr.length;i++) if (p == arr[i]) return true;
  return false;
}
function isPUBG(host, port){
  if (inList(host, PUBG_DOMAINS)) return true;
  if (portInList(port, PORT_MATCH) || portInList(port, PORT_LOBBY)) return true;
  return false;
}
function isJOip(ip){
  for (var i=0;i<JO_NETS.length;i++){
    if (isInNet(ip, JO_NETS[i][0], JO_NETS[i][1])) return true;
  }
  return false;
}

function FindProxyForURL(url, host){

  if (inList(host, BYPASS_DOMAINS)) return DIRECT_OK;

  var port = 0;
  var idx = url.lastIndexOf(":");
  if (idx > 6) port = parseInt(url.substring(idx+1)) || 0;

  if (isPUBG(host, port)) {
    var ip = dnsResolve(host);

    // Local Jordan endpoints stay DIRECT
    if (ip && ip != "0.0.0.0" && isJOip(ip)) return DIRECT_OK;

    // Encourage re-selection (soft-block first 2 tries)
    var key = host + ":" + port;
    if (incTry(key) <= 2) return BLOCK;

    // After that, don't break the game
    return DIRECT_OK;
  }

  return DIRECT_OK;
}
