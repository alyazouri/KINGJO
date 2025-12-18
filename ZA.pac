// ===================================================
//  PUBG Mobile – JO vs JO ENFORCER (EXTREME)
//  - Highest pressure to force re-search (may take longer)
//  - MATCH chain is SHORT + FAST-Fail (2 hops only) then BLOCK
//  - LOBBY chain is SHORT (entry stable) then BLOCK
//  - NO DIRECT internet leaks
//  - DIRECT allowed ONLY for: proxy servers themselves + GitHub
// ===================================================

var BLOCK = "PROXY 0.0.0.0:0";

// ==== Proxy IPs (DIRECT only to reach them) ====
var PROXY_IPS = [
  // LOBBY proxies
  "82.212.67.62","46.32.101.59","82.212.67.26","46.32.101.18","46.185.138.227",
  // MATCH proxies
  "82.212.67.18","77.245.14.135"
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

// ==== PUBG detection (tight) ====
function isPubgHost(h){
  h = (h || "").toLowerCase();
  return (
    shExpMatch(h,"*pubg*") ||
    shExpMatch(h,"*proximabeta*") ||
    shExpMatch(h,"*tencent*") ||
    shExpMatch(h,"*gcloud*") ||
    shExpMatch(h,"*igame*") ||
    shExpMatch(h,"*qcloud*") ||
    shExpMatch(h,"*gp.qq.com*") ||
    shExpMatch(h,"*qq.com*")
  );
}

// ==== EXTREME CHAINS ====
// Lobby/auth: keep it short; if these fail -> BLOCK (forces retry/login loop but max pressure)
var LOBBY_CHAIN =
  "PROXY 82.212.67.62:443; " +
  "PROXY 46.32.101.59:443; " +
  BLOCK;

// Match: FAST-Fail (only 2 best) then BLOCK (forces re-search hard)
var MATCH_CHAIN =
  "PROXY 82.212.67.18:20001; " +
  "PROXY 77.245.14.135:10012; " +
  BLOCK;

// Everything else: still through lobby proxies (no DIRECT leak)
var ALL_OTHER_CHAIN =
  "PROXY 82.212.67.62:443; " +
  "PROXY 46.32.101.59:443; " +
  BLOCK;

// ==== Helper ====
function isProxyIP(h){
  for (var i=0;i<PROXY_IPS.length;i++) if (h===PROXY_IPS[i]) return true;
  return false;
}

// ==== MAIN ====
function FindProxyForURL(url, host){

  // 1) DIRECT only to reach proxy servers themselves (prevents iOS deadlock)
  if (isProxyIP(host)) return "DIRECT";

  // 2) GitHub DIRECT so you can read scripts
  if (isGitHub(host)) return "DIRECT";

  // 3) PUBG EXTREME routing
  if (isPubgHost(host)) {
    // HTTPS = login/lobby/auth
    if (shExpMatch(url,"https://*")) return LOBBY_CHAIN;
    // Non-HTTPS PUBG = treat as match pressure
    return MATCH_CHAIN;
  }

  // 4) Everything else (no direct)
  if (shExpMatch(url,"https://*")) return ALL_OTHER_CHAIN;
  return ALL_OTHER_CHAIN;
}
