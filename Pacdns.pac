// ===================================================
//  PUBG – JO LOCAL PAC (NO BLOCK)  ✅
//  - No BLOCK at all (iOS will always see Internet)
//  - Apple connectivity always DIRECT
//  - PUBG: if destination resolves to JO IP => DIRECT (local bias)
//  - Everything else DIRECT
//  DNS (set in iOS manually):
//    213.139.57.12
//    213.139.57.100
// ===================================================

var DIRECT_OK = "DIRECT";

// -------- Apple connectivity (prevents "No Internet") --------
var APPLE_OK = [
  "captive.apple.com",
  "apple.com",
  "icloud.com",
  "itunes.apple.com",
  "apps.apple.com",
  "mzstatic.com",
  "guzzoni.apple.com",
  "configuration.apple.com",
  "mesu.apple.com"
];

// -------- PUBG ports --------
var PORT_MATCH = [20001, 10012];
var PORT_LOBBY = [443];

// -------- PUBG domains --------
var PUBG_DOMAINS = [
  "pubgmobile.com",
  "proximabeta.com",
  "igamecj.com",
  "tencent.com",
  "gcloudcs.com",
  "game.qq.com"
];

// -------- Bypass --------
var BYPASS_DOMAINS = [
  "raw.githubusercontent.com",
  "github.com"
];

// -------- JO IPv4 main ranges (fast in PAC) --------
var JO_NETS = [
  ["176.29.0.0","255.255.0.0"],       // /16
  ["46.185.128.0","255.255.128.0"],   // /17
  ["37.202.64.0","255.255.192.0"],    // /18
  ["82.212.64.0","255.255.192.0"],    // /18
  ["79.173.192.0","255.255.192.0"],   // /18
  ["92.253.0.0","255.255.128.0"],     // /17
  ["94.249.0.0","255.255.128.0"],     // /17
  ["86.108.0.0","255.255.128.0"],     // /17
  ["62.72.160.0","255.255.224.0"],    // /19
  ["212.118.0.0","255.255.224.0"],    // /19
  ["213.139.32.0","255.255.224.0"]    // /19
];

function inList(host, arr){
  for (var i=0;i<arr.length;i++){
    if (dnsDomainIs(host, arr[i])) return true;
  }
  return false;
}

function portInList(p, arr){
  for (var i=0;i<arr.length;i++){
    if (p == arr[i]) return true;
  }
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

  // 1) Apple connectivity always DIRECT (fixes iOS status)
  if (inList(host, APPLE_OK)) return DIRECT_OK;

  // 2) GitHub bypass
  if (inList(host, BYPASS_DOMAINS)) return DIRECT_OK;

  // Parse port
  var port = 0;
  var idx = url.lastIndexOf(":");
  if (idx > 6) port = parseInt(url.substring(idx+1)) || 0;

  // 3) PUBG: keep JO endpoints local DIRECT when possible
  if (isPUBG(host, port)) {
    var ip = dnsResolve(host);
    if (ip && ip != "0.0.0.0" && isJOip(ip)) return DIRECT_OK;

    // No block, no proxy: keep game stable
    return DIRECT_OK;
  }

  // 4) Everything else DIRECT
  return DIRECT_OK;
}
