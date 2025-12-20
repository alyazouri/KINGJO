// =====================================================
// PUBG-JO NO-DIRECT ULTRA (HUNT + STICKY + TRI-CHAIN)
// - NO DIRECT EVER (global)
// - PUBG classifier: LOBBY / RECRUIT / MATCH / CDN-UPDATES
// - HUNT MODE: limited BLOCK attempts on lobby/recruit to force re-search
// - Sticky per-host proxy choice to reduce jitter
// Built from your open ports:
//   46.32.102.152: 1080,808,3128,443...
//   91.106.109.12: 8443,8181,20001,20003...
//   212.35.66.45 : 1080,3128...
//   46.185.131.218: 443,8080,8443,20001,20002,20003...
// =====================================================

var BLOCK = "PROXY 0.0.0.0:0";   // Hard block (forces retry)
var NO_DIRECT = true;            // Just for readability

// -------------------- TUNING --------------------
var ENABLE_HUNT       = true;    // ضغط البحث (Lobby/Recruit)
var HUNT_MAX_BLOCKS   = 3;       // كم بلوك قبل ما نلين
var HUNT_WINDOW_MS    = 90000;   // 90s نافذة المحاولات لكل host+type
var STICKY_ENABLED    = true;    // تثبيت بروكسي لكل host لتقليل jitter

// -------------------- PROXY CHAINS --------------------
// Match: يفضّل SOCKS (1080) ثم HTTP proxies
var MATCH_CHAIN_A =
  "SOCKS5 46.32.102.152:1080; " +
  "SOCKS5 212.35.66.45:1080; " +
  "PROXY 46.185.131.218:8080; " +
  "PROXY 46.185.131.218:443; " +
  "PROXY 46.32.102.152:3128; " +
  "PROXY 46.32.102.152:808";

var MATCH_CHAIN_B =
  "SOCKS5 212.35.66.45:1080; " +
  "SOCKS5 46.32.102.152:1080; " +
  "PROXY 46.185.131.218:443; " +
  "PROXY 46.185.131.218:8443; " +
  "PROXY 46.32.102.152:808; " +
  "PROXY 46.32.102.152:3128";

// Lobby/Recruit: يفضّل HTTP (443/8080/8443) ثم SOCKS fallback
var LOBBY_CHAIN_A =
  "PROXY 46.185.131.218:443; " +
  "PROXY 46.185.131.218:8080; " +
  "PROXY 46.185.131.218:8443; " +
  "PROXY 46.32.102.152:808; " +
  "PROXY 46.32.102.152:3128; " +
  "SOCKS5 46.32.102.152:1080; " +
  "SOCKS5 212.35.66.45:1080";

var LOBBY_CHAIN_B =
  "PROXY 46.185.131.218:8080; " +
  "PROXY 46.185.131.218:443; " +
  "PROXY 46.32.102.152:3128; " +
  "PROXY 46.32.102.152:443; " +
  "SOCKS5 212.35.66.45:1080; " +
  "SOCKS5 46.32.102.152:1080";

// CDN/Updates: خفيفة (بدون HUNT/Block) — ثبات أهم من “ضغط”
var CDN_CHAIN =
  "PROXY 46.185.131.218:8080; " +
  "PROXY 46.185.131.218:443; " +
  "PROXY 46.32.102.152:3128; " +
  "PROXY 46.32.102.152:808; " +
  "PROXY 91.106.109.12:8443; " +
  "PROXY 91.106.109.12:8181";

// Global (كل شيء غير PUBG): برضه بدون DIRECT
var GLOBAL_CHAIN =
  "PROXY 46.185.131.218:8080; " +
  "PROXY 46.185.131.218:443; " +
  "PROXY 46.32.102.152:3128; " +
  "PROXY 46.32.102.152:808; " +
  "PROXY 91.106.109.12:8443; " +
  "PROXY 91.106.109.12:8181; " +
  "PROXY 212.35.66.45:3128; " +
  "SOCKS5 46.32.102.152:1080; " +
  "SOCKS5 212.35.66.45:1080";

// -------------------- PUBG Detection --------------------
function isPUBGHost(h){
  h = (h||"").toLowerCase();
  return (
    shExpMatch(h,"*pubg*") ||
    shExpMatch(h,"*igamecj*") ||
    shExpMatch(h,"*proximabeta*") ||
    shExpMatch(h,"*tencent*") ||
    shExpMatch(h,"*qcloud*") ||
    shExpMatch(h,"*gcloud*") ||
    shExpMatch(h,"*qq.com*") ||
    shExpMatch(h,"*cloudfront*") ||
    shExpMatch(h,"*akama*") ||
    shExpMatch(h,"*edge*")
  );
}

function classifyPUBG(url, host){
  var u=(url||"").toLowerCase();
  var h=(host||"").toLowerCase();

  // Recruit / matchmaking / search
  if (u.indexOf("recruit")>=0 || u.indexOf("team")>=0 || u.indexOf("finder")>=0 ||
      u.indexOf("matchmaking")>=0 || u.indexOf("queue")>=0 ||
      h.indexOf("team")>=0 || h.indexOf("match")>=0) return "RECRUIT";

  // Lobby / login
  if (u.indexOf("lobby")>=0 || u.indexOf("login")>=0 || u.indexOf("friends")>=0 ||
      u.indexOf("auth")>=0 || u.indexOf("gateway")>=0) return "LOBBY";

  // Updates / patch / downloads
  if (u.indexOf("update")>=0 || u.indexOf("patch")>=0 || u.indexOf("hotfix")>=0 ||
      u.indexOf(".obb")>=0 || u.indexOf("download")>=0) return "CDN";
  if (u.indexOf("cdn")>=0 || u.indexOf("static")>=0 || u.indexOf("resource")>=0) return "CDN";

  return "MATCH";
}

// -------------------- Sticky + HUNT counters --------------------
var G = (typeof globalThis !== "undefined") ? globalThis : this;
if (!G.__JO_NO_DIRECT) G.__JO_NO_DIRECT = { sticky:{}, tries:{} };

function nowMs(){ return (new Date()).getTime(); }
function h32(s){
  s = (s||"");
  var h=2166136261;
  for (var i=0;i<s.length;i++){
    h ^= s.charCodeAt(i);
    h = (h + (h<<1) + (h<<4) + (h<<7) + (h<<8) + (h<<24))>>>0;
  }
  return h>>>0;
}
function pickSticky(key, choicesCount){
  if (!STICKY_ENABLED) return 0;
  if (G.__JO_NO_DIRECT.sticky[key] !== undefined) return G.__JO_NO_DIRECT.sticky[key];
  var idx = (h32(key) % choicesCount) | 0;
  G.__JO_NO_DIRECT.sticky[key] = idx;
  return idx;
}

function getTryObj(k){
  var t = nowMs();
  var o = G.__JO_NO_DIRECT.tries[k];
  if (!o || (t - o.t) > HUNT_WINDOW_MS) { o = { n:0, t:t }; G.__JO_NO_DIRECT.tries[k]=o; }
  return o;
}

function shouldHuntBlock(cls, host, url){
  if (!ENABLE_HUNT) return false;
  if (!(cls==="LOBBY" || cls==="RECRUIT")) return false;

  // نخلي البلوك “مركّز” على إشارات البحث/الماتشميكنغ فقط
  var u = (url||"").toLowerCase();
  if (u.indexOf("matchmaking")<0 && u.indexOf("queue")<0 && u.indexOf("recruit")<0 && u.indexOf("team")<0) return false;

  var k = cls + "::" + host;
  var o = getTryObj(k);
  if (o.n < HUNT_MAX_BLOCKS) {
    o.n += 1;
    o.t = nowMs();
    G.__JO_NO_DIRECT.tries[k] = o;
    return true;
  }
  return false;
}

// -------------------- Main --------------------
function FindProxyForURL(url, host){
  host = (host||"").toLowerCase();

  // PUBG?
  if (isPUBGHost(host)) {
    var cls = classifyPUBG(url, host);

    // HUNT ضغط أولي (بدون ما يعلق للأبد)
    if (shouldHuntBlock(cls, host, url)) return BLOCK;

    // اختيار Chain (A/B) بطريقة sticky لكل host
    var choice = pickSticky(cls + "::" + host, 2);

    if (cls === "MATCH") return (choice===0 ? MATCH_CHAIN_A : MATCH_CHAIN_B) + "; " + BLOCK;
    if (cls === "CDN")   return CDN_CHAIN + "; " + BLOCK;

    // LOBBY / RECRUIT
    return (choice===0 ? LOBBY_CHAIN_A : LOBBY_CHAIN_B) + "; " + BLOCK;
  }

  // Everything else (NO DIRECT)
  return GLOBAL_CHAIN + "; " + BLOCK;
}
