// =====================================================
// PUBG MOBILE – JO LOCAL DOMINANCE (2+3+6+8+10)
// LOBBY  : 9030
// MATCH  : 20001
// (10) System Allowlist DIRECT (iOS safe)
// (3) Recruit/Social boost -> Lobby
// (6) Soft-fallback (repeat same proxy twice) -> stability
// (8) Updates/CDN -> Lobby (reduce match jitter)
// (2) Fail-closed for PUBG (no DIRECT leaks) + BLOCK at end
// ES5 SAFE
// =====================================================

var JO_PROXIES = [
  { ip: "82.212.84.33",  lobby: 9030, match: 20001 },
  { ip: "46.32.102.152", lobby: 9030, match: 20001 },
  { ip: "77.245.9.11",   lobby: 9030, match: 20001 }
];

var BLOCK = "PROXY 0.0.0.0:0";

// ثابت نسبيًا: يتغير كل 12 ساعة (ثبات NAT أعلى)
function idxSticky(hours) {
  var d = new Date();
  var slot = Math.floor(d.getTime() / (hours * 3600 * 1000));
  return (slot % JO_PROXIES.length);
}

function P(p, port) { return "PROXY " + p.ip + ":" + port; }

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

// نطاقات PUBG Mobile العالمية (واسعة بس منطقية)
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
    shExpMatch(host, "*pubg*") || shExpMatch(host, "*igame*") || shExpMatch(host, "*gcloud*")
  );
}

// (3) Recruit/Social boost
function isRecruit(host) {
  return (
    shExpMatch(host, "*recruit*") ||
    shExpMatch(host, "*team*") ||
    shExpMatch(host, "*squad*") ||
    shExpMatch(host, "*friend*") ||
    shExpMatch(host, "*social*") ||
    shExpMatch(host, "*chat*") ||
    shExpMatch(host, "*clan*") ||
    shExpMatch(host, "*group*") ||
    shExpMatch(host, "*invite*")
  );
}

// Lobby-ish
function isLobby(host) {
  return (
    shExpMatch(host, "*login*") ||
    shExpMatch(host, "*auth*") ||
    shExpMatch(host, "*lobby*") ||
    shExpMatch(host, "*account*") ||
    shExpMatch(host, "*profile*") ||
    shExpMatch(host, "*web*") ||
    shExpMatch(host, "*api*")
  );
}

// Match-ish
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

// (8) Updates/CDN separation
function isUpdate(host) {
  return (
    shExpMatch(host, "*update*") ||
    shExpMatch(host, "*patch*") ||
    shExpMatch(host, "*cdn*") ||
    shExpMatch(host, "*download*") ||
    shExpMatch(host, "*resource*") ||
    shExpMatch(host, "*assets*") ||
    shExpMatch(host, "*hotfix*")
  );
}

function FindProxyForURL(url, host) {
  host = (host || "").toLowerCase();

  // (10) keep system connectivity DIRECT
  if (isSystem(host)) return "DIRECT";

  // Normal browsing DIRECT
  if (!isPUBG(host)) return "DIRECT";

  // Sticky index (12h)
  var i = idxSticky(12);
  var p1 = JO_PROXIES[i];
  var p2 = JO_PROXIES[(i + 1) % JO_PROXIES.length];
  var p3 = JO_PROXIES[(i + 2) % JO_PROXIES.length];

  // (6) Soft-fallback: repeat same proxy twice before moving on
  var L = P(p1, p1.lobby) + "; " + P(p1, p1.lobby) + "; " +
          P(p2, p2.lobby) + "; " + P(p3, p3.lobby);

  var M = P(p1, p1.match) + "; " + P(p1, p1.match) + "; " +
          P(p2, p2.match) + "; " + P(p3, p3.match);

  // (8) Updates/CDN -> Lobby only (reduce match jitter)
  if (isUpdate(host)) return L + "; " + BLOCK;

  // (3) Recruit/Social -> Lobby first (visibility + local pool)
  if (isRecruit(host)) return L + "; " + M + "; " + BLOCK;

  // Match -> Match first (stability), then Lobby fallback
  if (isMatch(host)) return M + "; " + L + "; " + BLOCK;

  // Lobby -> Lobby first
  if (isLobby(host)) return L + "; " + M + "; " + BLOCK;

  // Default for any PUBG endpoint
  return L + "; " + M + "; " + BLOCK;
}
