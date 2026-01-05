// =====================================================
// PUBG MOBILE – HYBRID PRO FULL (AUTO SWITCH)
// Primary  : 82.212.84.33 (STABLE)
// Fallback : 46.32.102.152 (LOBBY ONLY)
// Disabled : 77.245.9.11
//
// LOBBY / RECRUIT / SOCIAL / UPDATES : 9030
// MATCH (Classic/Ranked/Game)        : 20001 (PRIMARY ONLY + BLOCK)
//
// Goals:
// - Strong JO visibility in lobby/recruit
// - Stable ping in match (min jitter)
// - No PUBG leaks to DIRECT
// - Keep non-PUBG traffic DIRECT (reduce load)
// =====================================================

var PRIMARY  = { ip: "82.212.84.33",  lobby: 9030, match: 20001 };
var FALLBACK = { ip: "46.32.102.152", lobby: 9030, match: 20001 };

var BLOCK = "PROXY 0.0.0.0:0";
function P(p, port){ return "PROXY " + p.ip + ":" + port; }

// ---------- System safe (iOS) ----------
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

// ---------- PUBG Domain Scope (Expanded) ----------
var PUBG_ROOTS = [
  // Known main / infra seen across PUBG Mobile ecosystem
  "pubgmobile.com",
  "proximabeta.com",
  "igamecj.com",
  "gcloudsdk.com",
  "tencent.com",
  "qq.com",
  "qcloud.com"
];

// Keywords to catch “unlabeled” PUBG endpoints (still scoped – not global)
var PUBG_KEYWORDS = [
  "*pubg*",
  "*pubgm*",
  "*igame*",
  "*gcloud*",
  "*proxima*",
  "*lightspeed*",
  "*tencent*"
];

// Some services may not include pubg in name but are tied to stack.
// Keep this list conservative to avoid catching random websites.
var PUBG_EXTRA_HINTS = [
  "*game*gateway*",
  "*auth*",
  "*login*",
  "*lobby*",
  "*match*",
  "*battle*",
  "*room*",
  "*relay*",
  "*stun*",
  "*team*",
  "*recruit*"
];

function isPUBG(h){
  h=(h||"").toLowerCase();

  // Primary: exact roots
  if (endsAny(h, PUBG_ROOTS)) return true;

  // Secondary: keyword hits (but still “game-ish”)
  if (hasAny(h, PUBG_KEYWORDS) && hasAny(h, PUBG_EXTRA_HINTS)) return true;

  // If contains pubg/pubgm explicitly, accept
  if (hasAny(h, ["*pubg*","*pubgm*"])) return true;

  return false;
}

// ---------- Classifiers ----------
function isRecruit(h){
  h=(h||"").toLowerCase();
  return hasAny(h, [
    "*recruit*","*team*","*squad*","*friend*","*friends*",
    "*social*","*chat*","*msg*","*message*","*clan*","*guild*",
    "*group*","*invite*","*party*","*nearby*","*community*"
  ]);
}

function isUpdate(h){
  h=(h||"").toLowerCase();
  return hasAny(h, [
    "*update*","*patch*","*cdn*","*download*","*resource*",
    "*assets*","*hotfix*","*pkg*","*bundle*"
  ]);
}

function isMatch(h){
  h=(h||"").toLowerCase();
  return hasAny(h, [
    "*match*","*game*","*battle*","*room*","*gateway*",
    "*relay*","*stun*","*udp*"
  ]);
}

// ---------- Routing (Hybrid PRO) ----------
function FindProxyForURL(url, host){
  host = (host || "").toLowerCase();

  // System safe
  if (isSystem(host)) return "DIRECT";

  // Keep non-PUBG direct (reduce proxy load => lower jitter)
  if (!isPUBG(host)) return "DIRECT";

  // A) Recruit/Social: LOBBY 9030 (PRIMARY x2 then FALLBACK) + BLOCK
  if (isRecruit(host)) {
    return P(PRIMARY, PRIMARY.lobby) + "; " +
           P(PRIMARY, PRIMARY.lobby) + "; " +
           P(FALLBACK, FALLBACK.lobby) + "; " + BLOCK;
  }

  // B) Updates/CDN: LOBBY only (avoid touching match path)
  if (isUpdate(host)) {
    return P(PRIMARY, PRIMARY.lobby) + "; " + BLOCK;
  }

  // C) Match: PRIMARY ONLY 20001 (ABSOLUTE HARD PIN) + BLOCK
  if (isMatch(host)) {
    return P(PRIMARY, PRIMARY.match) + "; " +
           P(PRIMARY, PRIMARY.match) + "; " + BLOCK;
  }

  // D) Any other PUBG endpoint (unknown): treat as LOBBY to keep identity JO
  return P(PRIMARY, PRIMARY.lobby) + "; " +
         P(FALLBACK, FALLBACK.lobby) + "; " + BLOCK;
}
