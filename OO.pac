// =====================================================
// PUBG MOBILE – ZERO TOLERANCE (PARANOID MODE)
// JO ONLY – ABSOLUTE ENFORCEMENT
//
// PRIMARY  : 82.212.84.33  (JO – MATCH + LOBBY)
// FALLBACK : 46.32.102.152 (JO – LOBBY ONLY)
//
// ZERO TOLERANCE:
// - Any non-JO path = BLOCK IMMEDIATELY
// - MAX_NON_JO_ATTEMPTS = 0
// - PARANOID MODE = ON
// =====================================================

// ---------- CONFIG ----------
var PRIMARY  = { ip: "82.212.84.33",  lobby: 9030, match: 20001 };
var FALLBACK = { ip: "46.32.102.152", lobby: 9030, match: 20001 };

var BLOCK = "PROXY 0.0.0.0:0";

// ---------- FLAGS ----------
var BLOCK_NON_JO_IMMEDIATELY = true;
var PARANOID_MODE = true;

// ---------- Proxy helper ----------
function P(p, port){ return "PROXY " + p.ip + ":" + port; }

// ---------- System Safe ----------
function isSystem(h){
  h=(h||"").toLowerCase();
  return (
    dnsDomainIs(h,"captive.apple.com") ||
    dnsDomainIs(h,"ocsp.apple.com") ||
    dnsDomainIs(h,"time.apple.com") ||
    dnsDomainIs(h,"mesu.apple.com") ||
    dnsDomainIs(h,"swscan.apple.com") ||
    dnsDomainIs(h,"swcdn.apple.com") ||
    dnsDomainIs(h,"configuration.apple.com") ||
    dnsDomainIs(h,"clients3.google.com") ||
    dnsDomainIs(h,"connectivitycheck.gstatic.com")
  );
}

// ---------- Helpers ----------
function hasAny(h, arr){
  for (var i=0;i<arr.length;i++){
    if (shExpMatch(h, arr[i])) return true;
  }
  return false;
}
function endsAny(h, arr){
  for (var i=0;i<arr.length;i++){
    if (dnsDomainIs(h, arr[i]) || shExpMatch(h, "*." + arr[i])) return true;
  }
  return false;
}

// ---------- PUBG Scope ----------
var PUBG_ROOTS = [
  "pubgmobile.com","proximabeta.com","igamecj.com",
  "gcloudsdk.com","tencent.com","qq.com","qcloud.com"
];

var PUBG_KEYWORDS = [
  "*pubg*","*pubgm*","*igame*","*gcloud*",
  "*proxima*","*lightspeed*","*tencent*"
];

var PUBG_HINTS = [
  "*auth*","*login*","*lobby*","*match*",
  "*battle*","*room*","*relay*","*stun*","*team*"
];

function isPUBG(h){
  h=(h||"").toLowerCase();
  if (endsAny(h, PUBG_ROOTS)) return true;
  if (hasAny(h, PUBG_KEYWORDS) && hasAny(h, PUBG_HINTS)) return true;
  if (hasAny(h, ["*pubg*","*pubgm*"])) return true;
  return false;
}

// ---------- 3-Layer Detection ----------
function isDefinitelyJordanian(h){
  // Match traffic must ONLY hit PRIMARY.match
  return isMatch(h);
}

function isPossiblyJordanian(h){
  // Lobby / recruit / updates through JO proxies only
  return isRecruit(h) || isUpdate(h);
}

function isDefinitelyForeign(h){
  // Anything PUBG but not classified clearly = foreign (PARANOID)
  return isPUBG(h) && !isDefinitelyJordanian(h) && !isPossiblyJordanian(h);
}

// ---------- Classifiers ----------
function isRecruit(h){
  h=(h||"").toLowerCase();
  return hasAny(h, [
    "*recruit*","*team*","*squad*","*friend*",
    "*social*","*chat*","*clan*","*guild*",
    "*party*","*invite*"
  ]);
}

function isUpdate(h){
  h=(h||"").toLowerCase();
  return hasAny(h, [
    "*update*","*patch*","*cdn*","*download*",
    "*resource*","*assets*"
  ]);
}

function isMatch(h){
  h=(h||"").toLowerCase();
  return hasAny(h, [
    "*match*","*game*","*battle*","*room*",
    "*gateway*","*relay*","*stun*","*udp*"
  ]);
}

// ---------- Routing ----------
function FindProxyForURL(url, host){
  host = (host || "").toLowerCase();

  // System always direct
  if (isSystem(host)) return "DIRECT";

  // Non-PUBG = DIRECT
  if (!isPUBG(host)) return "DIRECT";

  // 🚨 PARANOID ZERO TOLERANCE
  if (PARANOID_MODE && isDefinitelyForeign(host)) {
    return BLOCK;
  }

  // 🎯 MATCH = PRIMARY ONLY (Ultra Aggressive)
  if (isDefinitelyJordanian(host)) {
    return P(PRIMARY, PRIMARY.match) + "; " +
           P(PRIMARY, PRIMARY.match) + "; " +
           P(PRIMARY, PRIMARY.match) + "; " +
           BLOCK;
  }

  // 👥 LOBBY / RECRUIT / UPDATE (20x + BLOCK)
  if (isPossiblyJordanian(host)) {
    return (
      P(PRIMARY, PRIMARY.lobby) + "; ".repeat(10) +
      P(FALLBACK, FALLBACK.lobby) + "; ".repeat(10) +
      BLOCK
    );
  }

  // ❌ Any unknown PUBG endpoint = BLOCK ALL
  return BLOCK;
}
