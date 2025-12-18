// ===================================================
//  PUBG Mobile – JO ULTRA PAC (NO DIRECT)
//  - NO DIRECT anywhere (zero leaks)
//  - All traffic -> JO LOBBY chain (stable HTTPS)
//  - PUBG -> MATCH chain (priority) / LOBBY chain (HTTPS)
//  - If all proxies fail -> BLOCK
// ===================================================

var BLOCK = "PROXY 0.0.0.0:0";

// ====== LOBBY / HTTPS chain (your fastest) ======
var LOBBY_CHAIN =
  "PROXY 82.212.67.62:443; " +
  "PROXY 46.32.101.59:443; " +
  "PROXY 82.212.67.26:443; " +
  "PROXY 82.212.67.19:443; " +
  "PROXY 46.32.101.18:443; " +
  "PROXY 46.185.138.227:443; " +
  "PROXY 82.212.67.19:8080; " +
  "PROXY 82.212.67.29:8080; " +
  "PROXY 46.185.139.60:8080; " +
  "PROXY 46.32.99.20:443; " +
  BLOCK;

// ====== MATCH chain (your fastest) ======
var MATCH_CHAIN =
  "PROXY 82.212.67.18:20001; " +
  "PROXY 82.212.67.26:20001; " +
  "PROXY 77.245.14.135:10012; " +
  "PROXY 46.32.102.48:20001; " +
  "PROXY 37.220.121.71:10012; " +
  "PROXY 77.245.12.16:20001; " +
  "PROXY 46.32.102.48:10012; " +
  "PROXY 77.245.8.95:20001; " +
  "PROXY 37.220.120.182:20001; " +
  "PROXY 77.245.11.107:10012; " +
  BLOCK;

// ====== PUBG detection ======
function isPubgHost(host) {
  host = (host || "").toLowerCase();
  return (
    shExpMatch(host, "*pubg*") ||
    shExpMatch(host, "*proximabeta*") ||
    shExpMatch(host, "*tencent*") ||
    shExpMatch(host, "*gcloud*") ||
    shExpMatch(host, "*igame*") ||
    shExpMatch(host, "*qcloud*") ||
    shExpMatch(host, "*gp.qq.com*") ||
    shExpMatch(host, "*qq.com*") ||
    shExpMatch(host, "*game*")
  );
}

function FindProxyForURL(url, host) {

  // PUBG:
  // - HTTPS/auth/lobby -> LOBBY_CHAIN
  // - other PUBG domain traffic -> MATCH_CHAIN
  if (isPubgHost(host)) {
    if (shExpMatch(url, "https://*")) return LOBBY_CHAIN;
    return MATCH_CHAIN;
  }

  // Everything else (to keep “كلشي فعال” without DIRECT):
  // route via LOBBY_CHAIN (more stable for general browsing)
  if (shExpMatch(url, "https://*")) return LOBBY_CHAIN;

  // Non-https still through LOBBY chain (no leaks)
  return LOBBY_CHAIN;
}
