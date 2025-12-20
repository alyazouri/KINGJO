// =====================================================
// PRO-JO V3 — NO DIRECT GLOBAL
// ✅ DIRECT ONLY: YouTube + GitHub
// 🎮 PUBG: Smart HUNT (limited BLOCK) + optimized chains
// =====================================================

var BLOCK = "PROXY 0.0.0.0:0";
var DIRECT = "DIRECT";

// ======= TUNING =======
var ENABLE_SMART_BLOCK = true;
var BLOCK_MAX_TRIES    = 2;       // ضغط معتدل (بدون تعليق)
var BLOCK_WINDOW_MS    = 60000;   // 60s window

// ======= PROXY CHAINS (adjust if needed) =======

// MATCH: SOCKS then HTTP
var MATCH_CHAIN =
  "SOCKS5 46.32.102.152:20001; " +
  "SOCKS5 46.32.102.152:20003; " +
  "SOCKS5 46.32.102.152:1080; " +
  "PROXY 46.32.102.152:443; " +
  "PROXY 46.32.102.152:8080; " +
  "PROXY 46.32.102.152:3128; " +
  "PROXY 46.32.102.152:808";

// LOBBY/RECRUIT: HTTP first
var LOBBY_CHAIN =
  "PROXY 46.32.102.152:443; " +
  "PROXY 46.32.102.152:8080; " +
  "PROXY 46.32.102.152:8443; " +
  "PROXY 46.32.102.152:808; " +
  "PROXY 46.32.102.152:3128; " +
  "SOCKS5 46.32.102.152:1080; " +
  "PROXY 46.32.102.152:3128";

// CDN/Updates: stable
var CDN_CHAIN =
  "PROXY 46.32.102.152:443; " +
  "PROXY 46.32.102.152:8080; " +
  "PROXY 46.32.102.152:8443; " +
  "PROXY 46.32.102.152:8181; " +
  "PROXY 46.32.102.152:3128; " +
  "PROXY 46.32.102.152:808";

// Global fallback (everything else, still NO DIRECT)
var GLOBAL_CHAIN =
  "PROXY 46.32.102.152:443; " +
  "PROXY 46.32.102.152:8080; " +
  "PROXY 91.106.109.12:8443; " +
  "PROXY 91.106.109.12:8181; " +
  "PROXY 46.32.102.152:3128; " +
  "PROXY 46.32.102.152:808; " +
  "SOCKS5 46.32.102.152:1080; " +
  "PROXY 46.32.102.152:3128";

// ======= DIRECT ALLOWLIST (ONLY THESE) =======
function isGitHub(host){
  host = (host || "").toLowerCase();
  return (
    host === "github.com" ||
    host === "api.github.com" ||
    host === "gist.github.com" ||
    host === "raw.githubusercontent.com" ||
    host.endsWith(".githubusercontent.com")
  );
}

function isYouTube(host){
  host = (host || "").toLowerCase();
  return (
    host === "youtube.com" ||
    host.endsWith(".youtube.com") ||
    host === "youtu.be" ||
    host === "googlevideo.com" ||
    host.endsWith(".googlevideo.com") ||
    host === "ytimg.com" ||
    host.endsWith(".ytimg.com")
  );
}

// ======= PUBG DETECTION =======
function isPUBGHost(h) {
  h = (h||"").toLowerCase();
  return (
    h.indexOf("pubg") !== -1 ||
    h.indexOf("igamecj") !== -1 ||
    h.indexOf("proximabeta") !== -1 ||
    h.indexOf("tencent") !== -1 ||
    h.indexOf("qcloud") !== -1 ||
    h.indexOf("gcloud") !== -1 ||
    h.indexOf("qq.com") !== -1 ||
    h.indexOf("cloudfront") !== -1 ||
    h.indexOf("akama") !== -1 ||
    h.indexOf("edge") !== -1
  );
}

function classifyPUBG(url) {
  var u=(url||"").toLowerCase();

  if (u.indexOf("recruit")>=0 || u.indexOf("team")>=0 ||
      u.indexOf("matchmaking")>=0 || u.indexOf("queue")>=0)
    return "RECRUIT";

  if (u.indexOf("lobby")>=0 || u.indexOf("login")>=0 ||
      u.indexOf("friend")>=0 || u.indexOf("gateway")>=0)
    return "LOBBY";

  if (u.indexOf("cdn")>=0 || u.indexOf("download")>=0 ||
      u.indexOf("update")>=0 || u.indexOf("patch")>=0 || u.indexOf(".obb")>=0)
    return "CDN";

  return "MATCH";
}

// ======= SMART BLOCK COUNTERS =======
var G = (typeof globalThis !== "undefined") ? globalThis : this;
if (!G.__PRO_JO_V3) G.__PRO_JO_V3 = { tries:{} };

function nowMs() { return (new Date()).getTime(); }

function getTryRecord(key) {
  var t = nowMs();
  var r = G.__PRO_JO_V3.tries[key];
  if (!r || (t - r.t) > BLOCK_WINDOW_MS) {
    r = { n:0, t:t }; G.__PRO_JO_V3.tries[key] = r;
  }
  return r;
}

function shouldBlock(cls, host, url) {
  if (!ENABLE_SMART_BLOCK) return false;
  if (!(cls==="LOBBY" || cls==="RECRUIT")) return false;

  // نركز البلوك على إشارات البحث فقط
  var u=(url||"").toLowerCase();
  if (u.indexOf("matchmaking")<0 && u.indexOf("queue")<0 && u.indexOf("recruit")<0 && u.indexOf("team")<0)
    return false;

  var key = cls + "::" + host;
  var rec = getTryRecord(key);

  if (rec.n < BLOCK_MAX_TRIES) {
    rec.n++;
    rec.t = nowMs();
    G.__PRO_JO_V3.tries[key] = rec;
    return true;
  }
  return false;
}

// ======= MAIN =======
function FindProxyForURL(url, host) {
  host = (host||"").toLowerCase();

  // ✅ ONLY allowed DIRECT:
  if (isGitHub(host) || isYouTube(host)) return DIRECT;

  // 🎮 PUBG routing:
  if (isPUBGHost(host)) {
    var cls = classifyPUBG(url);

    // Smart block only for lobby/recruit search
    if (shouldBlock(cls, host, url)) return BLOCK;

    if (cls==="MATCH")   return MATCH_CHAIN + "; " + BLOCK;
    if (cls==="LOBBY" || cls==="RECRUIT") return LOBBY_CHAIN + "; " + BLOCK;
    if (cls==="CDN")     return CDN_CHAIN + "; " + BLOCK;

    return GLOBAL_CHAIN + "; " + BLOCK;
  }

  // 🌐 Everything else: NO DIRECT
  return GLOBAL_CHAIN + "; " + BLOCK;
}
