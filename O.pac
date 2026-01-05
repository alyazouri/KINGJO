// =====================================================
// PUBG MOBILE – JO PINNED FINAL (STABLE)
// Primary  : 82.212.84.33  (BEST / STABLE)
// Fallback : 46.32.102.152
// Disabled : 77.245.9.11   (UNSTABLE)
// LOBBY / RECRUIT : 9030
// MATCH           : 20001 (HARD PIN)
// =====================================================

var PRIMARY = { ip: "82.212.84.33",  lobby: 9030, match: 20001 };
var FALLBACK = { ip: "46.32.102.152", lobby: 9030, match: 20001 };

var BLOCK = "PROXY 0.0.0.0:0";

function P(p, port) { return "PROXY " + p.ip + ":" + port; }

// ---- iOS / system safe ----
function isSystem(host) {
  host = host.toLowerCase();
  return (
    dnsDomainIs(host, "captive.apple.com") ||
    dnsDomainIs(host, "ocsp.apple.com") ||
    dnsDomainIs(host, "time.apple.com") ||
    dnsDomainIs(host, "mesu.apple.com") ||
    dnsDomainIs(host, "swscan.apple.com") ||
    dnsDomainIs(host, "swcdn.apple.com") ||
    dnsDomainIs(host, "configuration.apple.com") ||
    dnsDomainIs(host, "clients3.google.com") ||
    dnsDomainIs(host, "connectivitycheck.gstatic.com")
  );
}

// ---- PUBG scope ----
function isPUBG(host) {
  host = host.toLowerCase();
  return (
    dnsDomainIs(host, "pubgmobile.com") || shExpMatch(host, "*.pubgmobile.com") ||
    dnsDomainIs(host, "proximabeta.com") || shExpMatch(host, "*.proximabeta.com") ||
    dnsDomainIs(host, "igamecj.com") || shExpMatch(host, "*.igamecj.com") ||
    dnsDomainIs(host, "gcloudsdk.com") || shExpMatch(host, "*.gcloudsdk.com") ||
    dnsDomainIs(host, "tencent.com") || shExpMatch(host, "*.tencent.com") ||
    dnsDomainIs(host, "qq.com") || shExpMatch(host, "*.qq.com") ||
    dnsDomainIs(host, "qcloud.com") || shExpMatch(host, "*.qcloud.com") ||
    shExpMatch(host, "*pubg*")
  );
}

// ---- Recruit / Social (JO visibility booster) ----
function isRecruit(host) {
  return (
    shExpMatch(host, "*recruit*") ||
    shExpMatch(host, "*team*") ||
    shExpMatch(host, "*squad*") ||
    shExpMatch(host, "*friend*") ||
    shExpMatch(host, "*chat*") ||
    shExpMatch(host, "*clan*") ||
    shExpMatch(host, "*group*") ||
    shExpMatch(host, "*invite*") ||
    shExpMatch(host, "*party*")
  );
}

// ---- Updates / CDN ----
function isUpdate(host) {
  return (
    shExpMatch(host, "*update*") ||
    shExpMatch(host, "*patch*") ||
    shExpMatch(host, "*cdn*") ||
    shExpMatch(host, "*download*") ||
    shExpMatch(host, "*resource*")
  );
}

// ---- Match traffic ----
function isMatch(host) {
  return (
    shExpMatch(host, "*match*") ||
    shExpMatch(host, "*game*") ||
    shExpMatch(host, "*battle*") ||
    shExpMatch(host, "*room*") ||
    shExpMatch(host, "*gateway*") ||
    shExpMatch(host, "*relay*") ||
    shExpMatch(host, "*stun*")
  );
}

function FindProxyForURL(url, host) {
  host = (host || "").toLowerCase();

  // System safe
  if (isSystem(host)) return "DIRECT";

  // Keep non-PUBG clean
  if (!isPUBG(host)) return "DIRECT";

  // Recruit / Social -> Lobby (PRIMARY then FALLBACK)
  if (isRecruit(host))
    return P(PRIMARY, PRIMARY.lobby) + "; " +
           P(FALLBACK, FALLBACK.lobby) + "; " + BLOCK;

  // Updates -> Lobby (avoid match jitter)
  if (isUpdate(host))
    return P(PRIMARY, PRIMARY.lobby) + "; " +
           P(FALLBACK, FALLBACK.lobby) + "; " + BLOCK;

  // Match -> HARD PIN (NO FALLBACK)
  if (isMatch(host))
    return P(PRIMARY, PRIMARY.match) + "; " + BLOCK;

  // Default PUBG
  return P(PRIMARY, PRIMARY.lobby) + "; " +
         P(FALLBACK, FALLBACK.lobby) + "; " + BLOCK;
}
