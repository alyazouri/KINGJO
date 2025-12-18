// ===================================================
//  PUBG Mobile – JO vs JO ENFORCER (GitHub EXEMPTED)
//  - Goal: Highest possible chance BOTH team & enemies are Jordanian
//  - DIRECT allowed ONLY for:
//      • Proxy servers themselves
//      • GitHub (read scripts)
// ===================================================

var BLOCK = "PROXY 0.0.0.0:0";

// ==== Proxy IPs (DIRECT only to reach them) ====
var PROXY_IPS = [
  "82.212.67.62","46.32.101.59","82.212.67.26","82.212.67.19",
  "46.32.101.18","46.185.138.227","82.212.67.29","46.185.139.60",
  "46.32.99.20","82.212.67.18","77.245.14.135","46.32.102.48",
  "37.220.121.71","77.245.12.16","77.245.8.95","37.220.120.182",
  "77.245.11.107"
];

// ==== GitHub domains (DIRECT allowed) ====
function isGitHub(host){
  host = (host || "").toLowerCase();
  return (
    shExpMatch(host, "github.com") ||
    shExpMatch(host, "*.github.com") ||
    shExpMatch(host, "raw.githubusercontent.com") ||
    shExpMatch(host, "*.githubusercontent.com") ||
    shExpMatch(host, "*.githubassets.com")
  );
}

// ==== LOBBY (stable) ====
var LOBBY_CHAIN =
  "PROXY 82.212.67.62:443; " +
  "PROXY 46.32.101.59:443; " +
  "PROXY 82.212.67.26:443; " +
  "PROXY 46.32.101.18:443; " +
  "PROXY 46.185.138.227:443; " +
  BLOCK;

// ==== MATCH (VERY STRICT) ====
var MATCH_CHAIN =
  "PROXY 82.212.67.18:20001; " +
  "PROXY 77.245.14.135:10012; " +
  "PROXY 46.32.102.48:20001; " +
  "PROXY 37.220.121.71:10012; " +
  BLOCK;

// ==== Helpers ====
function isProxyIP(h){
  for (var i=0;i<PROXY_IPS.length;i++) if (h===PROXY_IPS[i]) return true;
  return false;
}

function isPubgHost(h){
  h=(h||"").toLowerCase();
  return shExpMatch(h,"*pubg*") ||
         shExpMatch(h,"*proximabeta*") ||
         shExpMatch(h,"*tencent*") ||
         shExpMatch(h,"*gcloud*") ||
         shExpMatch(h,"*igame*") ||
         shExpMatch(h,"*qcloud*") ||
         shExpMatch(h,"*qq.com*");
}

// ==== MAIN ====
function FindProxyForURL(url, host){

  // 1) Allow DIRECT to reach proxy servers themselves
  if (isProxyIP(host)) return "DIRECT";

  // 2) Allow DIRECT for GitHub ONLY
  if (isGitHub(host)) return "DIRECT";

  // 3) PUBG logic
  if (isPubgHost(host)) {
    if (shExpMatch(url,"https://*")) return LOBBY_CHAIN;
    return MATCH_CHAIN;
  }

  // 4) Everything else -> JO proxy (no leak)
  return LOBBY_CHAIN;
}
