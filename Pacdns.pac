// ===================================================
//  JO DNS-SYNC + PUBG LOCAL PAC (FINAL)
//  - Apple Allow: fixes iOS "No Internet Connection"
//  - DNS-Guard: blocks common DoH/DoT endpoints (keeps your manual DNS effective)
//  - PUBG Local Bias:
//      * If PUBG destination resolves to JO IPv4 -> DIRECT (local)
//      * Else -> DIRECT (no blocks, stable gameplay)
//  - GitHub raw bypass
//
//  Recommended iOS DNS order (Manual):
//    213.139.57.12
//    213.139.57.100
//    1.1.1.1   (as 3rd only, for iOS checks / fallback)
// ===================================================

var DIRECT_OK = "DIRECT";
var BLOCK     = "PROXY 0.0.0.0:0";

// ---------------- Apple connectivity allowlist ----------------
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

// ---------------- Block common encrypted DNS endpoints ----------------
// (Stops "Secure DNS / DoH" from overriding your JO DNS)
var ENCRYPTED_DNS_BLOCK = [
  "cloudflare-dns.com",
  "security.cloudflare-dns.com",
  "family.cloudflare-dns.com",
  "dns.google",
  "dns.quad9.net",
  "doh.opendns.com",
  "dns.nextdns.io",
  "dns.adguard.com",
  "doh.cleanbrowsing.org"
];

// ---------------- Bypass ----------------
var BYPASS_DOMAINS = ["raw.githubusercontent.com","github.com"];

// ---------------- PUBG ports & domains ----------------
var PORT_MATCH = [20001, 10012];
var PORT_LOBBY = [443];

var PUBG_DOMAINS = [
  "pubgmobile.com",
  "proximabeta.com",
  "igamecj.com",
  "tencent.com",
  "gcloudcs.com",
  "game.qq.com"
];

// ---------------- JO IPv4 MAIN RANGES (fast in PAC) ----------------
// (Main large Jordan blocks; optimized for speed)
var JO_NETS = [
  ["176.29.0.0","255.255.0.0"],       // /16
  ["46.185.128.0","255.255.128.0"],   // /17
  ["37.202.64.0","255.255.192.0"],    // /18
  ["82.212.64.0","255.255.192.0"],    // /18
  ["79.173.192.0","255.255.192.0"],   // /18
  ["92.253.0.0","255.255.128.0"],     // /17
  ["94.249.0.0","255.255.128.0"],     // /17
  ["86.108.0.0","255.255.128.0"],     // /17
  ["149.200.128.0","255.255.128.0"],  // /17
  ["176.28.128.0","255.255.128.0"],   // /17

  ["46.32.96.0","255.255.224.0"],     // /19
  ["62.72.160.0","255.255.224.0"],    // /19
  ["79.134.128.0","255.255.224.0"],   // /19
  ["84.18.32.0","255.255.224.0"],     // /19
  ["84.18.64.0","255.255.224.0"],     // /19
  ["91.186.224.0","255.255.224.0"],   // /19
  ["94.142.32.0","255.255.224.0"],    // /19
  ["95.172.192.0","255.255.224.0"],   // /19
  ["109.107.224.0","255.255.224.0"],  // /19
  ["188.123.160.0","255.255.224.0"],  // /19
  ["194.165.128.0","255.255.224.0"],  // /19
  ["212.34.0.0","255.255.224.0"],     // /19
  ["212.35.64.0","255.255.224.0"],    // /19
  ["212.118.0.0","255.255.224.0"],    // /19
  ["213.139.32.0","255.255.224.0"],   // /19
  ["213.186.160.0","255.255.224.0"],  // /19

  ["5.45.128.0","255.255.240.0"],     // /20
  ["37.220.112.0","255.255.240.0"],   // /20
  ["46.23.112.0","255.255.240.0"],    // /20
  ["77.245.0.0","255.255.240.0"],     // /20
  ["80.90.160.0","255.255.240.0"],    // /20
  ["81.21.0.0","255.255.240.0"],      // /20
  ["81.28.112.0","255.255.240.0"],    // /20
  ["91.106.96.0","255.255.240.0"]     // /20
];

// ---------------- Helpers ----------------
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

// ===================================================
//  MAIN
// ===================================================
function FindProxyForURL(url, host){

  // 1) Apple connectivity: always DIRECT
  if (inList(host, APPLE_OK)) return DIRECT_OK;

  // 2) GitHub bypass: DIRECT
  if (inList(host, BYPASS_DOMAINS)) return DIRECT_OK;

  // 3) Block encrypted DNS endpoints (DoH/DoT): keep JO DNS effective
  if (inList(host, ENCRYPTED_DNS_BLOCK)) return BLOCK;

  // Parse port
  var port = 0;
  var idx = url.lastIndexOf(":");
  if (idx > 6) port = parseInt(url.substring(idx+1)) || 0;

  // 4) PUBG local bias
  if (isPUBG(host, port)) {
    var ip = dnsResolve(host);
    if (ip && ip != "0.0.0.0" && isJOip(ip)) {
      return DIRECT_OK; // local Jordan endpoints
    }
    return DIRECT_OK;   // no blocks, keep stable
  }

  // 5) Everything else
  return DIRECT_OK;
}
