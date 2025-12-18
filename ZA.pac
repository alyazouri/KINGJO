// ===================================================
//  PUBG Mobile – JO ULTRA PAC (NO DIRECT INTERNET)
//  - DIRECT allowed ONLY to reach proxy servers themselves
//  - All other traffic -> JO proxies
//  - PUBG uses MATCH / LOBBY priority
// ===================================================

var BLOCK = "PROXY 0.0.0.0:0";

// ===== Proxy IPs (DIRECT allowed ONLY for these) =====
var PROXY_IPS = [
  "82.212.67.62",
  "46.32.101.59",
  "82.212.67.26",
  "82.212.67.19",
  "46.32.101.18",
  "46.185.138.227",
  "82.212.67.29",
  "46.185.139.60",
  "46.32.99.20",

  "82.212.67.18",
  "77.245.14.135",
  "46.32.102.48",
  "37.220.121.71",
  "77.245.12.16",
  "77.245.8.95",
  "37.220.120.182",
  "77.245.11.107"
];

// ===== LOBBY / HTTPS =====
var LOBBY_CHAIN =
  "PROXY 82.212.67.62:443; " +
  "PROXY 46.32.101.59:443; " +
  "PROXY 82.212.67.26:443; " +
  "PROXY 82.212.67.19:443; " +
  "PROXY 46.32.101.18:443; " +
  "PROXY 46.185.138.227:443; " +
  "PROXY 82.212.67.29:8080; " +
  "PROXY 46.185.139.60:8080; " +
  "PROXY 46.32.99.20:443; " +
  BLOCK;

// ===== MATCH =====
var MATCH_CHAIN =
  "PROXY 82.212.67.18:20001; " +
  "PROXY 77.245.14.135:10012; " +
  "PROXY 46.32.102.48:20001; " +
  "PROXY 37.220.121.71:10012; " +
  "PROXY 77.245.12.16:20001; " +
  "PROXY 77.245.8.95:20001; " +
  "PROXY 37.220.120.182:20001; " +
  "PROXY 77.245.11.107:10012; " +
  BLOCK;

// ===== Utils =====
function isProxyIP(host) {
  for (var i = 0; i < PROXY_IPS.length; i++) {
    if (host === PROXY_IPS[i]) return true;
  }
  return false;
}

function isPubgHost(host) {
  host = (host || "").toLowerCase();
  return (
    shExpMatch(host, "*pubg*") ||
    shExpMatch(host, "*proximabeta*") ||
    shExpMatch(host, "*tencent*") ||
    shExpMatch(host, "*gcloud*") ||
    shExpMatch(host, "*igame*") ||
    shExpMatch(host, "*qcloud*") ||
    shExpMatch(host, "*qq.com*")
  );
}

// ===== Main =====
function FindProxyForURL(url, host) {

  // Allow DIRECT only to reach the proxies themselves
  if (isProxyIP(host)) {
    return "DIRECT";
  }

  // PUBG logic
  if (isPubgHost(host)) {
    if (shExpMatch(url, "https://*")) return LOBBY_CHAIN;
    return MATCH_CHAIN;
  }

  // Everything else goes through LOBBY proxies
  return LOBBY_CHAIN;
}
